import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import OnboardingPage from '../src/pages/onboarding'
import MainPage from './pages/mainPage'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  )
}

export default App
