import { isIP } from "node:net";

/**
 * Client IP for rate limiting / Turnstile remoteip.
 *
 * - On Vercel, `x-vercel-forwarded-for` is set by the platform (not spoofable from the client the same way).
 * - Otherwise, only trust `x-forwarded-for` / `x-real-ip` when `TRUST_PROXY_HEADERS=true` (your edge sets them).
 * - Without that context, forwarded headers are ignored so arbitrary clients cannot pick an IP bucket.
 */
export function getClientIp(request: Request): string {
  const stripZone = (ip: string) => ip.split("%")[0]?.trim() ?? ip.trim();

  if (process.env.VERCEL === "1") {
    const vf = request.headers
      .get("x-vercel-forwarded-for")
      ?.split(",")[0]
      ?.trim();
    if (vf) {
      const ip = stripZone(vf);
      if (isIP(ip)) return ip;
    }
    const xff = request.headers.get("x-forwarded-for");
    if (xff) {
      const first = stripZone(xff.split(",")[0]?.trim() ?? "");
      if (first && isIP(first)) return first;
    }
  }

  if (process.env.TRUST_PROXY_HEADERS === "true") {
    const xff = request.headers.get("x-forwarded-for");
    if (xff) {
      const first = stripZone(xff.split(",")[0]?.trim() ?? "");
      if (first && isIP(first)) return first;
    }
    const xr = request.headers.get("x-real-ip")?.trim();
    if (xr) {
      const ip = stripZone(xr);
      if (isIP(ip)) return ip;
    }
  }

  return "unknown";
}

export type RequestTrustFailureReason =
  | "invalid_content_type"
  | "missing_host"
  | "host_mismatch"
  | "missing_origin"
  | "null_origin"
  | "invalid_origin_url"
  | "origin_not_allowed";

function parseAllowedOrigins(): string[] {
  const raw = process.env.CONTACT_ALLOWED_ORIGINS?.trim();
  if (!raw) return [];
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const s = part.trim();
    if (!s) continue;
    try {
      out.push(new URL(s).origin);
    } catch {
      /* skip malformed entry */
    }
  }
  return out;
}

/**
 * Same-site browser posts: Host must match this deployment's URL host; Origin must match server origin
 * or {@link CONTACT_ALLOWED_ORIGINS} when set (e.g. apex + www).
 */
export function validateSameSitePost(
  request: Request,
): { ok: true } | { ok: false; reason: RequestTrustFailureReason } {
  let url: URL;
  try {
    url = new URL(request.url);
  } catch {
    return { ok: false, reason: "host_mismatch" };
  }

  const hostHeader = request.headers.get("host")?.trim();
  if (!hostHeader) {
    return { ok: false, reason: "missing_host" };
  }

  if (hostHeader.toLowerCase() !== url.host.toLowerCase()) {
    return { ok: false, reason: "host_mismatch" };
  }

  const originHeader = request.headers.get("origin");
  if (!originHeader) {
    return { ok: false, reason: "missing_origin" };
  }
  if (originHeader === "null") {
    return { ok: false, reason: "null_origin" };
  }

  let originUrl: URL;
  try {
    originUrl = new URL(originHeader);
  } catch {
    return { ok: false, reason: "invalid_origin_url" };
  }

  const serverOrigin = url.origin;
  const allowed = parseAllowedOrigins();
  if (allowed.length > 0) {
    if (!allowed.includes(originUrl.origin)) {
      return { ok: false, reason: "origin_not_allowed" };
    }
    if (originUrl.host.toLowerCase() !== hostHeader.toLowerCase()) {
      return { ok: false, reason: "host_mismatch" };
    }
    return { ok: true };
  }

  if (originUrl.origin !== serverOrigin) {
    return { ok: false, reason: "origin_not_allowed" };
  }

  return { ok: true };
}

/** Only `application/json` (optional charset and other parameters). */
export function isApplicationJsonContentType(request: Request): boolean {
  const raw = request.headers.get("content-type");
  if (!raw) return false;
  const media = raw.split(";")[0]?.trim().toLowerCase();
  return media === "application/json";
}
