import React from 'react'
import { useNavigate } from 'react-router-dom'

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold text-blue-600">온보딩 페이지</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        <button onClick={() => navigate('/login')} className="px-4 py-2 text-white bg-blue-500 rounded">
          로그인
        </button>
        <button onClick={() => navigate('/signup')} className="px-4 py-2 text-white bg-blue-500 rounded">
          회원가입
        </button>
        <button onClick={() => navigate('/main')} className="px-4 py-2 text-white bg-blue-500 rounded">
          메인페이지
        </button>
      </div>
    </div>
  )
}

export default OnboardingPage
