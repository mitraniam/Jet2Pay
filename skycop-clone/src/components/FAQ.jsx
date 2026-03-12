import { useState } from 'react'
import './FAQ.css'

const faqData = [
  {
    q: 'What is flight compensation, and who is eligible?',
    a: 'Flight compensation is a payment airlines must make to passengers for certain flight disruptions. Under EU Regulation 261/2004, you may be entitled to compensation of up to €600 if your flight was delayed by more than 3 hours, cancelled, or if you were denied boarding due to overbooking.',
  },
  {
    q: 'How much compensation can I get for my flight?',
    a: 'The compensation amount depends on the flight distance: up to €250 for flights under 1,500 km, up to €400 for flights between 1,500 km and 3,500 km, and up to €600 for flights over 3,500 km.',
  },
  {
    q: 'How does Jet2Pay work?',
    a: 'Simply submit your flight details through our platform. We evaluate your claim, handle all communication with the airline, and if necessary, take legal action on your behalf. You only pay when we succeed.',
  },
  {
    q: 'Does Jet2Pay have a fee for the service?',
    a: 'Jet2Pay operates on a no-win, no-fee basis. If we successfully secure your compensation, we deduct our service fee. If we do not succeed, you pay nothing.',
  },
  {
    q: 'Can I claim compensation for a flight that was delayed in the last few years?',
    a: 'Yes, depending on the country. In most EU countries, you can claim for flights up to 3 years old. In the UK, claims can go back up to 6 years. In Germany, the limit is 3 years.',
  },
  {
    q: 'What are extraordinary circumstances?',
    a: 'Extraordinary circumstances are events beyond the airline\'s control that may exempt them from paying compensation. These include severe weather, political instability, security risks, air traffic control restrictions, and similar situations.',
  },
  {
    q: 'How long does the compensation process take?',
    a: 'The timeline varies depending on the airline and whether legal action is needed. Some claims are resolved within a few weeks, while more complex cases may take several months.',
  },
  {
    q: 'What documents do I need to submit a claim?',
    a: 'You typically need your booking confirmation, boarding pass, and any documentation about the disruption. Our system will guide you through the required documents.',
  },
  {
    q: 'Can someone else file a claim on my behalf?',
    a: 'Yes, a third party can submit a claim on your behalf, provided they have the necessary authorization and documentation.',
  },
  {
    q: 'Does this apply to UK flights under UK261?',
    a: 'Yes, UK261 mirrors EU Regulation 261/2004 and applies to flights departing from the UK or arriving in the UK on a UK carrier.',
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="faq">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>

        <div className="faq__list">
          {faqData.map((item, i) => (
            <div
              key={i}
              className={`faq__item ${openIndex === i ? 'faq__item--open' : ''}`}
            >
              <button
                className="faq__question"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{item.q}</span>
                <svg
                  className="faq__arrow"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M5 8L10 13L15 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="faq__answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq__cta">
          <a href="#" className="btn-primary">Check Your Compensation</a>
        </div>
      </div>
    </section>
  )
}

export default FAQ
