import { useTranslation } from 'react-i18next'
import './Footer.css'

const Footer = ({ onNavigate }) => {
  const { t } = useTranslation()

  const handleClick = (page) => (e) => {
    e.preventDefault()
    onNavigate?.(page)
  }

  const columns = [
    {
      title: t('footer.knowYourRights', 'Know Your Rights'),
      links: [
        { label: t('footer.links.eu261', 'EU Regulation 261/2004'), page: 'rights' },
        { label: t('footer.links.uk261', 'UK Regulation UK261'), page: 'rights' },
        { label: t('footer.links.delayComp', 'Flight Delay Compensation'), page: 'rights' },
        { label: t('footer.links.cancelComp', 'Cancelled Flight Compensation'), page: 'rights' },
        { label: t('footer.links.overbookedComp', 'Overbooked Flight Compensation'), page: 'rights' },
        { label: t('footer.links.deniedBoarding', 'Denied Boarding'), page: 'rights' },
        { label: t('footer.links.passengerRights', 'Air Passenger Rights'), page: 'rights' },
      ],
    },
    {
      title: t('footer.products', 'Products'),
      links: [
        { label: t('footer.links.checkComp', 'Check Compensation'), page: 'compensation' },
        { label: t('footer.links.howItWorks', 'How It Works'), page: 'howItWorks' },
        { label: t('footer.links.pricing', 'Pricing'), page: 'pricing' },
        { label: t('footer.links.claimStatus', 'Check Claim Status'), page: 'status' },
      ],
    },
    {
      title: t('footer.aboutCompany', 'About Company'),
      links: [
        { label: t('footer.links.aboutUs', 'About Jet2Pay'), page: 'about' },
        { label: t('footer.links.reviews', 'Reviews'), page: 'reviews' },
        { label: t('footer.links.careers', 'Careers'), page: 'careers' },
        { label: t('footer.links.partners', 'Partners'), page: 'partners' },
        { label: t('footer.links.press', 'Press'), page: 'press' },
        { label: t('footer.links.contact', 'Contact Us'), page: 'contact' },
        { label: t('footer.links.news', 'News'), page: 'news' },
      ],
    },
    {
      title: t('footer.legal', 'Legal'),
      links: [
        { label: t('footer.links.terms', 'Terms & Conditions'), page: 'terms' },
        { label: t('footer.links.privacy', 'Privacy Policy'), page: 'privacy' },
        { label: t('footer.links.cookies', 'Cookie Policy'), page: 'cookies' },
        { label: t('footer.links.imprint', 'Imprint'), page: 'imprint' },
        { label: t('footer.links.complaints', 'Complaints'), page: 'complaints' },
      ],
    },
  ]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="/" className="footer__logo" onClick={handleClick('home')}>
              <img src="/logo.webp" alt="Jet2Pay" className="footer__logo-img" />
            </a>
            <p className="footer__brand-desc">
              {t('footer.description', 'Flight compensation made simple. We help passengers claim up to €600 for delayed, cancelled, or overbooked flights.')}
            </p>
            <div className="footer__social">
              {['Facebook', 'LinkedIn', 'Instagram', 'Twitter', 'YouTube', 'TikTok'].map((s) => (
                <a key={s} href="#" className="footer__social-link" title={s}>
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          <div className="footer__columns">
            {columns.map((col, i) => (
              <div key={i} className="footer__column">
                <h4 className="footer__column-title">{col.title}</h4>
                <ul className="footer__column-list">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="footer__column-link" onClick={handleClick(link.page)}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__newsletter">
          <div className="footer__newsletter-content">
            <h4>{t('footer.newsletter.title', 'Subscribe to our newsletter')}</h4>
            <p>{t('footer.newsletter.text', 'Get the latest news and travel tips directly to your inbox.')}</p>
          </div>
          <div className="footer__newsletter-form">
            <input type="email" placeholder={t('footer.newsletter.placeholder', 'Your email address')} />
            <button className="btn-primary">{t('footer.newsletter.button', 'Subscribe')}</button>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Jet2Pay. {t('footer.copyright', 'All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
