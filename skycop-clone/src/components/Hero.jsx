import { useState } from 'react'
import './Hero.css'
import AirportSearch from './AirportSearch'

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z" stroke="#717171" strokeWidth="1.5"/>
    <path d="M15 15L19 19" stroke="#717171" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const Hero = () => {
  const [departure, setDeparture] = useState(null)
  const [arrival, setArrival] = useState(null)

  return (
    <section className="hero">
      <div className="hero__bg-shape"></div>
      <div className="hero__inner container">
        <div className="hero__content">
          <h1 className="hero__title">
            Flight <span className="hero__title--green">Delayed</span> or <span className="hero__title--green">Cancelled</span>?
          </h1>
          <p className="hero__subtitle">
            Claim up to <strong>€600</strong> for a delayed or cancelled flight
          </p>

          <div className="hero__form">
            <p className="hero__form-label">What happened with your flight?</p>
            <div className="hero__form-options">
              <label className="hero__radio">
                <input type="radio" name="flightIssue" defaultChecked />
                <span className="hero__radio-custom"></span>
                <span>Delayed</span>
              </label>
              <label className="hero__radio">
                <input type="radio" name="flightIssue" />
                <span className="hero__radio-custom"></span>
                <span>Cancelled / Overbooked</span>
              </label>
              <label className="hero__radio">
                <input type="radio" name="flightIssue" />
                <span className="hero__radio-custom"></span>
                <span>Other disruptions</span>
              </label>
            </div>

            <div className="hero__form-inputs">
              <AirportSearch
                placeholder="Departure airport"
                icon={<SearchIcon />}
                onChange={setDeparture}
              />
              <AirportSearch
                placeholder="Arrival airport"
                icon={<SearchIcon />}
                onChange={setArrival}
              />
              <button className="hero__submit btn-primary">
                Check Compensation
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="hero__trust">
            <div className="hero__trust-item">
              <span className="hero__trust-check">&#10003;</span>
              <span>Free compensation check</span>
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-check">&#10003;</span>
              <span>Hassle-free</span>
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-check">&#10003;</span>
              <span>Claims up to 3 years old</span>
            </div>
          </div>
        </div>

        <div className="hero__images">
          <div className="hero__image-wrapper">
            <img
              src="https://www.skycop.com/wp-content/uploads/2024/05/hero-img.png"
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
            <span className="hero__stat-label">compensated customers</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-value">250+</span>
            <span className="hero__stat-label">airlines</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-value">10+</span>
            <span className="hero__stat-label">years trusted</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
