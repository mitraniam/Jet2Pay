import './FlightProtection.css'

const FlightProtection = () => {
  return (
    <section className="flight-protection">
      <div className="container">
        <div className="flight-protection__card">
          <h2 className="flight-protection__title">Was Your Flight Disrupted?</h2>
          <p className="flight-protection__desc">
            Check your eligibility for compensation now. It only takes 3 minutes.
          </p>
          <div className="flight-protection__actions">
            <a href="#" className="btn-primary flight-protection__btn">Check Compensation</a>
          </div>
          <div className="flight-protection__stars">
            <span>★★★★★</span>
            <span className="flight-protection__stars-text">Rated 4.6/5 on Trustpilot</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FlightProtection
