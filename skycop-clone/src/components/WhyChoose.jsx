import './WhyChoose.css'

const WhyChoose = () => {
  const claimItems = [
    { icon: '⚡', text: 'Quick and simple' },
    { icon: '🆓', text: 'No financial risk' },
    { icon: '✈️', text: 'We handle 650+ airlines' },
    { icon: '📊', text: 'Regular updates' },
    { icon: '⭐', text: 'Trustpilot reviews' },
  ]

  const selfItems = [
    { icon: '📝', text: 'Time consuming' },
    { icon: '💰', text: 'Legal costs involved' },
    { icon: '❓', text: 'Uncertain outcome' },
    { icon: '📞', text: 'Need to follow up' },
    { icon: '🔍', text: 'Research regulations yourself' },
  ]

  return (
    <section className="why-choose">
      <div className="container">
        <h2 className="section-title">
          Why People Choose <span>Jet2Pay</span>?
        </h2>

        <div className="why-choose__grid">
          <div className="why-choose__card why-choose__card--green">
            <h3 className="why-choose__card-title">Claim with Jet2Pay</h3>
            <ul className="why-choose__list">
              {claimItems.map((item, i) => (
                <li key={i} className="why-choose__list-item">
                  <span className="why-choose__icon why-choose__icon--check">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 5" stroke="#E8672C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="why-choose__card why-choose__card--gray">
            <h3 className="why-choose__card-title">Claim by Yourself</h3>
            <ul className="why-choose__list">
              {selfItems.map((item, i) => (
                <li key={i} className="why-choose__list-item">
                  <span className="why-choose__icon why-choose__icon--cross">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4L12 12M12 4L4 12" stroke="#fe6050" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChoose
