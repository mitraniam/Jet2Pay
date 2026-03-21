import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getClaimStatus } from '../lib/api'
import './ClaimStatusPage.css'

const STATUS_STEPS = [
  'submitted',
  'under_review',
  'airline_contacted',
  'negotiating',
  'resolved',
]

const STATUS_ICONS = {
  submitted: '📋',
  under_review: '🔍',
  airline_contacted: '✈️',
  negotiating: '⚖️',
  resolved: '✅',
  rejected: '❌',
  paid: '💰',
}

export default function ClaimStatusPage() {
  const { t } = useTranslation()
  const [claimId, setClaimId] = useState('')
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    const trimmed = claimId.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setClaim(null)

    try {
      const data = await getClaimStatus(trimmed)
      setClaim(data)
    } catch (err) {
      if (err.status === 404) {
        setError(t('claimStatus.notFound'))
      } else {
        setError(t('claimStatus.error'))
      }
    } finally {
      setLoading(false)
    }
  }

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.indexOf(status)
    return idx === -1 ? 0 : idx
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="csp">
      <div className="csp__bg" />
      <div className="csp__container container">

        {/* Search Section */}
        <div className="csp__search-card">
          <h1 className="csp__title">{t('claimStatus.title')}</h1>
          <p className="csp__subtitle">{t('claimStatus.subtitle')}</p>

          <form className="csp__form" onSubmit={handleSearch}>
            <input
              type="text"
              className="csp__input"
              placeholder={t('claimStatus.placeholder')}
              value={claimId}
              onChange={(e) => setClaimId(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="csp__btn"
              disabled={loading || !claimId.trim()}
            >
              {loading ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="csp__spinner">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="50 20" />
                </svg>
              ) : t('claimStatus.search')}
            </button>
          </form>

          {error && (
            <div className="csp__error">
              <span>⚠️</span> {error}
            </div>
          )}
        </div>

        {/* Result Section */}
        {claim && (
          <div className="csp__result">

            {/* Status Progress */}
            <div className="csp__card">
              <h2 className="csp__card-title">{t('claimStatus.progress')}</h2>
              <div className="csp__progress">
                {STATUS_STEPS.map((step, i) => {
                  const currentIdx = getStepIndex(claim.status)
                  const isActive = i <= currentIdx
                  const isCurrent = i === currentIdx
                  return (
                    <div key={step} className={`csp__step ${isActive ? 'csp__step--active' : ''} ${isCurrent ? 'csp__step--current' : ''}`}>
                      <div className="csp__step-dot">
                        {isActive ? '✓' : (i + 1)}
                      </div>
                      <div className="csp__step-label">
                        {t(`claimStatus.steps.${step}`)}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`csp__step-line ${i < currentIdx ? 'csp__step-line--active' : ''}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Claim Details */}
            <div className="csp__grid">
              <div className="csp__card">
                <h2 className="csp__card-title">{t('claimStatus.flightDetails')}</h2>
                <div className="csp__details">
                  <div className="csp__detail-row">
                    <span className="csp__detail-label">{t('claimStatus.claimRef')}</span>
                    <span className="csp__detail-value csp__mono">{claim.claimId?.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="csp__detail-row">
                    <span className="csp__detail-label">{t('claimStatus.status')}</span>
                    <span className={`csp__badge csp__badge--${claim.status}`}>
                      {STATUS_ICONS[claim.status] || '📋'} {t(`claimStatus.steps.${claim.status}`, claim.status)}
                    </span>
                  </div>
                  <div className="csp__detail-row">
                    <span className="csp__detail-label">{t('claimStatus.flight')}</span>
                    <span className="csp__detail-value">{claim.flightNumber}</span>
                  </div>
                  <div className="csp__detail-row">
                    <span className="csp__detail-label">{t('claimStatus.date')}</span>
                    <span className="csp__detail-value">{formatDate(claim.flightDate)}</span>
                  </div>
                  <div className="csp__detail-row">
                    <span className="csp__detail-label">{t('claimStatus.route')}</span>
                    <span className="csp__detail-value csp__route">
                      <strong>{claim.departureAirport}</strong>
                      <span className="csp__arrow">→</span>
                      <strong>{claim.arrivalAirport}</strong>
                    </span>
                  </div>
                  <div className="csp__detail-row">
                    <span className="csp__detail-label">{t('claimStatus.disruption')}</span>
                    <span className="csp__detail-value">{t(`claimStatus.disruptionTypes.${claim.disruptionType}`, claim.disruptionType)}</span>
                  </div>
                </div>
              </div>

              <div className="csp__card">
                <h2 className="csp__card-title">{t('claimStatus.compensation')}</h2>
                <div className="csp__compensation">
                  <div className="csp__amount">€{claim.estimatedAmount}</div>
                  <p className="csp__amount-label">{t('claimStatus.estimatedAmount')}</p>
                  {claim.routeDistanceKm && (
                    <p className="csp__distance">{t('claimStatus.distance')}: {claim.routeDistanceKm} km</p>
                  )}
                  {claim.eligibility && (
                    <div className={`csp__eligibility ${claim.eligibility.eligible ? 'csp__eligibility--yes' : 'csp__eligibility--no'}`}>
                      {claim.eligibility.eligible ? '✅' : '❌'} {claim.eligibility.eligible ? t('claimStatus.eligible') : t('claimStatus.notEligible')}
                    </div>
                  )}
                </div>

                {/* Documents */}
                <h3 className="csp__card-subtitle">{t('claimStatus.documents')}</h3>
                {claim.documents && claim.documents.length > 0 ? (
                  <ul className="csp__doc-list">
                    {claim.documents.map(doc => (
                      <li key={doc.id} className="csp__doc-item">
                        <span>📄 {doc.fileName}</span>
                        <span className="csp__doc-date">{formatDate(doc.uploadedAt)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="csp__no-docs">{t('claimStatus.noDocs')}</p>
                )}

                {claim.missingDocuments && claim.missingDocuments.length > 0 && (
                  <div className="csp__missing-docs">
                    <p className="csp__missing-title">⚠️ {t('claimStatus.missingDocs')}:</p>
                    <ul>
                      {claim.missingDocuments.map(doc => (
                        <li key={doc}>{t(`claimStatus.docTypes.${doc}`, doc.replace(/_/g, ' '))}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            {claim.statusHistory && claim.statusHistory.length > 0 && (
              <div className="csp__card">
                <h2 className="csp__card-title">{t('claimStatus.timeline')}</h2>
                <div className="csp__timeline">
                  {claim.statusHistory.map((entry, i) => (
                    <div key={i} className="csp__timeline-item">
                      <div className="csp__timeline-dot" />
                      <div className="csp__timeline-content">
                        <span className="csp__timeline-status">
                          {STATUS_ICONS[entry.status] || '📋'} {t(`claimStatus.steps.${entry.status}`, entry.status)}
                        </span>
                        <span className="csp__timeline-date">{formatDateTime(entry.changedAt)}</span>
                        {entry.reason && <p className="csp__timeline-reason">{entry.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
