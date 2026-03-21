/**
 * GET /api/claims/:claimId
 * Retrieve full claim details and status.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applyRateLimit } from "@/lib/rateLimit";
import { logRequest, logError } from "@/lib/logger";

interface RouteParams {
  params: { claimId: string };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  logRequest(req, { claimId: params.claimId });

  // ── Rate limiting ──────────────────────────────────────────
  const rateLimited = await applyRateLimit(req);
  if (rateLimited) return rateLimited;

  // ── Validate claimId format (UUID) ────────────────────────
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(params.claimId)) {
    return NextResponse.json(
      { error: "Invalid claim ID", message: "Claim ID must be a valid UUID" },
      { status: 400 }
    );
  }

  try {
    const claim = await db.claim.findUnique({
      where: {
        id: params.claimId,
        deletedAt: null, // exclude soft-deleted claims
      },
      include: {
        passengers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            nationality: true,
          },
        },
        documents: {
          select: {
            id: true,
            documentType: true,
            fileName: true,
            fileSize: true,
            mimeType: true,
            uploadedAt: true,
            virusScanStatus: true,
          },
        },
        flightVerification: {
          select: {
            scheduledDeparture: true,
            actualDeparture: true,
            scheduledArrival: true,
            actualArrival: true,
            delayMinutes: true,
            flightStatus: true,
            source: true,
            verifiedAt: true,
          },
        },
        statusHistory: {
          orderBy: { changedAt: "asc" },
          select: {
            status: true,
            changedAt: true,
            reason: true,
          },
        },
        eligibility: {
          select: {
            eligible: true,
            refundOnly: true,
            estimatedCompensationEur: true,
            requiresManualReview: true,
            flags: true,
            ineligibilityReason: true,
            createdAt: true,
          },
        },
      },
    });

    if (!claim) {
      return NextResponse.json(
        { error: "Not found", message: "Claim not found" },
        { status: 404 }
      );
    }

    // ── Determine what documents are still needed ──────────
    const uploadedTypes = claim.documents.map((d) => d.documentType);
    const missingDocuments = [];
    if (!uploadedTypes.includes("boarding_pass"))
      missingDocuments.push("boarding_pass");
    if (!uploadedTypes.includes("booking_confirmation"))
      missingDocuments.push("booking_confirmation");

    return NextResponse.json({
      claimId: claim.id,
      status: claim.status,
      flightNumber: claim.flightNumber,
      flightDate: claim.flightDate,
      departureAirport: claim.departureAirport,
      arrivalAirport: claim.arrivalAirport,
      disruptionType: claim.disruptionType,
      delayDuration: claim.delayDuration,
      passengerCount: claim.passengerCount,
      bookingReference: claim.bookingReference,
      estimatedAmount: claim.estimatedAmount,
      routeDistanceKm: claim.routeDistanceKm,
      consentGiven: claim.consentGiven,
      submittedAt: claim.createdAt,
      updatedAt: claim.updatedAt,
      passengers: claim.passengers,
      documents: claim.documents,
      missingDocuments,
      flightVerification: claim.flightVerification,
      statusHistory: claim.statusHistory,
      eligibility: claim.eligibility,
    });
  } catch (err) {
    logError("Failed to fetch claim", err, { claimId: params.claimId });
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to retrieve claim" },
      { status: 500 }
    );
  }
}
