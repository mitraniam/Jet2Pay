import { useState } from 'react'
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
import LegalPage from './components/LegalPage'

function App() {
  // Check if URL has ?admin or #admin
  const isAdmin = window.location.search.includes('admin') || window.location.hash.includes('admin')
  const [page, setPage] = useState(isAdmin ? 'admin' : 'home')

  const navigate = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToForm   = () => navigate('compensation')
  const goHome     = () => navigate('home')
  const goRights   = () => navigate('rights')
  const goStatus   = () => navigate('status')
  const goAbout    = () => navigate('about')
  const goNews     = () => navigate('news')

  // Common header + footer props
  const headerProps = {
    onCheckCompensation: goToForm,
    onKnowYourRights: goRights,
    onHome: goHome,
    onCheckStatus: goStatus,
    onAbout: goAbout,
    onNews: goNews,
  }

  const footerProps = {
    onNavigate: navigate,
  }

  // Footer page types
  const footerPageTypes = ['howItWorks', 'pricing', 'reviews', 'careers', 'partners', 'press', 'contact']
  const legalPageTypes = ['terms', 'privacy', 'cookies', 'imprint', 'complaints']

  if (page === 'admin') {
    return <AdminDashboard />
  }

  // Footer content pages
  if (footerPageTypes.includes(page)) {
    return (
      <>
        <Header {...headerProps} />
        <FooterPages type={page} onCheckCompensation={goToForm} />
        <Footer {...footerProps} />
      </>
    )
  }

  // Legal pages
  if (legalPageTypes.includes(page)) {
    return (
      <>
        <Header {...headerProps} />
        <LegalPage type={page} onCheckCompensation={goToForm} />
        <Footer {...footerProps} />
      </>
    )
  }

  if (page === 'compensation') {
    return (
      <>
        <Header {...headerProps} />
        <CheckCompensationForm onBack={goHome} />
        <Footer {...footerProps} />
      </>
    )
  }

  if (page === 'rights') {
    return (
      <>
        <Header {...headerProps} />
        <KnowYourRights onCheckCompensation={goToForm} />
        <Footer {...footerProps} />
      </>
    )
  }

  if (page === 'about') {
    return (
      <>
        <Header {...headerProps} />
        <AboutCompanyPage onCheckCompensation={goToForm} />
        <Footer {...footerProps} />
      </>
    )
  }

  if (page === 'news') {
    return (
      <>
        <Header {...headerProps} />
        <NewsPage onCheckCompensation={goToForm} />
        <Footer {...footerProps} />
      </>
    )
  }

  if (page === 'status') {
    return (
      <>
        <Header {...headerProps} />
        <ClaimStatusPage />
        <Footer {...footerProps} />
      </>
    )
  }

  return (
    <>
      <Header {...headerProps} />
      <main>
        <Hero onCheckCompensation={goToForm} />
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
      <Footer {...footerProps} />
    </>
  )
}

export default App
