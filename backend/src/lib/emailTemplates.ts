/**
 * Email Templates — Priority 5
 *
 * Minimal, inline-styled HTML templates for transactional emails.
 * All templates are mobile-readable with plain professional styling.
 */

const FOOTER = `
<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
  <p>Jet2Pay.eu — Flight Compensation Claims</p>
  <p>This email was sent regarding your EC261/UK261 compensation claim.
  If you believe you received this in error, please contact us at support@jet2pay.eu.</p>
  <p><a href="https://jet2pay.eu/unsubscribe" style="color:#9ca3af;">Unsubscribe</a></p>
</div>
`;

function wrap(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px;">
<div style="background:#fff;border-radius:8px;padding:32px;border:1px solid #e5e7eb;">
<div style="margin-bottom:24px;">
  <strong style="font-size:20px;color:#111827;">Jet2Pay.eu</strong>
</div>
${content}
${FOOTER}
</div>
</div>
</body>
</html>`;
}

export interface SubmissionConfirmationData {
  claimId: string;
  claimToken: string;
  flightNumber: string;
  flightDate: string;
  departureAirport: string;
  arrivalAirport: string;
  estimatedAmount: number;
  passengerName: string;
}

export function submissionConfirmation(data: SubmissionConfirmationData): {
  subject: string;
  html: string;
} {
  const shortId = data.claimId.substring(0, 8).toUpperCase();
  const uploadLink = `https://jet2pay.eu/claims/${data.claimId}/upload?token=${data.claimToken}`;

  return {
    subject: `Your Jet2 compensation claim has been received — Ref #${shortId}`,
    html: wrap(`
<h2 style="color:#111827;font-size:18px;margin:0 0 16px;">Your claim has been received</h2>
<p style="color:#374151;line-height:1.6;">Dear ${data.passengerName},</p>
<p style="color:#374151;line-height:1.6;">
  Thank you for submitting your compensation claim. We will review it and keep you updated.
</p>

<div style="background:#f3f4f6;border-radius:6px;padding:16px;margin:16px 0;">
  <p style="margin:4px 0;color:#374151;"><strong>Claim Reference:</strong> #${shortId}</p>
  <p style="margin:4px 0;color:#374151;"><strong>Flight:</strong> ${data.flightNumber} on ${data.flightDate}</p>
  <p style="margin:4px 0;color:#374151;"><strong>Route:</strong> ${data.departureAirport} → ${data.arrivalAirport}</p>
  <p style="margin:4px 0;color:#374151;"><strong>Estimated Compensation:</strong> €${data.estimatedAmount}</p>
</div>

<h3 style="color:#111827;font-size:15px;margin:24px 0 12px;">What happens next?</h3>
<ol style="color:#374151;line-height:1.8;padding-left:20px;">
  <li><strong>Upload your documents</strong> — boarding pass and booking confirmation are required.</li>
  <li><strong>We verify your flight</strong> — we cross-check with flight data records.</li>
  <li><strong>We handle your claim</strong> — we contact Jet2 on your behalf. No Win, No Fee.</li>
</ol>

<div style="margin:24px 0;text-align:center;">
  <a href="${uploadLink}"
     style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
    Upload Documents
  </a>
</div>

<p style="color:#6b7280;font-size:13px;">
  Our service is No Win, No Fee. We only charge a 30% commission on successful claims.
  Your rights under EC Regulation 261/2004 and UK261 are protected.
</p>
`),
  };
}

export interface DocumentReminderData {
  claimId: string;
  claimToken: string;
  flightNumber: string;
  passengerName: string;
}

export function documentReminder(data: DocumentReminderData): {
  subject: string;
  html: string;
} {
  const shortId = data.claimId.substring(0, 8).toUpperCase();
  const uploadLink = `https://jet2pay.eu/claims/${data.claimId}/upload?token=${data.claimToken}`;

  return {
    subject: `Documents needed for your claim — Ref #${shortId}`,
    html: wrap(`
<h2 style="color:#111827;font-size:18px;margin:0 0 16px;">We still need your documents</h2>
<p style="color:#374151;line-height:1.6;">Dear ${data.passengerName},</p>
<p style="color:#374151;line-height:1.6;">
  We noticed you haven't uploaded documents for your claim #${shortId} (flight ${data.flightNumber}).
  To process your claim, we need at minimum:
</p>
<ul style="color:#374151;line-height:1.8;">
  <li>Boarding pass</li>
  <li>Booking confirmation</li>
</ul>
<div style="margin:24px 0;text-align:center;">
  <a href="${uploadLink}"
     style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
    Upload Documents Now
  </a>
</div>
<p style="color:#6b7280;font-size:13px;">Without these documents, we may not be able to proceed with your claim.</p>
`),
  };
}

export interface StatusChangeData {
  claimId: string;
  flightNumber: string;
  passengerName: string;
  newStatus: string;
  reason?: string;
}

const STATUS_COPY: Record<string, { title: string; body: string; nextSteps: string }> = {
  under_review: {
    title: "Your claim is being reviewed",
    body: "We're reviewing your claim against EC261/UK261 regulations. This usually takes 5–10 working days.",
    nextSteps: "No action is needed from you at this time. We'll notify you once we have an update.",
  },
  approved: {
    title: "Great news! Your claim has been approved",
    body: "Jet2 has approved your compensation claim.",
    nextSteps: "We'll process your payment shortly. You'll receive a separate email with payment details.",
  },
  rejected: {
    title: "Your claim was not approved",
    body: "Unfortunately, your compensation claim was not approved.",
    nextSteps: "If you believe this decision is incorrect, please reply to this email and we'll review your case again.",
  },
  legal_escalated: {
    title: "We're escalating your case",
    body: "We've escalated your claim through our legal process. This is a standard step when the airline hasn't responded within the expected timeframe.",
    nextSteps: "No action is needed from you. Our legal team will handle the next steps, including a formal Letter Before Action to Jet2.",
  },
  paid: {
    title: "Your compensation has been sent",
    body: "Your compensation payment has been processed and sent to your bank account.",
    nextSteps: "The transfer typically arrives within 1–3 working days. Check your bank account for the incoming payment.",
  },
};

export function statusChange(data: StatusChangeData): {
  subject: string;
  html: string;
} {
  const shortId = data.claimId.substring(0, 8).toUpperCase();
  const copy = STATUS_COPY[data.newStatus] ?? {
    title: "Claim status update",
    body: `Your claim status has been updated to: ${data.newStatus}.`,
    nextSteps: "We'll keep you informed of any further developments.",
  };

  return {
    subject: `Claim update: ${copy.title} — Ref #${shortId}`,
    html: wrap(`
<h2 style="color:#111827;font-size:18px;margin:0 0 16px;">${copy.title}</h2>
<p style="color:#374151;line-height:1.6;">Dear ${data.passengerName},</p>
<p style="color:#374151;line-height:1.6;">${copy.body}</p>
${data.reason ? `<p style="color:#374151;line-height:1.6;"><strong>Details:</strong> ${data.reason}</p>` : ""}
<div style="background:#f3f4f6;border-radius:6px;padding:16px;margin:16px 0;">
  <p style="margin:4px 0;color:#374151;"><strong>Claim:</strong> #${shortId}</p>
  <p style="margin:4px 0;color:#374151;"><strong>Flight:</strong> ${data.flightNumber}</p>
  <p style="margin:4px 0;color:#374151;"><strong>Status:</strong> ${data.newStatus.replace(/_/g, " ")}</p>
</div>
<h3 style="color:#111827;font-size:15px;margin:24px 0 8px;">What's next?</h3>
<p style="color:#374151;line-height:1.6;">${copy.nextSteps}</p>
`),
  };
}

export interface CompensationApprovedData {
  claimId: string;
  flightNumber: string;
  passengerName: string;
  approvedAmountEur: number;
  companyFeeEur: number;
  clientPayoutEur: number;
  expectedPaymentDate: string;
  bankingLink: string;
}

export function compensationApproved(data: CompensationApprovedData): {
  subject: string;
  html: string;
} {
  const shortId = data.claimId.substring(0, 8).toUpperCase();

  return {
    subject: `Your compensation of €${data.clientPayoutEur} is approved — Ref #${shortId}`,
    html: wrap(`
<h2 style="color:#111827;font-size:18px;margin:0 0 16px;">Your compensation has been approved!</h2>
<p style="color:#374151;line-height:1.6;">Dear ${data.passengerName},</p>
<p style="color:#374151;line-height:1.6;">
  Great news — Jet2 has approved your EC261 compensation claim. Here's the breakdown:
</p>
<div style="background:#f3f4f6;border-radius:6px;padding:16px;margin:16px 0;">
  <p style="margin:4px 0;color:#374151;"><strong>Total Compensation:</strong> €${data.approvedAmountEur.toFixed(2)}</p>
  <p style="margin:4px 0;color:#374151;"><strong>Service Fee (30%):</strong> €${data.companyFeeEur.toFixed(2)}</p>
  <p style="margin:8px 0;color:#111827;font-size:16px;"><strong>Your Payout:</strong> €${data.clientPayoutEur.toFixed(2)}</p>
  <p style="margin:4px 0;color:#6b7280;font-size:13px;">Expected payment by: ${data.expectedPaymentDate}</p>
</div>
<p style="color:#374151;line-height:1.6;">
  To receive your payment, please provide your bank details:
</p>
<div style="margin:24px 0;text-align:center;">
  <a href="${data.bankingLink}"
     style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
    Enter Bank Details
  </a>
</div>
`),
  };
}

export interface MonthlyStaleUpdateData {
  claimId: string;
  flightNumber: string;
  passengerName: string;
  daysSinceSubmission: number;
}

export function monthlyStaleUpdate(data: MonthlyStaleUpdateData): {
  subject: string;
  html: string;
} {
  const shortId = data.claimId.substring(0, 8).toUpperCase();

  return {
    subject: `Update on your claim — Ref #${shortId}`,
    html: wrap(`
<h2 style="color:#111827;font-size:18px;margin:0 0 16px;">An update on your claim</h2>
<p style="color:#374151;line-height:1.6;">Dear ${data.passengerName},</p>
<p style="color:#374151;line-height:1.6;">
  We wanted to let you know that your claim #${shortId} for flight ${data.flightNumber} is still
  being processed. It has been ${data.daysSinceSubmission} days since submission, which is longer
  than usual, and we apologise for the delay.
</p>
<p style="color:#374151;line-height:1.6;">
  Airline response times can vary. We are actively pursuing your claim and will update you
  as soon as we hear back from Jet2. Typical resolution takes 6–12 weeks from the date of submission.
</p>
<p style="color:#374151;line-height:1.6;">
  If you have any questions, please don't hesitate to contact us at
  <a href="mailto:support@jet2pay.eu" style="color:#2563eb;">support@jet2pay.eu</a>.
</p>
`),
  };
}
