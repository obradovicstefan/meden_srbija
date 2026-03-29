const DEFAULT_MIN_MS = 320;
const MAX_MIN_MS = 2000;

/**
 * Minimum elapsed time for POST /api/send (reduces trivial timing side channels on fast rejections).
 * Set CONTACT_MIN_RESPONSE_MS=0 to disable.
 */
export function getContactMinResponseMs(): number {
  const raw = process.env.CONTACT_MIN_RESPONSE_MS?.trim();
  if (raw === "0") return 0;
  if (raw === undefined || raw === "") return DEFAULT_MIN_MS;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return DEFAULT_MIN_MS;
  return Math.min(MAX_MIN_MS, Math.floor(n));
}

export async function delayUniformResponse<T>(
  startedAt: number,
  minMs: number,
  response: T,
): Promise<T> {
  if (minMs <= 0) return response;
  const elapsed = Date.now() - startedAt;
  const wait = Math.max(0, minMs - elapsed);
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  return response;
}
