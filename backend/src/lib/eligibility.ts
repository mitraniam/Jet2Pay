/**
 * EC261/UK261 Eligibility Rules Engine (Priority 3)
 *
 * Deterministic, fail-fast evaluation of claim eligibility.
 * Rules are checked in order — first failure wins.
 */

import { AIRPORTS, routeDistanceKm } from "@/lib/airports";
import { EXTRAORDINARY_KEYWORDS } from "@/lib/ec261";

export interface EligibilityInput {
  departureAirport: string;
  arrivalAirport: string;
  disruptionType: "delay" | "cancellation" | "denied_boarding" | "missed_connection";
  delayMinutes: number | null;
  noticeGivenDays: number | null;
  circumstancesDescription: string | null;
  bookingReference: string;
  routeDistanceKm: number | null;
}

export interface EligibilityResult {
  eligible: boolean;
  refund_only: boolean;
  estimated_compensation_eur: number;
  requires_manual_review: boolean;
  flags: string[];
  ineligibility_reason?: string;
}

/**
 * Evaluate EC261/UK261 eligibility for a claim.
 * Rules are applied in order (fail-fast):
 *   1. Route coverage (EU/UK/EEA)
 *   2. Delay threshold (≥180 min for delays)
 *   3. Notice given (cancellations with ≥14 days notice)
 *   4. Extraordinary circumstances (keyword scan)
 *   5. Missed connection rules
 */
export function evaluateEligibility(input: EligibilityInput): EligibilityResult {
  const flags: string[] = [];
  let requiresManualReview = false;

  // Calculate distance if not provided
  const distKm = input.routeDistanceKm ?? routeDistanceKm(input.departureAirport, input.arrivalAirport);

  // ── RULE 1: Route Coverage ──────────────────────────────────
  const dep = AIRPORTS[input.departureAirport.toUpperCase()];
  const arr = AIRPORTS[input.arrivalAirport.toUpperCase()];

  const depInEuEea = dep?.isEuEea ?? false;
  const arrInEuEea = arr?.isEuEea ?? false;

  if (!depInEuEea && !arrInEuEea) {
    return {
      eligible: false,
      refund_only: false,
      estimated_compensation_eur: 0,
      requires_manual_review: false,
      flags: ["route_not_covered"],
      ineligibility_reason:
        "Neither departure nor arrival airport is in the EU/UK/EEA. EC261/UK261 does not apply to this route.",
    };
  }

  // ── Calculate base compensation from distance tier ──────────
  let baseAmount = 0;
  if (distKm !== null) {
    if (distKm < 1500) {
      baseAmount = 250;
    } else if (distKm <= 3500) {
      baseAmount = 400;
    } else {
      baseAmount = 600;
    }
  } else {
    baseAmount = 400; // safe default for unknown distance
    flags.push("distance_unknown");
    requiresManualReview = true;
  }

  // ── RULE 2: Delay Threshold ─────────────────────────────────
  if (input.disruptionType === "delay") {
    const delay = input.delayMinutes ?? 0;

    if (delay < 180) {
      return {
        eligible: false,
        refund_only: false,
        estimated_compensation_eur: 0,
        requires_manual_review: false,
        flags: ["delay_below_threshold"],
        ineligibility_reason:
          `Delay of ${delay} minutes is below the 3-hour (180-minute) threshold required for EC261 compensation.`,
      };
    }

    // Art. 7(2): >3500km with delay <4h → reduced to €300
    if (distKm !== null && distKm > 3500 && delay < 240) {
      baseAmount = 300;
      flags.push("reduced_long_haul");
    }
  }

  // ── RULE 3: Notice Given (cancellations) ────────────────────
  if (input.disruptionType === "cancellation") {
    if (input.noticeGivenDays !== null && input.noticeGivenDays >= 14) {
      return {
        eligible: false,
        refund_only: true,
        estimated_compensation_eur: 0,
        requires_manual_review: false,
        flags: ["cancellation_14_day_notice"],
        ineligibility_reason:
          `Airline provided ${input.noticeGivenDays} days notice of cancellation (≥14 days). Under EC261 Art. 5(1)(c), no monetary compensation is due. You may still be eligible for a refund or re-routing.`,
      };
    }

    if (input.noticeGivenDays === null) {
      flags.push("notice_unknown");
      requiresManualReview = true;
    }
  }

  // ── RULE 4: Extraordinary Circumstances ─────────────────────
  if (input.circumstancesDescription) {
    const lower = input.circumstancesDescription.toLowerCase();
    const matched = EXTRAORDINARY_KEYWORDS.filter((kw) => lower.includes(kw));
    if (matched.length > 0) {
      flags.push("possible_extraordinary_circumstances");
      requiresManualReview = true;
    }
  }

  // ── RULE 5: Missed Connection ───────────────────────────────
  if (input.disruptionType === "missed_connection") {
    const delay = input.delayMinutes ?? 0;
    if (delay < 180) {
      return {
        eligible: false,
        refund_only: false,
        estimated_compensation_eur: 0,
        requires_manual_review: false,
        flags: ["missed_connection_delay_below_threshold"],
        ineligibility_reason:
          `Missed connection delay of ${delay} minutes at final destination is below the 3-hour threshold.`,
      };
    }
  }

  return {
    eligible: true,
    refund_only: false,
    estimated_compensation_eur: baseAmount,
    requires_manual_review: requiresManualReview,
    flags,
  };
}
