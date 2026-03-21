/**
 * POST /api/admin/claims/:claimId/assign
 * Assign a claim to a case handler.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, verifyAdminToken } from "@/lib/auth";
import { logRequest, logError } from "@/lib/logger";
import { z } from "zod";

interface RouteParams {
  params: { claimId: string };
}

const AssignSchema = z.object({
  assigned_to_user_id: z.string().min(1),
  assigned_to_name: z.string().min(1).max(200),
});

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest, { params }: RouteParams) {
  logRequest(req, { claimId: params.claimId });

  const authError = await requireAdmin(req);
  if (authError) return authError;

  let adminPayload;
  try {
    adminPayload = await verifyAdminToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!UUID_REGEX.test(params.claimId)) {
    return NextResponse.json({ error: "Invalid claim ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AssignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const claim = await db.claim.findUnique({
      where: { id: params.claimId, deletedAt: null },
      select: { id: true, status: true },
    });

    if (!claim) {
      return NextResponse.json(
        { error: "Not found", message: "Claim not found" },
        { status: 404 }
      );
    }

    const { assigned_to_user_id, assigned_to_name } = parsed.data;

    await db.$transaction([
      db.claim.update({
        where: { id: params.claimId },
        data: {
          assignedTo: assigned_to_user_id,
          assignedToName: assigned_to_name,
        },
      }),
      db.claimStatusHistory.create({
        data: {
          claimId: params.claimId,
          status: claim.status as any,
          changedBy: adminPayload.sub,
          reason: `Assigned to ${assigned_to_name}`,
        },
      }),
    ]);

    return NextResponse.json({
      claimId: params.claimId,
      assignedTo: assigned_to_user_id,
      assignedToName: assigned_to_name,
      message: `Claim assigned to ${assigned_to_name}`,
    });
  } catch (err) {
    logError("Failed to assign claim", err, { claimId: params.claimId });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
