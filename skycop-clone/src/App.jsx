import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation, Link } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import PressLogos from './components/PressLogos'
import WhyChoose from './components/WhyChoose'
import CompensationAmount from './components/CompensationAmount'
import HowItWorks from './components/HowItWorks'
import TravelCare from './components/TravelCare'
import FlightProblems from './components/FlightProblems'
import WhatElse from './components/WhatElse'
import FlightProtection from './components/FlightProtection'
import FAQ from './components/FAQ'
import PassengerRights from './components/PassengerRights'
import Airlines from './components/Airlines'
import Airports from './components/Airports'
import Footer from './components/Footer'
import CheckCompensationForm from './components/CheckCompensationForm'
import KnowYourRights from './components/KnowYourRights'
import ClaimStatusPage from './components/ClaimStatusPage'
import AdminDashboard from './components/AdminDashboard'
import AboutCompanyPage from './components/AboutCompanyPage'
import NewsPage from './components/NewsPage'
import FooterPages from './components/FooterPages'
import ReferralPage from './components/ReferralPage'
import LegalPage from './components/LegalPage'

/* ── Scroll to top on route change ───────────────────── */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

/* ── Per-page document title ─────────────────────────── */
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title ? `${title} | Jet2Pay` : 'Jet2Pay — Flight Compensation up to €600'
    return () => { document.title = 'Jet2Pay — Flight Compensation up to €600' }
  }, [title])
  return null
}

/* ── Shared Layout (Header + Outlet + Footer) ────────── */
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

/* ── Home page ───────────────────────────────────────── */
function HomePage() {
  return (
    <>
      <PageTitle title={null} />
      <main>
        <Hero />
        <PressLogos />
        <WhyChoose />
        <CompensationAmount />
        <HowItWorks />
        <TravelCare />
        <FlightProblems />
        <WhatElse />
        <FlightProtection />
        <FAQ />
        <PassengerRights />
        <Airlines />
        <Airports />
      </main>
    </>
  )
}

/* ── 404 page ────────────────────────────────────────── */
function NotFound() {
  return (
    <main style={{ textAlign: 'center', padding: '120px 24px', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '80px', fontWeight: 800, color: '#e2e8f0', margin: '0 0 8px' }}>404</h1>
      <h2 style={{ fontSize: '24px', color: '#2d3748', margin: '0 0 12px' }}>Page not found</h2>
      <p style={{ color: '#718096', marginBottom: '32px' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ background: '#F15A2B', color: '#fff', padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}>
        Go Home
      </Link>
    </main>
  )
}

/* ── App with Routes ─────────────────────────────────── */
function App() {
  return (
    <Routes>
      {/* Admin — no header/footer */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Main layout */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="/compensation" element={<><PageTitle title="Check Your Flight Compensation" /><CheckCompensationForm /></>} />
        <Route path="/rights" element={<><PageTitle title="Know Your Passenger Rights" /><KnowYourRights /></>} />
        <Route path="/status" element={<><PageTitle title="Check Claim Status" /><ClaimStatusPage /></>} />
        <Route path="/about" element={<><PageTitle title="About Jet2Pay" /><AboutCompanyPage /></>} />
        <Route path="/referral" element={<><PageTitle title="Refer a Friend" /><ReferralPage /></>} />
        <Route path="/news" element={<><PageTitle title="News" /><NewsPage /></>} />

        {/* Footer pages */}
        <Route path="/how-it-works" element={<><PageTitle title="How It Works" /><FooterPages type="howItWorks" /></>} />
        <Route path="/pricing" element={<><PageTitle title="Pricing" /><FooterPages type="pricing" /></>} />
        <Route path="/reviews" element={<><PageTitle title="Reviews" /><FooterPages type="reviews" /></>} />
        <Route path="/careers" element={<><PageTitle title="Careers" /><FooterPages type="careers" /></>} />
        <Route path="/partners" element={<><PageTitle title="Partners" /><FooterPages type="partners" /></>} />
        <Route path="/press" element={<><PageTitle title="Press" /><FooterPages type="press" /></>} />
        <Route path="/contact" element={<><PageTitle title="Contact Us" /><FooterPages type="contact" /></>} />

        {/* Legal pages */}
        <Route path="/terms" element={<><PageTitle title="Terms & Conditions" /><LegalPage type="terms" /></>} />
        <Route path="/privacy" element={<><PageTitle title="Privacy Policy" /><LegalPage type="privacy" /></>} />
        <Route path="/cookies" element={<><PageTitle title="Cookie Policy" /><LegalPage type="cookies" /></>} />
        <Route path="/imprint" element={<><PageTitle title="Imprint" /><LegalPage type="imprint" /></>} />
        <Route path="/complaints" element={<><PageTitle title="Complaints" /><LegalPage type="complaints" /></>} />

        <Route path="*" element={<><PageTitle title="404 Not Found" /><NotFound /></>} />
      </Route>
    </Routes>
  )
}

export default App
