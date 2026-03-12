import { useState } from 'react'
import './CompensationAmount.css'
import AirportSearch from './AirportSearch'

const CompensationAmount = () => {
  const [departure, setDeparture] = useState(null)
  const [arrival, setArrival] = useState(null)

  return (
    <section className="compensation">
      <div className="container">
        <h2 className="section-title">
          How Much is Your Legal<br />
          <span>Compensation</span> For Your<br />
          Problem Flight?
        </h2>

        <div className="compensation__tiers">
          <div className="compensation__tier">
            <div className="compensation__tier-amount">€250</div>
            <div className="compensation__tier-label">Up to 1500 km</div>
            <div className="compensation__tier-bar compensation__tier-bar--1"></div>
          </div>
          <div className="compensation__tier">
            <div className="compensation__tier-amount">€400</div>
            <div className="compensation__tier-label">From 1500 km to 3500 km</div>
            <div className="compensation__tier-bar compensation__tier-bar--2"></div>
          </div>
          <div className="compensation__tier compensation__tier--highlight">
            <div className="compensation__tier-amount">€600</div>
            <div className="compensation__tier-label">More than 3500 km</div>
            <div className="compensation__tier-bar compensation__tier-bar--3"></div>
          </div>
        </div>

        <div className="compensation__calculator">
          <div className="compensation__calc-inputs">
            <div className="compensation__calc-group">
              <label>Departure airport</label>
              <AirportSearch
                placeholder="e.g., London Heathrow"
                onChange={setDeparture}
              />
            </div>
            <div className="compensation__calc-group">
              <label>Arrival airport</label>
              <AirportSearch
                placeholder="e.g., Paris CDG"
                onChange={setArrival}
              />
            </div>
            <button className="btn-primary compensation__calc-btn">Calculate</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CompensationAmount
