import { NextResponse } from "next/server";
import {
  type PublicErrorCode,
  PublicErrorCode as Codes,
} from "@/lib/public-error-codes";

export * from "@/lib/public-error-codes";

export type ApiErrorBody = {
  error: string;
  code?: PublicErrorCode;
};

/** Fixed message for unexpected failures (never forward vendor API text). */
export function toPublicErrorMessage(): string {
  return "Slanje poruke trenutno nije moguće. Pokušajte ponovo kasnije.";
}

/**
 * Logs full detail server-side only. Never pass `err` through to the client.
 */
export function logServerError(context: string, err: unknown): void {
  if (err instanceof Error) {
    const detail =
      process.env.NODE_ENV === "development"
        ? err.stack ?? err.message
        : err.message;
    console.error(`[${context}]`, detail);
  } else {
    console.error(`[${context}]`, err);
  }
}

/**
 * Logs a third-party / upstream failure with a vendor label. Safe to pass rich detail here;
 * responses to the browser must still use {@link toPublicErrorMessage} or fixed copy.
 */
export function logVendorFailure(
  context: string,
  vendor: string,
  detail: unknown,
): void {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}] ${vendor}`, detail);
  } else {
    const message =
      detail instanceof Error
        ? detail.message
        : typeof detail === "object" && detail !== null && "message" in detail
          ? String((detail as { message: unknown }).message)
          : "[non-Error upstream response]";
    console.error(`[${context}] ${vendor}`, message);
  }
}

type JsonErrorOptions = {
  headers?: HeadersInit;
  code?: PublicErrorCode;
};

export function jsonError(
  status: number,
  message: string,
  init?: JsonErrorOptions,
): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = init?.code
    ? { error: message, code: init.code }
    : { error: message };
  return NextResponse.json(body, { status, headers: init?.headers });
}

/** Validation / client-fixable input issues (400). */
export function jsonValidationError(message: string): NextResponse<ApiErrorBody> {
  return jsonError(400, message, { code: Codes.VALIDATION });
}

/** Malformed JSON or unusable body (400). */
export function jsonBadRequest(message: string): NextResponse<ApiErrorBody> {
  return jsonError(400, message, { code: Codes.BAD_REQUEST });
}

export function jsonSuccess<T extends Record<string, unknown>>(
  body: T,
  init?: { status?: number },
): NextResponse<T> {
  return NextResponse.json(body, { status: init?.status ?? 200 });
}
