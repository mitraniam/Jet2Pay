import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './Header.css'

const POPULAR_LANGS = ['es', 'fr', 'de', 'pt', 'it', 'nl', 'ru', 'tr']

const LANGUAGES = [
  { code: 'en', label: 'English (UK)', flag: '🇬🇧' },
  { code: 'bg', label: 'Български', flag: '🇧🇬' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português (PT)', flag: '🇵🇹' },
  { code: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'da', label: 'Dansk', flag: '🇩🇰' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'no', label: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', label: 'Suomi', flag: '🇫🇮' },
  { code: 'is', label: 'Íslenska', flag: '🇮🇸' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'cs', label: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sl', label: 'Slovenščina', flag: '🇸🇮' },
  { code: 'bs', label: 'Bosanski', flag: '🇧🇦' },
  { code: 'sr', label: 'Српски', flag: '🇷🇸' },
  { code: 'mk', label: 'Македонски', flag: '🇲🇰' },
  { code: 'sq', label: 'Shqip', flag: '🇦🇱' },
  { code: 'ca', label: 'Català', flag: '🏴' },
  { code: 'et', label: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', label: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', label: 'Lietuvių', flag: '🇱🇹' },
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'hy', label: 'Հայերեն', flag: '🇦🇲' },
  { code: 'ka', label: 'ქართული', flag: '🇬🇪' },
  { code: 'he', label: 'עברית', flag: '🇮🇱' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'zh', label: '中文 (中国)', flag: '🇨🇳' },
]

const NAV_ICONS = {
  checkCompensation: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
    </svg>
  ),
  knowYourRights: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  aboutCompany: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
    </svg>
  ),
  news: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>
    </svg>
  ),
  referAFriend: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
}

const Header = ({ onCheckCompensation, onKnowYourRights, onHome, onCheckStatus, onAbout, onNews }) => {
  const { t, i18n } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileLangOpen, setMobileLangOpen] = useState(false)
  const langRef = useRef(null)

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* Close desktop lang dropdown on outside click */
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
    setMobileLangOpen(false)
  }

  const closeMenu = () => setMobileOpen(false)

  return (
    <>
      <header className="header">
        <div className="header__inner container">
          {/* Logo */}
          <a href="/" className="header__logo" onClick={e => { e.preventDefault(); onHome?.() }}>
            <img src="/logo.webp" alt="Jet2Pay" className="header__logo-img" />
          </a>

          {/* Desktop Nav */}
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item header__nav-item--cta">
                <a href="#" className="header__nav-link header__nav-link--brand"
                  onClick={e => { e.preventDefault(); onCheckCompensation?.() }}>
                  {t('header.checkCompensation')}
                </a>
              </li>
              <li className="header__nav-item header__nav-item--dropdown">
                <a href="#" className="header__nav-link"
                  onClick={e => { e.preventDefault(); onKnowYourRights?.() }}>
                  {t('header.knowYourRights')}
                </a>
              </li>
              <li className="header__nav-item">
                <a href="#" className="header__nav-link"
                  onClick={e => { e.preventDefault(); onAbout?.() }}>
                  {t('header.aboutCompany')}
                </a>
              </li>
              <li className="header__nav-item">
                <a href="#" className="header__nav-link"
                  onClick={e => { e.preventDefault(); onNews?.() }}>
                  {t('header.news')}
                </a>
              </li>
              <li className="header__nav-item">
                <a href="#" className="header__nav-link">{t('header.referAFriend')}</a>
              </li>
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="header__actions">
            <a href="#" className="header__claim-btn" onClick={e => { e.preventDefault(); onCheckStatus?.() }}>{t('header.checkClaimStatus')}</a>

            {/* Desktop Language Switcher */}
            <div className="header__lang" ref={langRef} onClick={() => setLangOpen(!langOpen)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#333" strokeWidth="1.5"/>
                <ellipse cx="10" cy="10" rx="4" ry="9" stroke="#333" strokeWidth="1.5"/>
                <line x1="1" y1="10" x2="19" y2="10" stroke="#333" strokeWidth="1.5"/>
              </svg>
              <span>{currentLang.code.toUpperCase()}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                style={{ marginLeft: 2, transition: 'transform 0.2s', transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {langOpen && (
                <div className="header__lang-panel" onClick={e => e.stopPropagation()}>
                  <div className="header__lang-panel-header">
                    <h3 className="header__lang-panel-title">Popular Languages</h3>
                    <button className="header__lang-panel-close" onClick={() => setLangOpen(false)}>&times;</button>
                  </div>
                  <div className="header__lang-popular">
                    {LANGUAGES.filter(l => POPULAR_LANGS.includes(l.code)).map(lang => (
                      <button key={lang.code}
                        className={`header__lang-option${lang.code === i18n.language ? ' header__lang-option--active' : ''}`}
                        onClick={() => changeLanguage(lang.code)}>
                        <span className="header__lang-flag">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                  <h3 className="header__lang-panel-title" style={{ marginTop: 12 }}>Select Language</h3>
                  <div className="header__lang-grid">
                    {LANGUAGES.filter(l => !POPULAR_LANGS.includes(l.code)).map(lang => (
                      <button key={lang.code}
                        className={`header__lang-option${lang.code === i18n.language ? ' header__lang-option--active' : ''}`}
                        onClick={() => changeLanguage(lang.code)}>
                        <span className="header__lang-flag">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              className={`header__menu-toggle${mobileOpen ? ' is-open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`header__overlay${mobileOpen ? ' header__overlay--visible' : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Drawer */}
      <div className={`header__drawer${mobileOpen ? ' header__drawer--open' : ''}`}>
        {/* Drawer Header */}
        <div className="header__drawer-top">
          <img src="/logo.webp" alt="Jet2Pay" className="header__drawer-logo" />
          <button className="header__drawer-close" onClick={closeMenu} aria-label="Close menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="header__drawer-nav">
          <a href="#" className="header__drawer-link header__drawer-link--cta"
            onClick={e => { e.preventDefault(); onCheckCompensation?.(); closeMenu() }}>
            <span className="header__drawer-icon">{NAV_ICONS.checkCompensation}</span>
            {t('header.checkCompensation')}
            <span className="header__drawer-chevron">›</span>
          </a>
          <a href="#" className="header__drawer-link"
            onClick={e => { e.preventDefault(); onKnowYourRights?.(); closeMenu() }}>
            <span className="header__drawer-icon">{NAV_ICONS.knowYourRights}</span>
            {t('header.knowYourRights')}
            <span className="header__drawer-chevron">›</span>
          </a>
          <a href="#" className="header__drawer-link"
            onClick={e => { e.preventDefault(); onAbout?.(); closeMenu() }}>
            <span className="header__drawer-icon">{NAV_ICONS.aboutCompany}</span>
            {t('header.aboutCompany')}
            <span className="header__drawer-chevron">›</span>
          </a>
          <a href="#" className="header__drawer-link"
            onClick={e => { e.preventDefault(); onNews?.(); closeMenu() }}>
            <span className="header__drawer-icon">{NAV_ICONS.news}</span>
            {t('header.news')}
            <span className="header__drawer-chevron">›</span>
          </a>
          <a href="#" className="header__drawer-link"
            onClick={e => e.preventDefault()}>
            <span className="header__drawer-icon">{NAV_ICONS.referAFriend}</span>
            {t('header.referAFriend')}
            <span className="header__drawer-chevron">›</span>
          </a>
        </nav>

        {/* Divider */}
        <div className="header__drawer-divider" />

        {/* Language Switcher in Drawer */}
        <div className="header__drawer-lang-section">
          <p className="header__drawer-lang-title">Language</p>
          <div className="header__drawer-lang-grid">
            {LANGUAGES.map(lang => (
              <button key={lang.code}
                className={`header__drawer-lang-btn${lang.code === i18n.language ? ' header__drawer-lang-btn--active' : ''}`}
                onClick={() => changeLanguage(lang.code)}>
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="header__drawer-footer">
          <a href="#" className="header__drawer-cta"
            onClick={e => { e.preventDefault(); onCheckCompensation?.(); closeMenu() }}>
            {t('header.checkClaimStatus')}
          </a>
        </div>
      </div>
    </>
  )
}

export default Header
