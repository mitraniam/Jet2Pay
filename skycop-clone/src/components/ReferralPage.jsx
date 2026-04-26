import { useState } from 'react'
import { sendReferral } from '../lib/api'
import './ReferralPage.css'

const GiftIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="giftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8672C"/>
        <stop offset="100%" stopColor="#7B2D8E"/>
      </linearGradient>
    </defs>
    <rect x="6" y="20" width="36" height="24" rx="3" stroke="url(#giftGrad)" strokeWidth="2.5" fill="none"/>
    <rect x="4" y="14" width="40" height="8" rx="3" stroke="url(#giftGrad)" strokeWidth="2.5" fill="none"/>
    <line x1="24" y1="14" x2="24" y2="44" stroke="url(#giftGrad)" strokeWidth="2.5"/>
    <path d="M24 14C24 14 18 8 14 10C10 12 12 18 16 16C20 14 24 14 24 14Z" stroke="url(#giftGrad)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
    <path d="M24 14C24 14 30 8 34 10C38 12 36 18 32 16C28 14 24 14 24 14Z" stroke="url(#giftGrad)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" fill="#E8672C" opacity="0.12"/>
    <polyline points="5.5,10 8.5,13 14.5,7" stroke="#E8672C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const BENEFITS = [
  'Your friend gets €25 off their first claim',
  'You earn €25 for every successful referral',
  'No limit — refer as many friends as you like',
  'Paid out once the referred claim is completed',
]

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

const ReferralPage = () => {
  const [emails, setEmails] = useState([''])
  const [senderName, setSenderName] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState([])
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')

  const addEmail = () => {
    if (emails.length < 5) setEmails([...emails, ''])
  }

  const updateEmail = (i, val) => {
    const next = [...emails]
    next[i] = val
    setEmails(next)
    if (errors[i]) {
      const nextErrors = { ...errors }
      delete nextErrors[i]
      setErrors(nextErrors)
    }
  }

  const removeEmail = (i) => {
    if (emails.length === 1) return
    setEmails(emails.filter((_, idx) => idx !== i))
  }

  const validate = () => {
    const nextErrors = {}
    emails.forEach((email, i) => {
      if (!email.trim()) {
        nextErrors[i] = 'Please enter an email address.'
      } else if (!isValidEmail(email)) {
        nextErrors[i] = 'Please enter a valid email address.'
      }
    })
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalError('')
    if (!validate()) return

    setLoading(true)
    try {
      await sendReferral({ emails: emails.map(e => e.trim()), senderName: senderName.trim() })
      setSent(emails.map(e => e.trim()))
      setEmails([''])
      setSenderName('')
    } catch (err) {
      setGlobalError(err.message || 'Failed to send invitations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="referral-page">
      <div className="referral-page__hero">
        <div className="referral-page__hero-bg"></div>
        <div className="container referral-page__hero-inner">
          <div className="referral-page__hero-text">
            <div className="referral-page__badge">Refer a Friend</div>
            <h1 className="referral-page__title">
              Share Jet2Pay.<br/>
              <span>Both of you win.</span>
            </h1>
            <p className="referral-page__subtitle">
              Know someone whose flight was delayed or cancelled? Invite them to claim their compensation — and earn a reward when they do.
            </p>
            <ul className="referral-page__benefits">
              {BENEFITS.map((b, i) => (
                <li key={i} className="referral-page__benefit">
                  <CheckIcon />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="referral-page__card">
            <div className="referral-page__card-header">
              <GiftIcon />
              <h2 className="referral-page__card-title">Invite Friends</h2>
              <p className="referral-page__card-subtitle">Enter your friends' email addresses below and we'll send them a personal invitation.</p>
            </div>

            {sent.length > 0 && (
              <div className="referral-page__success">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="10" fill="#E8672C" opacity="0.15"/>
                  <polyline points="6,11 9.5,14.5 16,8" stroke="#E8672C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <strong>Invitations sent!</strong>
                  <p>We've emailed {sent.join(', ')}. They'll receive a personal invite from Jet2Pay.</p>
                </div>
              </div>
            )}

            <form className="referral-page__form" onSubmit={handleSubmit} noValidate>
              <label className="referral-page__label">Your name <span>(optional)</span></label>
              <input
                className="referral-page__input"
                type="text"
                placeholder="e.g. Maria"
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
              />

              <label className="referral-page__label" style={{ marginTop: 16 }}>
                Friend's email address{emails.length > 1 ? 'es' : ''}
              </label>

              {emails.map((email, i) => (
                <div key={i} className="referral-page__email-row">
                  <div className={`referral-page__input-wrap ${errors[i] ? 'referral-page__input-wrap--error' : ''}`}>
                    <svg className="referral-page__input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="3" width="14" height="10" rx="2" stroke="#b0b0b0" strokeWidth="1.5" fill="none"/>
                      <path d="M1 5.5L8 9.5L15 5.5" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input
                      className="referral-page__input referral-page__input--icon"
                      type="email"
                      placeholder="friend@email.com"
                      value={email}
                      onChange={e => updateEmail(i, e.target.value)}
                    />
                    {emails.length > 1 && (
                      <button type="button" className="referral-page__remove-btn" onClick={() => removeEmail(i)} aria-label="Remove">
                        &times;
                      </button>
                    )}
                  </div>
                  {errors[i] && <p className="referral-page__field-error">{errors[i]}</p>}
                </div>
              ))}

              {emails.length < 5 && (
                <button type="button" className="referral-page__add-btn" onClick={addEmail}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <line x1="7" y1="1" x2="7" y2="13" stroke="#E8672C" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="1" y1="7" x2="13" y2="7" stroke="#E8672C" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Add another email
                </button>
              )}

              {globalError && (
                <div className="referral-page__global-error">{globalError}</div>
              )}

              <button type="submit" className="referral-page__submit j2p-btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="referral-page__spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Invitation{emails.length > 1 ? 's' : ''}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8h12M10 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

              <p className="referral-page__disclaimer">
                By sending an invitation you confirm your friend's consent to receive this email. We will not store their email for marketing purposes.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="referral-page__steps container">
        <h2 className="referral-page__steps-title">How the referral program works</h2>
        <div className="referral-page__steps-grid">
          {[
            { num: '01', title: 'Invite a friend', desc: 'Enter your friend\'s email and we\'ll send them a personalised invitation.' },
            { num: '02', title: 'They submit a claim', desc: 'Your friend clicks the link and submits their flight compensation claim.' },
            { num: '03', title: 'Both of you earn', desc: 'Once their claim is paid out, you both receive a €25 reward.' },
          ].map((step) => (
            <div key={step.num} className="referral-page__step">
              <span className="referral-page__step-num">{step.num}</span>
              <h3 className="referral-page__step-title">{step.title}</h3>
              <p className="referral-page__step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ReferralPage
