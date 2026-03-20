/**
 * POST /api/flights/verify
 * Verify a flight's actual departure/arrival times via AviationStack.
 * Results are cached in Upstash Redis (TTL: 24h).
 */

import { NextRequest, NextResponse } from "next/server";
import { redis, flightCacheKey, FLIGHT_CACHE_TTL } from "@/lib/redis";
import { applyRateLimit } from "@/lib/rateLimit";
import { logRequest, logError } from "@/lib/logger";
import { VerifyFlightSchema } from "@/schemas/flight";

// ── AviationStack response types ────────────────────────────────────────────

interface AviationStackFlight {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    iata: string;
    scheduled: string | null;
    actual: string | null;
    delay: number | null;
  };
  arrival: {
    airport: string;
    iata: string;
    scheduled: string | null;
    actual: string | null;
    delay: number | null;
  };
  flight: {
    iata: string;
    number: string;
  };
}

interface AviationStackResponse {
  data: AviationStackFlight[];
  error?: { message: string; code: string };
}

// ── Normalised output ────────────────────────────────────────────────────────

export interface FlightVerificationResult {
  flightNumber: string;
  date: string;
  scheduledDeparture: string | null;
  actualDeparture: string | null;
  scheduledArrival: string | null;
  actualArrival: string | null;
  delayMinutes: number | null;
  status: "cancelled" | "delayed" | "on_time" | "unknown";
  source: "aviationstack" | "manual";
  likelyIneligible: boolean;   // delay < 180 min flag
  cachedAt?: string;
}

// ── AviationStack fetcher ────────────────────────────────────────────────────

async function fetchFromAviationStack(
  flightNumber: string,
  date: string
): Promise<FlightVerificationResult> {
  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  if (!apiKey) {
    throw new Error("AVIATIONSTACK_API_KEY is not configured");
  }

  // AviationStack API: flight_iata is the IATA flight number, flight_date is YYYY-MM-DD
  const url = new URL("http://api.aviationstack.com/v1/flights");
  url.searchParams.set("access_key", apiKey);
  url.searchParams.set("flight_iata", flightNumber.toUpperCase());
  url.searchParams.set("flight_date", date);

  const response = await fetch(url.toString(), {
    next: { revalidate: 0 }, // never use Next.js cache — we manage with Redis
  });

  if (!response.ok) {
    throw new Error(`AviationStack HTTP ${response.status}`);
  }

  const json: AviationStackResponse = await response.json();

  if (json.error) {
    throw new Error(`AviationStack error: ${json.error.message}`);
  }

  const flight = json.data?.[0];
  if (!flight) {
    // No data returned — return unknown result
    return {
      flightNumber: flightNumber.toUpperCase(),
      date,
      scheduledDeparture: null,
      actualDeparture: null,
      scheduledArrival: null,
      actualArrival: null,
      delayMinutes: null,
      status: "unknown",
      source: "aviationstack",
      likelyIneligible: false,
    };
  }

  // ── Determine delay in minutes ─────────────────────────────
  // AviationStack provides departure.delay and arrival.delay in minutes.
  // We use the arrival delay as EC261 is based on arrival time.
  const delayMinutes =
    flight.arrival.delay ??
    flight.departure.delay ??
    (() => {
      const sched = flight.arrival.scheduled ? new Date(flight.arrival.scheduled).getTime() : null;
      const actual = flight.arrival.actual ? new Date(flight.arrival.actual).getTime() : null;
      if (sched && actual) return Math.round((actual - sched) / 60_000);
      return null;
    })();

  // ── Normalise status ───────────────────────────────────────
  let status: FlightVerificationResult["status"] = "unknown";
  const rawStatus = flight.flight_status?.toLowerCase() ?? "";
  if (rawStatus === "cancelled") {
    status = "cancelled";
  } else if (delayMinutes !== null && delayMinutes >= 180) {
    status = "delayed";
  } else if (delayMinutes !== null && delayMinutes < 180) {
    status = "on_time"; // under threshold — likely ineligible
  } else if (rawStatus === "active" || rawStatus === "landed" || rawStatus === "scheduled") {
    status = delayMinutes ? "delayed" : "on_time";
  }

  return {
    flightNumber: flight.flight.iata ?? flightNumber.toUpperCase(),
    date,
    scheduledDeparture: flight.departure.scheduled,
    actualDeparture: flight.departure.actual,
    scheduledArrival: flight.arrival.scheduled,
    actualArrival: flight.arrival.actual,
    delayMinutes,
    status,
    source: "aviationstack",
    likelyIneligible: delayMinutes !== null && delayMinutes < 180 && status !== "cancelled",
  };
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  logRequest(req);

  // ── Rate limiting ──────────────────────────────────────────
  const rateLimited = await applyRateLimit(req);
  if (rateLimited) return rateLimited;

  // ── Parse & validate ──────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = VerifyFlightSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { flightNumber, date } = parsed.data;
  const cacheKey = flightCacheKey(flightNumber, date);

  // ── Cache lookup ──────────────────────────────────────────
  try {
    const cached = await redis.get<FlightVerificationResult>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true }, { status: 200 });
    }
  } catch (err) {
    // Redis failure is non-fatal — continue to live API
    logError("Redis cache read failed", err, { cacheKey });
  }

  // ── Live API call ──────────────────────────────────────────
  let result: FlightVerificationResult;
  try {
    result = await fetchFromAviationStack(flightNumber, date);
  } catch (err) {
    logError("AviationStack API call failed", err, { flightNumber, date });
    // Return a graceful degradation response
    return NextResponse.json(
      {
        error: "Flight data unavailable",
        message:
          "Unable to verify flight data at this time. Your claim will be reviewed manually.",
        flightNumber: flightNumber.toUpperCase(),
        date,
        source: "manual",
        status: "unknown",
      },
      { status: 503 }
    );
  }

  // ── Write-through cache ────────────────────────────────────
  const resultWithTimestamp = {
    ...result,
    cachedAt: new Date().toISOString(),
  };
  try {
    await redis.set(cacheKey, resultWithTimestamp, { ex: FLIGHT_CACHE_TTL });
  } catch (err) {
    logError("Redis cache write failed", err, { cacheKey });
    // Non-fatal
  }

  return NextResponse.json({ ...resultWithTimestamp, cached: false }, { status: 200 });
}
