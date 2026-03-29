import { Resend } from "resend";
import { delayUniformResponse, getContactMinResponseMs } from "@/lib/contact-response-timing";
import { buildRateLimitKey, checkRateLimit } from "@/lib/rate-limit";
import {
  getClientIp,
  isApplicationJsonContentType,
  validateSameSitePost,
} from "@/lib/request-trust";
import {
  getResendCircuitResponse,
  recordResendSendFailure,
  recordResendSendSuccess,
} from "@/lib/resend-circuit";
import { PublicErrorCode } from "@/lib/public-error-codes";
import {
  buildRequestFingerprint,
  hashClientKey,
  logSecurityAudit,
} from "@/lib/security-audit";
import {
  jsonBadRequest,
  jsonError,
  jsonSuccess,
  jsonValidationError,
  logServerError,
  logVendorFailure,
  toPublicErrorMessage,
} from "@/lib/server-errors";
import { verifyTurnstileToken } from "@/lib/turnstile-verify";

export const runtime = "nodejs";

const MAX_NAME_LEN = 200;
const MAX_MESSAGE_LEN = 5000;
const MAX_PHONE_LEN = 40;
const MAX_EMAIL_LEN = 254;
const MIN_MESSAGE_LEN = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Minimum time from client-reported form open to submit (blocks instant scripted POSTs). */
const MIN_SUBMIT_MS = 2800;
/** Reject stale timestamps (replay / tampered payloads). */
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
/** Allow small client clock skew. */
const CLOCK_SKEW_MS = 60_000;

const DISALLOWED_CTRL = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

type JsonBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  turnstileToken?: unknown;
  companyWebsite?: unknown;
  formOpenedAt?: unknown;
};

type ValidPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

/** Coarse validation bucket for audit logs only (no user text). */
type ValidationAuditDetail =
  | "invalid_name"
  | "message_too_short"
  | "message_too_long"
  | "invalid_email";

function stripDisallowedCtrl(s: string): string {
  return s.replace(DISALLOWED_CTRL, "");
}

function normalizeContactName(s: string): string {
  return stripDisallowedCtrl(s).replace(/\s+/g, " ").trim();
}

function normalizeContactEmail(s: string): string {
  return stripDisallowedCtrl(s).trim().toLowerCase().slice(0, MAX_EMAIL_LEN);
}

function normalizeContactPhone(s: string): string {
  return stripDisallowedCtrl(s).replace(/\s+/g, " ").trim().slice(0, MAX_PHONE_LEN);
}

function normalizeContactMessage(s: string): string {
  return stripDisallowedCtrl(s)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function validateBody(
  body: JsonBody,
):
  | { ok: true; data: ValidPayload }
  | { ok: false; message: string; auditDetail: ValidationAuditDetail } {
  const name =
    typeof body.name === "string" ? normalizeContactName(body.name) : "";
  const email =
    typeof body.email === "string" ? normalizeContactEmail(body.email) : "";
  const phone =
    typeof body.phone === "string"
      ? normalizeContactPhone(body.phone)
      : "";
  const message =
    typeof body.message === "string"
      ? normalizeContactMessage(body.message)
      : "";

  if (!name || name.length > MAX_NAME_LEN) {
    return { ok: false, message: "Unesite ispravno ime.", auditDetail: "invalid_name" };
  }
  if (!message || message.length < MIN_MESSAGE_LEN) {
    return {
      ok: false,
      message: `Poruka mora imati najmanje ${MIN_MESSAGE_LEN} karaktera.`,
      auditDetail: "message_too_short",
    };
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return {
      ok: false,
      message: "Poruka je predugačka.",
      auditDetail: "message_too_long",
    };
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return {
      ok: false,
      message: "Unesite ispravnu e-poštu.",
      auditDetail: "invalid_email",
    };
  }

  return { ok: true, data: { name, email, phone, message } };
}

function parseFormOpenedAtMs(raw: unknown): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return null;
  }
  const t = Math.trunc(raw);
  if (t <= 0) return null;
  return t;
}

function resolveFromAddress(): string {
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  return fromEmail || "Kontakt sajta <onboarding@resend.dev>";
}

async function handleContactPost(request: Request): Promise<Response> {
  const fingerprint = buildRequestFingerprint(request);
  const ip = getClientIp(request);
  const ipHash = hashClientKey(ip);

  if (!isApplicationJsonContentType(request)) {
    logSecurityAudit({
      type: "contact_send_request_trust_failed",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 400,
      errorCode: PublicErrorCode.BAD_REQUEST,
      fingerprint,
      detail: "invalid_content_type",
    });
    return jsonBadRequest("Neispravan zahtev.");
  }

  const sameSite = validateSameSitePost(request);
  if (!sameSite.ok) {
    logSecurityAudit({
      type: "contact_send_request_trust_failed",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 400,
      errorCode: PublicErrorCode.BAD_REQUEST,
      fingerprint,
      detail: sameSite.reason,
    });
    return jsonBadRequest("Neispravan zahtev.");
  }

  const rateLimitKey = buildRateLimitKey(ip, request);
  const limited = await checkRateLimit(rateLimitKey);
  if (!limited.ok) {
    logSecurityAudit({
      type: "contact_send_rate_limited",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 429,
      errorCode: PublicErrorCode.RATE_LIMIT,
      fingerprint,
    });
    return jsonError(
      429,
      "Previše zahteva sa ove adrese. Pokušajte ponovo kasnije.",
      {
        code: PublicErrorCode.RATE_LIMIT,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      },
    );
  }

  const circuitBlock = await getResendCircuitResponse();
  if (circuitBlock) {
    const retryAfter = circuitBlock.headers.get("Retry-After") ?? "?";
    logSecurityAudit({
      type: "contact_send_circuit_open",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 503,
      errorCode: PublicErrorCode.SERVICE_UNAVAILABLE,
      fingerprint,
      detail: `retry_after_seconds:${retryAfter}`,
    });
    return circuitBlock;
  }

  let body: JsonBody;
  try {
    body = (await request.json()) as JsonBody;
  } catch {
    logSecurityAudit({
      type: "contact_send_bad_json",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 400,
      errorCode: PublicErrorCode.BAD_REQUEST,
      fingerprint,
    });
    return jsonBadRequest("Neispravan zahtev.");
  }

  const honeypot =
    typeof body.companyWebsite === "string"
      ? body.companyWebsite.trim()
      : "";
  if (honeypot.length > 0) {
    logSecurityAudit({
      type: "contact_send_honeypot_triggered",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 400,
      errorCode: PublicErrorCode.BAD_REQUEST,
      fingerprint,
    });
    return jsonBadRequest("Neispravan zahtev.");
  }

  const now = Date.now();
  const openedAt = parseFormOpenedAtMs(body.formOpenedAt);
  if (openedAt === null) {
    logSecurityAudit({
      type: "contact_send_too_fast",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 400,
      errorCode: PublicErrorCode.BAD_REQUEST,
      fingerprint,
      detail: "missing_or_invalid_form_opened_at",
    });
    return jsonBadRequest("Molimo sačekajte trenutak pre slanja poruke.");
  }
  if (openedAt > now + CLOCK_SKEW_MS) {
    logSecurityAudit({
      type: "contact_send_too_fast",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 400,
      errorCode: PublicErrorCode.BAD_REQUEST,
      fingerprint,
      detail: "form_opened_at_in_future",
    });
    return jsonBadRequest("Neispravan zahtev.");
  }
  if (now - openedAt > MAX_FORM_AGE_MS) {
    logSecurityAudit({
      type: "contact_send_too_fast",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 400,
      errorCode: PublicErrorCode.BAD_REQUEST,
      fingerprint,
      detail: "form_opened_at_stale",
    });
    return jsonBadRequest("Osvežite stranicu i pokušajte ponovo.");
  }
  if (now - openedAt < MIN_SUBMIT_MS) {
    logSecurityAudit({
      type: "contact_send_too_fast",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 400,
      errorCode: PublicErrorCode.BAD_REQUEST,
      fingerprint,
      detail: "below_min_submit_ms",
    });
    return jsonBadRequest("Molimo sačekajte trenutak pre slanja poruke.");
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (turnstileSecret) {
    const token =
      typeof body.turnstileToken === "string"
        ? body.turnstileToken.trim()
        : "";
    if (!token) {
      logSecurityAudit({
        type: "contact_send_turnstile_failed",
        timestamp: new Date().toISOString(),
        route: "POST /api/send",
        ipHash,
        statusCode: 400,
        errorCode: PublicErrorCode.TURNSTILE_FAILED,
        fingerprint,
        detail: "missing_token",
      });
      return jsonError(
        400,
        "Potvrdite sigurnosnu proveru i pokušajte ponovo.",
        { code: PublicErrorCode.TURNSTILE_FAILED },
      );
    }

    const verify = await verifyTurnstileToken(
      token,
      turnstileSecret,
      ip !== "unknown" ? ip : undefined,
    );

    if (!verify.success) {
      logVendorFailure("api/send", "Turnstile", verify.errorCodes);
      logSecurityAudit({
        type: "contact_send_turnstile_failed",
        timestamp: new Date().toISOString(),
        route: "POST /api/send",
        ipHash,
        statusCode: 400,
        errorCode: PublicErrorCode.TURNSTILE_FAILED,
        fingerprint,
        detail: "verify_failed",
      });
      return jsonError(
        400,
        "Sigurnosna provera nije uspela. Osvežite proveru i pokušajte ponovo.",
        { code: PublicErrorCode.TURNSTILE_FAILED },
      );
    }
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    logServerError("api/send", new Error("RESEND_API_KEY is not set"));
    logSecurityAudit({
      type: "contact_send_misconfigured",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 503,
      errorCode: PublicErrorCode.SERVICE_UNAVAILABLE,
      fingerprint,
      detail: "missing_resend_api_key",
    });
    return jsonError(503, toPublicErrorMessage(), {
      code: PublicErrorCode.SERVICE_UNAVAILABLE,
    });
  }

  const toEmail =
    process.env.RESEND_TO_EMAIL?.trim() || "office@medensrbija.com";

  const validated = validateBody(body);
  if (!validated.ok) {
    logSecurityAudit({
      type: "contact_send_validation_failed",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 400,
      errorCode: PublicErrorCode.VALIDATION,
      fingerprint,
      detail: validated.auditDetail,
    });
    return jsonValidationError(validated.message);
  }

  const { name, email, phone, message } = validated.data;
  const from = resolveFromAddress();
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: toEmail,
      replyTo: email,
      subject: name ? `Kontakt sa sajta – ${name}` : "Kontakt sa sajta",
      text: [
        message,
        "",
        `Pošiljalac: ${name}`,
        `E-pošta: ${email}`,
        phone ? `Telefon: ${phone}` : "Telefon: (nije naveden)",
      ].join("\n"),
    });

    if (error) {
      await recordResendSendFailure();
      logVendorFailure("api/send", "Resend", error);
      logSecurityAudit({
        type: "contact_send_upstream_failed",
        timestamp: new Date().toISOString(),
        route: "POST /api/send",
        ipHash,
        statusCode: 502,
        errorCode: PublicErrorCode.UPSTREAM_FAILED,
        fingerprint,
      });
      return jsonError(502, toPublicErrorMessage(), {
        code: PublicErrorCode.UPSTREAM_FAILED,
      });
    }

    await recordResendSendSuccess();
    logSecurityAudit({
      type: "contact_send_success",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 200,
      errorCode: null,
      fingerprint,
    });

    return jsonSuccess({ success: true });
  } catch (err) {
    await recordResendSendFailure();
    logServerError("api/send", err);
    logSecurityAudit({
      type: "contact_send_internal_error",
      timestamp: new Date().toISOString(),
      route: "POST /api/send",
      ipHash,
      statusCode: 500,
      errorCode: PublicErrorCode.INTERNAL,
      fingerprint,
    });
    return jsonError(500, toPublicErrorMessage(), {
      code: PublicErrorCode.INTERNAL,
    });
  }
}

export async function POST(request: Request) {
  const started = Date.now();
  const minMs = getContactMinResponseMs();
  let response: Response;
  try {
    response = await handleContactPost(request);
  } catch (err) {
    logServerError("api/send", err);
    response = jsonError(500, toPublicErrorMessage(), {
      code: PublicErrorCode.INTERNAL,
    });
  }
  return delayUniformResponse(started, minMs, response);
}
