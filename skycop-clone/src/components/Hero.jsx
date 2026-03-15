import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Hero.css'
import AirportSearch from './AirportSearch'

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z" stroke="#717171" strokeWidth="1.5"/>
    <path d="M15 15L19 19" stroke="#717171" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const Hero = ({ onCheckCompensation }) => {
  const { t } = useTranslation()
  const [departure, setDeparture] = useState(null)
  const [arrival, setArrival] = useState(null)

  return (
    <section className="hero">
      <div className="hero__bg-shape"></div>
      <div className="hero__inner container">
        <div className="hero__content">
          <h1 className="hero__title">
            {t('hero.titleFlight')} <span className="hero__title--green">{t('hero.titleDelayed')}</span> {t('hero.titleOr')} <span className="hero__title--green">{t('hero.titleCancelled')}</span>?
          </h1>
          <p className="hero__subtitle"
            dangerouslySetInnerHTML={{ __html: t('hero.subtitle') }}
          />

          <div className="hero__form">
            <p className="hero__form-label">{t('hero.whatHappened')}</p>
            <div className="hero__form-options">
              <label className="hero__radio">
                <input type="radio" name="flightIssue" defaultChecked />
                <span className="hero__radio-custom"></span>
                <span>{t('hero.delayed')}</span>
              </label>
              <label className="hero__radio">
                <input type="radio" name="flightIssue" />
                <span className="hero__radio-custom"></span>
                <span>{t('hero.cancelled')}</span>
              </label>
              <label className="hero__radio">
                <input type="radio" name="flightIssue" />
                <span className="hero__radio-custom"></span>
                <span>{t('hero.otherDisruptions')}</span>
              </label>
            </div>

            <div className="hero__form-inputs">
              <AirportSearch
                placeholder={t('hero.departurePlaceholder')}
                icon={<SearchIcon />}
                onChange={setDeparture}
              />
              <AirportSearch
                placeholder={t('hero.arrivalPlaceholder')}
                icon={<SearchIcon />}
                onChange={setArrival}
              />
              <button
                className="hero__submit btn-primary"
                onClick={onCheckCompensation}
              >
                {t('hero.checkCompensation')}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="hero__trust">
            <div className="hero__trust-item">
              <span className="hero__trust-check">&#10003;</span>
              <span>{t('hero.freeCheck')}</span>
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-check">&#10003;</span>
              <span>{t('hero.hassleFree')}</span>
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-check">&#10003;</span>
              <span>{t('hero.claimsUpTo')}</span>
            </div>
          </div>
        </div>

        <div className="hero__images">
          <div className="hero__image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=800&fit=crop&crop=faces"
              alt="Happy travelers using Jet2Pay"
              className="hero__image"
            />
          </div>
        </div>
      </div>

      <div className="hero__stats container">
        <div className="hero__stats-inner">
          <div className="hero__stat">
            <img src="https://www.skycop.com/wp-content/themes/sc2/build/images/trustpilot-logo.svg" alt="Trustpilot" className="hero__stat-logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }} />
            <span style={{display:'none', fontWeight:700, color:'#00b67a'}}>Trustpilot</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-value">1M+</span>
            <span className="hero__stat-label">{t('hero.compensatedCustomers')}</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-value">250+</span>
            <span className="hero__stat-label">{t('hero.airlines')}</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-value">10+</span>
            <span className="hero__stat-label">{t('hero.yearsTrusted')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
