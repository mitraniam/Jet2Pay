/**
 * EC261/UK261 Compensation Rules Engine
 *
 * Regulation (EC) No 261/2004 + UK261 (retained post-Brexit)
 * No Win No Fee platform — Jet2 specific (EU/UK registered carrier)
 */

import { routeDistanceKm, isEC261Route } from "@/lib/airports";

export type DisruptionType =
  | "delay"
  | "cancellation"
  | "denied_boarding"
  | "missed_connection";

export interface CompensationInput {
  departureAirport: string;   // IATA
  arrivalAirport: string;     // IATA
  disruptionType: DisruptionType;
  delayDuration?: number | null;   // minutes (passenger reported or verified)
  noticeGiven?: number | null;     // days airline notified before departure
}

export interface CompensationResult {
  estimatedAmount: number;   // EUR
  routeDistanceKm: number | null;
  distanceTier: "<1500" | "1500-3500" | ">3500" | "unknown";
  eligible: boolean;
  ineligibilityReason?: string;
  notes: string[];
}

/**
 * Extraordinary circumstances keywords (EC261 Art. 5(3)).
 * If a delay/cancellation reason matches these, compensation may not apply.
 * Flagged for manual review — not auto-rejected.
 */
export const EXTRAORDINARY_KEYWORDS = [
  "weather",
  "storm",
  "hurricane",
  "fog",
  "snow",
  "ice",
  "volcanic",
  "eruption",
  "atc",
  "air traffic control",
  "strike",
  "industrial action",
  "security",
  "terrorism",
  "bird strike",
  "medical emergency",
  "political unrest",
  "civil unrest",
  "pandemic",
  "covid",
  "military",
];

/**
 * Core compensation calculator per EC261 Art. 7.
 *
 * Distance tiers:
 *   < 1,500 km          → €250
 *   1,500–3,500 km      → €400
 *   > 3,500 km (intra-EU or < 4h delay) → €300
 *   > 3,500 km (all others) → €600
 */
export function calculateCompensation(
  input: CompensationInput
): CompensationResult {
  const notes: string[] = [];
  const distKm = routeDistanceKm(input.departureAirport, input.arrivalAirport);

  // ── Distance tier ──────────────────────────────────────────
  let tier: CompensationResult["distanceTier"] = "unknown";
  let baseAmount = 0;

  if (distKm !== null) {
    if (distKm < 1500) {
      tier = "<1500";
      baseAmount = 250;
    } else if (distKm <= 3500) {
      tier = "1500-3500";
      baseAmount = 400;
    } else {
      tier = ">3500";
      baseAmount = 600;
    }
  } else {
    // Airport not in database — use €400 as safe middle tier, flag for review
    tier = "unknown";
    baseAmount = 400;
    notes.push(
      "Route distance unknown — using €400 default. Manual review required."
    );
  }

  // ── EC261 Art. 7(2): Reduction for >3500km with delay < 4h ──
  if (
    tier === ">3500" &&
    input.disruptionType === "delay" &&
    typeof input.delayDuration === "number" &&
    input.delayDuration < 240 // 4h = 240 min
  ) {
    const depInfo = isEC261Route(input.departureAirport, input.arrivalAirport);
    if (depInfo) {
      baseAmount = 300;
      notes.push(
        "Amount reduced to €300: >3500km route, delay < 4h, EU/UK airport involved (Art. 7(2))"
      );
    }
  }

  // ── Minimum delay threshold ────────────────────────────────
  if (input.disruptionType === "delay") {
    const delay = input.delayDuration ?? 0;

    // EC261 Art. 6: Compensation only applies when arrival delay ≥ 3h
    if (delay < 180) {
      return {
        estimatedAmount: 0,
        routeDistanceKm: distKm,
        distanceTier: tier,
        eligible: false,
        ineligibilityReason: `Delay of ${delay} minutes is below the 3-hour (180-minute) threshold required for EC261 compensation.`,
        notes,
      };
    }
    notes.push(`Delay of ${delay} minutes (${(delay / 60).toFixed(1)}h) meets EC261 threshold.`);
  }

  // ── Cancellation with 14+ days notice ─────────────────────
  if (
    input.disruptionType === "cancellation" &&
    typeof input.noticeGiven === "number" &&
    input.noticeGiven >= 14
  ) {
    return {
      estimatedAmount: 0,
      routeDistanceKm: distKm,
      distanceTier: tier,
      eligible: false,
      ineligibilityReason: `Airline provided ${input.noticeGiven} days notice of cancellation (≥14 days). EC261 Art. 5(1)(c) — no compensation due.`,
      notes,
    };
  }

  // ── EC261 coverage check ───────────────────────────────────
  const routeCovered = isEC261Route(input.departureAirport, input.arrivalAirport);
  if (!routeCovered) {
    notes.push(
      "WARNING: Neither departure nor arrival airport appears to be in EU/EEA/UK. EC261 may not apply. Manual review required."
    );
  }

  return {
    estimatedAmount: baseAmount,
    routeDistanceKm: distKm,
    distanceTier: tier,
    eligible: true,
    notes,
  };
}

/**
 * Check if a disruption reason string suggests extraordinary circumstances.
 * Returns matched keywords for flagging.
 */
export function detectExtraordinaryCircumstances(
  reason?: string | null
): string[] {
  if (!reason) return [];
  const lower = reason.toLowerCase();
  return EXTRAORDINARY_KEYWORDS.filter((kw) => lower.includes(kw));
}
