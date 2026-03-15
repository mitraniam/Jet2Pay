import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AirportSearch from './AirportSearch'
import './CheckCompensationForm.css'

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
  const [done, setDone] = useState(false)
  const [data, setData] = useState({
    from: null,
    to: null,
    isDirect: true,
    disruption: null,
    timing: null,
    airlineTold: null,
    reason: null,
    waitTime: null,
    description: '',
  })

  const set = (k, v) => setData(p => ({ ...p, [k]: v }))

  const canContinue = () => {
    if (step === 1) return !!data.from && !!data.to
    if (step === 2) return !!data.disruption
    if (step === 3) return !!data.timing
    if (step === 4) return !!data.airlineTold && (data.airlineTold !== 'yes' || !!data.reason)
    return true
  }

  const handleContinue = () => {
    if (!canContinue()) return
    if (step < 5) setStep(s => s + 1)
    else setDone(true)
  }

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1)
    else onBack?.()
  }

  /* ── Sidebar config (translated) ── */
  const SIDEBAR = [
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
  ]

  if (done) {
    return <Result data={data} onReset={() => { setDone(false); setStep(1); onBack?.() }} />
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
          </div>

          {/* Actions */}
          <div className="ccf__actions">
            <button className="ccf__btn-back" onClick={handleBack}>
              {t('form.back')}
            </button>
            <button
              className={`ccf__btn-continue${canContinue() ? '' : ' ccf__btn-continue--off'}`}
              onClick={handleContinue}
            >
              {step === 5 ? t('form.submitClaim') : t('form.continue')}
              {step < 5 && <ArrowIcon />}
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

/* ── Result screen ──────────────────────────────────────── */
const Result = ({ data, onReset }) => {
  const { t } = useTranslation()
  const eligible = data.timing === 'more3' || data.timing === 'missed'

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
                dangerouslySetInnerHTML={{ __html: t('form.eligible.description') }}
              />
              <button className="ccf__btn-continue" style={{ marginBottom: 0 }}>
                {t('form.eligible.startClaim')}
              </button>
            </>
          ) : (
            <>
              <h2 className="ccf__result-h2">{t('form.notEligible.title')}</h2>
              <p className="ccf__result-p">{t('form.notEligible.description')}</p>
            </>
          )}

          <button className="ccf__btn-back" style={{ marginTop: 16 }} onClick={onReset}>
            {t('form.checkAnotherFlight')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckCompensationForm
