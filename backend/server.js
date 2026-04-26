require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static uploads
app.use('/uploads', express.static(uploadsDir))

// Routes
const claimsRouter = require('./routes/claims')
const adminRouter = require('./routes/admin')
const flightsRouter = require('./routes/flights')
const referralRouter = require('./routes/referral')

app.use('/api/claims', claimsRouter)
app.use('/api/admin', adminRouter)
app.use('/api/flights', flightsRouter)
app.use('/api/referral', referralRouter)

// Also mount status update on /api/claims/:id/status (called by admin dashboard)
app.patch('/api/claims/:id/status', require('./middleware/auth'), (req, res) => {
  const db = require('./db')
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

// Full claim detail for admin (GET /api/claims/:id without token — admin uses auth header)
app.get('/api/claims/:id', (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Admin request — delegate to admin handler
    return require('./routes/admin').handle ? next() : next()
  }
  next()
})

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

app.listen(PORT, () => {
  console.log(`Jet2Pay backend running on http://localhost:${PORT}`)
})
