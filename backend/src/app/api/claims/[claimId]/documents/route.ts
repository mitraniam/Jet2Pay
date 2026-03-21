/**
 * POST /api/claims/:claimId/documents — Upload a document (claim_token auth)
 * GET  /api/claims/:claimId/documents — List documents (admin JWT required)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { applyRateLimit } from "@/lib/rateLimit";
import { logRequest, logError } from "@/lib/logger";
import {
  sanitizeFilename,
  validateFile,
  uploadToR2,
  getPresignedUrl,
} from "@/lib/storage";

interface RouteParams {
  params: { claimId: string };
}

const DOCUMENT_TYPES = [
  "boarding_pass",
  "booking_confirmation",
  "expense_receipts",
  "delay_certificate",
  "other",
] as const;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest, { params }: RouteParams) {
  logRequest(req, { claimId: params.claimId });

  const rateLimited = await applyRateLimit(req);
  if (rateLimited) return rateLimited;

  if (!UUID_REGEX.test(params.claimId)) {
    return NextResponse.json(
      { error: "Invalid claim ID" },
      { status: 400 }
    );
  }

  // ── Parse multipart form data ──────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data", message: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  const documentType = formData.get("document_type") as string | null;
  const claimToken = formData.get("claim_token") as string | null;

  if (!file || !documentType || !claimToken) {
    return NextResponse.json(
      {
        error: "Missing fields",
        message: "Required: file, document_type, claim_token",
      },
      { status: 400 }
    );
  }

  // ── Validate document type ─────────────────────────────────
  if (!DOCUMENT_TYPES.includes(documentType as any)) {
    return NextResponse.json(
      {
        error: "Invalid document_type",
        message: `Must be one of: ${DOCUMENT_TYPES.join(", ")}`,
      },
      { status: 422 }
    );
  }

  // ── Validate file ──────────────────────────────────────────
  const fileValidation = validateFile(file.type, file.size);
  if (!fileValidation.valid) {
    return NextResponse.json(
      { error: "File validation failed", message: fileValidation.error },
      { status: 422 }
    );
  }

  try {
    // ── Verify claim exists and claim_token matches ──────────
    const claim = await db.claim.findUnique({
      where: { id: params.claimId, deletedAt: null },
      select: { id: true, claimToken: true },
    });

    if (!claim) {
      return NextResponse.json(
        { error: "Not found", message: "Claim not found" },
        { status: 404 }
      );
    }

    if (claim.claimToken !== claimToken) {
      return NextResponse.json(
        { error: "Forbidden", message: "Invalid claim token" },
        { status: 403 }
      );
    }

    // ── Upload to R2 ─────────────────────────────────────────
    const sanitized = sanitizeFilename(file.name);
    const timestamp = Date.now();
    const storageKey = `claims/${params.claimId}/${documentType}/${timestamp}-${sanitized}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadToR2(storageKey, buffer, file.type);

    // ── Persist document record ──────────────────────────────
    const document = await db.document.create({
      data: {
        claimId: params.claimId,
        documentType: documentType as any,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        storageKey,
        virusScanStatus: "pending",
      },
    });

    // ── Generate presigned URL ───────────────────────────────
    const downloadUrl = await getPresignedUrl(storageKey);

    return NextResponse.json(
      {
        documentId: document.id,
        documentType: document.documentType,
        fileName: document.fileName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        uploadedAt: document.uploadedAt,
        downloadUrl,
      },
      { status: 201 }
    );
  } catch (err) {
    logError("Failed to upload document", err, { claimId: params.claimId });
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to upload document" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  logRequest(req, { claimId: params.claimId });

  // ── Admin auth ─────────────────────────────────────────────
  const authError = await requireAdmin(req);
  if (authError) return authError;

  if (!UUID_REGEX.test(params.claimId)) {
    return NextResponse.json(
      { error: "Invalid claim ID" },
      { status: 400 }
    );
  }

  try {
    const documents = await db.document.findMany({
      where: { claimId: params.claimId },
      orderBy: { uploadedAt: "desc" },
    });

    const docsWithUrls = await Promise.all(
      documents.map(async (doc) => ({
        id: doc.id,
        documentType: doc.documentType,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        uploadedAt: doc.uploadedAt,
        virusScanStatus: doc.virusScanStatus,
        downloadUrl: await getPresignedUrl(doc.storageKey),
      }))
    );

    return NextResponse.json({ documents: docsWithUrls });
  } catch (err) {
    logError("Failed to list documents", err, { claimId: params.claimId });
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to list documents" },
      { status: 500 }
    );
  }
}
