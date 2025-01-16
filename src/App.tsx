import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import OnboardingPage from './pages/Onboarding'
import MainPage from './pages/MainPage'
import Nod from './components/Nods/Nod'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/Nod" element={<Nod/>}/>
      </Routes>
    </Router>
  )
}

export default App
