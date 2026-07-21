import type { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getClientIp } from "@/lib/request-ip";

interface RateLimiter {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

const WRITE_LIMIT = 5;
const READ_LIMIT = 60;
const WINDOW_MS = 60_000;

// Fallback in-memory fixed-window limiter, used when the CF ratelimit
// bindings aren't available (e.g. `next dev`).
const memoryStore = new Map<string, { count: number; windowStart: number }>();

function checkMemoryLimit(key: string, limit: number): boolean {
  const now = Date.now();

  // Opportunistically prune stale entries.
  for (const [k, v] of memoryStore) {
    if (now - v.windowStart > WINDOW_MS) memoryStore.delete(k);
  }

  const entry = memoryStore.get(key);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    memoryStore.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

export async function checkRateLimit(
  req: NextRequest,
  opts: { key: string; kind: "write" | "read" },
): Promise<boolean> {
  const ip = getClientIp(req);
  const limiterKey = `${opts.key}:${ip}`;
  const bindingName = opts.kind === "write" ? "WRITE_RATE_LIMITER" : "READ_RATE_LIMITER";

  try {
    const { env } = getCloudflareContext();
    const limiter = (env as unknown as Record<string, RateLimiter | undefined>)[bindingName];
    if (limiter) {
      const { success } = await limiter.limit({ key: limiterKey });
      return success;
    }
  } catch {
    // getCloudflareContext throws outside the CF runtime (e.g. `next dev`).
  }

  const limit = opts.kind === "write" ? WRITE_LIMIT : READ_LIMIT;
  return checkMemoryLimit(limiterKey, limit);
}
