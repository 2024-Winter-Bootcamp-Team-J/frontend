import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type LoginStatusProps = {
  onLogout: () => void
}

const LoginStatus: React.FC<LoginStatusProps> = ({ onLogout }) => {
  const navigate = useNavigate()

  const accessToken = localStorage.getItem('accessToken') // 로컬 스토리지에서 토큰 가져오기

  useEffect(() => {
    if (!accessToken) {
      navigate('/')
      alert('로그인을 해주세요.') // 토큰이 없으면 로그인 페이지로 이동
    }
  }, [accessToken, navigate])

  const handleLogout = () => {
    localStorage.removeItem('accessToken') // 토큰 삭제
    onLogout() // 로그아웃 콜백 실행
    navigate('/') // 홈 페이지로 이동
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button onClick={handleLogout} className="px-6 py-3 text-white">
        로그아웃
      </button>
    </div>
  )
}

export default LoginStatus
