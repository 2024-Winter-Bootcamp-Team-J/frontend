import React from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo.png'

interface LoginProps {
  onClose: () => void
  onOpenRegister: () => void
}

const Login: React.FC<LoginProps> = ({ onClose, onOpenRegister }) => {
  const navigate = useNavigate() // 페이지 이동을 위한 useNavigate

  // 엔터 키 입력 처리 함수
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      navigate('/main') // MainPage로 이동
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md">
      <div className="bg-login rounded-[30px] shadow-lg w-[350px] h-[402px] p-8 flex flex-col relative">
        <div className="flex items-center justify-center">
          <img src={Logo} alt={Logo} className="w-40 h-20"></img>
        </div>
        <button onClick={onClose} className="absolute top-[20px] right-[20px] text-sm text-white hover:text-white">
          X
        </button>
        <form className="flex flex-col items-center justify-center mt-20">
          {/* 이메일 */}
          <div className="mb-4">
            <input
              type="email"
              id="email"
              placeholder="email"
              className="absolute top-[150px] left-[40px] w-[280px] h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 shadow-inner"
            />
          </div>

          {/* 비밀번호 */}
          <div className="mb-4">
            <input
              type="password"
              id="password"
              placeholder="password"
              onKeyDown={handleKeyDown} // 엔터 키 입력 처리
              className="absolute top-[210px] left-[40px] w-[280px] h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 "
            />
          </div>
        </form>

        {/* 아이디/비번 찾기 */}
        <div className="bottom-[20px] right-[20px]">
          <button className="absolute top-[260px] left-[220px] text-xs text-gray-500 cursor-pointer">아이디/비번 찾기 〉</button>
        </div>
        {/* 회원가입 버튼 */}
        <div className="bottom-[20px] left-[20px]">
          <button onClick={onOpenRegister} className="absolute top-[340px] left-[150px] text-white text-center cursor-pointer">
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
