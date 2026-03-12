import './FlightProblems.css'

const FlightProblems = () => {
  const problems = [
    {
      title: 'Delayed Flight Compensation',
      desc: 'Was your flight delayed by 3 hours or more? You could be entitled to up to €600 in compensation.',
      icon: '⏱️',
      color: '#fff3e0',
    },
    {
      title: 'Cancelled Flight Compensation',
      desc: 'If your flight was cancelled less than 14 days before departure, you may be entitled to compensation.',
      icon: '❌',
      color: '#fce4ec',
    },
    {
      title: 'Overbooked Flight Compensation',
      desc: 'Were you denied boarding due to overbooking? Claim up to €600 in compensation.',
      icon: '👥',
      color: '#e8eaf6',
    },
    {
      title: 'Air Passenger Rights',
      desc: 'Learn about your rights as an air passenger under EU Regulation 261/2004.',
      icon: '⚖️',
      color: '#e0f7fa',
    },
  ]

  return (
    <section className="flight-problems">
      <div className="container">
        <h2 className="section-title">
          We Solve <span>More Flight Problems</span>
        </h2>

        <div className="flight-problems__grid">
          {problems.map((p, i) => (
            <div key={i} className="flight-problems__card">
              <div className="flight-problems__card-icon" style={{ background: p.color }}>
                <span>{p.icon}</span>
              </div>
              <h3 className="flight-problems__card-title">{p.title}</h3>
              <p className="flight-problems__card-desc">{p.desc}</p>
              <a href="#" className="flight-problems__card-link">
                Learn more
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FlightProblems
