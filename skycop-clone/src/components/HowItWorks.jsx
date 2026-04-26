import './HowItWorks.css'

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Submit Your Flight Claim',
      description: 'It takes less than 3 minutes. We will check if you\'re entitled to compensation and will keep you updated about your claim status.',
      icon: (
        <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="3" width="16" height="22" rx="2.5" stroke="#E8672C" strokeWidth="2" fill="none"/>
          <line x1="9" y1="10" x2="17" y2="10" stroke="#E8672C" strokeWidth="2" strokeLinecap="round"/>
          <line x1="9" y1="14" x2="17" y2="14" stroke="#E8672C" strokeWidth="2" strokeLinecap="round"/>
          <line x1="9" y1="18" x2="13" y2="18" stroke="#E8672C" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="23" cy="23" r="5.5" fill="#E8672C"/>
          <line x1="23" y1="20.5" x2="23" y2="25.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="20.5" y1="23" x2="25.5" y2="23" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      iconBg: 'var(--j2p-bg-orange-lt, #FFF5EE)',
    },
    {
      number: '02',
      title: 'We Fight For Your Rights',
      description: 'Our legal experts handle everything. We communicate with the airline on your behalf and take legal action if needed.',
      icon: (
        <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="13" cy="13" r="8" stroke="#7B2D8E" strokeWidth="2" fill="none"/>
          <line x1="19" y1="19" x2="26" y2="26" stroke="#7B2D8E" strokeWidth="2.2" strokeLinecap="round"/>
          <polyline points="9,13 12,16 17,10" stroke="#7B2D8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      ),
      iconBg: '#F5ECF9',
    },
    {
      number: '03',
      title: 'Receive Your Compensation',
      description: 'Once we secure your compensation, we deduct our fee and transfer the rest to your bank account. Up to €600 per passenger.',
      icon: (
        <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="9" width="24" height="15" rx="3" stroke="#C94488" strokeWidth="2" fill="none"/>
          <circle cx="15" cy="16.5" r="3.5" stroke="#C94488" strokeWidth="2" fill="none"/>
          <line x1="3" y1="13.5" x2="7" y2="13.5" stroke="#C94488" strokeWidth="2" strokeLinecap="round"/>
          <line x1="23" y1="13.5" x2="27" y2="13.5" stroke="#C94488" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 6 L15 3 L22 6" stroke="#C94488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      ),
      iconBg: '#FFF0F7',
    },
  ]

  return (
    <section className="how-it-works">
      <div className="container">
        <p className="how-it-works__eyebrow">Simple process</p>
        <h2 className="how-it-works__title">
          How to Get <span>Compensation</span> with Jet2Pay
        </h2>

        <div className="how-it-works__steps">
          {steps.map((step, i) => (
            <div key={i} className="how-it-works__step">
              <span className="how-it-works__step-badge">{step.number}</span>
              <div className="how-it-works__step-icon" style={{ background: step.iconBg }}>
                {step.icon}
              </div>
              <h3 className="how-it-works__step-title">{step.title}</h3>
              <p className="how-it-works__step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
