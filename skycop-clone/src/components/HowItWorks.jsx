import './HowItWorks.css'

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Submit Your Flight Claim',
      description: 'It takes less than 3 minutes. We will check if you\'re entitled to compensation and will keep you updated about your claim status.',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=500&h=350&fit=crop',
    },
    {
      number: '02',
      title: 'We Fight For Your Rights',
      description: 'Our legal experts handle everything. We communicate with the airline on your behalf and take legal action if needed.',
      image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=500&h=350&fit=crop',
    },
    {
      number: '03',
      title: 'Receive Your Compensation',
      description: 'Once we secure your compensation, we deduct our fee and transfer the rest to your bank account.',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&h=350&fit=crop',
    },
  ]

  return (
    <section className="how-it-works">
      <div className="container">
        <h2 className="section-title">
          How to Get<br />
          <span>Compensation</span><br />
          with Jet2Pay
        </h2>

        <div className="how-it-works__steps">
          {steps.map((step, i) => (
            <div key={i} className={`how-it-works__step ${i % 2 !== 0 ? 'how-it-works__step--reverse' : ''}`}>
              <div className="how-it-works__step-content">
                <div className="how-it-works__step-number">{step.number}</div>
                <h3 className="how-it-works__step-title">{step.title}</h3>
                <p className="how-it-works__step-desc">{step.description}</p>
              </div>
              <div className="how-it-works__step-image">
                <img src={step.image} alt={step.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
