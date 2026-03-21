import { useTranslation } from 'react-i18next'
import './FooterPages.css'

/* ─── page configs ─── */
const HERO = {
  howItWorks:  { badge: '🔍', icon: '✈️' },
  pricing:     { badge: '💰', icon: '🏷️' },
  reviews:     { badge: '⭐', icon: '💬' },
  careers:     { badge: '🚀', icon: '👩‍💻' },
  partners:    { badge: '🤝', icon: '🌐' },
  press:       { badge: '📰', icon: '🎤' },
  contact:     { badge: '📧', icon: '📍' },
}

const STEPS = [
  { num: 1, icon: '🔍' },
  { num: 2, icon: '📝' },
  { num: 3, icon: '⚖️' },
  { num: 4, icon: '💶' },
]

const WHY_US = [
  { icon: '🛡️', key: 'noRisk' },
  { icon: '⚡', key: 'fast' },
  { icon: '📊', key: 'expertise' },
]

const PRICING_ROWS = [
  { key: 'jet2pay', icon: '🏆' },
  { key: 'lawyer',  icon: '⚖️' },
  { key: 'diy',     icon: '🤷' },
]

const PRICING_FAQ = ['q1', 'q2', 'q3', 'q4']

const REVIEWS = [
  { key: 'r1', stars: 5 },
  { key: 'r2', stars: 5 },
  { key: 'r3', stars: 5 },
  { key: 'r4', stars: 4 },
  { key: 'r5', stars: 5 },
  { key: 'r6', stars: 5 },
  { key: 'r7', stars: 4 },
  { key: 'r8', stars: 5 },
]

const REVIEW_STATS = [
  { value: '4.9/5', key: 'avgRating' },
  { value: '10,000+', key: 'totalReviews' },
  { value: '98%', key: 'recommend' },
  { value: '€600', key: 'avgPayout' },
]

const POSITIONS = ['claimsSpecialist', 'legalAdvisor', 'frontendDev', 'customerSupport']

const PARTNER_TYPES = [
  { icon: '✈️', key: 'airlines' },
  { icon: '🏖️', key: 'travelAgency' },
  { icon: '⚖️', key: 'legal' },
]

const PARTNER_BENEFITS = ['benefit1', 'benefit2', 'benefit3', 'benefit4']

const PRESS_FACTS = ['fact1', 'fact2', 'fact3', 'fact4']

const CONTACT_CHANNELS = [
  { icon: '📧', key: 'email', detail: 'claims@jet2pay.eu' },
  { icon: '🛟', key: 'support', detail: 'support@jet2pay.eu' },
  { icon: '📍', key: 'address', detail: 'Sofia, Bulgaria' },
]

const CONTACT_FAQ = ['q1', 'q2', 'q3']

/* ─── renderers ─── */

function HowItWorks({ t, p }) {
  return (
    <>
      <section className="fp__section">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.steps.title`)}</h2>
          <div className="fp__steps">
            {STEPS.map((s, i) => (
              <div key={s.num} className="fp__step">
                <div className="fp__step-icon">{s.icon}</div>
                <div className="fp__step-number">{s.num}</div>
                <h3 className="fp__step-title">{t(`${p}.steps.s${s.num}.title`)}</h3>
                <p className="fp__step-text">{t(`${p}.steps.s${s.num}.text`)}</p>
                {i < STEPS.length - 1 && <div className="fp__step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fp__section fp__section--alt">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.whyUs.title`)}</h2>
          <div className="fp__grid fp__grid--3">
            {WHY_US.map(w => (
              <div key={w.key} className="fp__card">
                <div className="fp__card-icon">{w.icon}</div>
                <h3 className="fp__card-title">{t(`${p}.whyUs.${w.key}.title`)}</h3>
                <p className="fp__card-text">{t(`${p}.whyUs.${w.key}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Pricing({ t, p }) {
  return (
    <>
      <section className="fp__section">
        <div className="container">
          <div className="fp__highlight-card">
            <div className="fp__highlight-icon">🎉</div>
            <h2 className="fp__highlight-title">{t(`${p}.noWinNoFee.title`)}</h2>
            <p className="fp__highlight-text">{t(`${p}.noWinNoFee.text`)}</p>
            <div className="fp__highlight-badge">{t(`${p}.noWinNoFee.badge`)}</div>
          </div>
        </div>
      </section>

      <section className="fp__section fp__section--alt">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.comparison.title`)}</h2>
          <div className="fp__table-wrap">
            <table className="fp__table">
              <thead>
                <tr>
                  <th>{t(`${p}.comparison.option`)}</th>
                  <th>{t(`${p}.comparison.cost`)}</th>
                  <th>{t(`${p}.comparison.successRate`)}</th>
                  <th>{t(`${p}.comparison.effort`)}</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_ROWS.map(r => (
                  <tr key={r.key} className={r.key === 'jet2pay' ? 'fp__table-highlight' : ''}>
                    <td><span className="fp__table-icon">{r.icon}</span> {t(`${p}.comparison.${r.key}.name`)}</td>
                    <td>{t(`${p}.comparison.${r.key}.cost`)}</td>
                    <td>{t(`${p}.comparison.${r.key}.success`)}</td>
                    <td>{t(`${p}.comparison.${r.key}.effort`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="fp__section">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.faq.title`)}</h2>
          <div className="fp__faq">
            {PRICING_FAQ.map(q => (
              <div key={q} className="fp__faq-item">
                <h3 className="fp__faq-q">{t(`${p}.faq.${q}.q`)}</h3>
                <p className="fp__faq-a">{t(`${p}.faq.${q}.a`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Reviews({ t, p }) {
  return (
    <>
      <section className="fp__section">
        <div className="container">
          <div className="fp__stats-grid">
            {REVIEW_STATS.map(s => (
              <div key={s.key} className="fp__stat">
                <div className="fp__stat-value">{s.value}</div>
                <div className="fp__stat-label">{t(`${p}.stats.${s.key}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fp__section fp__section--alt">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.grid.title`)}</h2>
          <div className="fp__reviews-grid">
            {REVIEWS.map(r => (
              <div key={r.key} className="fp__review-card">
                <div className="fp__review-stars">{'⭐'.repeat(r.stars)}</div>
                <p className="fp__review-quote">{t(`${p}.grid.${r.key}.quote`)}</p>
                <div className="fp__review-author">
                  <strong>{t(`${p}.grid.${r.key}.name`)}</strong>
                  <span className="fp__review-route">{t(`${p}.grid.${r.key}.route`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Careers({ t, p }) {
  return (
    <>
      <section className="fp__section">
        <div className="container">
          <div className="fp__mission">
            <div className="fp__mission-content">
              <h2 className="fp__section-title">{t(`${p}.culture.title`)}</h2>
              <p className="fp__section-text">{t(`${p}.culture.text1`)}</p>
              <p className="fp__section-text">{t(`${p}.culture.text2`)}</p>
            </div>
            <div className="fp__mission-visual">
              <div className="fp__culture-card">
                <div className="fp__culture-icon">🌍</div>
                <h3>{t(`${p}.culture.cardTitle`)}</h3>
                <p>{t(`${p}.culture.cardText`)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="fp__section fp__section--alt">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.positions.title`)}</h2>
          <div className="fp__positions">
            {POSITIONS.map(pos => (
              <div key={pos} className="fp__position-card">
                <div className="fp__position-header">
                  <h3 className="fp__position-title">{t(`${p}.positions.${pos}.title`)}</h3>
                  <div className="fp__position-tags">
                    <span className="fp__tag">{t(`${p}.positions.${pos}.location`)}</span>
                    <span className="fp__tag fp__tag--type">{t(`${p}.positions.${pos}.type`)}</span>
                  </div>
                </div>
                <p className="fp__position-desc">{t(`${p}.positions.${pos}.desc`)}</p>
                <button className="fp__position-btn">{t(`${p}.positions.apply`)}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Partners({ t, p }) {
  return (
    <>
      <section className="fp__section">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.types.title`)}</h2>
          <div className="fp__grid fp__grid--3">
            {PARTNER_TYPES.map(pt => (
              <div key={pt.key} className="fp__card">
                <div className="fp__card-icon">{pt.icon}</div>
                <h3 className="fp__card-title">{t(`${p}.types.${pt.key}.title`)}</h3>
                <p className="fp__card-text">{t(`${p}.types.${pt.key}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fp__section fp__section--alt">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.benefits.title`)}</h2>
          <div className="fp__benefits">
            {PARTNER_BENEFITS.map(b => (
              <div key={b} className="fp__benefit">
                <div className="fp__benefit-check">✓</div>
                <div>
                  <h3 className="fp__benefit-title">{t(`${p}.benefits.${b}.title`)}</h3>
                  <p className="fp__benefit-text">{t(`${p}.benefits.${b}.text`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fp__section">
        <div className="container">
          <div className="fp__highlight-card">
            <div className="fp__highlight-icon">📩</div>
            <h2 className="fp__highlight-title">{t(`${p}.contactUs.title`)}</h2>
            <p className="fp__highlight-text">{t(`${p}.contactUs.text`)}</p>
            <p className="fp__highlight-email">partners@jet2pay.eu</p>
          </div>
        </div>
      </section>
    </>
  )
}

function Press({ t, p }) {
  return (
    <>
      <section className="fp__section">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.facts.title`)}</h2>
          <div className="fp__grid fp__grid--4">
            {PRESS_FACTS.map(f => (
              <div key={f} className="fp__fact-card">
                <div className="fp__fact-value">{t(`${p}.facts.${f}.value`)}</div>
                <div className="fp__fact-label">{t(`${p}.facts.${f}.label`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fp__section fp__section--alt">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.releases.title`)}</h2>
          <div className="fp__press-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="fp__press-item">
                <div className="fp__press-date">{t(`${p}.releases.r${i}.date`)}</div>
                <div className="fp__press-body">
                  <h3 className="fp__press-title">{t(`${p}.releases.r${i}.title`)}</h3>
                  <p className="fp__press-summary">{t(`${p}.releases.r${i}.summary`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fp__section">
        <div className="container">
          <div className="fp__grid fp__grid--2">
            <div className="fp__card">
              <div className="fp__card-icon">📦</div>
              <h3 className="fp__card-title">{t(`${p}.mediaKit.title`)}</h3>
              <p className="fp__card-text">{t(`${p}.mediaKit.text`)}</p>
              <p className="fp__card-email">press@jet2pay.eu</p>
            </div>
            <div className="fp__card">
              <div className="fp__card-icon">🎤</div>
              <h3 className="fp__card-title">{t(`${p}.pressContact.title`)}</h3>
              <p className="fp__card-text">{t(`${p}.pressContact.text`)}</p>
              <p className="fp__card-email">media@jet2pay.eu</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Contact({ t, p }) {
  return (
    <>
      <section className="fp__section">
        <div className="container">
          <div className="fp__grid fp__grid--3">
            {CONTACT_CHANNELS.map(c => (
              <div key={c.key} className="fp__card fp__card--center">
                <div className="fp__card-icon">{c.icon}</div>
                <h3 className="fp__card-title">{t(`${p}.channels.${c.key}.title`)}</h3>
                <p className="fp__card-detail">{c.detail}</p>
                <p className="fp__card-text">{t(`${p}.channels.${c.key}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fp__section fp__section--alt">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.form.title`)}</h2>
          <div className="fp__contact-form">
            <div className="fp__form-placeholder">
              <div className="fp__form-icon">✉️</div>
              <p>{t(`${p}.form.placeholder`)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="fp__section">
        <div className="container">
          <h2 className="fp__section-title fp__section-title--center">{t(`${p}.faq.title`)}</h2>
          <div className="fp__faq">
            {CONTACT_FAQ.map(q => (
              <div key={q} className="fp__faq-item">
                <h3 className="fp__faq-q">{t(`${p}.faq.${q}.q`)}</h3>
                <p className="fp__faq-a">{t(`${p}.faq.${q}.a`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

const RENDERERS = {
  howItWorks: HowItWorks,
  pricing:    Pricing,
  reviews:    Reviews,
  careers:    Careers,
  partners:   Partners,
  press:      Press,
  contact:    Contact,
}

/* ─── main component ─── */

export default function FooterPages({ type, onCheckCompensation }) {
  const { t } = useTranslation()
  const p = `footerPages.${type}`
  const hero = HERO[type] || HERO.contact
  const Renderer = RENDERERS[type]

  if (!Renderer) return null

  return (
    <div className="fp">
      {/* Hero */}
      <section className="fp__hero">
        <div className="container">
          <span className="fp__badge">{hero.badge} {t(`${p}.hero.badge`)}</span>
          <h1 className="fp__hero-title">{t(`${p}.hero.title`)}</h1>
          <p className="fp__hero-subtitle">{t(`${p}.hero.subtitle`)}</p>
        </div>
      </section>

      {/* Page-specific content */}
      <Renderer t={t} p={p} />

      {/* CTA */}
      <section className="fp__cta">
        <div className="container">
          <h2 className="fp__cta-title">{t(`${p}.cta.title`)}</h2>
          <p className="fp__cta-text">{t(`${p}.cta.text`)}</p>
          <button className="fp__cta-btn" onClick={onCheckCompensation}>
            {t(`${p}.cta.button`)}
          </button>
        </div>
      </section>
    </div>
  )
}
