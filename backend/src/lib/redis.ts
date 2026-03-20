import { Redis } from "@upstash/redis";

// Lazy singleton Redis client — avoids crashing at build time
// when env vars are not yet available (Next.js static analysis phase).
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function getRedis(): Redis {
  if (globalForRedis.redis) return globalForRedis.redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN env vars"
    );
  }

  const instance = new Redis({ url, token });
  if (process.env.NODE_ENV !== "production") globalForRedis.redis = instance;
  return instance;
}

/** Lazily-initialized Upstash Redis client */
export const redis = new Proxy({} as Redis, {
  get(_target, prop, receiver) {
    const instance = getRedis();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

// ── Cache helpers ──────────────────────────────

/** TTL in seconds for flight verification cache (24 hours) */
export const FLIGHT_CACHE_TTL = 60 * 60 * 24;

export function flightCacheKey(flightNumber: string, date: string): string {
  // Normalise: uppercase flight, date as YYYY-MM-DD
  return `flight:${flightNumber.toUpperCase()}:${date}`;
}
