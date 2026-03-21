/**
 * GET /api/admin/claims
 * Admin endpoint — list claims with filters, sorting, and cursor pagination.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logRequest, logError } from "@/lib/logger";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  logRequest(req);

  const authError = await requireAdmin(req);
  if (authError) return authError;

  const url = req.nextUrl;
  const status = url.searchParams.get("status");
  const disruptionType = url.searchParams.get("disruption_type");
  const fromDate = url.searchParams.get("from_date");
  const toDate = url.searchParams.get("to_date");
  const requiresManualReview = url.searchParams.get("requires_manual_review");
  const assignedTo = url.searchParams.get("assigned_to");
  const cursor = url.searchParams.get("cursor");
  const limitParam = url.searchParams.get("limit");

  const limit = Math.min(Math.max(parseInt(limitParam ?? "25", 10) || 25, 1), 100);

  try {
    // ── Build where clause ───────────────────────────────────
    const where: Prisma.ClaimWhereInput = { deletedAt: null };

    if (status) {
      where.status = status as any;
    }
    if (disruptionType) {
      where.disruptionType = disruptionType as any;
    }
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) (where.createdAt as any).gte = new Date(fromDate);
      if (toDate) (where.createdAt as any).lte = new Date(toDate);
    }
    if (assignedTo) {
      where.assignedTo = assignedTo;
    }
    if (requiresManualReview === "true") {
      where.eligibility = { requiresManualReview: true };
    }

    // ── Decode cursor ────────────────────────────────────────
    let decodedCursor: string | undefined;
    if (cursor) {
      try {
        decodedCursor = Buffer.from(cursor, "base64").toString("utf-8");
      } catch {
        return NextResponse.json(
          { error: "Invalid cursor" },
          { status: 400 }
        );
      }
    }

    // ── Query claims ─────────────────────────────────────────
    const [claims, totalCount] = await Promise.all([
      db.claim.findMany({
        where,
        take: limit + 1, // fetch one extra for cursor
        ...(decodedCursor
          ? { cursor: { id: decodedCursor }, skip: 1 }
          : {}),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          flightNumber: true,
          flightDate: true,
          disruptionType: true,
          status: true,
          passengerCount: true,
          estimatedAmount: true,
          assignedTo: true,
          assignedToName: true,
          createdAt: true,
          eligibility: {
            select: {
              requiresManualReview: true,
              flags: true,
              estimatedCompensationEur: true,
            },
          },
          _count: { select: { documents: true } },
        },
      }),
      db.claim.count({ where }),
    ]);

    // ── Determine next cursor ────────────────────────────────
    let nextCursor: string | null = null;
    if (claims.length > limit) {
      claims.pop();
      const lastClaim = claims[claims.length - 1];
      nextCursor = Buffer.from(lastClaim.id).toString("base64");
    }

    const claimSummaries = claims.map((c) => ({
      id: c.id,
      flightNumber: c.flightNumber,
      flightDate: c.flightDate,
      disruptionType: c.disruptionType,
      status: c.status,
      passengerCount: c.passengerCount,
      estimatedCompensationEur: c.eligibility?.estimatedCompensationEur ?? c.estimatedAmount,
      requiresManualReview: c.eligibility?.requiresManualReview ?? false,
      flags: c.eligibility?.flags ?? [],
      assignedTo: c.assignedTo,
      assignedToName: c.assignedToName,
      submittedAt: c.createdAt,
      documentCount: c._count.documents,
    }));

    return NextResponse.json({
      claims: claimSummaries,
      next_cursor: nextCursor,
      total_count: totalCount,
    });
  } catch (err) {
    logError("Failed to list admin claims", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
