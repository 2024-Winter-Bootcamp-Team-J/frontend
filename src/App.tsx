import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import OnboardingPage from './page/onboarding'
import MainPage from './page/mainPage'
import './index.css'

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
