import './Airlines.css'

const Airlines = () => {
  const airlines = [
    'Ryanair', 'Lufthansa', 'British Airways', 'Wizz Air', 'EasyJet',
    'KLM', 'Air France', 'Iberia', 'Vueling', 'TAP Portugal',
    'Norwegian', 'Turkish Airlines', 'Aer Lingus', 'SAS', 'Eurowings',
    'Finnair', 'LOT Polish Airlines', 'Swiss', 'Austrian Airlines', 'Brussels Airlines',
  ]

  return (
    <section className="airlines">
      <div className="container">
        <h2 className="section-title">
          Successful Cases Against <span>These Airlines and Others</span>
        </h2>
        <p className="airlines__desc">
          We have successfully claimed compensation from over 250 airlines worldwide.
        </p>

        <div className="airlines__grid">
          {airlines.map((a, i) => (
            <a key={i} href="#" className="airlines__item">{a}</a>
          ))}
        </div>

        <div className="airlines__more">
          <a href="#" className="btn-outline">View All Airlines</a>
        </div>
      </div>
    </section>
  )
}

export default Airlines
