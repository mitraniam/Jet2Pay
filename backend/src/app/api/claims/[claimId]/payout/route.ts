/**
 * POST /api/claims/:claimId/payout
 * Admin endpoint — initiate payout to claimant after airline pays.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logRequest, logError } from "@/lib/logger";
import { calculateSplit, initiateWiseTransfer, COMMISSION_RATE } from "@/lib/payments";
import { sendEmail } from "@/lib/email";
import { compensationApproved } from "@/lib/emailTemplates";
import { z } from "zod";

interface RouteParams {
  params: { claimId: string };
}

const PayoutSchema = z.object({
  airline_payment_amount_eur: z.number().positive(),
  payment_proof_document_id: z.string().uuid(),
});

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest, { params }: RouteParams) {
  logRequest(req, { claimId: params.claimId });

  const authError = await requireAdmin(req);
  if (authError) return authError;

  if (!UUID_REGEX.test(params.claimId)) {
    return NextResponse.json({ error: "Invalid claim ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PayoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { airline_payment_amount_eur, payment_proof_document_id } = parsed.data;

  try {
    // ── Verify claim ─────────────────────────────────────────
    const claim = await db.claim.findUnique({
      where: { id: params.claimId, deletedAt: null },
      include: {
        passengers: {
          take: 1,
          orderBy: { id: "asc" },
          select: { firstName: true, email: true },
        },
        payout: true,
      },
    });

    if (!claim) {
      return NextResponse.json(
        { error: "Not found", message: "Claim not found" },
        { status: 404 }
      );
    }

    if (claim.status !== "approved") {
      return NextResponse.json(
        { error: "Invalid status", message: `Claim must be in 'approved' status, currently '${claim.status}'` },
        { status: 409 }
      );
    }

    if (claim.payout) {
      return NextResponse.json(
        { error: "Payout exists", message: `Payout already exists with status '${claim.payout.status}'` },
        { status: 409 }
      );
    }

    // ── Calculate split ──────────────────────────────────────
    const { gross, companyFee, clientPayout } = calculateSplit(airline_payment_amount_eur);

    // ── Create payout record ─────────────────────────────────
    if (!claim.iban || !claim.ibanHolderName) {
      // No banking details — create pending payout
      const payout = await db.payout.create({
        data: {
          claimId: params.claimId,
          grossAmountEur: gross,
          feeAmountEur: companyFee,
          netAmountEur: clientPayout,
          commissionRate: COMMISSION_RATE,
          paymentProofDocumentId: payment_proof_document_id,
          status: "awaiting_banking_details",
        },
      });

      // Send banking details request email
      const passenger = claim.passengers[0];
      if (passenger) {
        const bankingLink = `https://jet2pay.eu/claims/${claim.id}/banking?token=${claim.claimToken}`;
        sendEmail({
          to: passenger.email,
          subject: `Banking details needed — Claim #${claim.id.substring(0, 8).toUpperCase()}`,
          html: `<p>Dear ${passenger.firstName},</p><p>Your compensation claim has been approved and we're ready to send your payout of €${clientPayout.toFixed(2)}. Please provide your bank details: <a href="${bankingLink}">Enter bank details</a></p>`,
          claimId: claim.id,
          templateName: "BANKING_DETAILS_REQUEST",
        }).catch((err) => logError("Banking request email failed", err));
      }

      return NextResponse.json({
        payoutId: payout.id,
        status: payout.status,
        grossAmountEur: gross,
        feeAmountEur: companyFee,
        netAmountEur: clientPayout,
        message: "Payout created — awaiting banking details from claimant",
      });
    }

    // ── Initiate Wise transfer ───────────────────────────────
    const shortId = params.claimId.substring(0, 8).toUpperCase();

    const transfer = await initiateWiseTransfer(
      clientPayout,
      claim.iban,
      claim.ibanHolderName,
      `Jet2Pay claim ${shortId}`
    );

    const payout = await db.payout.create({
      data: {
        claimId: params.claimId,
        grossAmountEur: gross,
        feeAmountEur: companyFee,
        netAmountEur: clientPayout,
        commissionRate: COMMISSION_RATE,
        paymentProofDocumentId: payment_proof_document_id,
        wiseTransferId: String(transfer.transferId),
        status: "initiated",
      },
    });

    // Update claim status to paid
    await db.$transaction([
      db.claim.update({
        where: { id: params.claimId },
        data: { status: "paid" },
      }),
      db.claimStatusHistory.create({
        data: {
          claimId: params.claimId,
          status: "paid",
          reason: `Payout initiated via Wise (transfer ${transfer.transferId})`,
        },
      }),
    ]);

    // Send payment confirmation email
    const passenger = claim.passengers[0];
    if (passenger) {
      const paymentDate = new Date();
      paymentDate.setDate(paymentDate.getDate() + 3);

      const template = compensationApproved({
        claimId: claim.id,
        flightNumber: claim.flightNumber,
        passengerName: passenger.firstName,
        approvedAmountEur: gross,
        companyFeeEur: companyFee,
        clientPayoutEur: clientPayout,
        expectedPaymentDate: paymentDate.toLocaleDateString("en-GB"),
        bankingLink: "#",
      });

      sendEmail({
        to: passenger.email,
        subject: template.subject,
        html: template.html,
        claimId: claim.id,
        templateName: "PAYOUT_INITIATED",
      }).catch((err) => logError("Payout email failed", err));
    }

    return NextResponse.json({
      payoutId: payout.id,
      status: payout.status,
      wiseTransferId: transfer.transferId,
      grossAmountEur: gross,
      feeAmountEur: companyFee,
      netAmountEur: clientPayout,
      message: "Payout initiated via Wise",
    });
  } catch (err) {
    logError("Failed to process payout", err, { claimId: params.claimId });
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to process payout" },
      { status: 500 }
    );
  }
}
