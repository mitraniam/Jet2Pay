const express = require('express')
const router = express.Router()
const { sendReferralInvite } = require('../services/email')

/**
 * POST /api/referral
 * Body: { emails: string[], senderName?: string }
 * Sends referral invitation emails to the provided addresses.
 */
router.post('/', async (req, res) => {
  const { emails, senderName } = req.body

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'At least one email address is required.' })
  }

  if (emails.length > 5) {
    return res.status(400).json({ error: 'Maximum 5 emails per request.' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  for (const email of emails) {
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: `Invalid email address: ${email}` })
    }
  }

  try {
    await Promise.all(
      emails.map(email => sendReferralInvite(email, senderName || ''))
    )
    res.json({ success: true, sent: emails.length })
  } catch (err) {
    console.error('Referral email error:', err)
    res.status(500).json({ error: 'Failed to send invitation emails. Please try again.' })
  }
})

module.exports = router
