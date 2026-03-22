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

const PAGE_SIZE = 25

/* ── Export to CSV ──────────────────────────────────── */
function exportCSV(claims) {
  const headers = ['ID', 'Flight', 'Date', 'Type', 'Status', 'Amount (€)', 'Passengers', 'Docs', 'Submitted']
  const rows = claims.map(c => [
    c.id,
    c.flightNumber,
    new Date(c.flightDate).toLocaleDateString('en-GB'),
    c.disruptionType,
    STATUS_CONFIG[c.status]?.label || c.status,
    c.estimatedCompensationEur || '',
    c.passengerCount,
    c.documentCount || 0,
    new Date(c.submittedAt).toLocaleDateString('en-GB'),
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `jet2pay-claims-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

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
  const [lbaLoading, setLbaLoading] = useState(false)
  const [lbaSent, setLbaSent] = useState(false)
  const [activeTab, setActiveTab] = useState('info')

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

  const sendLBA = async () => {
    if (!window.confirm('Send Letter Before Action to the airline?')) return
    setLbaLoading(true)
    try {
      await adminFetch(`/api/admin/claims/${claim.id}/lba`, token, { method: 'POST' })
      setLbaSent(true)
      onRefresh()
    } catch (err) {
      alert('Failed to send LBA: ' + err.message)
    } finally {
      setLbaLoading(false)
    }
  }

  const fc = fullClaim
  const cfg = STATUS_CONFIG[fc?.status] || { color: '#999', bg: '#f5f5f5', icon: '📋', label: fc?.status }

  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'passengers', label: `Passengers${fc?.passengers?.length ? ` (${fc.passengers.length})` : ''}` },
    { id: 'documents', label: `Docs${fc?.documents?.length ? ` (${fc.documents.length})` : ''}` },
    { id: 'banking', label: 'Banking' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'actions', label: 'Actions' },
  ]

  return (
    <div className="adm-detail-overlay" onClick={onClose}>
      <div className="adm-detail" onClick={e => e.stopPropagation()}>
        <div className="adm-detail__header">
          <div>
            <h2>Claim Details</h2>
            {fc && <span className="adm-mono adm-detail__id">{fc.claimId}</span>}
          </div>
          <button className="adm-detail__close" onClick={onClose}>✕</button>
        </div>

        {fc ? (
          <>
            {/* Status + LBA */}
            <div className="adm-detail__top-bar">
              <div className="adm-detail__status" style={{ background: cfg.bg, color: cfg.color }}>
                {cfg.icon} {cfg.label}
              </div>
              <button
                className={`adm-lba-btn${lbaSent ? ' adm-lba-btn--sent' : ''}`}
                onClick={sendLBA}
                disabled={lbaLoading || lbaSent}
              >
                {lbaSent ? '✓ LBA Sent' : lbaLoading ? 'Sending...' : '✉️ Send LBA'}
              </button>
            </div>

            {/* Tabs */}
            <div className="adm-tabs">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`adm-tab${activeTab === t.id ? ' adm-tab--active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="adm-detail__body">

              {/* INFO TAB */}
              {activeTab === 'info' && (
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
                  {fc.eligibility && (
                    <div className="adm-detail__field adm-detail__field--full">
                      <label>Eligibility</label>
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
                </div>
              )}

              {/* PASSENGERS TAB */}
              {activeTab === 'passengers' && (
                <div>
                  {fc.passengers?.length > 0 ? fc.passengers.map(p => (
                    <div key={p.id} className="adm-passenger-card">
                      <div className="adm-passenger-card__name">👤 {p.firstName} {p.lastName}</div>
                      <div className="adm-passenger-card__row">
                        <span>✉️ {p.email}</span>
                        <span>📞 {p.phone}</span>
                        <span>🌍 {p.nationality}</span>
                      </div>
                    </div>
                  )) : <p className="adm-empty-msg">No passenger data</p>}
                </div>
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === 'documents' && (
                <div>
                  {fc.documents?.length > 0 ? fc.documents.map((doc, i) => (
                    <div key={i} className="adm-doc-item">
                      <span className="adm-doc-item__icon">📎</span>
                      <div>
                        <div className="adm-doc-item__name">{doc.fileName || doc.type || `Document ${i + 1}`}</div>
                        <div className="adm-doc-item__meta">
                          {doc.uploadedAt && new Date(doc.uploadedAt).toLocaleDateString('en-GB')}
                          {doc.fileSize && ` · ${Math.round(doc.fileSize / 1024)} KB`}
                        </div>
                      </div>
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="adm-doc-item__link">View →</a>
                      )}
                    </div>
                  )) : <p className="adm-empty-msg">No documents uploaded</p>}
                </div>
              )}

              {/* BANKING TAB */}
              {activeTab === 'banking' && (
                <div>
                  {fc.bankingDetails ? (
                    <div className="adm-detail__grid">
                      <div className="adm-detail__field">
                        <label>Account Holder</label>
                        <span>{fc.bankingDetails.accountHolder || '—'}</span>
                      </div>
                      <div className="adm-detail__field">
                        <label>IBAN</label>
                        <span className="adm-mono">{fc.bankingDetails.iban || '—'}</span>
                      </div>
                      <div className="adm-detail__field">
                        <label>BIC / SWIFT</label>
                        <span className="adm-mono">{fc.bankingDetails.bic || '—'}</span>
                      </div>
                      <div className="adm-detail__field">
                        <label>Bank Name</label>
                        <span>{fc.bankingDetails.bankName || '—'}</span>
                      </div>
                    </div>
                  ) : <p className="adm-empty-msg">No banking details provided yet</p>}
                </div>
              )}

              {/* TIMELINE TAB */}
              {activeTab === 'timeline' && (
                <div>
                  {fc.statusHistory?.length > 0 ? (
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
                  ) : <p className="adm-empty-msg">No history yet</p>}
                </div>
              )}

              {/* ACTIONS TAB */}
              {activeTab === 'actions' && (
                <div>
                  {/* Update Status */}
                  <div className="adm-detail__section" style={{ paddingTop: 0, borderTop: 'none', marginTop: 0 }}>
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

                  {/* Existing Notes */}
                  {fc.notes?.filter(n => n.internal)?.length > 0 && (
                    <div className="adm-detail__section">
                      <h3>Internal Notes</h3>
                      {fc.notes.filter(n => n.internal).map((n, i) => (
                        <div key={i} className="adm-note-item">
                          <p className="adm-note-item__text">{n.content || n.note}</p>
                          <span className="adm-note-item__meta">
                            {n.createdBy || 'Admin'} · {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </>
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
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('submittedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [loading, setLoading] = useState(false)

  const totalPages = Math.ceil(totalClaims / PAGE_SIZE)

  const loadStats = useCallback(async () => {
    try {
      const data = await adminFetch('/api/admin/stats', token)
      setStats(data)
    } catch {}
  }, [token])

  const loadClaims = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String((page - 1) * PAGE_SIZE),
        sortBy,
        sortDir,
      })
      if (statusFilter) params.set('status', statusFilter)
      if (search) params.set('search', search)
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
  }, [token, statusFilter, search, page, sortBy, sortDir])

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

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortDir('desc')
    }
    setPage(1)
  }

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span className="adm-sort-icon adm-sort-icon--idle">↕</span>
    return <span className="adm-sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

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
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="adm-search-form">
                <input
                  type="text"
                  className="adm-search-input"
                  placeholder="Search flight, ID, name..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                />
                <button type="submit" className="adm-search-btn">🔍</button>
                {search && (
                  <button type="button" className="adm-search-clear" onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}>✕</button>
                )}
              </form>

              {/* Status filter */}
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="adm-claims__filter-select">
                <option value="">All Statuses</option>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                ))}
              </select>

              {/* Export */}
              <button className="adm-claims__export" onClick={() => exportCSV(claims)} disabled={claims.length === 0} title="Export current page to CSV">
                ⬇️ CSV
              </button>

              {/* Refresh */}
              <button className="adm-claims__refresh" onClick={() => { loadStats(); loadClaims() }}>🔄</button>
            </div>
          </div>

          {loading ? (
            <div className="adm-claims__loading">Loading claims...</div>
          ) : (
            <>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th className="adm-th-sort" onClick={() => handleSort('id')}>ID <SortIcon col="id" /></th>
                      <th className="adm-th-sort" onClick={() => handleSort('flightNumber')}>Flight <SortIcon col="flightNumber" /></th>
                      <th className="adm-th-sort" onClick={() => handleSort('flightDate')}>Date <SortIcon col="flightDate" /></th>
                      <th>Type</th>
                      <th className="adm-th-sort" onClick={() => handleSort('status')}>Status <SortIcon col="status" /></th>
                      <th className="adm-th-sort" onClick={() => handleSort('estimatedCompensationEur')}>Amount <SortIcon col="estimatedCompensationEur" /></th>
                      <th>PAX</th>
                      <th>Docs</th>
                      <th className="adm-th-sort" onClick={() => handleSort('submittedAt')}>Submitted <SortIcon col="submittedAt" /></th>
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
                          <td>
                            <span className={c.documentCount > 0 ? 'adm-docs-ok' : 'adm-docs-missing'}>
                              {c.documentCount || 0}
                            </span>
                          </td>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="adm-pagination">
                  <button
                    className="adm-page-btn"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >«</button>
                  <button
                    className="adm-page-btn"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >‹</button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                    const p = start + i
                    return (
                      <button
                        key={p}
                        className={`adm-page-btn${page === p ? ' adm-page-btn--active' : ''}`}
                        onClick={() => setPage(p)}
                      >{p}</button>
                    )
                  })}

                  <button
                    className="adm-page-btn"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >›</button>
                  <button
                    className="adm-page-btn"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >»</button>

                  <span className="adm-pagination__info">
                    Page {page} of {totalPages} · {totalClaims} total
                  </span>
                </div>
              )}
            </>
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
