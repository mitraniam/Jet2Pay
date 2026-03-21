# Jet2Pay — Backend API

REST API for the Jet2Pay EC261/UK261 flight compensation claims platform.

**Stack:** Next.js 14 App Router · TypeScript · PostgreSQL + Prisma · Upstash Redis · Zod

---

## Setup

```bash
cd backend
npm install
cp .env.example .env.local
# Fill in DATABASE_URL, UPSTASH_*, AVIATIONSTACK_API_KEY, ADMIN_JWT_SECRET
npm run prisma:push      # apply schema to DB
npm run dev              # http://localhost:3001
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `UPSTASH_REDIS_REST_URL` | ✅ | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | Upstash Redis REST token |
| `ADMIN_JWT_SECRET` | ✅ | Secret for signing admin JWTs (min 32 chars) |
| `AVIATIONSTACK_API_KEY` | ✅ | AviationStack API key (free tier available) |
| `ALLOWED_ORIGINS` | ✅ | CORS origins, comma-separated |

---

## API Reference

### Priority 1 — Claim Submission

#### `POST /api/claims`
Submit a new compensation claim.

**Request body:**
```json
{
  "flightNumber": "LS123",
  "flightDate": "2024-07-15",
  "departureAirport": "LBA",
  "arrivalAirport": "PMI",
  "disruptionType": "delay",
  "delayDuration": 240,
  "passengerCount": 2,
  "passengerDetails": [
    {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john@example.com",
      "phone": "+447700900000",
      "nationality": "GB"
    }
  ],
  "bookingReference": "ABC123",
  "noticeGiven": null,
  "consentGiven": true
}
```

**Response `201`:**
```json
{
  "claimId": "uuid",
  "status": "submitted",
  "estimatedAmount": 250,
  "distanceTier": "<1500",
  "eligible": true,
  "submittedAt": "2024-03-17T10:00:00Z"
}
```

---

#### `GET /api/claims/:claimId`
Retrieve full claim details and status history.

**Response `200`:** Full claim object including passengers, documents, flight verification, status history.

---

#### `PATCH /api/claims/:claimId/status`
**Admin only** — requires `Authorization: Bearer <jwt>`

Update claim status.

```json
{ "status": "approved", "reason": "Flight verified, delay confirmed 4h 15m" }
```

Valid statuses: `submitted` · `under_review` · `approved` · `rejected` · `paid` · `legal_escalated`

---

### Priority 2 — Flight Verification

#### `POST /api/flights/verify`
Verify flight data via AviationStack API. Results cached 24h in Redis.

```json
{ "flightNumber": "LS123", "date": "2024-07-15" }
```

**Response `200`:**
```json
{
  "flightNumber": "LS123",
  "date": "2024-07-15",
  "scheduledDeparture": "2024-07-15T06:00:00Z",
  "actualDeparture": "2024-07-15T10:15:00Z",
  "scheduledArrival": "2024-07-15T09:30:00Z",
  "actualArrival": "2024-07-15T13:45:00Z",
  "delayMinutes": 255,
  "status": "delayed",
  "source": "aviationstack",
  "likelyIneligible": false,
  "cached": false
}
```

---

## EC261 Compensation Rules

| Route distance | Compensation |
|----------------|-------------|
| < 1,500 km | €250 |
| 1,500 – 3,500 km | €400 |
| > 3,500 km | €600 (or €300 if delay < 4h on EU/UK border crossing) |

Minimum delay threshold: **3 hours** at destination (arrival time).

Cancellations with **14+ days notice** → €0 (EC261 Art. 5(1)(c)).

---

## Rate Limiting

Public endpoints: **10 requests / minute / IP** (Upstash sliding window).
Responses include `X-RateLimit-*` headers.

---

## Admin JWT

Generate a token for testing:
```ts
import { signAdminToken } from "@/lib/auth";
const token = await signAdminToken("admin-user-id", "admin", "8h");
// Use as: Authorization: Bearer <token>
```

---

## GDPR Compliance

- `consentGiven: true` required on claim submission
- `gdprRetainUntil` set to 6 years from creation (EC261 statute of limitations)
- Soft-delete via `deletedAt` field — PII can be zeroed without losing claim metadata
- No PII logged to console/files

---

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # DB schema (Claim, Passenger, Document, ...)
├── src/
│   ├── app/api/
│   │   ├── claims/
│   │   │   ├── route.ts       # POST /api/claims
│   │   │   └── [claimId]/
│   │   │       ├── route.ts   # GET /api/claims/:claimId
│   │   │       └── status/
│   │   │           └── route.ts # PATCH /api/claims/:claimId/status
│   │   └── flights/
│   │       └── verify/
│   │           └── route.ts   # POST /api/flights/verify
│   ├── lib/
│   │   ├── db.ts              # Prisma singleton
│   │   ├── redis.ts           # Upstash Redis + cache helpers
│   │   ├── rateLimit.ts       # Sliding window rate limiter
│   │   ├── auth.ts            # Admin JWT (jose)
│   │   ├── logger.ts          # Winston structured logging
│   │   ├── ec261.ts           # EC261/UK261 compensation rules engine
│   │   └── airports.ts        # Airport coordinates + haversine distance
│   └── schemas/
│       ├── claim.ts           # Zod schemas for claim endpoints
│       └── flight.ts          # Zod schema for flight verification
└── .env.example
```
