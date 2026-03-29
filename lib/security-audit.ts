import { createHmac } from "crypto";
import type { PublicErrorCode } from "@/lib/public-error-codes";

/** One-line JSON logs; filter in your host by `channel":"security_audit"`. */
const LOG_CHANNEL = "security_audit";

export type SecurityAuditEventType =
  | "contact_send_rate_limited"
  | "contact_send_bad_json"
  | "contact_send_misconfigured"
  | "contact_send_turnstile_failed"
  | "contact_send_honeypot_triggered"
  | "contact_send_too_fast"
  | "contact_send_validation_failed"
  | "contact_send_upstream_failed"
  | "contact_send_success"
  | "contact_send_internal_error"
  | "contact_send_request_trust_failed"
  | "contact_send_circuit_open";

export type RequestFingerprint = {
  hasUserAgent: boolean;
  userAgentLength: number;
  /** Lowercase header names that were absent (diagnostics only; no values). */
  missingHeaders: string[];
};

const FINGERPRINT_HEADER_NAMES = [
  "user-agent",
  "accept",
  "accept-language",
  "origin",
  "referer",
  "content-type",
  "x-forwarded-for",
] as const;

/**
 * HMAC-SHA256 of the client key (IP or "unknown"). Requires
 * `SECURITY_AUDIT_SALT` in production for unlinkability across sites.
 */
export function hashClientKey(clientKey: string): string {
  const secret =
    process.env.SECURITY_AUDIT_SALT?.trim() || "dev-only-audit-salt";
  return createHmac("sha256", secret).update(clientKey).digest("hex").slice(0, 32);
}

export function buildRequestFingerprint(request: Request): RequestFingerprint {
  const ua = request.headers.get("user-agent");
  const hasUserAgent = Boolean(ua && ua.length > 0);
  const userAgentLength = ua?.length ?? 0;
  const missingHeaders = FINGERPRINT_HEADER_NAMES.filter(
    (name) => !request.headers.get(name),
  );
  return { hasUserAgent, userAgentLength, missingHeaders };
}

export type SecurityAuditLogEntry = {
  channel: typeof LOG_CHANNEL;
  type: SecurityAuditEventType;
  timestamp: string;
  route: "POST /api/send";
  ipHash: string;
  statusCode: number;
  errorCode: PublicErrorCode | null;
  fingerprint: RequestFingerprint;
  /** Optional coarse reason; never includes user-supplied text. */
  detail?: string;
};

/**
 * Emits a single JSON line to stdout. Server-side only; never send this object to clients.
 */
export function logSecurityAudit(entry: Omit<SecurityAuditLogEntry, "channel">): void {
  const line: SecurityAuditLogEntry = { ...entry, channel: LOG_CHANNEL };
  console.info(JSON.stringify(line));
}
