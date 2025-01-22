import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../../assets/logo.png'

interface LoginProps {
  onClose: () => void
  onOpenRegister: () => void
}

const Login: React.FC<LoginProps> = ({ onClose, onOpenRegister }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isStretched, setIsStretched] = useState(false)

  // 로그인 버튼 클릭 시 호출되는 함수
  const handleLogin = async () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력하세요.') // 입력 필드 확인
      return
    }

    try {
      // 로그인 API 호출
      const response = await axios.post('http://localhost:8000/userslogin', { email, password })

      console.log('API response:', response.data) // 응답 데이터 확인

      // 토큰 저장
      const accessToken = response.data.access_token
      const refreshToken = response.data.refresh_token

      console.log('Access Token:', accessToken) // 액세스 토큰 디버깅
      console.log('Refresh Token:', refreshToken) // 리프레시 토큰 디버깅

      if (!accessToken || !refreshToken) {
        alert('토큰을 확인할 수 없습니다.')
        return
      }

      localStorage.setItem('accessToken', accessToken)
      Cookies.set('refreshToken', refreshToken)

      alert('로그인 성공!')

      // 애니메이션 트리거
      setIsAnimating(true)
      setTimeout(() => {
        setIsStretched(true)
        setTimeout(() => navigate('/main'), 2000) // 메인 화면으로 이동
      }, 2000)
    } catch (error: any) {
      if (error.response) {
        console.error('API Error Response:', error.response.data) // 백엔드 오류 응답 확인
      } else {
        console.error('Unexpected Error:', error) // 기타 오류 확인
      }
      alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.') // 오류 처리
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
    >
      <div
        className={`bg-login shadow-lg p-8 flex flex-col relative transition-all duration-1000 ${
          isStretched ? 'w-full h-full rounded-none' : 'w-[350px] h-[402px] rounded-[30px]'
        } flex items-center justify-center`}
      >
        <div className={`flex items-center justify-center transition-transform duration-1000 ${isAnimating ? 'translate-y-[50px]' : 'translate-y-[-80px]'}`}>
          <img src={Logo} alt="Logo" className="w-40 h-20"></img>
        </div>
        <div className={`transition-opacity duration-1000 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <button onClick={onClose} className="absolute top-[20px] right-[20px] text-sm text-white hover:text-white">
            X
          </button>
          <form className="flex flex-col items-center justify-center mt-20">
            <div className="mb-4">
              <input
                type="email"
                id="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="absolute top-[150px] left-[40px] w-[280px] h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 shadow-inner text-white"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                id="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="absolute top-[210px] left-[40px] w-[280px] h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white shadow-inner"
              />
            </div>
          </form>

          <div className="bottom-[20px] right-[20px]">
            <button className="absolute top-[260px] left-[220px] text-xs text-gray-500 cursor-pointer ">아이디/비번 찾기 〉</button>
          </div>
          <div className="bottom-[20px] left-[20px]">
            <button onClick={onOpenRegister} className="absolute top-[340px] left-[150px] text-white text-center cursor-pointer">
              회원가입
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Login
