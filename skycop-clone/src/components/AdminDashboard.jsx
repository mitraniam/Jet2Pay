import { useState, useEffect, useCallback } from 'react'
import './AdminDashboard.css'

const API = import.meta.env.VITE_API_URL || 'https://jet2pay-production.up.railway.app'

/* ── Admin API helpers ──────────────────────────────── */
async function adminFetch(path, token, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
    ...opts,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.message || data?.error || `Error ${res.status}`)
  return data
}

/* ── Status colors & icons ──────────────────────────── */
const STATUS_CONFIG = {
  submitted:         { color: '#3182ce', bg: '#ebf8ff', icon: '📋', label: 'Submitted' },
  under_review:      { color: '#d69e2e', bg: '#fffff0', icon: '🔍', label: 'Under Review' },
  airline_contacted: { color: '#805ad5', bg: '#faf5ff', icon: '✈️', label: 'Airline Contacted' },
  negotiating:       { color: '#dd6b20', bg: '#fffaf0', icon: '⚖️', label: 'Negotiating' },
  resolved:          { color: '#38a169', bg: '#f0fff4', icon: '✅', label: 'Resolved' },
  rejected:          { color: '#e53e3e', bg: '#fff5f5', icon: '❌', label: 'Rejected' },
  paid:              { color: '#38a169', bg: '#f0fff4', icon: '💰', label: 'Paid' },
}

const STATUSES = ['submitted', 'under_review', 'airline_contacted', 'negotiating', 'resolved', 'rejected', 'paid']

/* ════════════════════════════════════════════════════════
   LOGIN SCREEN
════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      localStorage.setItem('admin_token', data.token)
      onLogin(data.token)
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="adm-login">
      <div className="adm-login__card">
        <div className="adm-login__logo">🛡️</div>
        <h1 className="adm-login__title">Jet2Pay Admin</h1>
        <p className="adm-login__subtitle">Sign in to manage claims</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="adm-login__input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="adm-login__input"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="adm-login__error">{error}</p>}
          <button className="adm-login__btn" disabled={loading || !email || !password}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   STATS CARDS
════════════════════════════════════════════════════════ */
function StatsCards({ stats }) {
  if (!stats) return null
  const cards = [
    { label: 'Total Claims', value: stats.total_claims, icon: '📋', color: '#3182ce' },
    { label: 'This Week', value: stats.claims_this_week, icon: '📈', color: '#38a169' },
    { label: 'Estimated Value', value: `€${(stats.total_estimated_value_eur || 0).toLocaleString()}`, icon: '💰', color: '#d69e2e' },
    { label: 'Paid Out', value: `€${(stats.total_paid_out_eur || 0).toLocaleString()}`, icon: '✅', color: '#38a169' },
    { label: 'Manual Review', value: stats.pending_manual_review, icon: '⚠️', color: '#e53e3e' },
    { label: 'Missing Docs', value: stats.documents_missing, icon: '📄', color: '#dd6b20' },
  ]

  return (
    <div className="adm-stats">
      {cards.map(c => (
        <div key={c.label} className="adm-stat-card">
          <div className="adm-stat-card__icon" style={{ color: c.color }}>{c.icon}</div>
          <div>
            <div className="adm-stat-card__value">{c.value}</div>
            <div className="adm-stat-card__label">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   STATUS DISTRIBUTION BAR
════════════════════════════════════════════════════════ */
function StatusBar({ stats }) {
  if (!stats?.by_status) return null
  const total = stats.total_claims || 1
  return (
    <div className="adm-status-bar">
      <h3 className="adm-section-title">Claims by Status</h3>
      <div className="adm-status-bar__bar">
        {Object.entries(stats.by_status).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status] || { color: '#999', label: status }
          const pct = (count / total * 100).toFixed(1)
          return count > 0 ? (
            <div
              key={status}
              className="adm-status-bar__segment"
              style={{ width: `${pct}%`, background: cfg.color }}
              title={`${cfg.label}: ${count} (${pct}%)`}
            />
          ) : null
        })}
      </div>
      <div className="adm-status-bar__legend">
        {Object.entries(stats.by_status).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status] || { color: '#999', label: status }
          return (
            <span key={status} className="adm-status-bar__item">
              <span className="adm-status-bar__dot" style={{ background: cfg.color }} />
              {cfg.label}: {count}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   CLAIM DETAIL PANEL
════════════════════════════════════════════════════════ */
function ClaimDetail({ claim, token, onClose, onRefresh }) {
  const [fullClaim, setFullClaim] = useState(null)
  const [note, setNote] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [statusReason, setStatusReason] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    adminFetch(`/api/claims/${claim.id}`, token).then(setFullClaim).catch(() => {})
  }, [claim.id, token])

  const addNote = async () => {
    if (!note.trim()) return
    setLoading(true)
    try {
      await adminFetch(`/api/admin/claims/${claim.id}/notes`, token, {
        method: 'POST',
        body: JSON.stringify({ note: note.trim(), internal: true }),
      })
      setNote('')
      const updated = await adminFetch(`/api/claims/${claim.id}`, token)
      setFullClaim(updated)
    } catch (err) {
      alert('Failed to add note: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async () => {
    if (!newStatus) return
    setLoading(true)
    try {
      await adminFetch(`/api/claims/${claim.id}/status`, token, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, reason: statusReason || undefined }),
      })
      setNewStatus('')
      setStatusReason('')
      onRefresh()
      const updated = await adminFetch(`/api/claims/${claim.id}`, token)
      setFullClaim(updated)
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const fc = fullClaim
  const cfg = STATUS_CONFIG[fc?.status] || { color: '#999', bg: '#f5f5f5', icon: '📋', label: fc?.status }

  return (
    <div className="adm-detail-overlay" onClick={onClose}>
      <div className="adm-detail" onClick={e => e.stopPropagation()}>
        <div className="adm-detail__header">
          <h2>Claim Details</h2>
          <button className="adm-detail__close" onClick={onClose}>✕</button>
        </div>

        {fc ? (
          <div className="adm-detail__body">
            {/* Status Badge */}
            <div className="adm-detail__status" style={{ background: cfg.bg, color: cfg.color }}>
              {cfg.icon} {cfg.label}
            </div>

            {/* Info Grid */}
            <div className="adm-detail__grid">
              <div className="adm-detail__field">
                <label>Claim ID</label>
                <span className="adm-mono">{fc.claimId}</span>
              </div>
              <div className="adm-detail__field">
                <label>Flight</label>
                <span>{fc.flightNumber} — {new Date(fc.flightDate).toLocaleDateString()}</span>
              </div>
              <div className="adm-detail__field">
                <label>Route</label>
                <span><strong>{fc.departureAirport}</strong> → <strong>{fc.arrivalAirport}</strong></span>
              </div>
              <div className="adm-detail__field">
                <label>Disruption</label>
                <span>{fc.disruptionType} {fc.delayDuration ? `(${fc.delayDuration} min)` : ''}</span>
              </div>
              <div className="adm-detail__field">
                <label>Compensation</label>
                <span className="adm-detail__amount">€{fc.estimatedAmount}</span>
              </div>
              <div className="adm-detail__field">
                <label>Distance</label>
                <span>{fc.routeDistanceKm ? `${fc.routeDistanceKm} km` : 'Unknown'}</span>
              </div>
              <div className="adm-detail__field">
                <label>Passengers</label>
                <span>{fc.passengerCount}</span>
              </div>
              <div className="adm-detail__field">
                <label>Booking Ref</label>
                <span className="adm-mono">{fc.bookingReference}</span>
              </div>
            </div>

            {/* Passengers */}
            {fc.passengers?.length > 0 && (
              <div className="adm-detail__section">
                <h3>Passengers</h3>
                {fc.passengers.map(p => (
                  <div key={p.id} className="adm-detail__passenger">
                    <span>👤 {p.firstName} {p.lastName}</span>
                    <span>{p.email}</span>
                    <span>{p.phone}</span>
                    <span>{p.nationality}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Eligibility */}
            {fc.eligibility && (
              <div className="adm-detail__section">
                <h3>Eligibility</h3>
                <div className={`adm-detail__elig ${fc.eligibility.eligible ? 'adm-detail__elig--yes' : 'adm-detail__elig--no'}`}>
                  {fc.eligibility.eligible ? '✅ Eligible' : '❌ Not Eligible'}
                  {fc.eligibility.requiresManualReview && <span className="adm-detail__review-badge">⚠️ Manual Review</span>}
                </div>
                {fc.eligibility.flags?.length > 0 && (
                  <div className="adm-detail__flags">
                    {fc.eligibility.flags.map((f, i) => <span key={i} className="adm-detail__flag">{f}</span>)}
                  </div>
                )}
              </div>
            )}

            {/* Status Timeline */}
            {fc.statusHistory?.length > 0 && (
              <div className="adm-detail__section">
                <h3>Timeline</h3>
                <div className="adm-detail__timeline">
                  {fc.statusHistory.map((h, i) => (
                    <div key={i} className="adm-detail__tl-item">
                      <div className="adm-detail__tl-dot" />
                      <div>
                        <strong>{STATUS_CONFIG[h.status]?.label || h.status}</strong>
                        <span className="adm-detail__tl-date">{new Date(h.changedAt).toLocaleString()}</span>
                        {h.reason && <p className="adm-detail__tl-reason">{h.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Update Status */}
            <div className="adm-detail__section">
              <h3>Update Status</h3>
              <div className="adm-detail__action-row">
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="adm-detail__select">
                  <option value="">Select new status...</option>
                  {STATUSES.filter(s => s !== fc.status).map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Reason (optional)"
                  value={statusReason}
                  onChange={e => setStatusReason(e.target.value)}
                  className="adm-detail__input"
                />
                <button className="adm-detail__btn" onClick={updateStatus} disabled={!newStatus || loading}>
                  Update
                </button>
              </div>
            </div>

            {/* Add Note */}
            <div className="adm-detail__section">
              <h3>Add Internal Note</h3>
              <div className="adm-detail__action-row">
                <textarea
                  placeholder="Write a note..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="adm-detail__textarea"
                  rows={3}
                />
                <button className="adm-detail__btn" onClick={addNote} disabled={!note.trim() || loading}>
                  Add Note
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="adm-detail__loading">Loading claim details...</div>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '')
  const [authenticated, setAuthenticated] = useState(false)
  const [stats, setStats] = useState(null)
  const [claims, setClaims] = useState([])
  const [totalClaims, setTotalClaims] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadStats = useCallback(async () => {
    try {
      const data = await adminFetch('/api/admin/stats', token)
      setStats(data)
    } catch {}
  }, [token])

  const loadClaims = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (statusFilter) params.set('status', statusFilter)
      const data = await adminFetch(`/api/admin/claims?${params}`, token)
      setClaims(data.claims || [])
      setTotalClaims(data.total_count || 0)
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }, [token, statusFilter])

  useEffect(() => {
    if (!authenticated) return
    loadStats()
    loadClaims()
  }, [authenticated, loadStats, loadClaims])

  const handleLogin = (t) => {
    setToken(t)
    setAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setToken('')
    setAuthenticated(false)
    setStats(null)
    setClaims([])
  }

  // Auto-login if token exists
  useEffect(() => {
    if (token && !authenticated) {
      adminFetch('/api/admin/stats', token)
        .then((data) => { setStats(data); setAuthenticated(true) })
        .catch(() => { localStorage.removeItem('admin_token'); setToken('') })
    }
  }, [])

  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="adm">
      {/* Header */}
      <header className="adm-header">
        <div className="adm-header__left">
          <h1 className="adm-header__title">🛡️ Jet2Pay Admin</h1>
        </div>
        <button className="adm-header__logout" onClick={handleLogout}>Sign Out</button>
      </header>

      <div className="adm-content">
        {/* Stats */}
        <StatsCards stats={stats} />
        <StatusBar stats={stats} />

        {/* Claims Table */}
        <div className="adm-claims">
          <div className="adm-claims__header">
            <h3 className="adm-section-title">Claims ({totalClaims})</h3>
            <div className="adm-claims__filters">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="adm-claims__filter-select">
                <option value="">All Statuses</option>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                ))}
              </select>
              <button className="adm-claims__refresh" onClick={() => { loadStats(); loadClaims() }}>🔄 Refresh</button>
            </div>
          </div>

          {loading ? (
            <div className="adm-claims__loading">Loading claims...</div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Flight</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>PAX</th>
                    <th>Docs</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map(c => {
                    const cfg = STATUS_CONFIG[c.status] || { color: '#999', bg: '#f5f5f5', label: c.status }
                    return (
                      <tr key={c.id} className="adm-table__row" onClick={() => setSelectedClaim(c)}>
                        <td className="adm-mono">{c.id?.slice(0, 8)}</td>
                        <td><strong>{c.flightNumber}</strong></td>
                        <td>{new Date(c.flightDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                        <td>{c.disruptionType}</td>
                        <td>
                          <span className="adm-badge" style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </td>
                        <td className="adm-table__amount">€{c.estimatedCompensationEur || '—'}</td>
                        <td>{c.passengerCount}</td>
                        <td>{c.documentCount || 0}</td>
                        <td>{new Date(c.submittedAt).toLocaleDateString('en-GB')}</td>
                      </tr>
                    )
                  })}
                  {claims.length === 0 && (
                    <tr><td colSpan={9} className="adm-table__empty">No claims found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Claim Detail Overlay */}
      {selectedClaim && (
        <ClaimDetail
          claim={selectedClaim}
          token={token}
          onClose={() => setSelectedClaim(null)}
          onRefresh={() => { loadStats(); loadClaims() }}
        />
      )}
    </div>
  )
}
