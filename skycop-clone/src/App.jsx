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

  if (page === 'compensation') {
    return (
      <>
        <Header onCheckCompensation={goToForm} onKnowYourRights={goRights} onHome={goHome} onCheckStatus={goStatus} onAbout={goAbout} onNews={goNews} />
        <CheckCompensationForm onBack={goHome} />
        <Footer />
      </>
    )
  }

  if (page === 'rights') {
    return (
      <>
        <Header onCheckCompensation={goToForm} onKnowYourRights={goRights} onHome={goHome} onCheckStatus={goStatus} onAbout={goAbout} onNews={goNews} />
        <KnowYourRights onCheckCompensation={goToForm} />
        <Footer />
      </>
    )
  }

  if (page === 'admin') {
    return <AdminDashboard />
  }

  if (page === 'about') {
    return (
      <>
        <Header onCheckCompensation={goToForm} onKnowYourRights={goRights} onHome={goHome} onCheckStatus={goStatus} onAbout={goAbout} onNews={goNews} />
        <AboutCompanyPage onCheckCompensation={goToForm} />
        <Footer />
      </>
    )
  }

  if (page === 'news') {
    return (
      <>
        <Header onCheckCompensation={goToForm} onKnowYourRights={goRights} onHome={goHome} onCheckStatus={goStatus} onAbout={goAbout} onNews={goNews} />
        <NewsPage onCheckCompensation={goToForm} />
        <Footer />
      </>
    )
  }

  if (page === 'status') {
    return (
      <>
        <Header onCheckCompensation={goToForm} onKnowYourRights={goRights} onHome={goHome} onCheckStatus={goStatus} onAbout={goAbout} onNews={goNews} />
        <ClaimStatusPage />
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header onCheckCompensation={goToForm} onKnowYourRights={goRights} onHome={goHome} onCheckStatus={goStatus} />
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
      <Footer />
    </>
  )
}

export default App
