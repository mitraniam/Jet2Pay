/**
 * PATCH /api/claims/:claimId/status
 * Admin-only endpoint to update claim status.
 * Requires valid admin JWT in Authorization: Bearer <token>
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { requireAdmin } from "@/lib/auth";
import { logRequest, logError } from "@/lib/logger";
import { sendEmail } from "@/lib/email";
import { statusChange, compensationApproved } from "@/lib/emailTemplates";
import { UpdateClaimStatusSchema } from "@/schemas/claim";
import type { AdminTokenPayload } from "@/lib/auth";
import { verifyAdminToken } from "@/lib/auth";

interface RouteParams {
  params: { claimId: string };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  logRequest(req, { claimId: params.claimId });

  // ── Admin auth ────────────────────────────────────────────
  const authError = await requireAdmin(req);
  if (authError) return authError;

  // Extract admin user from token for audit trail
  let adminPayload: AdminTokenPayload;
  try {
    adminPayload = await verifyAdminToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Validate claimId ──────────────────────────────────────
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(params.claimId)) {
    return NextResponse.json(
      { error: "Invalid claim ID" },
      { status: 400 }
    );
  }

  // ── Parse & validate body ──────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = UpdateClaimStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const { status, reason } = parsed.data;

  try {
    // ── Fetch current claim ────────────────────────────────
    const existing = await db.claim.findUnique({
      where: { id: params.claimId, deletedAt: null },
      select: { id: true, status: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Not found", message: "Claim not found" },
        { status: 404 }
      );
    }

    // ── Guard: prevent no-op status updates ───────────────
    if (existing.status === status) {
      return NextResponse.json(
        {
          error: "No change",
          message: `Claim is already in '${status}' status`,
        },
        { status: 409 }
      );
    }

    // ── Update claim + create status history entry ────────
    const updated = await db.$transaction(async (tx) => {
      const updatedClaim = await tx.claim.update({
        where: { id: params.claimId },
        data: { status: status as any },
        select: { id: true, status: true, updatedAt: true, estimatedAmount: true },
      });

      await tx.claimStatusHistory.create({
        data: {
          claimId: params.claimId,
          status: status as any,
          changedBy: adminPayload.sub,
          reason: reason ?? null,
        },
      });

      return updatedClaim;
    });

    // ── Bust admin stats cache ────────────────────────────
    try { await redis.del("admin:stats"); } catch {}

    // ── Send status change email notifications (async, non-blocking) ──
    try {
      const fullClaim = await db.claim.findUnique({
        where: { id: params.claimId },
        include: {
          passengers: { select: { firstName: true, email: true } },
        },
      });

      if (fullClaim && fullClaim.passengers.length > 0) {
        const emails = fullClaim.passengers.map((p) => p.email);
        const primaryName = fullClaim.passengers[0].firstName;

        // General status change email
        const template = statusChange({
          claimId: fullClaim.id,
          flightNumber: fullClaim.flightNumber,
          passengerName: primaryName,
          newStatus: status,
          reason: reason ?? undefined,
        });

        sendEmail({
          to: emails,
          subject: template.subject,
          html: template.html,
          claimId: fullClaim.id,
          templateName: "STATUS_CHANGE",
        }).catch((err) => logError("Status change email failed", err));

        // Additional compensation approved email
        if (status === "approved") {
          const approvedAmount = updated.estimatedAmount;
          const fee = Math.round(approvedAmount * 0.30 * 100) / 100;
          const payout = Math.round((approvedAmount - fee) * 100) / 100;
          const paymentDate = new Date();
          paymentDate.setDate(paymentDate.getDate() + 14);

          const approvedTemplate = compensationApproved({
            claimId: fullClaim.id,
            flightNumber: fullClaim.flightNumber,
            passengerName: primaryName,
            approvedAmountEur: approvedAmount,
            companyFeeEur: fee,
            clientPayoutEur: payout,
            expectedPaymentDate: paymentDate.toLocaleDateString("en-GB"),
            bankingLink: `https://jet2pay.eu/claims/${fullClaim.id}/banking?token=${fullClaim.claimToken}`,
          });

          sendEmail({
            to: emails,
            subject: approvedTemplate.subject,
            html: approvedTemplate.html,
            claimId: fullClaim.id,
            templateName: "COMPENSATION_APPROVED",
          }).catch((err) => logError("Approved email failed", err));
        }
      }
    } catch (emailErr) {
      logError("Email notification failed (non-fatal)", emailErr);
    }

    return NextResponse.json({
      claimId: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
      message: `Claim status updated to '${status}'`,
    });
  } catch (err) {
    logError("Failed to update claim status", err, {
      claimId: params.claimId,
      status,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
