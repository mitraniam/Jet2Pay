import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

// 10 requests per minute per IP for public endpoints
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: false,
  prefix: "jet2pay:rl",
});

/**
 * Extract the real client IP from Next.js request headers.
 * Handles proxies (Vercel, Cloudflare, etc.)
 */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

/**
 * Apply rate limiting. Returns a 429 NextResponse if limit exceeded,
 * otherwise returns null (caller should continue).
 */
export async function applyRateLimit(
  req: NextRequest
): Promise<NextResponse | null> {
  const ip = getClientIp(req);
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "Rate limit exceeded. Please wait before retrying.",
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      }
    );
  }

  return null;
}
