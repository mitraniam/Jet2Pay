import { z } from "zod";

export const VerifyFlightSchema = z.object({
  flightNumber: z
    .string()
    .min(3)
    .max(10)
    .toUpperCase()
    .regex(/^[A-Z]{2}\d{1,4}[A-Z]?$/, "Invalid flight number format (e.g. LS123)"),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((d) => {
      const date = new Date(d);
      const now = new Date();
      const sixYearsAgo = new Date();
      sixYearsAgo.setFullYear(now.getFullYear() - 6);
      return date <= now && date >= sixYearsAgo;
    }, "Date must be in the past and within the last 6 years"),
});

export type VerifyFlightInput = z.infer<typeof VerifyFlightSchema>;
