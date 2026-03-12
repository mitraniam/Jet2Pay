import './Airports.css'

const Airports = () => {
  const airports = [
    'London Heathrow (LHR)', 'Paris Charles de Gaulle (CDG)', 'Amsterdam Schiphol (AMS)',
    'Frankfurt (FRA)', 'Madrid Barajas (MAD)', 'Barcelona El Prat (BCN)',
    'Munich (MUC)', 'Rome Fiumicino (FCO)', 'Dublin (DUB)',
    'Lisbon (LIS)', 'Brussels (BRU)', 'Vienna (VIE)',
    'Copenhagen (CPH)', 'Oslo (OSL)', 'Stockholm Arlanda (ARN)',
    'Helsinki (HEL)', 'Warsaw Chopin (WAW)', 'Prague (PRG)',
  ]

  return (
    <section className="airports">
      <div className="container">
        <h2 className="section-title">
          Help Provided at <span>These Airports and More</span>
        </h2>
        <p className="airports__desc">
          Jet2Pay provides support at airports across the globe, ensuring passengers can claim their rightful compensation.
        </p>

        <div className="airports__grid">
          {airports.map((a, i) => (
            <a key={i} href="#" className="airports__item">{a}</a>
          ))}
        </div>

        <div className="airports__more">
          <a href="#" className="btn-outline">View All Airports</a>
        </div>
      </div>
    </section>
  )
}

export default Airports
