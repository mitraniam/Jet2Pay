import './WhatElse.css'

const WhatElse = () => {
  return (
    <section className="what-else">
      <div className="container">
        <h2 className="section-title">
          What Else <span>do We Offer</span>?
        </h2>

        <div className="what-else__grid">
          <div className="what-else__card what-else__card--fast">
            <div className="what-else__card-content">
              <h3 className="what-else__card-title">Fast Payout</h3>
              <p className="what-else__card-desc">
                Don't want to wait? Get your compensation within 2 working days with our Fast Payout option.
              </p>
              <a href="#" className="btn-primary what-else__card-btn">Get Fast Payout</a>
            </div>
            <div className="what-else__card-image what-else__card-image--fast">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
                alt="Fast Payout"
              />
            </div>
          </div>

          <div className="what-else__card what-else__card--refer">
            <div className="what-else__card-content">
              <h3 className="what-else__card-title">
                Refer a Friend, Get<br />
                <span className="what-else__amount">€75</span>
              </h3>
              <p className="what-else__card-desc">
                Know someone who had a flight disruption? Refer them and earn €75 for each successful claim.
              </p>
              <a href="#" className="btn-outline what-else__card-btn">Refer Now</a>
            </div>
          </div>

          <div className="what-else__card what-else__card--planned">
            <div className="what-else__card-content">
              <h3 className="what-else__card-title">Planned Trips</h3>
              <p className="what-else__card-desc">
                Be ready for flight delays — from just €9.99. Monitor your upcoming flights and get automatic claim filing.
              </p>
              <a href="#" className="btn-primary what-else__card-btn">Protect My Trip</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatElse
