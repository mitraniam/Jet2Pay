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

function App() {
  const [page, setPage] = useState('home')

  const goToForm = () => {
    setPage('compensation')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goHome = () => {
    setPage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (page === 'compensation') {
    return (
      <>
        <Header onCheckCompensation={goToForm} />
        <CheckCompensationForm onBack={goHome} />
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header onCheckCompensation={goToForm} />
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
