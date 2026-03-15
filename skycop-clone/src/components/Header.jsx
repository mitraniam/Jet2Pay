import { useState } from 'react'
import './Header.css'

const Header = ({ onCheckCompensation }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="header">
      <div className="header__inner container">
        <a href="/" className="header__logo">
          <img src="/logo.webp" alt="Jet2Pay" className="header__logo-img" />
        </a>

        <nav className={`header__nav ${mobileOpen ? 'open' : ''}`}>
          <ul className="header__nav-list">
            <li className="header__nav-item header__nav-item--cta">
              <a
                href="#"
                className="header__nav-link header__nav-link--brand"
                onClick={e => { e.preventDefault(); onCheckCompensation?.() }}
              >Check Compensation</a>
            </li>
            <li className="header__nav-item header__nav-item--dropdown">
              <a href="#" className="header__nav-link">Know Your Rights</a>
            </li>
            <li className="header__nav-item header__nav-item--dropdown">
              <a href="#" className="header__nav-link">About Company</a>
            </li>
            <li className="header__nav-item header__nav-item--dropdown">
              <a href="#" className="header__nav-link">News</a>
            </li>
            <li className="header__nav-item">
              <a href="#" className="header__nav-link">Refer a Friend</a>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          <a href="#" className="header__claim-btn">Check Claim Status</a>
          <div className="header__lang">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#333" strokeWidth="1.5"/>
              <ellipse cx="10" cy="10" rx="4" ry="9" stroke="#333" strokeWidth="1.5"/>
              <line x1="1" y1="10" x2="19" y2="10" stroke="#333" strokeWidth="1.5"/>
            </svg>
            <span>EN</span>
          </div>
          <button className="header__menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
