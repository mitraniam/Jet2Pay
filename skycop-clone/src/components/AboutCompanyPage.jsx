import { useTranslation } from 'react-i18next'
import './AboutCompanyPage.css'

const TEAM = [
  { name: 'Avi Mitrani', role: 'about.team.founder', emoji: '👨‍💼' },
  { name: 'Legal Team', role: 'about.team.legal', emoji: '⚖️' },
  { name: 'Claims Team', role: 'about.team.claims', emoji: '📋' },
  { name: 'Tech Team', role: 'about.team.tech', emoji: '💻' },
]

const VALUES = [
  { icon: '🎯', key: 'transparency' },
  { icon: '🤝', key: 'noWinNoFee' },
  { icon: '⚡', key: 'speed' },
  { icon: '🛡️', key: 'expertise' },
]

const STATS = [
  { value: '1M+', key: 'about.stats.customers' },
  { value: '250+', key: 'about.stats.airlines' },
  { value: '98%', key: 'about.stats.successRate' },
  { value: '€10M+', key: 'about.stats.recovered' },
]

export default function AboutCompanyPage({ onCheckCompensation }) {
  const { t } = useTranslation()

  return (
    <div className="about">
      {/* Hero */}
      <section className="about__hero">
        <div className="container">
          <span className="about__badge">{t('about.badge')}</span>
          <h1 className="about__hero-title">{t('about.hero.title')}</h1>
          <p className="about__hero-subtitle">{t('about.hero.subtitle')}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="about__stats">
        <div className="container">
          <div className="about__stats-grid">
            {STATS.map(s => (
              <div key={s.key} className="about__stat">
                <div className="about__stat-value">{s.value}</div>
                <div className="about__stat-label">{t(s.key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about__section">
        <div className="container">
          <div className="about__mission">
            <div className="about__mission-content">
              <h2 className="about__section-title">{t('about.mission.title')}</h2>
              <p className="about__section-text">{t('about.mission.text1')}</p>
              <p className="about__section-text">{t('about.mission.text2')}</p>
            </div>
            <div className="about__mission-visual">
              <div className="about__mission-card">
                <div className="about__mission-icon">✈️</div>
                <h3>{t('about.mission.cardTitle')}</h3>
                <p>{t('about.mission.cardText')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about__section about__section--alt">
        <div className="container">
          <h2 className="about__section-title about__section-title--center">{t('about.values.title')}</h2>
          <div className="about__values-grid">
            {VALUES.map(v => (
              <div key={v.key} className="about__value-card">
                <div className="about__value-icon">{v.icon}</div>
                <h3 className="about__value-title">{t(`about.values.${v.key}.title`)}</h3>
                <p className="about__value-text">{t(`about.values.${v.key}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="about__section">
        <div className="container">
          <h2 className="about__section-title about__section-title--center">{t('about.howItWorks.title')}</h2>
          <div className="about__steps">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="about__step">
                <div className="about__step-number">{i}</div>
                <h3 className="about__step-title">{t(`about.howItWorks.step${i}.title`)}</h3>
                <p className="about__step-text">{t(`about.howItWorks.step${i}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about__section about__section--alt">
        <div className="container">
          <h2 className="about__section-title about__section-title--center">{t('about.team.title')}</h2>
          <p className="about__section-text" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            {t('about.team.subtitle')}
          </p>
          <div className="about__team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="about__team-card">
                <div className="about__team-avatar">{m.emoji}</div>
                <h3 className="about__team-name">{m.name}</h3>
                <p className="about__team-role">{t(m.role)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="about__section">
        <div className="container">
          <h2 className="about__section-title about__section-title--center">{t('about.legal.title')}</h2>
          <div className="about__legal-grid">
            <div className="about__legal-card">
              <div className="about__legal-icon">🏢</div>
              <h3>{t('about.legal.company.title')}</h3>
              <p>{t('about.legal.company.name')}</p>
              <p>{t('about.legal.company.registration')}</p>
            </div>
            <div className="about__legal-card">
              <div className="about__legal-icon">📍</div>
              <h3>{t('about.legal.address.title')}</h3>
              <p>{t('about.legal.address.text')}</p>
            </div>
            <div className="about__legal-card">
              <div className="about__legal-icon">📧</div>
              <h3>{t('about.legal.contact.title')}</h3>
              <p>claims@jet2pay.eu</p>
              <p>support@jet2pay.eu</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about__cta">
        <div className="container">
          <h2 className="about__cta-title">{t('about.cta.title')}</h2>
          <p className="about__cta-text">{t('about.cta.text')}</p>
          <button className="about__cta-btn" onClick={onCheckCompensation}>
            {t('about.cta.button')}
          </button>
        </div>
      </section>
    </div>
  )
}
