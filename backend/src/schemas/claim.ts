import { z } from "zod";

// ── Shared sub-schemas ──────────────────────────────────────────────────────

export const PassengerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name required")
    .max(100)
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/, "Invalid characters in first name"),
  lastName: z
    .string()
    .min(1, "Last name required")
    .max(100)
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/, "Invalid characters in last name"),
  email: z.string().email("Invalid email address").max(254),
  phone: z
    .string()
    .min(7, "Phone number too short")
    .max(20)
    .regex(/^\+?[0-9\s\-().]+$/, "Invalid phone number format"),
  nationality: z
    .string()
    .length(2, "Nationality must be a 2-letter ISO country code")
    .toUpperCase(),
});

export type Passenger = z.infer<typeof PassengerSchema>;

// ── IATA code ───────────────────────────────────────────────────────────────

const IATACode = z
  .string()
  .length(3, "IATA code must be exactly 3 characters")
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "IATA code must contain only letters");

// ── POST /api/claims ────────────────────────────────────────────────────────

export const CreateClaimSchema = z.object({
  flightNumber: z
    .string()
    .min(3, "Flight number too short")
    .max(10)
    .toUpperCase()
    .regex(/^[A-Z]{2}\d{1,4}[A-Z]?$/, "Invalid flight number format (e.g. LS123)"),

  flightDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((d) => {
      const date = new Date(d);
      const now = new Date();
      const sixYearsAgo = new Date();
      sixYearsAgo.setFullYear(now.getFullYear() - 6);
      return date <= now && date >= sixYearsAgo;
    }, "Flight date must be in the past and within 6 years (EC261 statute of limitations)"),

  departureAirport: IATACode,
  arrivalAirport: IATACode,

  disruptionType: z.enum(
    ["delay", "cancellation", "denied_boarding", "missed_connection"],
    { errorMap: () => ({ message: "Invalid disruption type" }) }
  ),

  delayDuration: z
    .number()
    .int("Delay must be a whole number of minutes")
    .min(0)
    .max(72 * 60, "Delay cannot exceed 72 hours (4320 minutes)")
    .nullable()
    .optional(),

  passengerCount: z
    .number()
    .int("Passenger count must be a whole number")
    .min(1, "At least 1 passenger required")
    .max(9, "Maximum 9 passengers per claim"),

  passengerDetails: z
    .array(PassengerSchema)
    .min(1, "At least one passenger required")
    .max(9, "Maximum 9 passengers"),

  bookingReference: z
    .string()
    .min(4, "Booking reference too short")
    .max(20, "Booking reference too long")
    .regex(/^[A-Z0-9]+$/i, "Booking reference should be alphanumeric"),

  noticeGiven: z
    .number()
    .int("Notice must be whole days")
    .min(0)
    .max(365)
    .nullable()
    .optional(),

  consentGiven: z.literal(true, {
    errorMap: () => ({
      message: "You must consent to our terms and GDPR data processing policy",
    }),
  }),
}).refine(
  (data) => data.passengerDetails.length === data.passengerCount,
  {
    message: "passengerDetails length must match passengerCount",
    path: ["passengerDetails"],
  }
).refine(
  (data) => data.departureAirport !== data.arrivalAirport,
  {
    message: "Departure and arrival airports cannot be the same",
    path: ["arrivalAirport"],
  }
);

export type CreateClaimInput = z.infer<typeof CreateClaimSchema>;

// ── PATCH /api/claims/:claimId/status ───────────────────────────────────────

export const UpdateClaimStatusSchema = z.object({
  status: z.enum([
    "submitted",
    "under_review",
    "approved",
    "rejected",
    "paid",
    "legal_escalated",
  ]),
  reason: z.string().max(500).optional(),
});

export type UpdateClaimStatusInput = z.infer<typeof UpdateClaimStatusSchema>;
