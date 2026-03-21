/**
 * POST /api/webhooks/wise
 * Wise webhook handler — updates payout status on transfer state changes.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logError } from "@/lib/logger";
import { verifyWiseWebhookSignature } from "@/lib/payments";
import { sendEmail } from "@/lib/email";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // ── Verify webhook signature ───────────────────────────────
  const signature = req.headers.get("x-signature") ?? "";
  const valid = await verifyWiseWebhookSignature(rawBody, signature);

  if (!valid) {
    logger.warn("Wise webhook signature verification failed");
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = payload.event_type;
  const transferId = String(payload.data?.resource?.id ?? "");

  if (!transferId) {
    return NextResponse.json({ error: "Missing transfer ID" }, { status: 400 });
  }

  logger.info("Wise webhook received", { eventType, transferId });

  try {
    const payout = await db.payout.findFirst({
      where: { wiseTransferId: transferId },
      include: { claim: { select: { id: true, flightNumber: true } } },
    });

    if (!payout) {
      logger.warn("Wise webhook: payout not found", { transferId });
      return NextResponse.json({ message: "Payout not found" }, { status: 200 });
    }

    const transferState = payload.data?.current_state;

    if (transferState === "outgoing_payment_sent") {
      await db.payout.update({
        where: { id: payout.id },
        data: { status: "completed", completedAt: new Date() },
      });

      logger.info("Payout completed", {
        payoutId: payout.id,
        claimId: payout.claimId,
      });
    } else if (transferState === "cancelled" || transferState === "funds_refunded") {
      await db.payout.update({
        where: { id: payout.id },
        data: { status: "failed" },
      });

      // Alert admin
      const adminEmail = process.env.EMAIL_FROM ?? "claims@jet2pay.eu";
      sendEmail({
        to: adminEmail,
        subject: `ALERT: Wise transfer failed — Claim #${payout.claim.id.substring(0, 8).toUpperCase()}`,
        html: `<p>Wise transfer <strong>${transferId}</strong> for claim <strong>${payout.claim.id}</strong> (flight ${payout.claim.flightNumber}) has been ${transferState}. Manual intervention required.</p>`,
        claimId: payout.claimId,
        templateName: "WISE_TRANSFER_FAILED_ADMIN",
      }).catch((err) => logError("Admin alert email failed", err));

      logger.error("Payout failed", {
        payoutId: payout.id,
        claimId: payout.claimId,
        transferState,
      });
    }

    return NextResponse.json({ message: "Webhook processed" });
  } catch (err) {
    logError("Failed to process Wise webhook", err, { transferId });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
