import './KnowYourRights.css'

/* ── Icons ───────────────────────────────────────────────── */
const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
)
const IconClock = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
)
const IconPlane = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2a.5.5 0 00-.5.1L2 7.5a.5.5 0 00.1.7L8 12l-2 3H4l-1 1 3 2 2 3 1-1v-2l3-2 3.9 5.9a.5.5 0 00.7.1l2.2-2.3a.5.5 0 00.1-.4z"/>
  </svg>
)
const IconX = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M15 9l-6 6M9 9l6 6"/>
  </svg>
)
const IconUsers = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const IconRobot = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="12" rx="2"/>
    <path d="M12 2v6M8 2h8M9 12h.01M15 12h.01M9 16h6"/>
    <path d="M1 12h2M21 12h2"/>
  </svg>
)
const IconPercent = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19"/>
    <circle cx="6.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
)
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
const KnowYourRights = ({ onCheckCompensation }) => {
  return (
    <main className="kyr">

      {/* ── Hero ── */}
      <section className="kyr__hero">
        <div className="kyr__hero-bg" />
        <div className="container kyr__hero-inner">
          <div className="kyr__hero-badge">
            <IconShield />
            <span>EU Regulation 261/2004</span>
          </div>
          <h1 className="kyr__hero-title">
            Know Your Rights<br />
            as an <span className="kyr__gradient">Air Passenger</span>
          </h1>
          <p className="kyr__hero-sub">
            European law protects you when your flight is delayed, cancelled, or denied boarding.
            You may be entitled to up to <strong>€600</strong> in compensation — and we'll help you claim every cent.
          </p>
          <div className="kyr__hero-pills">
            <span className="kyr__pill kyr__pill--orange">✈ Flight Delays</span>
            <span className="kyr__pill kyr__pill--purple">❌ Cancellations</span>
            <span className="kyr__pill kyr__pill--green">🚫 Denied Boarding</span>
          </div>
        </div>
      </section>

      {/* ── Unique Advantage ── */}
      <section className="kyr__advantage">
        <div className="container">
          <div className="kyr__advantage-card">
            <div className="kyr__advantage-left">
              <div className="kyr__advantage-icon">
                <IconPercent />
              </div>
              <div>
                <p className="kyr__advantage-label">Our unique advantage</p>
                <h2 className="kyr__advantage-title">
                  Only <span className="kyr__gradient">15% Commission</span> —<br />
                  The Lowest in the Market
                </h2>
                <p className="kyr__advantage-text">
                  While most competitors charge <strong>25–35%</strong> of your compensation,
                  we charge just <strong>15%</strong>. This is possible because our
                  fully automated claim process eliminates unnecessary overhead — meaning
                  more money stays in <em>your</em> pocket.
                </p>
                <ul className="kyr__advantage-list">
                  <li><span className="kyr__check"><IconCheck /></span> No hidden fees — ever</li>
                  <li><span className="kyr__check"><IconCheck /></span> Only pay if you win (no win, no fee)</li>
                  <li><span className="kyr__check"><IconCheck /></span> Automated processing = faster payouts</li>
                  <li><span className="kyr__check"><IconCheck /></span> Average claim resolved in 4–8 weeks</li>
                </ul>
              </div>
            </div>
            <div className="kyr__advantage-right">
              <div className="kyr__compare">
                <p className="kyr__compare-title">Industry Commission Comparison</p>
                <div className="kyr__compare-bar-wrap">
                  <div className="kyr__compare-row">
                    <span className="kyr__compare-name kyr__compare-name--us">Jet2Pay</span>
                    <div className="kyr__compare-bar-bg">
                      <div className="kyr__compare-bar kyr__compare-bar--us" style={{ width: '30%' }}>
                        <span>15%</span>
                      </div>
                    </div>
                  </div>
                  <div className="kyr__compare-row">
                    <span className="kyr__compare-name">Competitors</span>
                    <div className="kyr__compare-bar-bg">
                      <div className="kyr__compare-bar kyr__compare-bar--them" style={{ width: '65%' }}>
                        <span>25–35%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kyr__compare-saving">
                  <strong>You keep up to €120 more</strong> on a €600 claim vs. the competition.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How Automation Helps ── */}
      <section className="kyr__auto">
        <div className="container">
          <div className="kyr__section-header">
            <h2 className="kyr__section-title">How Our Automation Saves You Money</h2>
            <p className="kyr__section-sub">Technology does the heavy lifting so you get a bigger share of your compensation.</p>
          </div>
          <div className="kyr__auto-grid">
            {[
              { icon: <IconRobot />, title: 'AI-Powered Claim Filing', text: 'Our system automatically prepares, validates and submits your claim — no paperwork, no delays.' },
              { icon: <IconClock />, title: 'Real-Time Tracking', text: 'Track every step of your claim 24/7. Automated status updates means no chasing, no waiting.' },
              { icon: <IconPercent />, title: '15% Success Fee Only', text: 'You pay nothing upfront. Our 15% fee is only charged when your compensation is won and paid.' },
              { icon: <IconUsers />, title: 'No Middlemen', text: 'We deal directly with airlines on your behalf. Fewer hands in the process means lower costs for you.' },
            ].map((item, i) => (
              <div key={i} className="kyr__auto-card">
                <div className="kyr__auto-icon">{item.icon}</div>
                <h3 className="kyr__auto-title">{item.title}</h3>
                <p className="kyr__auto-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EU 261/2004 Overview ── */}
      <section className="kyr__law">
        <div className="container">
          <div className="kyr__section-header">
            <div className="kyr__law-badge">Regulation (EC) No 261/2004</div>
            <h2 className="kyr__section-title">Your Rights Under EU Law</h2>
            <p className="kyr__section-sub">
              EU Regulation 261/2004 gives passengers on flights within, to, or from the EU strong protections
              against flight disruptions. Here's what you need to know.
            </p>
          </div>

          <div className="kyr__law-grid">
            <div className="kyr__law-card kyr__law-card--applies">
              <h3 className="kyr__law-card-title">
                <IconShield /> When Does It Apply?
              </h3>
              <ul className="kyr__law-list">
                <li><span className="kyr__check"><IconCheck /></span> Flights <strong>departing from any EU airport</strong></li>
                <li><span className="kyr__check"><IconCheck /></span> Flights <strong>arriving into an EU airport</strong> on an EU-based carrier</li>
                <li><span className="kyr__check"><IconCheck /></span> You must have a <strong>confirmed booking</strong></li>
                <li><span className="kyr__check"><IconCheck /></span> You arrived <strong>on time for check-in</strong></li>
                <li><span className="kyr__check"><IconCheck /></span> The disruption was <strong>within the airline's control</strong></li>
              </ul>
            </div>
            <div className="kyr__law-card kyr__law-card--excludes">
              <h3 className="kyr__law-card-title">
                <IconX /> Extraordinary Circumstances
              </h3>
              <p className="kyr__law-card-intro">Airlines can avoid compensation if disruption was caused by:</p>
              <ul className="kyr__law-list kyr__law-list--red">
                <li>Extreme weather events (storms, blizzards)</li>
                <li>Air traffic control strikes</li>
                <li>Security threats or political unrest</li>
                <li>Medical emergencies affecting crew</li>
              </ul>
              <p className="kyr__law-note">
                ⚠️ Airlines often misuse this clause. Our experts challenge unjustified claims.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Delay Compensation ── */}
      <section className="kyr__delays">
        <div className="container">
          <div className="kyr__section-header">
            <h2 className="kyr__section-title">
              <span className="kyr__gradient">Delay</span> Compensation
            </h2>
            <p className="kyr__section-sub">
              If you arrive at your final destination <strong>3+ hours late</strong>,
              you're entitled to fixed compensation based on flight distance.
            </p>
          </div>

          <div className="kyr__table-wrap">
            <table className="kyr__table">
              <thead>
                <tr>
                  <th>Flight Distance</th>
                  <th>Delay Required</th>
                  <th>Compensation</th>
                  <th>Example Routes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="kyr__distance">Under 1,500 km</span></td>
                  <td>3+ hours</td>
                  <td><span className="kyr__amount">€250</span></td>
                  <td>London–Paris, Sofia–Vienna</td>
                </tr>
                <tr>
                  <td><span className="kyr__distance">1,500–3,500 km</span></td>
                  <td>3+ hours</td>
                  <td><span className="kyr__amount">€400</span></td>
                  <td>London–Athens, Berlin–Cairo</td>
                </tr>
                <tr>
                  <td><span className="kyr__distance">Over 3,500 km</span></td>
                  <td>4+ hours</td>
                  <td><span className="kyr__amount kyr__amount--large">€600</span></td>
                  <td>London–New York, Paris–Dubai</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="kyr__delays-note">
            <span>💡</span>
            <p>Compensation can be <strong>reduced by 50%</strong> if the airline offers an alternative flight arriving within a certain time of the original schedule.</p>
          </div>
        </div>
      </section>

      {/* ── Cancellation Rights ── */}
      <section className="kyr__cancel">
        <div className="container">
          <div className="kyr__section-header">
            <h2 className="kyr__section-title">
              <span className="kyr__gradient">Cancellation</span> Rights
            </h2>
            <p className="kyr__section-sub">
              If your flight is cancelled, you have a choice between a <strong>full refund</strong> or
              <strong> re-routing</strong> to your destination — plus financial compensation.
            </p>
          </div>

          <div className="kyr__cancel-grid">
            <div className="kyr__cancel-card">
              <div className="kyr__cancel-icon kyr__cancel-icon--blue"><IconPlane /></div>
              <h3>Right to Re-routing</h3>
              <p>Request an alternative flight to your destination at the earliest opportunity, or at a later date of your choice, subject to availability.</p>
            </div>
            <div className="kyr__cancel-card">
              <div className="kyr__cancel-icon kyr__cancel-icon--green">💶</div>
              <h3>Right to Refund</h3>
              <p>Receive a full refund of your ticket price within 7 days, including the return flight if the cancellation makes the outward leg pointless.</p>
            </div>
            <div className="kyr__cancel-card">
              <div className="kyr__cancel-icon kyr__cancel-icon--orange"><IconPercent /></div>
              <h3>Financial Compensation</h3>
              <p>If notified less than 14 days before departure and no suitable alternative is offered, you're entitled to €250–€600 compensation.</p>
            </div>
            <div className="kyr__cancel-card">
              <div className="kyr__cancel-icon kyr__cancel-icon--purple">🍽️</div>
              <h3>Right to Care</h3>
              <p>Meals, refreshments, and hotel accommodation (if overnight stay required) must be provided by the airline during long waits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Denied Boarding ── */}
      <section className="kyr__denied">
        <div className="container">
          <div className="kyr__denied-card">
            <div className="kyr__denied-left">
              <div className="kyr__denied-icon"><IconUsers /></div>
              <h2>Denied Boarding &amp; Overbooking</h2>
              <p>
                Airlines sometimes sell more tickets than seats available (overbooking). If you are
                involuntarily denied boarding despite having a valid, confirmed ticket and arriving
                on time, you are entitled to the same compensation as a cancellation — up to <strong>€600</strong>.
              </p>
              <ul className="kyr__advantage-list">
                <li><span className="kyr__check"><IconCheck /></span> Full refund or re-routing</li>
                <li><span className="kyr__check"><IconCheck /></span> €250–€600 compensation</li>
                <li><span className="kyr__check"><IconCheck /></span> Meals &amp; refreshments while waiting</li>
                <li><span className="kyr__check"><IconCheck /></span> Hotel if overnight stay needed</li>
              </ul>
            </div>
            <div className="kyr__denied-right">
              <div className="kyr__denied-stat">
                <span className="kyr__denied-number">€600</span>
                <span className="kyr__denied-label">Max. Compensation</span>
              </div>
              <div className="kyr__denied-stat">
                <span className="kyr__denied-number">3yr</span>
                <span className="kyr__denied-label">Claim Time Limit</span>
              </div>
              <div className="kyr__denied-stat">
                <span className="kyr__denied-number">15%</span>
                <span className="kyr__denied-label">Our Commission</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="kyr__cta">
        <div className="container kyr__cta-inner">
          <div className="kyr__cta-badge">🏆 Market-leading 15% Commission</div>
          <h2 className="kyr__cta-title">Ready to Claim What You're Owed?</h2>
          <p className="kyr__cta-sub">
            Check your eligibility in under 2 minutes. No win, no fee.
            Only 15% commission — the lowest in the market.
          </p>
          <button className="kyr__cta-btn" onClick={onCheckCompensation}>
            Calculate Your Compensation
            <IconArrow />
          </button>
          <p className="kyr__cta-fine">Free check • No upfront costs • Claims up to 3 years old</p>
        </div>
      </section>

    </main>
  )
}

export default KnowYourRights
