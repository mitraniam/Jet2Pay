import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "dev-secret-change-in-production-32chars"
);

export interface AdminTokenPayload {
  sub: string;   // admin user ID
  role: "admin" | "case_handler";
  iat: number;
  exp: number;
}

/**
 * Verify a Bearer token from the Authorization header.
 * Returns the payload or throws.
 */
export async function verifyAdminToken(
  req: NextRequest
): Promise<AdminTokenPayload> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.slice(7);
  const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
  return payload as unknown as AdminTokenPayload;
}

/**
 * Sign a new admin JWT (for seeding/testing).
 */
export async function signAdminToken(
  userId: string,
  role: "admin" | "case_handler" = "admin",
  expiresIn = "8h"
): Promise<string> {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(ADMIN_JWT_SECRET);
}

/**
 * Middleware helper — returns 401 response if not authenticated as admin.
 * Returns null if auth passes (caller continues).
 */
export async function requireAdmin(
  req: NextRequest
): Promise<NextResponse | null> {
  try {
    await verifyAdminToken(req);
    return null;
  } catch {
    return NextResponse.json(
      { error: "Unauthorized", message: "Valid admin JWT required" },
      { status: 401 }
    );
  }
}
