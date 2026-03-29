/**
 * Stable, non-secret codes for clients to branch on (e.g. rate limit vs validation).
 * User-facing copy stays in Serbian in API responses; codes are English identifiers only.
 */
export const PublicErrorCode = {
  RATE_LIMIT: "RATE_LIMIT",
  VALIDATION: "VALIDATION",
  BAD_REQUEST: "BAD_REQUEST",
  TURNSTILE_FAILED: "TURNSTILE_FAILED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  UPSTREAM_FAILED: "UPSTREAM_FAILED",
  INTERNAL: "INTERNAL",
} as const;

export type PublicErrorCode =
  (typeof PublicErrorCode)[keyof typeof PublicErrorCode];
