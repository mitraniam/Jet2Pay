import './PassengerRights.css'

const PassengerRights = () => {
  const rights = [
    'EU Regulation 261/2004',
    'UK Regulation UK261',
    'Turkish SHY Regulation',
    'Brazilian ANAC Resolution',
    'Canadian APPR',
    'Montreal Convention',
  ]

  return (
    <section className="passenger-rights">
      <div className="container">
        <h2 className="section-title">
          Know Your <span>Air Passenger Rights</span>
        </h2>
        <p className="passenger-rights__desc">
          As an air passenger, you are protected by various regulations worldwide. We help you claim compensation under all major regulations.
        </p>

        <div className="passenger-rights__grid">
          {rights.map((r, i) => (
            <a key={i} href="#" className="passenger-rights__item">
              <span className="passenger-rights__item-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10L8 14L16 6" stroke="var(--PrimaryOrange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span>{r}</span>
              <svg className="passenger-rights__item-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PassengerRights
