/**
 * POST /api/claims
 * Submit a new EC261/UK261 compensation claim.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applyRateLimit } from "@/lib/rateLimit";
import { logRequest, logError } from "@/lib/logger";
import { calculateCompensation } from "@/lib/ec261";
import { evaluateEligibility } from "@/lib/eligibility";
import { sendEmail } from "@/lib/email";
import { submissionConfirmation } from "@/lib/emailTemplates";
import { CreateClaimSchema } from "@/schemas/claim";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  logRequest(req);

  // ── Rate limiting ──────────────────────────────────────────
  const rateLimited = await applyRateLimit(req);
  if (rateLimited) return rateLimited;

  // ── Parse & validate body ──────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON", message: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const parsed = CreateClaimSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // ── EC261 compensation calculation ─────────────────────────
  const compensation = calculateCompensation({
    departureAirport: data.departureAirport,
    arrivalAirport: data.arrivalAirport,
    disruptionType: data.disruptionType,
    delayDuration: data.delayDuration,
    noticeGiven: data.noticeGiven,
  });

  // ── GDPR retention date (6 years from claim creation) ─────
  const gdprRetainUntil = new Date();
  gdprRetainUntil.setFullYear(gdprRetainUntil.getFullYear() + 6);

  try {
    // ── Persist claim + passengers in a single transaction ───
    const claim = await db.$transaction(async (tx) => {
      const newClaim = await tx.claim.create({
        data: {
          flightNumber: data.flightNumber,
          flightDate: new Date(data.flightDate),
          departureAirport: data.departureAirport,
          arrivalAirport: data.arrivalAirport,
          disruptionType: data.disruptionType as any,
          delayDuration: data.delayDuration ?? null,
          passengerCount: data.passengerCount,
          bookingReference: data.bookingReference.toUpperCase(),
          noticeGiven: data.noticeGiven ?? null,
          estimatedAmount: compensation.estimatedAmount,
          routeDistanceKm: compensation.routeDistanceKm,
          consentGiven: data.consentGiven,
          gdprRetainUntil,
          // Create initial status history entry
          statusHistory: {
            create: {
              status: "submitted",
              reason: "Initial submission",
            },
          },
          // Create all passengers
          passengers: {
            createMany: {
              data: data.passengerDetails.map((p) => ({
                firstName: p.firstName,
                lastName: p.lastName,
                email: p.email.toLowerCase(),
                phone: p.phone,
                nationality: p.nationality,
              })),
            },
          },
        },
        include: {
          passengers: true,
        },
      });

      return newClaim;
    });

    // ── Run eligibility engine and persist result ──────────
    let eligibilityResult = null;
    try {
      const eligInput = {
        departureAirport: data.departureAirport,
        arrivalAirport: data.arrivalAirport,
        disruptionType: data.disruptionType as any,
        delayMinutes: data.delayDuration ?? null,
        noticeGivenDays: data.noticeGiven ?? null,
        circumstancesDescription: null,
        bookingReference: data.bookingReference,
        routeDistanceKm: compensation.routeDistanceKm,
      };
      eligibilityResult = evaluateEligibility(eligInput);

      await db.claimEligibility.create({
        data: {
          claimId: claim.id,
          eligible: eligibilityResult.eligible,
          refundOnly: eligibilityResult.refund_only,
          estimatedCompensationEur: eligibilityResult.estimated_compensation_eur,
          requiresManualReview: eligibilityResult.requires_manual_review,
          flags: eligibilityResult.flags,
          ineligibilityReason: eligibilityResult.ineligibility_reason ?? null,
        },
      });
    } catch (eligErr) {
      logError("Failed to run eligibility check (non-fatal)", eligErr, { claimId: claim.id });
    }

    // ── Send submission confirmation email (async, non-blocking) ──
    try {
      const primaryPassenger = data.passengerDetails[0];
      const template = submissionConfirmation({
        claimId: claim.id,
        claimToken: claim.claimToken,
        flightNumber: data.flightNumber,
        flightDate: data.flightDate,
        departureAirport: data.departureAirport,
        arrivalAirport: data.arrivalAirport,
        estimatedAmount: compensation.estimatedAmount,
        passengerName: primaryPassenger.firstName,
      });

      sendEmail({
        to: primaryPassenger.email.toLowerCase(),
        subject: template.subject,
        html: template.html,
        claimId: claim.id,
        templateName: "SUBMISSION_CONFIRMATION",
      }).catch((err) => logError("Submission email failed (non-fatal)", err));
    } catch {}

    // ── Response ────────────────────────────────────────────
    return NextResponse.json(
      {
        claimId: claim.id,
        claimToken: claim.claimToken,
        status: claim.status,
        estimatedAmount: claim.estimatedAmount,
        routeDistanceKm: claim.routeDistanceKm,
        distanceTier: compensation.distanceTier,
        eligible: compensation.eligible,
        ineligibilityReason: compensation.ineligibilityReason ?? null,
        notes: compensation.notes,
        eligibility: eligibilityResult,
        submittedAt: claim.createdAt,
        message: compensation.eligible
          ? `Your claim has been submitted successfully. Estimated compensation: €${claim.estimatedAmount}. You will receive a confirmation email shortly.`
          : `Your claim has been submitted for review. Based on the information provided, compensation may not apply — ${compensation.ineligibilityReason}`,
      },
      { status: 201 }
    );
  } catch (err) {
    logError("Failed to create claim", err, { flightNumber: data.flightNumber });
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to create claim" },
      { status: 500 }
    );
  }
}
