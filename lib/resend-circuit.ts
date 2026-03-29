import type { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { PublicErrorCode } from "@/lib/public-error-codes";
import { jsonError, toPublicErrorMessage } from "@/lib/server-errors";

const DEFAULT_FAILURE_THRESHOLD = 3;
const DEFAULT_COOLDOWN_MS = 90_000;

/** Shared with rate limit — distributed circuit when Upstash is configured. */
const CIRCUIT_OPEN_KEY = "meden:contact:resend:circuit:openUntil";
const CIRCUIT_FAILURES_KEY = "meden:contact:resend:circuit:failures";
/** Reset failure streak if no new failures arrive (avoids stale global count). */
const FAILURES_STALE_SEC = 600;

function failureThreshold(): number {
  const n = Number(process.env.RESEND_CIRCUIT_FAILURE_THRESHOLD);
  if (Number.isInteger(n) && n >= 1 && n <= 20) return n;
  return DEFAULT_FAILURE_THRESHOLD;
}

function cooldownMs(): number {
  const n = Number(process.env.RESEND_CIRCUIT_COOLDOWN_MS);
  if (Number.isFinite(n) && n >= 5_000 && n <= 600_000) return Math.floor(n);
  return DEFAULT_COOLDOWN_MS;
}

let contactRedis: Redis | null | undefined;

function getContactRedis(): Redis | null {
  if (contactRedis !== undefined) return contactRedis;
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    contactRedis = null;
    return null;
  }
  contactRedis = new Redis({ url, token });
  return contactRedis;
}

let memConsecutiveFailures = 0;
let memOpenUntil = 0;

function memoryCircuitOpen(): boolean {
  return Date.now() < memOpenUntil;
}

function getMemoryCircuitResponse(): NextResponse | null {
  if (!memoryCircuitOpen()) return null;
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((memOpenUntil - Date.now()) / 1000),
  );
  return jsonError(503, toPublicErrorMessage(), {
    code: PublicErrorCode.SERVICE_UNAVAILABLE,
    headers: { "Retry-After": String(retryAfterSeconds) },
  });
}

function recordMemoryFailure(): void {
  memConsecutiveFailures += 1;
  if (memConsecutiveFailures >= failureThreshold()) {
    memOpenUntil = Date.now() + cooldownMs();
    memConsecutiveFailures = 0;
  }
}

function recordMemorySuccess(): void {
  memConsecutiveFailures = 0;
  memOpenUntil = 0;
}

function parseOpenUntilMs(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const n = parseInt(raw, 10);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

/**
 * When open, new contact sends are rejected with 503 + Retry-After (avoids hammering Resend).
 * Uses Upstash when configured; otherwise in-memory (per-instance).
 */
export async function getResendCircuitResponse(): Promise<NextResponse | null> {
  const redis = getContactRedis();
  if (!redis) return getMemoryCircuitResponse();

  try {
    const raw = await redis.get(CIRCUIT_OPEN_KEY);
    if (raw == null) return null;
    const openUntil = parseOpenUntilMs(raw);
    if (openUntil <= Date.now()) return null;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((openUntil - Date.now()) / 1000),
    );
    return jsonError(503, toPublicErrorMessage(), {
      code: PublicErrorCode.SERVICE_UNAVAILABLE,
      headers: { "Retry-After": String(retryAfterSeconds) },
    });
  } catch (err) {
    console.error("[resend-circuit] Redis read failed, using memory fallback", err);
    return getMemoryCircuitResponse();
  }
}

export async function recordResendSendFailure(): Promise<void> {
  const redis = getContactRedis();
  if (!redis) {
    recordMemoryFailure();
    return;
  }

  try {
    const failures = await redis.incr(CIRCUIT_FAILURES_KEY);
    if (failures === 1) {
      await redis.expire(CIRCUIT_FAILURES_KEY, FAILURES_STALE_SEC);
    }
    if (failures >= failureThreshold()) {
      const until = Date.now() + cooldownMs();
      const exSec = Math.max(1, Math.ceil(cooldownMs() / 1000));
      await redis.set(CIRCUIT_OPEN_KEY, String(until), { ex: exSec });
      await redis.del(CIRCUIT_FAILURES_KEY);
    }
  } catch (err) {
    console.error("[resend-circuit] Redis write failed, using memory fallback", err);
    recordMemoryFailure();
  }
}

export async function recordResendSendSuccess(): Promise<void> {
  const redis = getContactRedis();
  if (!redis) {
    recordMemorySuccess();
    return;
  }

  try {
    await redis.del(CIRCUIT_OPEN_KEY, CIRCUIT_FAILURES_KEY);
  } catch (err) {
    console.error("[resend-circuit] Redis del failed, using memory fallback", err);
    recordMemorySuccess();
  }
}
