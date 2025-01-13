import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OnboardingPage from './pages/Onboarding'
import MainPage from './pages/MainPage'
import './index.css'
// import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
