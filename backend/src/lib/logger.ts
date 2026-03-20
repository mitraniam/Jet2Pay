import { createLogger, format, transports } from "winston";
import { NextRequest } from "next/server";

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    process.env.NODE_ENV === "production"
      ? format.json()
      : format.prettyPrint()
  ),
  transports: [new transports.Console()],
});

export default logger;

/**
 * Log an incoming API request with method, path, and client IP.
 */
export function logRequest(req: NextRequest, extra?: Record<string, unknown>) {
  logger.info("API request", {
    method: req.method,
    path: req.nextUrl.pathname,
    ip:
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      req.headers.get("x-real-ip") ??
      "unknown",
    userAgent: req.headers.get("user-agent"),
    ...extra,
  });
}

/**
 * Log an error with context.
 */
export function logError(
  message: string,
  error: unknown,
  context?: Record<string, unknown>
) {
  logger.error(message, {
    error:
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : error,
    ...context,
  });
}
