/**
 * Email Service — Priority 5
 *
 * Resend integration with logging to EmailLog table.
 */

import { Resend } from "resend";
import { db } from "@/lib/db";
import logger from "@/lib/logger";

// Lazy-initialized Resend client — avoids crash at Next.js build time
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("Missing RESEND_API_KEY env var");
    _resend = new Resend(key);
  }
  return _resend;
}

const EMAIL_FROM = process.env.EMAIL_FROM ?? "claims@jet2pay.eu";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  claimId?: string;
  templateName: string;
}

/**
 * Send an email via Resend and log the attempt.
 */
export async function sendEmail(params: SendEmailParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const recipients = Array.isArray(params.to) ? params.to : [params.to];

  try {
    const { data, error } = await getResend().emails.send({
      from: EMAIL_FROM,
      to: recipients,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      // Log failed attempt for each recipient
      await logEmailAttempts(
        recipients,
        params.claimId,
        params.templateName,
        null,
        error.message
      );
      logger.error("Email send failed", { error, templateName: params.templateName });
      return { success: false, error: error.message };
    }

    const messageId = data?.id ?? null;

    // Log successful send for each recipient
    await logEmailAttempts(
      recipients,
      params.claimId,
      params.templateName,
      messageId,
      null
    );

    logger.info("Email sent", {
      templateName: params.templateName,
      to: recipients,
      messageId,
    });

    return { success: true, messageId: messageId ?? undefined };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    await logEmailAttempts(
      recipients,
      params.claimId,
      params.templateName,
      null,
      errorMessage
    );

    logger.error("Email send exception", {
      error: errorMessage,
      templateName: params.templateName,
    });

    return { success: false, error: errorMessage };
  }
}

async function logEmailAttempts(
  recipients: string[],
  claimId: string | undefined,
  templateName: string,
  messageId: string | null,
  error: string | null
): Promise<void> {
  try {
    await db.emailLog.createMany({
      data: recipients.map((email) => ({
        claimId: claimId ?? null,
        templateName,
        toEmail: email,
        resendMessageId: messageId,
        error,
      })),
    });
  } catch (logErr) {
    logger.error("Failed to log email attempt", { error: logErr });
  }
}
