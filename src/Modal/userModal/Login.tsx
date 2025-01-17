import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../../assets/logo.png'

interface LoginProps {
  onClose: () => void
  onOpenRegister: () => void
}

const Login: React.FC<LoginProps> = ({ onClose, onOpenRegister }) => {
  const navigate = useNavigate()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isStretched, setIsStretched] = useState(false)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsAnimating(true)
      setTimeout(() => {
        setIsStretched(true)
        setTimeout(() => navigate('/main'), 2000)
      }, 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
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
                className="absolute top-[150px] left-[40px] w-[280px] h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 shadow-inner text-white"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                id="password"
                placeholder="password"
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
