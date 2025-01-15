import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import OnboardingPage from './pages/Onboarding'
import MainPage from './pages/MainPage' // MainPage가 별도로 있을 경우 추가

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
