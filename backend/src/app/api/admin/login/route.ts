/**
 * POST /api/admin/login
 * Authenticate admin user with email + password (simple implementation).
 * Returns a signed JWT token.
 */

import { NextRequest, NextResponse } from "next/server";
import { signAdminToken } from "@/lib/auth";
import { logRequest } from "@/lib/logger";

// Simple admin credentials from environment variables
// In production, replace with proper user database
function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "admin@jet2pay.eu",
    password: process.env.ADMIN_PASSWORD || "change-me-in-production",
  };
}

export async function POST(req: NextRequest) {
  logRequest(req);

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const creds = getAdminCredentials();

  if (email !== creds.email || password !== creds.password) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  try {
    const token = await signAdminToken("admin-1", "admin", "24h");

    return NextResponse.json({
      token,
      expiresIn: "24h",
      role: "admin",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
