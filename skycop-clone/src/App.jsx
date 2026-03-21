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

function App() {
  const [page, setPage] = useState('home')

  const navigate = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToForm = () => navigate('compensation')
  const goHome   = () => navigate('home')
  const goRights = () => navigate('rights')

  if (page === 'compensation') {
    return (
      <>
        <Header onCheckCompensation={goToForm} onKnowYourRights={goRights} onHome={goHome} />
        <CheckCompensationForm onBack={goHome} />
        <Footer />
      </>
    )
  }

  if (page === 'rights') {
    return (
      <>
        <Header onCheckCompensation={goToForm} onKnowYourRights={goRights} onHome={goHome} />
        <KnowYourRights onCheckCompensation={goToForm} />
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header onCheckCompensation={goToForm} onKnowYourRights={goRights} onHome={goHome} />
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
