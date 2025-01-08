import React, { useState } from 'react'

const OnboardingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold text-blue-600">온보딩 페이지</h1>
      <div className="flex items-center justify-center gap-4 fles-col">
        <button>로그인</button>
        <button>회원가입</button>
      </div>
    </div>
  )
}

export default OnboardingPage
