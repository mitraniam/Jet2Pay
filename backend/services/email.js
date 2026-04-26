const nodemailer = require('nodemailer')

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

async function sendClaimConfirmation(claim, passenger) {
  if (!process.env.SMTP_USER) return // skip if not configured

  const transporter = createTransport()
  await transporter.sendMail({
    from: `"Jet2Pay" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: passenger.email,
    subject: `Your claim has been received — ${claim.id.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#e85d26">Jet2Pay — Claim Received</h2>
        <p>Dear ${passenger.first_name},</p>
        <p>We have received your compensation claim. Your claim reference is:</p>
        <p style="font-size:24px;font-weight:bold;color:#e85d26;letter-spacing:2px">${claim.id.slice(0, 8).toUpperCase()}</p>
        <p>You can check your claim status at any time:</p>
        <a href="${process.env.FRONTEND_URL}/status?id=${claim.id}&token=${claim.claim_token}"
           style="background:#e85d26;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block">
          Check Claim Status
        </a>
        <p style="color:#666;font-size:12px;margin-top:24px">
          Jet2Pay — MITRANI CONSULT EOOD, Sofia, Bulgaria<br>
          Reply to this email if you have any questions.
        </p>
      </div>
    `,
  })
}

async function sendLBA(claim, passenger, airline) {
  if (!process.env.SMTP_USER) return

  const transporter = createTransport()
  await transporter.sendMail({
    from: `"Jet2Pay" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: passenger.email,
    subject: `Letter Before Action — Flight ${claim.flight_number || ''} on ${claim.flight_date || ''}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#e85d26">Letter Before Action</h2>
        <p>Dear ${passenger.first_name} ${passenger.last_name},</p>
        <p>We are writing on your behalf regarding your claim for flight disruption compensation
        under EC Regulation 261/2004.</p>
        <p><strong>Flight:</strong> ${claim.flight_number || 'N/A'}<br>
        <strong>Date:</strong> ${claim.flight_date || 'N/A'}<br>
        <strong>Route:</strong> ${claim.departure_airport || ''} → ${claim.arrival_airport || ''}</p>
        <p>This letter serves as formal notice that we will pursue legal action if compensation
        is not provided within 14 days.</p>
        <p>Estimated compensation: <strong>€${claim.estimated_compensation || 250}</strong></p>
        <p style="color:#666;font-size:12px;margin-top:24px">Jet2Pay — MITRANI CONSULT EOOD</p>
      </div>
    `,
  })
}

async function sendReferralInvite(toEmail, senderName) {
  if (!process.env.SMTP_USER) return // skip if not configured

  const transporter = createTransport()
  const fromName = senderName ? senderName : 'A friend'
  const frontendUrl = process.env.FRONTEND_URL || 'https://jet2pay.com'

  await transporter.sendMail({
    from: `"Jet2Pay" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `${fromName} thinks you're owed flight compensation`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#E8672C 0%,#C94488 50%,#7B2D8E 100%);padding:32px 40px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#fff;font-size:28px;font-weight:900;margin:0;letter-spacing:-0.5px">Jet2Pay</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">Flight Compensation up to €600</p>
        </div>

        <!-- Body -->
        <div style="padding:40px;background:#fff">
          <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 16px">
            Hi there,
          </p>
          <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 24px">
            <strong>${fromName}</strong> thinks you may be owed compensation for a delayed or cancelled flight — and asked us to reach out.
          </p>

          <!-- Highlight box -->
          <div style="background:#FFF5EE;border-left:4px solid #E8672C;border-radius:8px;padding:20px 24px;margin-bottom:28px">
            <p style="margin:0;font-size:15px;color:#333;font-weight:600">Did you know?</p>
            <p style="margin:8px 0 0;font-size:14px;color:#555;line-height:1.6">
              Under EU Regulation 261/2004, passengers are entitled to up to <strong style="color:#E8672C">€600 compensation</strong> for flights delayed more than 3 hours, cancelled, or overbooked — for flights to/from the EU in the last 3 years.
            </p>
          </div>

          <!-- Steps -->
          <p style="font-size:15px;font-weight:700;color:#000;margin:0 0 16px">How it works:</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
            ${[
              ['Check in 2 minutes', 'Tell us your flight details — completely free, no commitment.'],
              ['We handle everything', 'Our experts deal with the airline on your behalf.'],
              ['Get paid', 'Receive up to €600 directly to your bank account.'],
            ].map(([title, desc], i) => `
              <tr>
                <td style="width:36px;vertical-align:top;padding:0 12px 16px 0">
                  <div style="width:32px;height:32px;background:linear-gradient(135deg,#E8672C,#7B2D8E);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:13px;text-align:center;line-height:32px">${i + 1}</div>
                </td>
                <td style="vertical-align:top;padding-bottom:16px">
                  <strong style="font-size:14px;color:#000">${title}</strong><br>
                  <span style="font-size:13px;color:#717171;line-height:1.6">${desc}</span>
                </td>
              </tr>
            `).join('')}
          </table>

          <!-- CTA -->
          <div style="text-align:center;margin:32px 0">
            <a href="${frontendUrl}/compensation"
               style="display:inline-block;background:linear-gradient(135deg,#E8672C 0%,#C94488 50%,#7B2D8E 100%);color:#fff;font-size:16px;font-weight:700;padding:16px 40px;border-radius:100px;text-decoration:none;letter-spacing:0.02em">
              Check My Compensation →
            </a>
            <p style="margin:12px 0 0;font-size:12px;color:#b0b0b0">Free check · No win, no fee · Takes 2 minutes</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:24px 40px;background:#f7f7f7;border-radius:0 0 12px 12px;text-align:center">
          <p style="margin:0;font-size:11px;color:#b0b0b0;line-height:1.6">
            You received this email because ${fromName} invited you via Jet2Pay.<br>
            Jet2Pay — MITRANI CONSULT EOOD, Sofia, Bulgaria<br>
            <a href="${frontendUrl}/privacy" style="color:#b0b0b0">Privacy Policy</a>
          </p>
        </div>
      </div>
    `,
  })
}

module.exports = { sendClaimConfirmation, sendLBA, sendReferralInvite }
