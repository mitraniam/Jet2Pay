import { useTranslation } from 'react-i18next'
import './LegalPage.css'

const LEGAL_CONTENT = {
  terms: {
    titleKey: 'legal.terms.title',
    lastUpdated: '2025-01-15',
    sections: [
      {
        heading: 'legal.terms.s1.heading',
        content: [
          { type: 'p', key: 'legal.terms.s1.p1' },
          { type: 'p', key: 'legal.terms.s1.p2' },
        ],
      },
      {
        heading: 'legal.terms.s2.heading',
        content: [
          { type: 'p', key: 'legal.terms.s2.p1' },
          {
            type: 'ul',
            items: [
              'legal.terms.s2.li1',
              'legal.terms.s2.li2',
              'legal.terms.s2.li3',
              'legal.terms.s2.li4',
            ],
          },
        ],
      },
      {
        heading: 'legal.terms.s3.heading',
        content: [
          { type: 'p', key: 'legal.terms.s3.p1' },
          { type: 'p', key: 'legal.terms.s3.p2' },
        ],
      },
      {
        heading: 'legal.terms.s4.heading',
        content: [
          { type: 'p', key: 'legal.terms.s4.p1' },
          {
            type: 'ul',
            items: [
              'legal.terms.s4.li1',
              'legal.terms.s4.li2',
              'legal.terms.s4.li3',
            ],
          },
        ],
      },
      {
        heading: 'legal.terms.s5.heading',
        content: [
          { type: 'p', key: 'legal.terms.s5.p1' },
          { type: 'p', key: 'legal.terms.s5.p2' },
        ],
      },
      {
        heading: 'legal.terms.s6.heading',
        content: [
          { type: 'p', key: 'legal.terms.s6.p1' },
          { type: 'p', key: 'legal.terms.s6.p2' },
        ],
      },
      {
        heading: 'legal.terms.s7.heading',
        content: [
          { type: 'p', key: 'legal.terms.s7.p1' },
        ],
      },
    ],
  },

  privacy: {
    titleKey: 'legal.privacy.title',
    lastUpdated: '2025-01-15',
    sections: [
      {
        heading: 'legal.privacy.s1.heading',
        content: [
          { type: 'p', key: 'legal.privacy.s1.p1' },
          { type: 'p', key: 'legal.privacy.s1.p2' },
        ],
      },
      {
        heading: 'legal.privacy.s2.heading',
        content: [
          { type: 'p', key: 'legal.privacy.s2.p1' },
          {
            type: 'ul',
            items: [
              'legal.privacy.s2.li1',
              'legal.privacy.s2.li2',
              'legal.privacy.s2.li3',
              'legal.privacy.s2.li4',
              'legal.privacy.s2.li5',
            ],
          },
        ],
      },
      {
        heading: 'legal.privacy.s3.heading',
        content: [
          { type: 'p', key: 'legal.privacy.s3.p1' },
          {
            type: 'ul',
            items: [
              'legal.privacy.s3.li1',
              'legal.privacy.s3.li2',
              'legal.privacy.s3.li3',
            ],
          },
        ],
      },
      {
        heading: 'legal.privacy.s4.heading',
        content: [
          { type: 'p', key: 'legal.privacy.s4.p1' },
          {
            type: 'ul',
            items: [
              'legal.privacy.s4.li1',
              'legal.privacy.s4.li2',
            ],
          },
        ],
      },
      {
        heading: 'legal.privacy.s5.heading',
        content: [
          { type: 'p', key: 'legal.privacy.s5.p1' },
        ],
      },
      {
        heading: 'legal.privacy.s6.heading',
        content: [
          { type: 'p', key: 'legal.privacy.s6.p1' },
          {
            type: 'ul',
            items: [
              'legal.privacy.s6.li1',
              'legal.privacy.s6.li2',
              'legal.privacy.s6.li3',
              'legal.privacy.s6.li4',
              'legal.privacy.s6.li5',
              'legal.privacy.s6.li6',
            ],
          },
        ],
      },
      {
        heading: 'legal.privacy.s7.heading',
        content: [
          { type: 'p', key: 'legal.privacy.s7.p1' },
        ],
      },
    ],
  },

  cookies: {
    titleKey: 'legal.cookies.title',
    lastUpdated: '2025-01-15',
    sections: [
      {
        heading: 'legal.cookies.s1.heading',
        content: [
          { type: 'p', key: 'legal.cookies.s1.p1' },
        ],
      },
      {
        heading: 'legal.cookies.s2.heading',
        content: [
          { type: 'p', key: 'legal.cookies.s2.p1' },
          {
            type: 'ul',
            items: [
              'legal.cookies.s2.li1',
              'legal.cookies.s2.li2',
              'legal.cookies.s2.li3',
            ],
          },
        ],
      },
      {
        heading: 'legal.cookies.s3.heading',
        content: [
          { type: 'p', key: 'legal.cookies.s3.p1' },
          {
            type: 'ul',
            items: [
              'legal.cookies.s3.li1',
              'legal.cookies.s3.li2',
            ],
          },
        ],
      },
      {
        heading: 'legal.cookies.s4.heading',
        content: [
          { type: 'p', key: 'legal.cookies.s4.p1' },
          {
            type: 'ul',
            items: [
              'legal.cookies.s4.li1',
              'legal.cookies.s4.li2',
              'legal.cookies.s4.li3',
            ],
          },
        ],
      },
      {
        heading: 'legal.cookies.s5.heading',
        content: [
          { type: 'p', key: 'legal.cookies.s5.p1' },
        ],
      },
    ],
  },

  imprint: {
    titleKey: 'legal.imprint.title',
    lastUpdated: '2025-01-15',
    sections: [
      {
        heading: 'legal.imprint.s1.heading',
        content: [
          { type: 'p', key: 'legal.imprint.s1.p1' },
          {
            type: 'ul',
            items: [
              'legal.imprint.s1.li1',
              'legal.imprint.s1.li2',
              'legal.imprint.s1.li3',
              'legal.imprint.s1.li4',
              'legal.imprint.s1.li5',
            ],
          },
        ],
      },
      {
        heading: 'legal.imprint.s2.heading',
        content: [
          { type: 'p', key: 'legal.imprint.s2.p1' },
          {
            type: 'ul',
            items: [
              'legal.imprint.s2.li1',
              'legal.imprint.s2.li2',
            ],
          },
        ],
      },
      {
        heading: 'legal.imprint.s3.heading',
        content: [
          { type: 'p', key: 'legal.imprint.s3.p1' },
        ],
      },
      {
        heading: 'legal.imprint.s4.heading',
        content: [
          { type: 'p', key: 'legal.imprint.s4.p1' },
        ],
      },
    ],
  },

  complaints: {
    titleKey: 'legal.complaints.title',
    lastUpdated: '2025-01-15',
    sections: [
      {
        heading: 'legal.complaints.s1.heading',
        content: [
          { type: 'p', key: 'legal.complaints.s1.p1' },
          {
            type: 'ul',
            items: [
              'legal.complaints.s1.li1',
              'legal.complaints.s1.li2',
              'legal.complaints.s1.li3',
            ],
          },
        ],
      },
      {
        heading: 'legal.complaints.s2.heading',
        content: [
          { type: 'p', key: 'legal.complaints.s2.p1' },
          { type: 'p', key: 'legal.complaints.s2.p2' },
        ],
      },
      {
        heading: 'legal.complaints.s3.heading',
        content: [
          { type: 'p', key: 'legal.complaints.s3.p1' },
          {
            type: 'ul',
            items: [
              'legal.complaints.s3.li1',
              'legal.complaints.s3.li2',
              'legal.complaints.s3.li3',
            ],
          },
        ],
      },
      {
        heading: 'legal.complaints.s4.heading',
        content: [
          { type: 'p', key: 'legal.complaints.s4.p1' },
        ],
      },
      {
        heading: 'legal.complaints.s5.heading',
        content: [
          { type: 'p', key: 'legal.complaints.s5.p1' },
          {
            type: 'ul',
            items: [
              'legal.complaints.s5.li1',
              'legal.complaints.s5.li2',
              'legal.complaints.s5.li3',
            ],
          },
        ],
      },
    ],
  },
}

/* Fallback English content used when translation keys are missing */
const FALLBACK = {
  terms: {
    title: 'Terms & Conditions',
    s1: {
      heading: '1. Introduction',
      p1: 'These Terms and Conditions ("Terms") govern your use of the services provided by MITRANI CONSULT EOOD ("Jet2Pay", "we", "us"), a company registered in Bulgaria under the Commercial Register of the Republic of Bulgaria. By using our services, you agree to be bound by these Terms.',
      p2: 'Jet2Pay specialises in pursuing flight compensation claims on behalf of passengers under Regulation (EC) No 261/2004 and UK Regulation 261 ("UK261"). We act as your authorised representative in claiming compensation from airlines for delayed, cancelled, or overbooked flights.',
    },
    s2: {
      heading: '2. Services & Scope',
      p1: 'Our services include the following:',
      li1: 'Assessment of your eligibility for flight compensation under EC 261/2004 and UK261',
      li2: 'Preparation and submission of compensation claims to airlines on your behalf',
      li3: 'Negotiation with airlines and, if necessary, initiation of legal proceedings through our legal partners',
      li4: 'Collection and disbursement of compensation payments to you',
    },
    s3: {
      heading: '3. Commission & Fees',
      p1: 'Jet2Pay operates on a No Win No Fee basis. Our commission is 30% (including VAT where applicable) of the total compensation amount successfully recovered. You will not be charged if your claim is unsuccessful.',
      p2: 'Payment of the commission is due upon successful collection of compensation from the airline. Jet2Pay will deduct the commission before transferring the remaining amount to you.',
    },
    s4: {
      heading: '4. Assignment of Rights & Authorisation',
      p1: 'By submitting a claim through Jet2Pay, you authorise us to act on your behalf and grant us the following rights:',
      li1: 'To communicate with the airline and relevant authorities regarding your claim',
      li2: 'To assign the claim to our legal partners for enforcement if direct negotiation is unsuccessful',
      li3: 'To receive compensation payments on your behalf and forward them to you after deducting our commission',
    },
    s5: {
      heading: '5. Claims Process & Payment Terms',
      p1: 'Once you submit your claim, we will assess its validity and contact the airline. The process typically takes between 6 and 16 weeks, though complex cases or legal proceedings may take longer.',
      p2: 'Upon successful recovery, payment will be transferred to your nominated bank account within 14 business days. You are responsible for providing accurate banking details. Jet2Pay is not liable for delays caused by incorrect information provided by you.',
    },
    s6: {
      heading: '6. Cancellation Policy & Limitation of Liability',
      p1: 'You may cancel your claim at any time before compensation has been received by Jet2Pay. If Jet2Pay has already incurred costs (e.g., legal fees), you may be liable for those costs. Cancellation requests must be submitted in writing to info@jet2pay.eu.',
      p2: 'Jet2Pay shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the amount of compensation successfully recovered for your claim.',
    },
    s7: {
      heading: '7. Governing Law',
      p1: 'These Terms are governed by and construed in accordance with the laws of the Republic of Bulgaria, without prejudice to applicable EU regulations including Regulation (EC) No 261/2004. Any disputes shall be submitted to the competent courts in Sofia, Bulgaria.',
    },
  },

  privacy: {
    title: 'Privacy Policy',
    s1: {
      heading: '1. Data Controller',
      p1: 'The data controller responsible for processing your personal data is MITRANI CONSULT EOOD (operating as "Jet2Pay"), registered in Sofia, Bulgaria.',
      p2: 'If you have any questions about how we handle your personal data, please contact our Data Protection contact at privacy@jet2pay.eu.',
    },
    s2: {
      heading: '2. Data We Collect',
      p1: 'We collect the following personal data to process your compensation claim:',
      li1: 'Full name as shown on your booking',
      li2: 'Email address and telephone number',
      li3: 'Flight details (flight number, date, departure and arrival airports)',
      li4: 'Booking reference / PNR',
      li5: 'Bank account details for payment of compensation',
    },
    s3: {
      heading: '3. Purpose & Legal Basis',
      p1: 'We process your personal data for the following purposes:',
      li1: 'Contract performance: to process and pursue your compensation claim',
      li2: 'Legitimate interest: to improve our services and communicate with you about your claim status',
      li3: 'Legal obligation: to comply with applicable tax and accounting regulations',
    },
    s4: {
      heading: '4. Data Sharing',
      p1: 'Your data may be shared with the following categories of recipients, only as necessary to pursue your claim:',
      li1: 'Airlines against which your claim is directed',
      li2: 'Legal partners and courts if legal action is required to enforce your claim',
    },
    s5: {
      heading: '5. Data Retention',
      p1: 'We retain your personal data for a period of 6 years from the conclusion of your claim. This retention period is necessary to comply with legal requirements, including tax and accounting obligations, and to defend against potential legal claims.',
    },
    s6: {
      heading: '6. Your Rights Under GDPR',
      p1: 'Under the General Data Protection Regulation (GDPR), you have the following rights:',
      li1: 'Right of access: to obtain a copy of the personal data we hold about you',
      li2: 'Right to rectification: to request correction of inaccurate data',
      li3: 'Right to erasure: to request deletion of your data (subject to legal retention requirements)',
      li4: 'Right to data portability: to receive your data in a structured, machine-readable format',
      li5: 'Right to restrict processing: to limit how we use your data',
      li6: 'Right to object: to object to processing based on legitimate interest',
    },
    s7: {
      heading: '7. Contact',
      p1: 'To exercise any of your rights or for any privacy-related enquiry, please contact us at privacy@jet2pay.eu. You also have the right to lodge a complaint with the Bulgarian Commission for Personal Data Protection (CPDP) or another relevant supervisory authority.',
    },
  },

  cookies: {
    title: 'Cookie Policy',
    s1: {
      heading: '1. What Are Cookies',
      p1: 'Cookies are small text files placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, maintaining your session, and understanding how you interact with our site.',
    },
    s2: {
      heading: '2. Essential Cookies',
      p1: 'These cookies are strictly necessary for the website to function and cannot be switched off. They include:',
      li1: 'Session cookies: to maintain your session while you navigate the site',
      li2: 'Authentication cookies: to keep you logged in to your account',
      li3: 'Security cookies: to protect against cross-site request forgery and other threats',
    },
    s3: {
      heading: '3. Analytics Cookies',
      p1: 'We use analytics cookies to understand how visitors interact with our website. All analytics data is anonymised. These include:',
      li1: 'Page view tracking: to understand which pages are most visited',
      li2: 'User journey analysis: to identify how users navigate through the claim process',
    },
    s4: {
      heading: '4. Managing Cookies',
      p1: 'You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website. Here is how to manage cookies in the most common browsers:',
      li1: 'Google Chrome: Settings > Privacy and Security > Cookies',
      li2: 'Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data',
      li3: 'Safari: Preferences > Privacy > Manage Website Data',
    },
    s5: {
      heading: '5. Third-Party Cookies',
      p1: 'We may use third-party services that set their own cookies for analytics purposes. These third parties have their own privacy policies governing the use of cookies. We do not share personal data with third-party advertisers.',
    },
  },

  imprint: {
    title: 'Imprint',
    s1: {
      heading: '1. Company Information',
      p1: 'Information in accordance with the Bulgarian Commerce Act and the E-Commerce Act:',
      li1: 'Company name: MITRANI CONSULT EOOD',
      li2: 'Managing Director: Avi Mitrani',
      li3: 'Address: Sofia, Bulgaria',
      li4: 'Email: info@jet2pay.eu',
      li5: 'Telephone: Available on request',
    },
    s2: {
      heading: '2. Registration & VAT',
      p1: 'Registration and tax details:',
      li1: 'Registered in the Commercial Register of the Republic of Bulgaria',
      li2: 'VAT identification number: Available upon request',
    },
    s3: {
      heading: '3. Regulatory Compliance',
      p1: 'MITRANI CONSULT EOOD operates in compliance with Regulation (EC) No 261/2004, the Bulgarian Consumer Protection Act, and all applicable EU consumer protection directives. Our services are governed by the laws of the Republic of Bulgaria.',
    },
    s4: {
      heading: '4. Disclaimer',
      p1: 'The information provided on this website is for general informational purposes only and does not constitute legal advice. While we strive to keep the information accurate and up to date, MITRANI CONSULT EOOD makes no warranties of any kind, express or implied, about the completeness, accuracy, or reliability of the information.',
    },
  },

  complaints: {
    title: 'Complaints Procedure',
    s1: {
      heading: '1. How to File a Complaint',
      p1: 'If you are dissatisfied with any aspect of our service, we encourage you to contact us so we can resolve the matter promptly. You can file a complaint through the following channels:',
      li1: 'Email: complaints@jet2pay.eu',
      li2: 'Post: MITRANI CONSULT EOOD, Sofia, Bulgaria',
      li3: 'Through your account dashboard on jet2pay.eu',
    },
    s2: {
      heading: '2. Response Timeframes',
      p1: 'We will acknowledge receipt of your complaint within 3 business days. Our team will investigate the matter thoroughly and provide you with a full response within 14 business days of receiving your complaint.',
      p2: 'If the investigation requires additional time (for example, if we need to consult with legal partners or airlines), we will notify you and provide an updated timeline. In no case shall the resolution exceed 30 business days.',
    },
    s3: {
      heading: '3. Escalation Process',
      p1: 'If you are not satisfied with our initial response, you may escalate your complaint through the following steps:',
      li1: 'Request a review by a senior manager by replying to the complaint response',
      li2: 'Contact the Bulgarian Commission for Consumer Protection (KZP)',
      li3: 'Use the European Online Dispute Resolution (ODR) platform at ec.europa.eu/odr',
    },
    s4: {
      heading: '4. Contact',
      p1: 'For all complaint-related matters, please write to complaints@jet2pay.eu. Please include your claim reference number (if applicable) and a detailed description of the issue so we can assist you as quickly as possible.',
    },
    s5: {
      heading: '5. External Dispute Resolution',
      p1: 'If you are unable to resolve your dispute directly with us, you may seek resolution through the following external bodies:',
      li1: 'Bulgarian Commission for Consumer Protection (KZP) - for consumer disputes within Bulgaria',
      li2: 'European Online Dispute Resolution (ODR) platform - for cross-border disputes within the EU',
      li3: 'Your national consumer protection authority if you are based in another EU member state',
    },
  },
}

function renderContentBlock(block, t, idx) {
  if (block.type === 'p') {
    return <p key={idx} className="lp__text">{t(block.key, FALLBACK[getTypeFromKey(block.key)]?.[getSectionFromKey(block.key)]?.[getFieldFromKey(block.key)] || block.key)}</p>
  }
  if (block.type === 'ul') {
    return (
      <ul key={idx} className="lp__list">
        {block.items.map((itemKey, i) => (
          <li key={i} className="lp__list-item">
            {t(itemKey, FALLBACK[getTypeFromKey(itemKey)]?.[getSectionFromKey(itemKey)]?.[getFieldFromKey(itemKey)] || itemKey)}
          </li>
        ))}
      </ul>
    )
  }
  return null
}

/* Helpers to extract fallback values from translation keys like "legal.terms.s1.p1" */
function getTypeFromKey(key) {
  const parts = key.split('.')
  return parts[1] || ''
}
function getSectionFromKey(key) {
  const parts = key.split('.')
  return parts[2] || ''
}
function getFieldFromKey(key) {
  const parts = key.split('.')
  return parts[3] || ''
}

function getFallbackValue(key) {
  const type = getTypeFromKey(key)
  const section = getSectionFromKey(key)
  const field = getFieldFromKey(key)
  return FALLBACK[type]?.[section]?.[field] || key
}

export default function LegalPage({ type = 'terms', onCheckCompensation }) {
  const { t } = useTranslation()
  const config = LEGAL_CONTENT[type]

  if (!config) return null

  const title = t(config.titleKey, FALLBACK[type]?.title || type)

  return (
    <div className="lp">
      {/* Hero */}
      <section className="lp__hero">
        <div className="container">
          <h1 className="lp__hero-title">{title}</h1>
          <p className="lp__hero-updated">
            {t('legal.lastUpdated', 'Last updated')}: {config.lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="lp__content">
        <div className="container">
          <div className="lp__body">
            {/* Disclaimer */}
            <div className="lp__disclaimer">
              <p className="lp__disclaimer-text">
                {t('legal.disclaimer', 'Note: This document contains placeholder content for demonstration purposes. Please consult a qualified legal professional before publishing any legal documents on a production website.')}
              </p>
            </div>

            {/* Sections */}
            {config.sections.map((section, sIdx) => (
              <div key={sIdx} className="lp__section">
                <h2 className="lp__section-heading">
                  {t(section.heading, getFallbackValue(section.heading))}
                </h2>
                {section.content.map((block, bIdx) =>
                  renderContentBlock(block, (key, fb) => t(key, fb || getFallbackValue(key)), bIdx)
                )}
              </div>
            ))}

            {/* CTA */}
            {onCheckCompensation && (
              <div className="lp__cta">
                <p className="lp__cta-text">
                  {t('legal.cta.text', 'Have a flight compensation claim? Check your eligibility now.')}
                </p>
                <button className="btn-primary" onClick={onCheckCompensation}>
                  {t('legal.cta.button', 'Check Compensation')}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
