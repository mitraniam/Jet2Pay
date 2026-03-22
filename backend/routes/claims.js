const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const db = require('../db')
const { sendClaimConfirmation } = require('../services/email')

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

// POST /api/claims — submit a new claim
router.post('/', async (req, res) => {
  try {
    const body = req.body
    const claimId = uuidv4()
    const claimToken = uuidv4()

    const estimated = estimateCompensation(body.delayDuration, body.flightType)

    db.prepare(`
      INSERT INTO claims (id, claim_token, status, flight_type, departure_airport, arrival_airport,
        flight_number, flight_date, delay_duration, cancellation_reason, disruption_reason, airline,
        estimated_compensation, consent_ec261, consent_assignment, consent_marketing)
      VALUES (?, ?, 'submitted', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      claimId, claimToken,
      body.flightType || null,
      body.departureAirport || null,
      body.arrivalAirport || null,
      body.flightNumber || null,
      body.flightDate || null,
      body.delayDuration || null,
      body.cancellationReason || null,
      body.disruptionReason || null,
      body.airline || null,
      estimated,
      body.consent?.ec261 ? 1 : 0,
      body.consent?.assignment ? 1 : 0,
      body.consent?.marketing ? 1 : 0,
    )

    // Insert passengers
    const passengers = Array.isArray(body.passengers) ? body.passengers : []
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i]
      db.prepare(`
        INSERT INTO passengers (claim_id, first_name, last_name, email, phone, is_lead, iban, bic, date_of_birth)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(claimId, p.firstName, p.lastName, p.email, p.phone || null, i === 0 ? 1 : 0,
             p.iban || null, p.bic || null, p.dateOfBirth || null)
    }

    // Timeline event
    db.prepare(`INSERT INTO timeline_events (claim_id, event) VALUES (?, ?)`).run(
      claimId, 'Claim submitted'
    )

    // Send confirmation email
    if (passengers.length > 0) {
      const claim = db.prepare('SELECT * FROM claims WHERE id = ?').get(claimId)
      sendClaimConfirmation(claim, passengers[0]).catch(console.error)
    }

    res.status(201).json({
      success: true,
      claimId,
      claimToken,
      estimatedCompensation: estimated,
      message: 'Claim submitted successfully',
    })
  } catch (err) {
    console.error('Submit claim error:', err)
    res.status(500).json({ error: 'Failed to submit claim' })
  }
})

// GET /api/claims/:id — public (uses ?token=) or admin (uses Bearer JWT)
router.get('/:id', (req, res) => {
  const { id } = req.params
  const { token } = req.query
  const jwt = require('jsonwebtoken')

  const claim = db.prepare('SELECT * FROM claims WHERE id = ?').get(id)
  if (!claim) return res.status(404).json({ error: 'Claim not found' })

  // Check if admin Bearer token
  const authHeader = req.headers['authorization']
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || 'dev-secret')
      // Admin — return full data
      const passengers = db.prepare('SELECT * FROM passengers WHERE claim_id = ?').all(id)
      const documents = db.prepare('SELECT * FROM documents WHERE claim_id = ? ORDER BY uploaded_at DESC').all(id)
      const notes = db.prepare('SELECT * FROM notes WHERE claim_id = ? ORDER BY created_at DESC').all(id)
      const timeline = db.prepare('SELECT * FROM timeline_events WHERE claim_id = ? ORDER BY created_at ASC').all(id)
      const messages = db.prepare('SELECT * FROM messages WHERE claim_id = ? ORDER BY created_at DESC').all(id)
      return res.json({ ...claim, passengers, documents, notes, timeline, messages })
    } catch {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }

  // Public — requires claim_token query param
  if (!token) return res.status(401).json({ error: 'Token required' })
  if (claim.claim_token !== token) return res.status(403).json({ error: 'Invalid token' })

  const passengers = db.prepare('SELECT first_name, last_name, email FROM passengers WHERE claim_id = ?').all(id)
  const timeline = db.prepare('SELECT event, created_at FROM timeline_events WHERE claim_id = ? ORDER BY created_at ASC').all(id)

  res.json({
    id: claim.id,
    status: claim.status,
    flightType: claim.flight_type,
    departureAirport: claim.departure_airport,
    arrivalAirport: claim.arrival_airport,
    flightNumber: claim.flight_number,
    flightDate: claim.flight_date,
    airline: claim.airline,
    estimatedCompensation: claim.estimated_compensation,
    createdAt: claim.created_at,
    passengers,
    timeline,
  })
})

// POST /api/claims/:id/documents — upload document
router.post('/:id/documents', upload.single('file'), (req, res) => {
  const { id } = req.params
  const { claim_token, document_type } = req.body

  const claim = db.prepare('SELECT * FROM claims WHERE id = ?').get(id)
  if (!claim) return res.status(404).json({ error: 'Claim not found' })
  if (claim.claim_token !== claim_token) return res.status(403).json({ error: 'Invalid token' })

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  db.prepare(`
    INSERT INTO documents (claim_id, document_type, filename, original_name)
    VALUES (?, ?, ?, ?)
  `).run(id, document_type || 'other', req.file.filename, req.file.originalname)

  res.status(201).json({ success: true, message: 'Document uploaded' })
})

function estimateCompensation(delayDuration, flightType) {
  if (flightType === 'cancelled') return 400
  if (!delayDuration) return 250
  if (delayDuration.includes('2') || delayDuration === '2-3h') return 250
  if (delayDuration.includes('3') || delayDuration === '3-4h') return 400
  if (delayDuration.includes('4') || delayDuration === '4h+') return 600
  return 250
}

module.exports = router
