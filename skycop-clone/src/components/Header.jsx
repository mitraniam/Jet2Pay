import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './Header.css'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'bg', label: 'Български', flag: '🇧🇬' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

const Header = ({ onCheckCompensation }) => {
  const { t, i18n } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    setLangOpen(false)
  }

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
              >{t('header.checkCompensation')}</a>
            </li>
            <li className="header__nav-item header__nav-item--dropdown">
              <a href="#" className="header__nav-link">{t('header.knowYourRights')}</a>
            </li>
            <li className="header__nav-item header__nav-item--dropdown">
              <a href="#" className="header__nav-link">{t('header.aboutCompany')}</a>
            </li>
            <li className="header__nav-item header__nav-item--dropdown">
              <a href="#" className="header__nav-link">{t('header.news')}</a>
            </li>
            <li className="header__nav-item">
              <a href="#" className="header__nav-link">{t('header.referAFriend')}</a>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          <a href="#" className="header__claim-btn">{t('header.checkClaimStatus')}</a>

          {/* Language Switcher */}
          <div className="header__lang" ref={langRef} onClick={() => setLangOpen(!langOpen)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#333" strokeWidth="1.5"/>
              <ellipse cx="10" cy="10" rx="4" ry="9" stroke="#333" strokeWidth="1.5"/>
              <line x1="1" y1="10" x2="19" y2="10" stroke="#333" strokeWidth="1.5"/>
            </svg>
            <span>{currentLang.code.toUpperCase()}</span>
            <svg
              width="10" height="10" viewBox="0 0 10 10" fill="none"
              style={{ marginLeft: 2, transition: 'transform 0.2s', transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path d="M2 3.5L5 6.5L8 3.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            {langOpen && (
              <div className="header__lang-dropdown">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    className={`header__lang-option${lang.code === i18n.language ? ' header__lang-option--active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); changeLanguage(lang.code) }}
                  >
                    <span className="header__lang-flag">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
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
