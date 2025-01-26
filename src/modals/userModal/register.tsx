import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Logo from '../../assets/Logo.png'
import axios from 'axios'

interface RegisterProps {
  onClose: () => void
  openLoginModal: () => void
}

const Register: React.FC<RegisterProps> = ({ onClose, openLoginModal }) => {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleSignup = async () => {
    if (password !== repeatPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('nickname', nickname) // 닉네임 추가
      if (profileImage) {
        const response = await fetch(profileImage) // base64 데이터를 Blob으로 변환
        const blob = await response.blob()
        formData.append('profile_image', blob, 'profile_image.jpg') // 이미지 추가
      }

      const response = await axios.post('http://localhost:8000/usersregister', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(response.data)
      alert('환영합니다, 회원가입에 성공하셨습니다!')
      onClose()
      openLoginModal()
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error)
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const imageBase64 = reader.result as string
        setProfileImage(imageBase64)
        localStorage.setItem('profileImage', imageBase64)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
    >
      <div className="relative flex flex-col shadow-lg bg-login rounded-3xl">
        {/* 로고 */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <img src={Logo} alt="Logo" className="w-40 h-20 " />
        </div>

        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-[20px] right-[20px] text-md text-white hover:text-white">
          X
        </button>

        {/* 메인 컨텐츠 */}
        <div className="flex justify-between gap-10 p-4 mt-8 mb-4">
          {/* 왼쪽: 입력 폼 */}
          <div className="flex flex-col items-start w-1/2 gap-4 ml-8">
            {/* 이메일 입력 */}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className=" h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white shadow-inner"
            />

            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="name"
              className="w-full h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white shadow-inner"
            />

            {/* 비밀번호 입력 */}
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white shadow-inner"
            />

            {/* 비밀번호 확인 */}
            <input
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="repeat password"
              className="w-full h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white shadow-inner"
            />

            {/* 회원가입 텍스트 */}
            <span className="w-full h-[40px] mt-4 text-center text-white cursor-pointer hover:underline" onClick={handleSignup}>
              회원가입
            </span>
          </div>

          {/* 오른쪽: 프로필 사진 업로드 */}
          <div className="flex flex-col items-center w-1/2">
            <div className="flex flex-col items-center justify-center gap-6 mr-8 ">
              {/* 프로필 사진 */}
              {profileImage ? (
                <img src={profileImage} alt="Profile Preview" className="w-[200px] h-[200px] bg-gray-400 border-4 border-gray-500 rounded-full object-cover" />
              ) : (
                <div className="w-[200px] h-[200px] bg-gray-400 border-4 border-gray-500 rounded-full flex items-center justify-center text-white">이미지 없음</div>
              )}

              {/* 사진 첨부 텍스트 */}
              <label htmlFor="profileUpload" className="mt-3 text-white cursor-pointer hover:underline">
                사진 첨부
              </label>
            </div>

            <input id="profileUpload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Register
