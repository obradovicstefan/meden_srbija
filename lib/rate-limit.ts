import { createHash } from "crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const MAX_PER_HOUR = 3;
/** At most one submission per rolling minute (burst control). */
const MAX_PER_MINUTE = 1;
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

/** clientKey → timestamps (ms), last hour only */
const memoryBuckets = new Map<string, number[]>();

function pruneHour(timestamps: number[], now: number): number[] {
  return timestamps.filter((t) => now - t < HOUR_MS);
}

function runMemoryCleanup(): void {
  const now = Date.now();
  for (const [key, ts] of memoryBuckets.entries()) {
    const pruned = pruneHour(ts, now);
    if (pruned.length === 0) {
      memoryBuckets.delete(key);
    } else {
      memoryBuckets.set(key, pruned);
    }
  }
}

if (typeof setInterval !== "undefined") {
  setInterval(runMemoryCleanup, CLEANUP_INTERVAL_MS);
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

function retryAfterFromReset(resetMs: number): number {
  return Math.max(1, Math.ceil((resetMs - Date.now()) / 1000));
}

/**
 * In-memory: max {@link MAX_PER_MINUTE} per rolling minute and max {@link MAX_PER_HOUR} per rolling hour.
 */
export function checkRateLimitMemory(clientKey: string): RateLimitResult {
  const now = Date.now();
  let ts = memoryBuckets.get(clientKey) ?? [];
  ts = pruneHour(ts, now);

  const inLastMinute = ts.filter((t) => now - t < MINUTE_MS);
  if (inLastMinute.length >= MAX_PER_MINUTE) {
    const oldest = Math.min(...inLastMinute);
    const retryAfterMs = MINUTE_MS - (now - oldest);
    memoryBuckets.set(clientKey, ts);
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  if (ts.length >= MAX_PER_HOUR) {
    const oldest = Math.min(...ts);
    const retryAfterMs = HOUR_MS - (now - oldest);
    memoryBuckets.set(clientKey, ts);
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  ts.push(now);
  memoryBuckets.set(clientKey, ts);
  return { ok: true };
}

/** Short hash of User-Agent (no raw UA stored in Redis key beyond this). */
function hashUserAgent(request: Request): string {
  const ua = request.headers.get("user-agent") ?? "";
  return createHash("sha256").update(ua).digest("hex").slice(0, 16);
}

/**
 * Compound id: client IP + UA hash (reduces shared-IP false sharing vs IP-only).
 */
export function buildRateLimitKey(ip: string, request: Request): string {
  return `${ip}:${hashUserAgent(request)}`;
}

let upstashLimiters: { minute: Ratelimit; hour: Ratelimit } | null | undefined;

function getUpstashLimiters(): { minute: Ratelimit; hour: Ratelimit } | null {
  if (upstashLimiters !== undefined) {
    return upstashLimiters;
  }
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    upstashLimiters = null;
    return null;
  }
  const redis = new Redis({ url, token });
  upstashLimiters = {
    minute: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MAX_PER_MINUTE, "60 s"),
      prefix: "meden:contact:rl:60s",
      analytics: false,
    }),
    hour: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MAX_PER_HOUR, "1 h"),
      prefix: "meden:contact:rl:1h",
      analytics: false,
    }),
  };
  return upstashLimiters;
}

async function drainPending(p: Promise<unknown>): Promise<void> {
  try {
    await p;
  } catch {
    /* analytics / background work */
  }
}

/**
 * Distributed limits when Upstash env is set; otherwise {@link checkRateLimitMemory}.
 * Enforces 1/minute and 3/hour per compound key.
 */
export async function checkRateLimit(
  clientKey: string,
): Promise<RateLimitResult> {
  const limiters = getUpstashLimiters();
  if (!limiters) {
    return checkRateLimitMemory(clientKey);
  }

  try {
    const minuteResult = await limiters.minute.limit(clientKey);
    await drainPending(minuteResult.pending);
    if (!minuteResult.success) {
      return {
        ok: false,
        retryAfterSeconds: retryAfterFromReset(minuteResult.reset),
      };
    }

    const hourResult = await limiters.hour.limit(clientKey);
    await drainPending(hourResult.pending);
    if (!hourResult.success) {
      return {
        ok: false,
        retryAfterSeconds: retryAfterFromReset(hourResult.reset),
      };
    }

    return { ok: true };
  } catch (err) {
    console.error("[rate-limit] Upstash error, using in-memory fallback", err);
    return checkRateLimitMemory(clientKey);
  }
}

