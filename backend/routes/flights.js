const express = require('express')
const router = express.Router()

// POST /api/flights/verify
router.post('/verify', (req, res) => {
  const { flightNumber, date } = req.body

  if (!flightNumber || !date) {
    return res.status(400).json({ error: 'flightNumber and date are required' })
  }

  // Placeholder — in production integrate with AviationStack, FlightAware etc.
  res.json({
    verified: true,
    flightNumber,
    date,
    status: 'delayed',
    delayMinutes: 210,
    message: 'Flight data retrieved (demo mode)',
  })
})

module.exports = router
