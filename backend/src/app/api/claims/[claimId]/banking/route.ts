/**
 * PATCH /api/claims/:claimId/banking
 * Claimant submits IBAN (authenticated via claim_token).
 * If a payout is awaiting banking details, auto-triggers Wise transfer.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applyRateLimit } from "@/lib/rateLimit";
import { logRequest, logError } from "@/lib/logger";
import { initiateWiseTransfer } from "@/lib/payments";
import { z } from "zod";

interface RouteParams {
  params: { claimId: string };
}

// Basic IBAN validation: 2 letter country + 2 check digits + up to 30 alphanumeric
const IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/;

const BankingSchema = z.object({
  iban: z
    .string()
    .transform((v) => v.replace(/\s/g, "").toUpperCase())
    .pipe(z.string().regex(IBAN_REGEX, "Invalid IBAN format")),
  account_holder_name: z.string().min(2).max(200),
  claim_token: z.string().uuid(),
});

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  logRequest(req, { claimId: params.claimId });

  const rateLimited = await applyRateLimit(req);
  if (rateLimited) return rateLimited;

  if (!UUID_REGEX.test(params.claimId)) {
    return NextResponse.json({ error: "Invalid claim ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BankingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { iban, account_holder_name, claim_token } = parsed.data;

  try {
    const claim = await db.claim.findUnique({
      where: { id: params.claimId, deletedAt: null },
      select: { id: true, claimToken: true, flightNumber: true },
    });

    if (!claim) {
      return NextResponse.json(
        { error: "Not found", message: "Claim not found" },
        { status: 404 }
      );
    }

    if (claim.claimToken !== claim_token) {
      return NextResponse.json(
        { error: "Forbidden", message: "Invalid claim token" },
        { status: 403 }
      );
    }

    // ── Update banking details ───────────────────────────────
    await db.claim.update({
      where: { id: params.claimId },
      data: { iban, ibanHolderName: account_holder_name },
    });

    // ── Auto-trigger Wise transfer if payout is waiting ──────
    const pendingPayout = await db.payout.findUnique({
      where: { claimId: params.claimId },
    });

    if (pendingPayout && pendingPayout.status === "awaiting_banking_details") {
      try {
        const shortId = params.claimId.substring(0, 8).toUpperCase();
        const transfer = await initiateWiseTransfer(
          pendingPayout.netAmountEur,
          iban,
          account_holder_name,
          `Jet2Pay claim ${shortId}`
        );

        await db.payout.update({
          where: { id: pendingPayout.id },
          data: {
            status: "initiated",
            wiseTransferId: String(transfer.transferId),
          },
        });

        await db.$transaction([
          db.claim.update({
            where: { id: params.claimId },
            data: { status: "paid" },
          }),
          db.claimStatusHistory.create({
            data: {
              claimId: params.claimId,
              status: "paid",
              reason: `Banking details received; payout initiated via Wise (transfer ${transfer.transferId})`,
            },
          }),
        ]);

        return NextResponse.json({
          message: "Banking details saved. Payout transfer initiated.",
          payoutStatus: "initiated",
          wiseTransferId: transfer.transferId,
        });
      } catch (transferErr) {
        logError("Auto Wise transfer after banking details failed", transferErr, {
          claimId: params.claimId,
        });
        // Banking details still saved — admin can retry manually
      }
    }

    return NextResponse.json({
      message: "Banking details saved successfully",
      claimId: params.claimId,
    });
  } catch (err) {
    logError("Failed to save banking details", err, { claimId: params.claimId });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
