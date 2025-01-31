import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../../assets/Logo.png'

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



  const handleLogin = async () => {
    console.log('🟡 로그인 시도:', { email, password }) // ✅ 입력된 로그인 정보 확인

    if (!email || !password) {
      console.warn('⚠️ 이메일과 비밀번호가 입력되지 않음')
      alert('이메일과 비밀번호를 모두 입력하세요.')
      return
    }

    try {

      const response = await axios.post('https://api.link-in.site/users/login', { email, password })

      console.log('🟢 서버 응답:', response.data) // ✅ 서버 응답 데이터 출력

      const { access_token, refresh_token, user_id } = response.data

      if (!access_token || !refresh_token || user_id === undefined) {
        console.error('❌ 로그인 실패: 응답 데이터 오류', response.data)
        alert('로그인 정보가 올바르지 않습니다.')
        return
      }

      console.log('🟢 로그인 성공, 저장 중...')
      // ✅ 토큰 및 user_id 저장
      localStorage.setItem('accessToken', access_token)
      localStorage.setItem('userId', user_id.toString())
      Cookies.set('refreshToken', refresh_token)



      alert('로그인 성공!')

      // ✅ 애니메이션 효과
      setIsAnimating(true)
      setTimeout(() => {
        setIsStretched(true)
        setTimeout(() => {
          console.log('🟢 메인 페이지로 이동')
          navigate('/main')
        }, 2000)
      }, 2000)
    } catch (error: any) {
      console.error('❌ 로그인 오류:', error.response?.data || error.message) // ✅ 서버 응답 오류 로그
      alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.')
    }
  }

  // 엔터 키 입력 시 로그인 실행
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
        {/* 로고 애니메이션 */}
        <div className={`flex items-center justify-center transition-transform duration-1000 ${isAnimating ? 'translate-y-[50px]' : 'translate-y-[-80px]'}`}>
          <img src={Logo} alt="Logo" className="w-40 h-20" />
        </div>

        <div className={`transition-opacity duration-1000 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <button onClick={onClose} className="absolute top-[20px] right-[20px] text-sm text-white hover:text-white">
            X
          </button>

          {/* 로그인 폼 */}
          <form className="flex flex-col items-center justify-center mt-20">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => {

                setEmail(e.target.value)
              }}
              className="absolute top-[150px] left-[40px] w-[280px] h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 shadow-inner text-white"
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => {

                setPassword(e.target.value)
              }}
              onKeyDown={handleKeyDown}
              className="absolute top-[210px] left-[40px] w-[280px] h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white shadow-inner"
            />
          </form>

          <button onClick={handleLogin} className="absolute top-[270px] left-[40px] w-[280px] h-[40px] bg-blue-500 text-white rounded-lg shadow-md">
            로그인
          </button>

          {/* 비밀번호 찾기 */}
          <button className="absolute top-[320px] left-[220px] text-xs text-gray-500 cursor-pointer">아이디/비번 찾기 〉</button>

          {/* 회원가입 */}
          <button onClick={onOpenRegister} className="absolute top-[340px] left-[150px] text-white text-center cursor-pointer">
            회원가입
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Login
