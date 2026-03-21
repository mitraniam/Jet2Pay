/**
 * POST /api/claims/eligibility-check
 * Evaluate EC261/UK261 eligibility for a claim.
 * Can be called standalone or is auto-triggered after claim creation.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applyRateLimit } from "@/lib/rateLimit";
import { logRequest, logError } from "@/lib/logger";
import { evaluateEligibility, type EligibilityInput } from "@/lib/eligibility";
import { z } from "zod";

const EligibilityCheckSchema = z.object({
  claimId: z.string().uuid("claimId must be a valid UUID"),
});

export async function POST(req: NextRequest) {
  logRequest(req);

  const rateLimited = await applyRateLimit(req);
  if (rateLimited) return rateLimited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON", message: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const parsed = EligibilityCheckSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { claimId } = parsed.data;

  try {
    const claim = await db.claim.findUnique({
      where: { id: claimId, deletedAt: null },
      include: {
        flightVerification: { select: { delayMinutes: true, flightStatus: true } },
      },
    });

    if (!claim) {
      return NextResponse.json(
        { error: "Not found", message: "Claim not found" },
        { status: 404 }
      );
    }

    // Use verified delay if available, otherwise passenger-reported
    const delayMinutes =
      claim.flightVerification?.delayMinutes ?? claim.delayDuration ?? null;

    const input: EligibilityInput = {
      departureAirport: claim.departureAirport,
      arrivalAirport: claim.arrivalAirport,
      disruptionType: claim.disruptionType as EligibilityInput["disruptionType"],
      delayMinutes,
      noticeGivenDays: claim.noticeGiven,
      circumstancesDescription: claim.circumstancesDescription,
      bookingReference: claim.bookingReference,
      routeDistanceKm: claim.routeDistanceKm,
    };

    const result = evaluateEligibility(input);

    // Upsert eligibility result
    await db.claimEligibility.upsert({
      where: { claimId },
      create: {
        claimId,
        eligible: result.eligible,
        refundOnly: result.refund_only,
        estimatedCompensationEur: result.estimated_compensation_eur,
        requiresManualReview: result.requires_manual_review,
        flags: result.flags,
        ineligibilityReason: result.ineligibility_reason ?? null,
      },
      update: {
        eligible: result.eligible,
        refundOnly: result.refund_only,
        estimatedCompensationEur: result.estimated_compensation_eur,
        requiresManualReview: result.requires_manual_review,
        flags: result.flags,
        ineligibilityReason: result.ineligibility_reason ?? null,
      },
    });

    return NextResponse.json({
      claimId,
      ...result,
    });
  } catch (err) {
    logError("Failed to evaluate eligibility", err, { claimId });
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to evaluate eligibility" },
      { status: 500 }
    );
  }
}
