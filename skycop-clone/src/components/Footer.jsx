import './Footer.css'

const Footer = () => {
  const columns = [
    {
      title: 'Know Your Rights',
      links: [
        'EU Regulation 261/2004',
        'UK Regulation UK261',
        'Flight Delay Compensation',
        'Cancelled Flight Compensation',
        'Overbooked Flight Compensation',
        'Denied Boarding',
        'Air Passenger Rights',
      ],
    },
    {
      title: 'Products',
      links: [
        'Check Compensation',
        'Travel Care',
        'Fast Payout',
        'Planned Trips',
        'eSIM',
        'Flight Scoring 2.0',
      ],
    },
    {
      title: 'About Company',
      links: [
        'About Jet2Pay',
        'How It Works',
        'Pricing',
        'Reviews',
        'Careers',
        'Partners',
        'Press',
        'Contact Us',
      ],
    },
    {
      title: 'Legal',
      links: [
        'Terms & Conditions',
        'Privacy Policy',
        'Cookie Policy',
        'Imprint',
        'Complaints',
        'Sitemap',
      ],
    },
  ]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="/" className="footer__logo">
              <img src="/logo.svg" alt="Jet2Pay" className="footer__logo-img" />
            </a>
            <p className="footer__brand-desc">
              Flight compensation made simple. We help passengers claim up to €600 for delayed, cancelled, or overbooked flights.
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
                      <a href="#" className="footer__column-link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__newsletter">
          <div className="footer__newsletter-content">
            <h4>Subscribe to our newsletter</h4>
            <p>Get the latest news and travel tips directly to your inbox.</p>
          </div>
          <div className="footer__newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; 2024 Jet2Pay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
