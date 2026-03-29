const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileVerifyResult =
  | { success: true }
  | { success: false; errorCodes: string[] };

/**
 * Server-side Turnstile token check. Never log the raw token.
 */
export async function verifyTurnstileToken(
  token: string,
  secret: string,
  remoteip?: string,
): Promise<TurnstileVerifyResult> {
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteip) {
    body.set("remoteip", remoteip);
  }

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = (await res.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };

  if (data.success === true) {
    return { success: true };
  }

  const codes = Array.isArray(data["error-codes"])
    ? data["error-codes"]
    : ["unknown"];

  return { success: false, errorCodes: codes };
}
