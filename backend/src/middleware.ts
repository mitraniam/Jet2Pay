import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173,https://jet2pay.eu")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function getCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else if (ALLOWED_ORIGINS.includes("*")) {
    headers["Access-Control-Allow-Origin"] = "*";
  }

  return headers;
}

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  // Add CORS headers to response
  const res = NextResponse.next();
  for (const [key, value] of Object.entries(corsHeaders)) {
    res.headers.set(key, value);
  }
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
