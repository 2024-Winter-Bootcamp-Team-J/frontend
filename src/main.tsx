import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OnboardingPage from './pages/Onboarding'
import MainPage from '../src/pages/MainPage'
import './index.css' // import './styles/global.css'
// import Nod from './components/Nods/Nod'



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/main" element={<MainPage />} />
        {/* <Route path="/nod" element={<Nod/>}/> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
