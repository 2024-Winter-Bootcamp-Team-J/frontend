import React, { useState } from 'react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="bg-login rounded-3xl shadow-lg w-[700px] h-[460px] p-8 flex flex-col relative">
        {/* 엑스 버튼 */}
        <button onClick={onClose} className="absolute top-[20px] right-[20px] text-md text-white hover:text-white">
          X
        </button>

        {/* 모달 제목 */}
        <div className="flex justify-center w-1/2">
          <img src={Logo} alt="Logo" className="w-40 h-20 mt-4"></img>
        </div>
        {/* 메인 컨텐츠: 입력 폼과 프로필 사진 영역을 포함 */}
        <div className="flex flex-row gap-8">
          {/* 왼쪽: 입력 폼 */}
          <div className="flex flex-col items-center w-1/2">
            <form className="flex flex-col items-center w-full">
              {/* 이메일 입력 */}
              <div className="w-full">
                <input
                  type="email"
                  id="email"
                  placeholder="email"
                  className="absolute top-[165px] left-[50px] w-[280px] h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white shadow-inner"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="w-full mb-4">
                <input
                  type="password"
                  id="password"
                  placeholder="password"
                  className="absolute top-[230px] left-[50px] w-[280px] h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white shadow-inner"
                />
              </div>

              {/* 비밀번호 확인 */}
              <div className="w-full mb-6">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="repeat"
                  className="absolute top-[280px] left-[50px] w-[280px] h-[40px] p-4 rounded-lg bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300 text-white"
                />
              </div>

              {/* 회원가입 버튼 */}
              <button type="submit" className="absolute top-[390px] left-[160px] w- text-white">
                회원가입
              </button>
            </form>
          </div>

          {/* 오른쪽: 프로필 사진 업로드 영역 */}
          <div className="flex flex-col items-center w-1/2">
            {/* 동그란 이미지 미리보기 */}
            <div className="flex flex-col items-center justify-center gap-4">
              {/* 이미지가 있으면 미리보기, 없으면 기본 텍스트 */}
              {profileImage ? (
                <img src={profileImage} alt="Profile Preview" className="w-[180px] h-[180px] bg-gray-400 border-4 border-gray-500 rounded-full object-cover" />
              ) : (
                <div className="w-[180px] h-[180px] bg-gray-400 border-4 border-gray-500 rounded-full flex items-center justify-center text-white"></div>
              )}

              {/* 사진 첨부 버튼 */}
              <label htmlFor="profileUpload" className="px-4 py-2 text-white rounded-lg cursor-pointer mt-14">
                사진 첨부
              </label>
            </div>

            {/* 실제 파일 업로드 입력 (숨김 처리) */}
            <input id="profileUpload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
