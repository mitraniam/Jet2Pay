import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AirportSearch from './AirportSearch'
import { submitClaim } from '../lib/api'
import COORDS from '../data/airportCoords'
import './CheckCompensationForm.css'

/* ── Haversine distance (km) between two airports ────── */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getEstimatedCompensation(from, to) {
  if (!from?.iata || !to?.iata) return 600
  const c1 = COORDS[from.iata]
  const c2 = COORDS[to.iata]
  if (!c1 || !c2) return 600
  const km = haversineKm(c1[0], c1[1], c2[0], c2[1])
  if (km < 1500) return 250
  if (km <= 3500) return 400
  return 600
}

/* ── Icons ─────────────────────────────────────────────── */
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const PlaneSmIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--TextSilverDark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.5H2M17.5 12l2-8-2-.5-5 6.5-4.5-2L5.5 9l4 3.5L8 16.5l2 .5 2-3.5 5.5 1z"/>
  </svg>
)
const SpinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="ccf__spinner">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="50 20" />
  </svg>
)

/* ── Nationality options ──────────────────────────────── */
const NATIONALITIES = [
  { code: 'GB', label: 'United Kingdom' },
  { code: 'IE', label: 'Ireland' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'ES', label: 'Spain' },
  { code: 'IT', label: 'Italy' },
  { code: 'NL', label: 'Netherlands' },
  { code: 'BE', label: 'Belgium' },
  { code: 'PT', label: 'Portugal' },
  { code: 'AT', label: 'Austria' },
  { code: 'PL', label: 'Poland' },
  { code: 'CZ', label: 'Czech Republic' },
  { code: 'GR', label: 'Greece' },
  { code: 'HU', label: 'Hungary' },
  { code: 'RO', label: 'Romania' },
  { code: 'BG', label: 'Bulgaria' },
  { code: 'HR', label: 'Croatia' },
  { code: 'SE', label: 'Sweden' },
  { code: 'DK', label: 'Denmark' },
  { code: 'FI', label: 'Finland' },
  { code: 'NO', label: 'Norway' },
  { code: 'CH', label: 'Switzerland' },
  { code: 'US', label: 'United States' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
]

/* ── Map frontend values → backend enum values ────────── */
const DISRUPTION_MAP = {
  delayed: 'delay',
  cancelled: 'cancellation',
  denied: 'denied_boarding',
}

function getDelayMinutes(timing, waitTime) {
  if (timing === 'missed') return null
  if (timing === 'less3') return 120
  // more3 — use waitTime for more precision
  const map = { less2: 120, '2to4': 180, '4to8': 360, overnight: 540, none: 240 }
  return map[waitTime] ?? 240
}

/* ── Reusable option button ─────────────────────────────── */
const Option = ({ selected, onClick, children }) => (
  <button
    type="button"
    className={`ccf-opt${selected ? ' ccf-opt--on' : ''}`}
    onClick={onClick}
  >
    <span className="ccf-opt__radio">
      <span className="ccf-opt__dot" />
    </span>
    <span className="ccf-opt__label">{children}</span>
  </button>
)

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
const CheckCompensationForm = ({ onBack }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [phase, setPhase] = useState('eligibility') // 'eligibility' | 'claim' | 'submitted'
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [claimResult, setClaimResult] = useState(null)

  const [data, setData] = useState({
    // Eligibility (steps 1-5)
    from: null,
    to: null,
    isDirect: true,
    disruption: null,
    timing: null,
    airlineTold: null,
    reason: null,
    waitTime: null,
    description: '',
    // Claim details (steps 6-8)
    flightNumber: '',
    flightDate: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    bookingReference: '',
    consentTerms: false,
    consentGdpr: false,
  })

  const set = (k, v) => setData(p => ({ ...p, [k]: v }))

  const canContinue = () => {
    if (step === 1) return !!data.from && !!data.to
    if (step === 2) return !!data.disruption
    if (step === 3) return !!data.timing
    if (step === 4) return !!data.airlineTold && (data.airlineTold !== 'yes' || !!data.reason)
    if (step === 5) return !!data.waitTime
    if (step === 6) return data.flightNumber.trim().length >= 3 && !!data.flightDate
    if (step === 7) return data.firstName.trim() && data.lastName.trim() && data.email.includes('@') && data.phone.trim().length >= 7 && data.nationality
    if (step === 8) return data.bookingReference.trim().length >= 4 && data.consentTerms && data.consentGdpr
    return true
  }

  const handleContinue = async () => {
    if (!canContinue()) return

    if (phase === 'eligibility') {
      if (step < 5) setStep(s => s + 1)
      else {
        // After step 5, show eligibility result
        setStep(0) // 0 = result screen
      }
    } else if (phase === 'claim') {
      if (step < 8) {
        setStep(s => s + 1)
      } else {
        // Step 8 → submit claim
        await handleSubmitClaim()
      }
    }
  }

  const handleBack = () => {
    if (phase === 'claim' && step === 6) {
      // Go back to eligibility result
      setStep(0)
      setPhase('eligibility')
    } else if (step > 1) {
      setStep(s => s - 1)
    } else {
      onBack?.()
    }
  }

  const handleStartClaim = () => {
    setPhase('claim')
    setStep(6)
  }

  const handleSubmitClaim = async () => {
    setSubmitting(true)
    setSubmitError(null)

    const disruptionType = data.timing === 'missed'
      ? 'missed_connection'
      : DISRUPTION_MAP[data.disruption] || 'delay'

    const payload = {
      flightNumber: data.flightNumber.toUpperCase().trim(),
      flightDate: data.flightDate,
      departureAirport: data.from.iata,
      arrivalAirport: data.to.iata,
      disruptionType,
      delayDuration: getDelayMinutes(data.timing, data.waitTime),
      passengerCount: 1,
      passengerDetails: [{
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        nationality: data.nationality,
      }],
      bookingReference: data.bookingReference.trim().toUpperCase(),
      consentGiven: true,
    }

    try {
      const result = await submitClaim(payload)
      setClaimResult(result)
      setPhase('submitted')
    } catch (err) {
      console.error('Claim submission failed:', err)
      setSubmitError(err.data?.details
        ? Object.values(err.data.details).flat().join('. ')
        : err.message || t('form.error.submissionFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setPhase('eligibility')
    setStep(1)
    setClaimResult(null)
    setSubmitError(null)
    setData({
      from: null, to: null, isDirect: true, disruption: null, timing: null,
      airlineTold: null, reason: null, waitTime: null, description: '',
      flightNumber: '', flightDate: '', firstName: '', lastName: '',
      email: '', phone: '', nationality: '', bookingReference: '',
      consentTerms: false, consentGdpr: false,
    })
    onBack?.()
  }

  /* ── Sidebar config ── */
  const SIDEBAR = phase === 'eligibility' ? [
    {
      id: 1,
      label: t('form.sidebar.eligibilityCheck'),
      substeps: [
        { id: 1, label: t('form.sidebar.flightItinerary') },
        { id: 2, label: t('form.sidebar.disruptionType') },
        { id: 3, label: t('form.sidebar.timing') },
        { id: 4, label: t('form.sidebar.reason') },
      ],
    },
    {
      id: 2,
      label: t('form.sidebar.waitTime'),
      substeps: [{ id: 5, label: t('form.sidebar.howLong') }],
    },
    {
      id: 3,
      label: t('form.sidebar.done'),
      substeps: [],
    },
  ] : [
    {
      id: 1,
      label: t('form.sidebar.claimDetails'),
      substeps: [
        { id: 6, label: t('form.sidebar.flightInfo') },
        { id: 7, label: t('form.sidebar.passengerInfo') },
        { id: 8, label: t('form.sidebar.bookingConsent') },
      ],
    },
    {
      id: 2,
      label: t('form.sidebar.done'),
      substeps: [],
    },
  ]

  /* ── Submitted confirmation ── */
  if (phase === 'submitted' && claimResult) {
    return <SubmittedScreen result={claimResult} onReset={handleReset} />
  }

  /* ── Eligibility result screen ── */
  if (step === 0 && phase === 'eligibility') {
    return <Result data={data} onReset={handleReset} onStartClaim={handleStartClaim} />
  }

  return (
    <div className="ccf">
      <div className="ccf__bg" />

      <div className="ccf__wrap container">
        {/* ── Sidebar ── */}
        <aside className="ccf__sidebar">
          {SIDEBAR.map(group => {
            const allDone = group.substeps.length > 0 && group.substeps.every(s => s.id < step)
            const active = group.substeps.some(s => s.id === step)

            return (
              <div key={group.id} className={`ccf__sg${active ? ' ccf__sg--active' : ''}${allDone ? ' ccf__sg--done' : ''}`}>
                <div className="ccf__sg-head">
                  <span className={`ccf__sg-num${active ? ' active' : ''}${allDone ? ' done' : ''}`}>
                    {allDone ? <CheckIcon /> : group.id}
                  </span>
                  <span className="ccf__sg-title">{group.label}</span>
                </div>

                {group.substeps.length > 0 && (
                  <ul className="ccf__sg-list">
                    {group.substeps.map(s => (
                      <li
                        key={s.id}
                        className={`ccf__sg-item${s.id === step ? ' ccf__sg-item--active' : ''}${s.id < step ? ' ccf__sg-item--done' : ''}`}
                      >
                        {s.id < step
                          ? <span className="ccf__sg-check"><CheckIcon /></span>
                          : <span className="ccf__sg-dot" />
                        }
                        {s.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </aside>

        {/* ── Main Card ── */}
        <div className="ccf__card">
          <div className="ccf__card-body">
            {step === 1 && <Step1 data={data} set={set} t={t} />}
            {step === 2 && <Step2 data={data} set={set} t={t} />}
            {step === 3 && <Step3 data={data} set={set} t={t} />}
            {step === 4 && <Step4 data={data} set={set} t={t} />}
            {step === 5 && <Step5 data={data} set={set} t={t} />}
            {step === 6 && <Step6 data={data} set={set} t={t} />}
            {step === 7 && <Step7 data={data} set={set} t={t} />}
            {step === 8 && <Step8 data={data} set={set} t={t} error={submitError} />}
          </div>

          {/* Actions */}
          <div className="ccf__actions">
            <button className="ccf__btn-back" onClick={handleBack}>
              {t('form.back')}
            </button>
            <button
              className={`ccf__btn-continue${canContinue() && !submitting ? '' : ' ccf__btn-continue--off'}`}
              onClick={handleContinue}
              disabled={submitting}
            >
              {submitting ? (
                <><SpinnerIcon /> {t('form.submitting')}</>
              ) : step === 8 ? (
                t('form.step8.submitClaim')
              ) : step === 5 ? (
                t('form.submitClaim')
              ) : (
                <>{t('form.continue')} <ArrowIcon /></>
              )}
            </button>
          </div>

          {step === 1 && (
            <div className="ccf__trust">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--PrimaryOrange)" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span dangerouslySetInnerHTML={{ __html: t('form.freeCheck') }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Step 1: Route ──────────────────────────────────────── */
const Step1 = ({ data, set, t }) => (
  <div className="ccf__step">
    <h2 className="ccf__h2">{t('form.step1.title')}</h2>

    <div className="ccf__route-grid">
      <div className="ccf__field">
        <label className="ccf__lbl">
          {t('form.step1.departedFrom')} <span className="ccf__req">*</span>
        </label>
        <AirportSearch
          placeholder={t('form.step1.airportPlaceholder')}
          icon={<PlaneSmIcon />}
          onChange={a => set('from', a)}
          value={data.from ? `${data.from.city} (${data.from.iata})` : ''}
        />
      </div>

      <div className="ccf__field">
        <label className="ccf__lbl">
          {t('form.step1.finalDestination')} <span className="ccf__req">*</span>
        </label>
        <AirportSearch
          placeholder={t('form.step1.airportPlaceholder')}
          icon={<PlaneSmIcon />}
          onChange={a => set('to', a)}
          value={data.to ? `${data.to.city} (${data.to.iata})` : ''}
        />
      </div>
    </div>

    <hr className="ccf__divider" />

    <h3 className="ccf__h3">{t('form.step1.directFlight')}</h3>
    <div className="ccf__opts-row">
      <Option selected={data.isDirect === true} onClick={() => set('isDirect', true)}>
        {t('form.step1.yesDirect')}
      </Option>
      <Option selected={data.isDirect === false} onClick={() => set('isDirect', false)}>
        {t('form.step1.noConnecting')}
      </Option>
    </div>
  </div>
)

/* ── Step 2: Disruption type ────────────────────────────── */
const Step2 = ({ data, set, t }) => (
  <div className="ccf__step">
    <h2 className="ccf__h2">{t('form.step2.title')}</h2>
    <p className="ccf__p">
      {t('form.step2.question')}{' '}
      <span className="ccf__req">*</span>
    </p>
    <div className="ccf__opts-col">
      <Option selected={data.disruption === 'delayed'} onClick={() => set('disruption', 'delayed')}>
        {t('form.step2.delayed')}
      </Option>
      <Option selected={data.disruption === 'cancelled'} onClick={() => set('disruption', 'cancelled')}>
        {t('form.step2.cancelled')}
      </Option>
      <Option selected={data.disruption === 'denied'} onClick={() => set('disruption', 'denied')}>
        {t('form.step2.denied')}
      </Option>
    </div>
  </div>
)

/* ── Step 3: Timing ─────────────────────────────────────── */
const Step3 = ({ data, set, t }) => (
  <div className="ccf__step">
    <h2 className="ccf__h2">{t('form.step3.title')}</h2>
    <p className="ccf__p">
      {t('form.step3.question')}{' '}
      <span className="ccf__req">*</span>
    </p>
    <div className="ccf__opts-col">
      <Option selected={data.timing === 'less3'} onClick={() => set('timing', 'less3')}>
        {t('form.step3.less3')}
      </Option>
      <Option selected={data.timing === 'more3'} onClick={() => set('timing', 'more3')}>
        {t('form.step3.more3')}
      </Option>
      <Option selected={data.timing === 'missed'} onClick={() => set('timing', 'missed')}>
        {t('form.step3.missed')}
      </Option>
    </div>
  </div>
)

/* ── Step 4: Reason ─────────────────────────────────────── */
const Step4 = ({ data, set, t }) => (
  <div className="ccf__step">
    <h2 className="ccf__h2">{t('form.step4.title')}</h2>
    <p className="ccf__p">
      {t('form.step4.question1')}{' '}
      <span className="ccf__req">*</span>
    </p>
    <div className="ccf__opts-col">
      <Option selected={data.airlineTold === 'yes'} onClick={() => set('airlineTold', 'yes')}>
        {t('form.step4.yes')}
      </Option>
      <Option selected={data.airlineTold === 'no'} onClick={() => set('airlineTold', 'no')}>
        {t('form.step4.no')}
      </Option>
      <Option selected={data.airlineTold === 'dontremember'} onClick={() => set('airlineTold', 'dontremember')}>
        {t('form.step4.dontRemember')}
      </Option>
    </div>

    {data.airlineTold === 'yes' && (
      <>
        <p className="ccf__p" style={{ marginTop: 28 }}>
          {t('form.step4.question2')}{' '}
          <span className="ccf__req">*</span>
        </p>
        <div className="ccf__reasons-grid">
          {[
            { v: 'technical', icon: '🔧', labelKey: 'form.step4.technical' },
            { v: 'weather',   icon: '⛈️', labelKey: 'form.step4.weather' },
            { v: 'strike',    icon: '📢', labelKey: 'form.step4.strike' },
            { v: 'airport',   icon: '🛬', labelKey: 'form.step4.airport' },
            { v: 'other',     icon: '•••', labelKey: 'form.step4.other' },
          ].map(r => (
            <button
              key={r.v}
              type="button"
              className={`ccf__reason-card${data.reason === r.v ? ' ccf__reason-card--on' : ''}`}
              onClick={() => set('reason', r.v)}
            >
              <span className="ccf__reason-ic">{r.icon}</span>
              <span className="ccf__reason-lbl">{t(r.labelKey)}</span>
            </button>
          ))}
        </div>
      </>
    )}
  </div>
)

/* ── Step 5: Wait time ──────────────────────────────────── */
const Step5 = ({ data, set, t }) => (
  <div className="ccf__step">
    <h2 className="ccf__h2">{t('form.step5.title')}</h2>
    <p className="ccf__p">
      {t('form.step5.question')}{' '}
      <span className="ccf__req">*</span>
    </p>
    <div className="ccf__opts-col">
      {[
        { v: 'less2',     lKey: 'form.step5.less2' },
        { v: '2to4',      lKey: 'form.step5.2to4' },
        { v: '4to8',      lKey: 'form.step5.4to8' },
        { v: 'overnight', lKey: 'form.step5.overnight' },
        { v: 'none',      lKey: 'form.step5.none' },
      ].map(o => (
        <Option key={o.v} selected={data.waitTime === o.v} onClick={() => set('waitTime', o.v)}>
          {t(o.lKey)}
        </Option>
      ))}
    </div>

    <hr className="ccf__divider" />

    <p className="ccf__p">
      {t('form.step5.describeLabel')}{' '}
      <span style={{ color: 'var(--TextSilverDark)', fontSize: 13 }}>{t('form.step5.describeOptional')}</span>
    </p>
    <textarea
      className="ccf__textarea"
      placeholder={t('form.step5.describePlaceholder')}
      value={data.description}
      onChange={e => set('description', e.target.value)}
      rows={4}
    />
    <div className="ccf__infobox">
      <span style={{ fontSize: 18 }}>ℹ️</span>
      <p>{t('form.step5.infoText')}</p>
    </div>
  </div>
)

/* ── Step 6: Flight details ─────────────────────────────── */
const Step6 = ({ data, set, t }) => {
  const today = new Date().toISOString().split('T')[0]
  const sixYearsAgo = new Date()
  sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6)
  const minDate = sixYearsAgo.toISOString().split('T')[0]

  return (
    <div className="ccf__step">
      <h2 className="ccf__h2">{t('form.step6.title')}</h2>

      <div className="ccf__route-grid">
        <div className="ccf__field">
          <label className="ccf__lbl">
            {t('form.step6.flightNumber')} <span className="ccf__req">*</span>
          </label>
          <input
            type="text"
            className="ccf__input"
            placeholder={t('form.step6.flightNumberPlaceholder')}
            value={data.flightNumber}
            onChange={e => set('flightNumber', e.target.value.toUpperCase())}
            maxLength={10}
          />
        </div>

        <div className="ccf__field">
          <label className="ccf__lbl">
            {t('form.step6.flightDate')} <span className="ccf__req">*</span>
          </label>
          <input
            type="date"
            className="ccf__input"
            value={data.flightDate}
            onChange={e => set('flightDate', e.target.value)}
            max={today}
            min={minDate}
          />
          <span className="ccf__field-help">{t('form.step6.flightDateHelp')}</span>
        </div>
      </div>

      {data.from && data.to && (
        <div className="ccf__flight-summary">
          <span className="ccf__result-iata">{data.from.iata}</span>
          <span className="ccf__result-arrow">→</span>
          <span className="ccf__result-iata">{data.to.iata}</span>
          {data.flightNumber && (
            <span className="ccf__flight-num">{data.flightNumber}</span>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Step 7: Passenger details ──────────────────────────── */
const Step7 = ({ data, set, t }) => (
  <div className="ccf__step">
    <h2 className="ccf__h2">{t('form.step7.title')}</h2>

    <div className="ccf__route-grid">
      <div className="ccf__field">
        <label className="ccf__lbl">
          {t('form.step7.firstName')} <span className="ccf__req">*</span>
        </label>
        <input
          type="text"
          className="ccf__input"
          value={data.firstName}
          onChange={e => set('firstName', e.target.value)}
          maxLength={100}
        />
      </div>

      <div className="ccf__field">
        <label className="ccf__lbl">
          {t('form.step7.lastName')} <span className="ccf__req">*</span>
        </label>
        <input
          type="text"
          className="ccf__input"
          value={data.lastName}
          onChange={e => set('lastName', e.target.value)}
          maxLength={100}
        />
      </div>
    </div>

    <div className="ccf__field">
      <label className="ccf__lbl">
        {t('form.step7.email')} <span className="ccf__req">*</span>
      </label>
      <input
        type="email"
        className="ccf__input"
        value={data.email}
        onChange={e => set('email', e.target.value)}
        maxLength={254}
      />
    </div>

    <div className="ccf__route-grid">
      <div className="ccf__field">
        <label className="ccf__lbl">
          {t('form.step7.phone')} <span className="ccf__req">*</span>
        </label>
        <input
          type="tel"
          className="ccf__input"
          placeholder={t('form.step7.phonePlaceholder')}
          value={data.phone}
          onChange={e => set('phone', e.target.value)}
          maxLength={20}
        />
      </div>

      <div className="ccf__field">
        <label className="ccf__lbl">
          {t('form.step7.nationality')} <span className="ccf__req">*</span>
        </label>
        <select
          className="ccf__input ccf__select"
          value={data.nationality}
          onChange={e => set('nationality', e.target.value)}
        >
          <option value="">{t('form.step7.nationalityPlaceholder')}</option>
          {NATIONALITIES.map(n => (
            <option key={n.code} value={n.code}>{n.label}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
)

/* ── Step 8: Booking reference & consent ────────────────── */
const Step8 = ({ data, set, t, error }) => (
  <div className="ccf__step">
    <h2 className="ccf__h2">{t('form.step8.title')}</h2>

    <div className="ccf__field">
      <label className="ccf__lbl">
        {t('form.step8.bookingReference')} <span className="ccf__req">*</span>
      </label>
      <input
        type="text"
        className="ccf__input"
        placeholder={t('form.step8.bookingReferencePlaceholder')}
        value={data.bookingReference}
        onChange={e => set('bookingReference', e.target.value.toUpperCase())}
        maxLength={20}
      />
      <span className="ccf__field-help">{t('form.step8.bookingReferenceHelp')}</span>
    </div>

    <hr className="ccf__divider" />

    <div className="ccf__consent">
      <label className="ccf__checkbox-label">
        <input
          type="checkbox"
          checked={data.consentTerms}
          onChange={e => set('consentTerms', e.target.checked)}
        />
        <span dangerouslySetInnerHTML={{ __html: t('form.step8.consent') }} />
      </label>

      <label className="ccf__checkbox-label">
        <input
          type="checkbox"
          checked={data.consentGdpr}
          onChange={e => set('consentGdpr', e.target.checked)}
        />
        <span dangerouslySetInnerHTML={{ __html: t('form.step8.gdpr') }} />
      </label>
    </div>

    {error && (
      <div className="ccf__error">
        <span>⚠️</span>
        <p>{error}</p>
      </div>
    )}

    {/* Claim summary */}
    <div className="ccf__claim-summary">
      <h3 className="ccf__h3">Claim Summary</h3>
      <div className="ccf__summary-grid">
        <div><strong>Route:</strong> {data.from?.iata} → {data.to?.iata}</div>
        <div><strong>Flight:</strong> {data.flightNumber || '—'}</div>
        <div><strong>Date:</strong> {data.flightDate || '—'}</div>
        <div><strong>Passenger:</strong> {data.firstName} {data.lastName}</div>
        <div><strong>Email:</strong> {data.email}</div>
        <div><strong>Booking:</strong> {data.bookingReference || '—'}</div>
      </div>
    </div>
  </div>
)

/* ── Eligibility result screen ────────────────────────────── */
const Result = ({ data, onReset, onStartClaim }) => {
  const { t } = useTranslation()
  const eligible = data.timing === 'more3' || data.timing === 'missed'
  const estimatedAmount = getEstimatedCompensation(data.from, data.to)

  return (
    <div className="ccf">
      <div className="ccf__bg" />
      <div className="ccf__result-wrap container">
        <div className="ccf__result-card">
          <div className="ccf__result-emoji">{eligible ? '🎉' : 'ℹ️'}</div>

          {eligible ? (
            <>
              <h2 className="ccf__result-h2">{t('form.eligible.title')}</h2>
              {data.from && data.to && (
                <div className="ccf__result-route">
                  <span className="ccf__result-iata">{data.from.iata}</span>
                  <span className="ccf__result-arrow">→</span>
                  <span className="ccf__result-iata">{data.to.iata}</span>
                </div>
              )}
              <p className="ccf__result-p"
                dangerouslySetInnerHTML={{ __html: t('form.eligible.descriptionDynamic', { amount: estimatedAmount }) }}
              />
              <button className="ccf__btn-continue" style={{ marginBottom: 0 }} onClick={onStartClaim}>
                {t('form.eligible.startClaim')}
              </button>
            </>
          ) : (
            <>
              <h2 className="ccf__result-h2">{t('form.notEligible.title')}</h2>
              <p className="ccf__result-p">{t('form.notEligible.description')}</p>
            </>
          )}

          <button className="ccf__btn-continue ccf__btn-continue--outline" style={{ marginTop: 16 }} onClick={onReset}>
            {t('form.checkAnotherFlight')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Submitted confirmation screen ─────────────────────── */
const SubmittedScreen = ({ result, onReset }) => {
  const { t } = useTranslation()

  return (
    <div className="ccf">
      <div className="ccf__bg" />
      <div className="ccf__result-wrap container">
        <div className="ccf__result-card">
          <div className="ccf__result-emoji">✅</div>
          <h2 className="ccf__result-h2">{t('form.submitted.title')}</h2>

          <div className="ccf__submitted-details">
            <div className="ccf__submitted-row">
              <span className="ccf__submitted-label">{t('form.submitted.claimId')}</span>
              <span className="ccf__submitted-value ccf__claim-id">{result.claimId}</span>
            </div>

            {result.estimatedAmount && (
              <div className="ccf__submitted-row">
                <span className="ccf__submitted-label">{t('form.submitted.estimated')}</span>
                <span className="ccf__submitted-value ccf__amount">€{result.estimatedAmount}</span>
              </div>
            )}
          </div>

          <p className="ccf__result-p">{t('form.submitted.emailSent')}</p>
          <p className="ccf__result-p" style={{ fontSize: 14, color: 'var(--TextSilverDark)' }}>
            {t('form.submitted.trackClaim')}
          </p>

          <button className="ccf__btn-continue" style={{ marginTop: 24 }} onClick={onReset}>
            {t('form.submitted.newClaim')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckCompensationForm
