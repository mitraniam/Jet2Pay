/**
 * GET /api/admin/stats
 * Admin dashboard statistics — cached in Redis (5-minute TTL).
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { requireAdmin } from "@/lib/auth";
import { logRequest, logError } from "@/lib/logger";

const STATS_CACHE_KEY = "admin:stats";
const STATS_CACHE_TTL = 300; // 5 minutes

export async function GET(req: NextRequest) {
  logRequest(req);

  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    // ── Check Redis cache ────────────────────────────────────
    const cached = await redis.get(STATS_CACHE_KEY);
    if (cached) {
      return NextResponse.json(typeof cached === "string" ? JSON.parse(cached) : cached);
    }

    // ── Compute stats ────────────────────────────────────────
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [
      totalClaims,
      statusCounts,
      totalEstimated,
      totalPaid,
      claimsThisWeek,
      claimsLastWeek,
      pendingManualReview,
      documentsMissing,
      avgProcessing,
    ] = await Promise.all([
      // Total claims
      db.claim.count({ where: { deletedAt: null } }),

      // Claims by status
      db.claim.groupBy({
        by: ["status"],
        where: { deletedAt: null },
        _count: true,
      }),

      // Total estimated value
      db.claim.aggregate({
        where: { deletedAt: null },
        _sum: { estimatedAmount: true },
      }),

      // Total paid out
      db.payout.aggregate({
        where: { status: "completed" },
        _sum: { netAmountEur: true },
      }),

      // Claims this week
      db.claim.count({
        where: { createdAt: { gte: oneWeekAgo }, deletedAt: null },
      }),

      // Claims last week
      db.claim.count({
        where: {
          createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo },
          deletedAt: null,
        },
      }),

      // Pending manual review
      db.claimEligibility.count({
        where: { requiresManualReview: true },
      }),

      // Documents missing (submitted claims with 0 documents)
      db.claim.count({
        where: {
          status: "submitted",
          deletedAt: null,
          documents: { none: {} },
        },
      }),

      // Avg processing days (submitted → paid)
      db.$queryRaw<[{ avg_days: number | null }]>`
        SELECT AVG(EXTRACT(EPOCH FROM (p."completedAt" - c."createdAt")) / 86400)::float as avg_days
        FROM "Payout" p
        JOIN "Claim" c ON c.id = p."claimId"
        WHERE p.status = 'completed' AND p."completedAt" IS NOT NULL
      `,
    ]);

    const byStatus: Record<string, number> = {};
    for (const row of statusCounts) {
      byStatus[row.status] = row._count;
    }

    const submitted = byStatus["submitted"] ?? 0;
    const paid = byStatus["paid"] ?? 0;
    const conversionRate = submitted > 0 ? Math.round((paid / totalClaims) * 10000) / 100 : 0;

    const stats = {
      total_claims: totalClaims,
      by_status: byStatus,
      total_estimated_value_eur: totalEstimated._sum.estimatedAmount ?? 0,
      total_paid_out_eur: totalPaid._sum.netAmountEur ?? 0,
      avg_processing_days: Math.round((avgProcessing[0]?.avg_days ?? 0) * 10) / 10,
      conversion_rate_pct: conversionRate,
      claims_this_week: claimsThisWeek,
      claims_last_week: claimsLastWeek,
      pending_manual_review: pendingManualReview,
      documents_missing: documentsMissing,
    };

    // ── Cache result ─────────────────────────────────────────
    await redis.set(STATS_CACHE_KEY, JSON.stringify(stats), { ex: STATS_CACHE_TTL });

    return NextResponse.json(stats);
  } catch (err) {
    logError("Failed to compute admin stats", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
