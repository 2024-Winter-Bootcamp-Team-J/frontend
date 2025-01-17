import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Logo from '../../assets/logo.png'

interface RegisterProps {
  onClose: () => void
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const imageBase64 = reader.result as string
        setProfileImage(imageBase64)

        // 로컬 스토리지에 저장
        localStorage.setItem('profileImage', imageBase64)
        console.log('저장됨')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
    >
      <div className="bg-login shadow-lg p-4 flex flex-col relative w-[600px] h-[400px] rounded-3xl">
        {/* 로고 */}
        <div className="flex items-center justify-center mt-4">
          <img src={Logo} alt="Logo" className="w-40 h-20 " />
        </div>

        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-[20px] right-[20px] text-md text-white hover:text-white">
          X
        </button>

        {/* 메인 컨텐츠 */}
        <div className="flex justify-between mt-8">
          {/* 왼쪽: 입력 폼 */}
          <div className="flex flex-col items-start w-1/2 gap-4 ml-8">
            {/* 이메일 입력 */}
            <input type="email" id="email" placeholder="email" className="w-full h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white shadow-inner" />

            {/* 비밀번호 입력 */}
            <input
              type="password"
              id="password"
              placeholder="password"
              className="w-full h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white shadow-inner"
            />

            {/* 비밀번호 확인 */}
            <input
              type="password"
              id="confirmPassword"
              placeholder="repeat password"
              className="w-full h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white shadow-inner"
            />

            {/* 회원가입 텍스트 */}
            <span
              className="w-full h-[40px] mt-4 text-center text-white cursor-pointer hover:underline"
              onClick={onClose} // 회원가입 클릭 시 모달 닫기
            >
              회원가입
            </span>
          </div>

          {/* 오른쪽: 프로필 사진 업로드 */}
          <div className="flex flex-col items-center w-1/2">
            <div className="flex flex-col items-center justify-center gap-6 ">
              {/* 프로필 사진 */}
              {profileImage ? (
                <img src={profileImage} alt="Profile Preview" className="w-[140px] h-[140px] bg-gray-400 border-4 border-gray-500 rounded-full object-cover" />
              ) : (
                <div className="w-[140px] h-[140px] bg-gray-400 border-4 border-gray-500 rounded-full flex items-center justify-center text-white">이미지 없음</div>
              )}

              {/* 사진 첨부 텍스트 */}
              <label htmlFor="profileUpload" className="mt-4 text-white cursor-pointer hover:underline">
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
