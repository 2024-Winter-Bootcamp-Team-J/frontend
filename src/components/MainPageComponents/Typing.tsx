import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryBox from './CategorySelection'

type TypingProps = {
  isCollapsed: boolean
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>
}

const Typing: React.FC<TypingProps> = ({ isCollapsed }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const circleVariants = {
    animate: {
      x: [0, 50, -50, 0],
      y: [0, -50, 50, 0],
      opacity: [0.2, 0.3, 0.2],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const loadingBoxVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeInOut' } },
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsLoading(true)
    }
  }

  return (
    <div
      className={`fixed z-20 bottom-6 flex px-4 duration-300 items-center`}
      style={{
        left: isCollapsed ? '24px' : '320px',
        right: '20px',
      }}
    >
      {isCollapsed && <div className="flex items-center mr-4 text-xl text-white transition-opacity duration-300">LOGO</div>}

      {/* 입력창 및 로딩 상태 */}
      <div className="relative w-full">
        <div className="flex flex-col items-center gap-4">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="flex flex-col items-start justify-start max-w-full p-4 overflow-hidden text-white transform border-4 rounded-lg shadow-md bg-loading/60 backdrop-blur-md border-recordColor/70"
                style={{
                  top: '-140px',
                  transform: 'translate(-50%, 0)',
                }}
                variants={loadingBoxVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* 텍스트 영역 */}
                <div className="z-10 flex flex-col w-full gap-2">
                  {/* 텍스트와 시간 영역 */}
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="text-2xl break-words animate-pulse">관계를 생성중입니다!</div>
                    <div className="text-sm text-white">2025-01-14 14:00</div>
                  </div>
                  <div className="break-words whitespace-pre-line text-md">
                    대충 입력창으로 입력한 내용이 여기에 표시됩니다. 텍스트가 길어지면 아래로 늘어납니다. 예를 들어, 아주 긴 텍스트를 입력해도 문제없습니다. 한 줄로 처리되지 않고 적절히 아래로
                    내려갑니다.
                  </div>
                </div>

                {/* Blur 원들 */}
                <div className="absolute inset-0 flex items-center justify-center ">
                  <motion.div className="absolute w-48 h-48 bg-gray-200 rounded-full opacity-30 blur-xl" variants={circleVariants} animate="animate"></motion.div>
                  <motion.div className="absolute w-56 h-56 bg-gray-300 rounded-full opacity-20 blur-2xl" variants={circleVariants} animate="animate"></motion.div>
                  <motion.div className="absolute w-64 h-64 bg-gray-200 rounded-full opacity-25 blur-3xl" variants={circleVariants} animate="animate"></motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 기존 입력창 */}
          <input
            type="text"
            placeholder={isFocused ? '' : '만들고 싶은 관계를 정리해 주세요!'}
            className={`w-full h-12 px-4 text-lg shadow-md rounded-xl duration-300 bg-customColor/70 text-white backdrop-blur-md border-2 border-customColor2`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  )
}

export default Typing
