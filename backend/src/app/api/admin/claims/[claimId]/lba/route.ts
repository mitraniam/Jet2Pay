/**
 * GET /api/admin/claims/:claimId/lba
 * Admin endpoint — return presigned URL to the stored LBA PDF.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logRequest, logError } from "@/lib/logger";
import { getPresignedUrl } from "@/lib/storage";

interface RouteParams {
  params: { claimId: string };
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest, { params }: RouteParams) {
  logRequest(req, { claimId: params.claimId });

  const authError = await requireAdmin(req);
  if (authError) return authError;

  if (!UUID_REGEX.test(params.claimId)) {
    return NextResponse.json({ error: "Invalid claim ID" }, { status: 400 });
  }

  try {
    const lbaDoc = await db.document.findFirst({
      where: {
        claimId: params.claimId,
        documentType: "lba",
      },
      orderBy: { uploadedAt: "desc" },
    });

    if (!lbaDoc) {
      return NextResponse.json(
        { error: "Not found", message: "No LBA document found for this claim" },
        { status: 404 }
      );
    }

    const downloadUrl = await getPresignedUrl(lbaDoc.storageKey);

    return NextResponse.json({
      documentId: lbaDoc.id,
      fileName: lbaDoc.fileName,
      uploadedAt: lbaDoc.uploadedAt,
      downloadUrl,
    });
  } catch (err) {
    logError("Failed to fetch LBA document", err, { claimId: params.claimId });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
