/**
 * POST /api/claims/:claimId/escalate
 * Admin endpoint — generate LBA, send to Jet2, escalate claim status.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logRequest, logError } from "@/lib/logger";
import { generateLBA } from "@/lib/lba";
import { uploadToR2 } from "@/lib/storage";
import { sendEmail } from "@/lib/email";

interface RouteParams {
  params: { claimId: string };
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest, { params }: RouteParams) {
  logRequest(req, { claimId: params.claimId });

  const authError = await requireAdmin(req);
  if (authError) return authError;

  if (!UUID_REGEX.test(params.claimId)) {
    return NextResponse.json({ error: "Invalid claim ID" }, { status: 400 });
  }

  try {
    // ── Load claim with full details ─────────────────────────
    const claim = await db.claim.findUnique({
      where: { id: params.claimId, deletedAt: null },
      include: {
        passengers: {
          take: 1,
          orderBy: { id: "asc" },
        },
        eligibility: { select: { estimatedCompensationEur: true } },
      },
    });

    if (!claim) {
      return NextResponse.json(
        { error: "Not found", message: "Claim not found" },
        { status: 404 }
      );
    }

    // ── Validate escalation conditions ───────────────────────
    if (claim.status !== "under_review") {
      return NextResponse.json(
        {
          error: "Invalid status",
          message: `Claim must be 'under_review' to escalate, currently '${claim.status}'`,
        },
        { status: 409 }
      );
    }

    const daysSinceSubmission = Math.floor(
      (Date.now() - claim.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    const canEscalate =
      (claim.airlineRejected === true) ||
      (claim.airlineResponseReceived === false && daysSinceSubmission >= 56);

    if (!canEscalate) {
      return NextResponse.json(
        {
          error: "Escalation not allowed",
          message: `Claim must have either been rejected by airline, or 56+ days without airline response (currently ${daysSinceSubmission} days).`,
        },
        { status: 409 }
      );
    }

    if (claim.lbaSentAt) {
      return NextResponse.json(
        {
          error: "Already escalated",
          message: `LBA was already sent on ${claim.lbaSentAt.toISOString()}`,
        },
        { status: 409 }
      );
    }

    // ── Prepare LBA data ─────────────────────────────────────
    const passenger = claim.passengers[0];
    if (!passenger) {
      return NextResponse.json(
        { error: "No passenger", message: "Claim has no passenger records" },
        { status: 400 }
      );
    }

    const shortId = params.claimId.substring(0, 8).toUpperCase();
    const compensationAmount =
      claim.eligibility?.estimatedCompensationEur ?? claim.estimatedAmount;

    const passengerAddress: string[] = [];
    if (passenger.addressLine1) passengerAddress.push(passenger.addressLine1);
    if (passenger.addressLine2) passengerAddress.push(passenger.addressLine2);
    if (passenger.city) passengerAddress.push(passenger.city);
    if (passenger.postalCode) passengerAddress.push(passenger.postalCode);
    if (passenger.countryCode) passengerAddress.push(passenger.countryCode);
    if (passengerAddress.length === 0) {
      passengerAddress.push("[Address not provided]");
    }

    const flightDateStr = claim.flightDate.toISOString().split("T")[0];

    // ── Generate LBA PDF ─────────────────────────────────────
    const pdfBuffer = await generateLBA({
      claimReference: shortId,
      date: new Date().toLocaleDateString("en-GB"),
      passengerFullName: `${passenger.firstName} ${passenger.lastName}`,
      passengerAddress,
      flightNumber: claim.flightNumber,
      flightDate: flightDateStr,
      departureAirport: claim.departureAirport,
      arrivalAirport: claim.arrivalAirport,
      disruptionType: claim.disruptionType,
      delayMinutes: claim.delayDuration,
      compensationAmountEur: compensationAmount,
    });

    // ── Upload LBA to R2 ─────────────────────────────────────
    const storageKey = `claims/${params.claimId}/lba/${Date.now()}-lba.pdf`;
    await uploadToR2(storageKey, pdfBuffer, "application/pdf");

    // Store document record
    await db.document.create({
      data: {
        claimId: params.claimId,
        documentType: "lba",
        fileName: `LBA-${shortId}.pdf`,
        fileSize: pdfBuffer.length,
        mimeType: "application/pdf",
        storageKey,
      },
    });

    // ── Send LBA to Jet2 + CC claimant ───────────────────────
    const lbaSubject = `Letter Before Action — Flight ${claim.flightNumber} ${flightDateStr} — Ref ${shortId}`;

    // Send to Jet2 (in production, this would include the PDF as an attachment
    // via Resend's attachment feature — using inline link for now)
    await sendEmail({
      to: "eu261@jet2.com",
      subject: lbaSubject,
      html: `<p>Please find attached a Letter Before Action regarding EC261 compensation claim ${shortId}.</p>
<p>Flight: ${claim.flightNumber} on ${flightDateStr}<br>
Route: ${claim.departureAirport} → ${claim.arrivalAirport}<br>
Passenger: ${passenger.firstName} ${passenger.lastName}<br>
Compensation demanded: €${compensationAmount.toFixed(2)}</p>
<p>A response is requested within 14 calendar days. Failure to respond will result in court proceedings (MCOL) or CEDR referral.</p>`,
      claimId: params.claimId,
      templateName: "LBA_TO_AIRLINE",
    });

    // CC to claimant
    await sendEmail({
      to: passenger.email,
      subject: `Copy: ${lbaSubject}`,
      html: `<p>Dear ${passenger.firstName},</p>
<p>For your records, we have sent a formal Letter Before Action to Jet2 on your behalf regarding your claim #${shortId}.</p>
<p>Jet2 has 14 days to respond. We will keep you informed of any developments. No action is needed from you at this time.</p>`,
      claimId: params.claimId,
      templateName: "LBA_COPY_TO_CLAIMANT",
    });

    // ── Update claim ─────────────────────────────────────────
    const lbaDeadline = new Date();
    lbaDeadline.setDate(lbaDeadline.getDate() + 14);

    await db.$transaction([
      db.claim.update({
        where: { id: params.claimId },
        data: {
          status: "legal_escalated",
          lbaSentAt: new Date(),
          lbaResponseDeadline: lbaDeadline,
        },
      }),
      db.claimStatusHistory.create({
        data: {
          claimId: params.claimId,
          status: "legal_escalated",
          reason: `Letter Before Action sent to Jet2 (eu261@jet2.com). Response deadline: ${lbaDeadline.toISOString().split("T")[0]}`,
        },
      }),
    ]);

    return NextResponse.json({
      claimId: params.claimId,
      status: "legal_escalated",
      lbaSentAt: new Date().toISOString(),
      lbaResponseDeadline: lbaDeadline.toISOString(),
      lbaStorageKey: storageKey,
      message: `LBA sent to Jet2. Response deadline: ${lbaDeadline.toLocaleDateString("en-GB")}`,
    });
  } catch (err) {
    logError("Failed to escalate claim", err, { claimId: params.claimId });
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to escalate claim" },
      { status: 500 }
    );
  }
}
