/**
 * POST /api/cron/reminders
 * Cron endpoint for sending automated reminders.
 * Protected by CRON_SECRET header.
 *
 * Handles:
 * 1. Document upload reminders (24h after submission, no docs)
 * 2. Monthly stale claim updates (under_review > 30 days)
 * 3. LBA response deadline reminders (14 days after LBA sent)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logError } from "@/lib/logger";
import { sendEmail } from "@/lib/email";
import {
  documentReminder,
  monthlyStaleUpdate,
} from "@/lib/emailTemplates";

export async function POST(req: NextRequest) {
  // ── Verify CRON_SECRET ─────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Invalid CRON_SECRET" },
      { status: 401 }
    );
  }

  const results = {
    documentReminders: 0,
    monthlyUpdates: 0,
    lbaReminders: 0,
    errors: 0,
  };

  // ── 1. Document Upload Reminders ───────────────────────────
  try {
    const twentyThreeHoursAgo = new Date(Date.now() - 23 * 60 * 60 * 1000);

    const pendingDocs = await db.claim.findMany({
      where: {
        createdAt: { lt: twentyThreeHoursAgo },
        documentReminderSent: false,
        deletedAt: null,
        status: "submitted",
        documents: { none: {} },
      },
      include: {
        passengers: {
          take: 1,
          orderBy: { id: "asc" },
          select: { firstName: true, email: true },
        },
      },
    });

    for (const claim of pendingDocs) {
      const passenger = claim.passengers[0];
      if (!passenger) continue;

      try {
        const template = documentReminder({
          claimId: claim.id,
          claimToken: claim.claimToken,
          flightNumber: claim.flightNumber,
          passengerName: passenger.firstName,
        });

        await sendEmail({
          to: passenger.email,
          subject: template.subject,
          html: template.html,
          claimId: claim.id,
          templateName: "DOCUMENT_REMINDER",
        });

        await db.claim.update({
          where: { id: claim.id },
          data: { documentReminderSent: true },
        });

        results.documentReminders++;
      } catch (err) {
        logError("Failed to send document reminder", err, { claimId: claim.id });
        results.errors++;
      }
    }
  } catch (err) {
    logError("Failed to query pending document reminders", err);
    results.errors++;
  }

  // ── 2. Monthly Stale Claim Updates ─────────────────────────
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const staleClaims = await db.claim.findMany({
      where: {
        status: "under_review",
        createdAt: { lt: thirtyDaysAgo },
        monthlyUpdateSent: false,
        deletedAt: null,
      },
      include: {
        passengers: {
          take: 1,
          orderBy: { id: "asc" },
          select: { firstName: true, email: true },
        },
      },
    });

    for (const claim of staleClaims) {
      const passenger = claim.passengers[0];
      if (!passenger) continue;

      try {
        const daysSince = Math.floor(
          (Date.now() - claim.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        const template = monthlyStaleUpdate({
          claimId: claim.id,
          flightNumber: claim.flightNumber,
          passengerName: passenger.firstName,
          daysSinceSubmission: daysSince,
        });

        await sendEmail({
          to: passenger.email,
          subject: template.subject,
          html: template.html,
          claimId: claim.id,
          templateName: "MONTHLY_STALE_UPDATE",
        });

        await db.claim.update({
          where: { id: claim.id },
          data: { monthlyUpdateSent: true },
        });

        results.monthlyUpdates++;
      } catch (err) {
        logError("Failed to send monthly update", err, { claimId: claim.id });
        results.errors++;
      }
    }
  } catch (err) {
    logError("Failed to query stale claims", err);
    results.errors++;
  }

  // ── 3. LBA Response Deadline Reminders ─────────────────────
  try {
    const now = new Date();

    const lbaOverdue = await db.claim.findMany({
      where: {
        status: "legal_escalated",
        lbaResponseDeadline: { lt: now },
        mcolReminderSent: false,
        deletedAt: null,
      },
      select: { id: true, flightNumber: true },
    });

    for (const claim of lbaOverdue) {
      try {
        const adminEmail = process.env.EMAIL_FROM ?? "claims@jet2pay.eu";
        const shortId = claim.id.substring(0, 8).toUpperCase();

        await sendEmail({
          to: adminEmail,
          subject: `LBA unanswered — Claim #${shortId} — Consider MCOL filing`,
          html: `<p>Claim <strong>${claim.id}</strong> (flight ${claim.flightNumber}) has not received a response to the Letter Before Action within the 14-day deadline. Consider filing with MCOL or CEDR.</p>`,
          claimId: claim.id,
          templateName: "LBA_DEADLINE_ADMIN_ALERT",
        });

        await db.claim.update({
          where: { id: claim.id },
          data: { mcolReminderSent: true },
        });

        results.lbaReminders++;
      } catch (err) {
        logError("Failed to send LBA reminder", err, { claimId: claim.id });
        results.errors++;
      }
    }
  } catch (err) {
    logError("Failed to query LBA overdue claims", err);
    results.errors++;
  }

  return NextResponse.json({
    message: "Cron reminders processed",
    results,
  });
}
