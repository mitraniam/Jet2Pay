/**
 * POST /api/admin/claims/:claimId/notes
 * Add an internal note to a claim.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, verifyAdminToken } from "@/lib/auth";
import { logRequest, logError } from "@/lib/logger";
import { z } from "zod";

interface RouteParams {
  params: { claimId: string };
}

const NoteSchema = z.object({
  note: z.string().min(1).max(2000),
  internal: z.boolean().default(true),
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

  const parsed = NoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const claim = await db.claim.findUnique({
      where: { id: params.claimId, deletedAt: null },
      select: { id: true },
    });

    if (!claim) {
      return NextResponse.json(
        { error: "Not found", message: "Claim not found" },
        { status: 404 }
      );
    }

    const note = await db.claimNote.create({
      data: {
        claimId: params.claimId,
        content: parsed.data.note,
        authorId: adminPayload.sub,
        internal: parsed.data.internal,
      },
    });

    return NextResponse.json(
      {
        id: note.id,
        claimId: note.claimId,
        content: note.content,
        authorId: note.authorId,
        internal: note.internal,
        createdAt: note.createdAt,
      },
      { status: 201 }
    );
  } catch (err) {
    logError("Failed to create note", err, { claimId: params.claimId });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
