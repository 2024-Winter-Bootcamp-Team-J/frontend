import React, { useState, useEffect } from 'react'
import Login from '../modal/userModal/Login'
import Register from '../modal/userModal/Register'
import Logo from '../assets/Logo.png'


import OnboardingImage1 from '../assets/온보딩1.png'
import OnboardingImage2 from '../assets/온보딩2.png'
import OnboardingImage3 from '../assets/온보딩3.png'

import { motion } from 'framer-motion'

const OnboardingPage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  // 이미지와 텍스트 배열
  const slides = [
    {
      image: OnboardingImage1,
      title: '글을 타이핑하는 것만으로 관계도를 자동 형성',
      description: '\n이름과 간단한 메모를 입력하면, 자동으로 관계도가 생성됩니다.\n기억하고 싶은 사람들을 잊지 않고 기록하세요.',
    },
    {
      image: OnboardingImage2,
      title: '한눈에 보이는 나만의 관계도',
      description: '\n노드 간의 연결을 통해 관계를 시각적으로 표현합니다.\n잊기 쉬운 사람도 한눈에 기억하세요.',
    },
    {
      image: OnboardingImage3,
      title: '사람들을 그룹으로 묶어 체계적으로 관리',
      description: '\n가족,친구,동료 등 그룹별로 관계를 정리하여 쉽게 관리하세요.\n나만의 관계도 맵을 만들어 보세요.',
    },
  ]

  // 현재 슬라이드 상태 관리
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  // 현재 이미지 슬라이드 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 현재 애니메이션 방향 관리
  const [fadeDirection, setFadeDirection] = useState('in')

  // 이미지 배열
  const images = [OnboardingImage1, OnboardingImage2, OnboardingImage3]

  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  const openRegisterModal = () => {
    setIsLoginModalOpen(false) // 로그인 모달 닫기
    setIsRegisterModalOpen(true) // 회원가입 모달 열기
  }
  const closeRegisterModal = () => setIsRegisterModalOpen(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const interval = setInterval(() => {
      setFadeDirection('out') // 슬라이드 변경 전 fade-out 애니메이션 시작

      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length)
        setFadeDirection('in') // 슬라이드 변경 후 fade-in 애니메이션 시작
      }, 300) // fade-out 애니메이션 지속 시간과 일치
    }, 5000) // 5초 간격

    return () => {
      clearInterval(interval)
      document.body.style.overflow = 'auto'
    }
  }, [images.length])

  const currentSlide = slides[currentSlideIndex]

  // 이미지 애니메이션 variants 정의
  const imageVariants = {
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.95 },
  }

  // 텍스트 애니메이션 variants 정의
  const textVariants = {
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 },
  }

  return (
    <div className="flex h-screen bg-black">
      {/* 왼쪽 섹션 */}
      <div className="flex flex-col justify-center items-center w-[550px] shadow-xl bg-black">
        {/* 로고 */}
        <div className="mb-8">
          <img src={Logo} alt="Logo" className="w-40 h-20" />
        </div>
        {/* 버튼 섹션 */}
        <div className="flex flex-col items-center gap-4">
          {/* 가로로 정렬된 로그인/회원가입 버튼 */}
          <div className="flex gap-4 mb-4">
            {/* 회원가입 버튼 */}
            <button onClick={openRegisterModal} className="px-6 py-3 text-white">
              회원가입
            </button>

            {/* 작대기 */}
            <div className="py-3 text-white">|</div>

            {/* 로그인 버튼 */}
            <button onClick={openLoginModal} className="px-6 py-3 text-white">
              로그인
            </button>
          </div>

          {/* 메인 페이지 이동 버튼 */}
        </div>
      </div>

      {/* 오른쪽 섹션 */}
      <div className="relative w-full">
        {/* 이미지 애니메이션 */}
        <motion.div
          className="relative h-full transition-all duration-1000 bg-center bg-cover"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 70%, rgba(0, 0, 0, 1) 100%),  
            url(${images[currentImageIndex]})`,
          }}
          initial="out"
          animate={fadeDirection}
          variants={imageVariants}
          transition={{ duration: 0.5 }}
        ></motion.div>

        {/* 아래쪽 섹션 + 텍스트 애니메이션 */}
        <motion.div
          className="absolute bottom-0 left-0 h-[230px] w-full flex flex-col items-start justify-center z-10 mb-8"
          style={{ paddingLeft: '50px' }}
          initial="out"
          animate={fadeDirection}
          variants={textVariants}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-2 text-5xl text-white">{currentSlide.title}</h2>
          <h1 className="text-xl text-white" style={{ whiteSpace: 'pre-line' }}>
            {currentSlide.description}
          </h1>
        </motion.div>
      </div>

      {/* 로그인 모달 */}
      {isLoginModalOpen && <Login onClose={closeLoginModal} onOpenRegister={openRegisterModal} />}

      {/* 회원가입 모달 */}
      {isRegisterModalOpen && <Register onClose={closeRegisterModal} openLoginModal={openLoginModal}/>}
    </div>
  )
}

export default OnboardingPage
