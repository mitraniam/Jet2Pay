const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')
const requireAdmin = require('../middleware/auth')
const { sendLBA } = require('../services/email')

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@jet2pay.eu'
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123'

  if (email !== adminEmail) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = password === adminPassword || await bcrypt.compare(password, adminPassword).catch(() => false)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '12h' })
  res.json({ token, email })
})

// GET /api/admin/stats
router.get('/stats', requireAdmin, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM claims').get().count
  const submitted = db.prepare("SELECT COUNT(*) as count FROM claims WHERE status = 'submitted'").get().count
  const approved = db.prepare("SELECT COUNT(*) as count FROM claims WHERE status = 'approved'").get().count
  const paid = db.prepare("SELECT COUNT(*) as count FROM claims WHERE status = 'paid'").get().count
  const totalValue = db.prepare('SELECT COALESCE(SUM(estimated_compensation), 0) as total FROM claims').get().total

  res.json({ total, submitted, approved, paid, totalValue })
})

// GET /api/admin/claims
router.get('/claims', requireAdmin, (req, res) => {
  const { search = '', status = '', page = '1', limit = '25', sort = 'created_at', dir = 'desc' } = req.query

  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
  const offset = (pageNum - 1) * limitNum

  const allowedSorts = ['created_at', 'updated_at', 'status', 'estimated_compensation', 'flight_date']
  const sortCol = allowedSorts.includes(sort) ? sort : 'created_at'
  const sortDir = dir === 'asc' ? 'ASC' : 'DESC'

  let where = []
  let params = []

  if (search) {
    where.push(`(c.id LIKE ? OR c.flight_number LIKE ? OR p.first_name LIKE ? OR p.last_name LIKE ? OR p.email LIKE ?)`)
    const s = `%${search}%`
    params.push(s, s, s, s, s)
  }
  if (status) {
    where.push(`c.status = ?`)
    params.push(status)
  }

  const whereStr = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const countRow = db.prepare(`
    SELECT COUNT(DISTINCT c.id) as count FROM claims c
    LEFT JOIN passengers p ON p.claim_id = c.id AND p.is_lead = 1
    ${whereStr}
  `).get(...params)

  const claims = db.prepare(`
    SELECT c.*, p.first_name, p.last_name, p.email as passenger_email, p.phone
    FROM claims c
    LEFT JOIN passengers p ON p.claim_id = c.id AND p.is_lead = 1
    ${whereStr}
    GROUP BY c.id
    ORDER BY c.${sortCol} ${sortDir}
    LIMIT ? OFFSET ?
  `).all(...params, limitNum, offset)

  res.json({
    claims,
    total: countRow.count,
    page: pageNum,
    pages: Math.ceil(countRow.count / limitNum),
  })
})

// GET /api/claims/:id (full detail for admin — also used by public with token)
// This is mounted on /api/claims/:id in server.js

// PATCH /api/claims/:id/status
router.patch('/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const allowed = ['submitted', 'reviewing', 'documents_needed', 'approved', 'paid', 'rejected']
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' })

  const claim = db.prepare('SELECT * FROM claims WHERE id = ?').get(id)
  if (!claim) return res.status(404).json({ error: 'Claim not found' })

  db.prepare(`UPDATE claims SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, id)
  db.prepare(`INSERT INTO timeline_events (claim_id, event) VALUES (?, ?)`).run(id, `Status changed to: ${status}`)

  res.json({ success: true, status })
})

// POST /api/admin/claims/:id/notes
router.post('/claims/:id/notes', requireAdmin, (req, res) => {
  const { id } = req.params
  const { text } = req.body

  if (!text) return res.status(400).json({ error: 'Note text required' })

  const claim = db.prepare('SELECT id FROM claims WHERE id = ?').get(id)
  if (!claim) return res.status(404).json({ error: 'Claim not found' })

  db.prepare(`INSERT INTO notes (claim_id, text) VALUES (?, ?)`).run(id, text)
  db.prepare(`INSERT INTO timeline_events (claim_id, event) VALUES (?, ?)`).run(id, 'Internal note added')

  res.status(201).json({ success: true })
})

// POST /api/admin/claims/:id/lba
router.post('/claims/:id/lba', requireAdmin, async (req, res) => {
  const { id } = req.params

  const claim = db.prepare('SELECT * FROM claims WHERE id = ?').get(id)
  if (!claim) return res.status(404).json({ error: 'Claim not found' })

  const passenger = db.prepare('SELECT * FROM passengers WHERE claim_id = ? AND is_lead = 1').get(id)
  if (!passenger) return res.status(400).json({ error: 'No lead passenger found' })

  try {
    await sendLBA(claim, passenger, claim.airline)

    // Log outbound message
    db.prepare(`
      INSERT INTO messages (claim_id, direction, subject, body, from_email, to_email)
      VALUES (?, 'outbound', ?, ?, ?, ?)
    `).run(
      id,
      `LBA — Flight ${claim.flight_number || ''} on ${claim.flight_date || ''}`,
      'Letter Before Action sent',
      process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@jet2pay.eu',
      passenger.email
    )

    db.prepare(`INSERT INTO timeline_events (claim_id, event) VALUES (?, ?)`).run(id, 'LBA sent to passenger')

    res.json({ success: true, message: 'LBA sent' })
  } catch (err) {
    console.error('LBA send error:', err)
    res.status(500).json({ error: 'Failed to send LBA' })
  }
})

// GET /api/admin/claims/:id (full claim with all relations)
router.get('/claims/:id', requireAdmin, (req, res) => {
  const { id } = req.params

  const claim = db.prepare('SELECT * FROM claims WHERE id = ?').get(id)
  if (!claim) return res.status(404).json({ error: 'Claim not found' })

  const passengers = db.prepare('SELECT * FROM passengers WHERE claim_id = ?').all(id)
  const documents = db.prepare('SELECT * FROM documents WHERE claim_id = ? ORDER BY uploaded_at DESC').all(id)
  const notes = db.prepare('SELECT * FROM notes WHERE claim_id = ? ORDER BY created_at DESC').all(id)
  const timeline = db.prepare('SELECT * FROM timeline_events WHERE claim_id = ? ORDER BY created_at ASC').all(id)
  const messages = db.prepare('SELECT * FROM messages WHERE claim_id = ? ORDER BY created_at DESC').all(id)

  res.json({ ...claim, passengers, documents, notes, timeline, messages })
})

// POST /api/admin/claims/:id/messages (log inbound reply)
router.post('/claims/:id/messages', requireAdmin, (req, res) => {
  const { id } = req.params
  const { subject, body, from_email, direction = 'inbound' } = req.body

  if (!body) return res.status(400).json({ error: 'Message body required' })

  const claim = db.prepare('SELECT id FROM claims WHERE id = ?').get(id)
  if (!claim) return res.status(404).json({ error: 'Claim not found' })

  db.prepare(`
    INSERT INTO messages (claim_id, direction, subject, body, from_email, to_email)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, direction, subject || null, body, from_email || null,
         direction === 'outbound' ? from_email : process.env.FROM_EMAIL || null)

  db.prepare(`INSERT INTO timeline_events (claim_id, event) VALUES (?, ?)`).run(
    id, direction === 'inbound' ? 'Client reply received' : 'Message sent'
  )

  res.status(201).json({ success: true })
})

module.exports = router
