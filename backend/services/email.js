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

module.exports = { sendClaimConfirmation, sendLBA }
