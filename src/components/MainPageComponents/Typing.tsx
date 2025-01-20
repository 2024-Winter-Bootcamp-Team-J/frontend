import React, { useState, useEffect } from 'react'
import NodeProp from '../TypingComponents/ProfileName'
import CategoryBox from '../TypingComponents/CategorySelection'
import { motion } from 'framer-motion'
import '../../Animation/Typing.css'

type TypingProps = {
  isCollapsed: boolean
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>
  addLog: (log: string) => void // 로그 추가 함수
}

const Typing: React.FC<TypingProps> = ({ isCollapsed, addLog }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showFirstBox, setShowFirstBox] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categories, setCategories] = useState(['친구', '가족', '게임', '지인', '직장']) // 초기 카테고리
  const [animationActive, setAnimationActive] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isFirstBoxFadingOut, setIsFirstBoxFadingOut] = useState(false)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setShowFirstBox(true)
      setIsLoading(true)
      setAnimationActive(true)
      setDisplayText(inputValue)
      setInputValue('')
    }
  }

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false)
        setIsExpanded(true)
        setAnimationActive(false) // 애니메이션 중지
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [isLoading])

  const handleClose = () => {
    setIsFirstBoxFadingOut(true)
    setIsFadingOut(true)
    setTimeout(() => {
      setShowFirstBox(false)
      setIsExpanded(false)
      setIsFadingOut(false)
      setIsFirstBoxFadingOut(false)
      addLog(displayText) // 로그 추가
    }, 500) // Fade-out 애니메이션 시간과 일치
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategories(
      (prevCategories) =>
        prevCategories.includes(category)
          ? prevCategories.filter((item) => item !== category) // 이미 선택된 카테고리면 제거
          : [...prevCategories, category], // 아니면 추가
    )
  }

  const handleCategoryAdd = (newCategory: string) => {
    setCategories((prevCategories) => [...prevCategories, newCategory])
    setSelectedCategories((prevCategories) => [...prevCategories, newCategory]) // 추가된 카테고리를 선택된 상태로 유지
    console.log('New category added:', newCategory)
  }

  return (
    <div
      className={`fixed z-20 bottom-6 flex px-4 duration-300 items-center`}
      style={{
        left: isCollapsed ? '24px' : '320px',
        right: '20px',
      }}
    >
      <div className="relative w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 max-w-[700px] w-full overflow-hidden">
            {showFirstBox && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isFirstBoxFadingOut ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`relative p-6 ml-auto mr-auto text-white transform border-2 rounded-t-lg shadow-md bg-loadingExpand/60 backdrop-blur-md border-recordColor/70 overflow-hidden animate-slide-up`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {animationActive && (
                    <>
                      <motion.div
                        key={inputValue + '-blur1'}
                        initial={{ x: -150, y: -150 }}
                        animate={{ x: [-150, 150, -150], y: [-150, -150, -150] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                        className="absolute w-[300px] h-[300px] bg-gray-400 opacity-70 rounded-full filter blur-[150px]"
                      ></motion.div>
                      <motion.div
                        key={inputValue + '-blur2'}
                        initial={{ x: 150, y: -150 }}
                        animate={{ x: [150, -150, 150], y: [-150, -150, -150] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                        className="absolute w-[250px] h-[250px] bg-white opacity-60 rounded-full filter blur-[120px]"
                      ></motion.div>
                      <motion.div
                        key={inputValue + '-blur3'}
                        initial={{ x: 0, y: 150 }}
                        animate={{ x: [0, 0, 0], y: [150, -150, 150] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 2 }}
                        className="absolute w-[200px] h-[200px] bg-gray-200 opacity-55 rounded-full filter blur-[100px]"
                      ></motion.div>
                    </>
                  )}
                </div>
                <div className="relative z-10 text-3xl">관계를 생성 중입니다!</div>
                <div className="relative z-10 mt-2 text-md">{displayText}</div>
              </motion.div>
            )}
            {showFirstBox && isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isFadingOut ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className={`ml-auto mr-auto overflow-hidden text-white transform border-2 rounded-b-lg shadow-md bg-loadingExpand/60 backdrop-blur-md border-recordColor/70`}
                style={{
                  height: 'auto',
                  paddingTop: '20px',
                }}
              >
                <motion.div initial={{ opacity: 1 }} animate={{ opacity: isFadingOut ? 0 : 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center mb-6">
                  <div className="flex justify-center mt-10 text-3xl text-white">인물</div>
                  <div className="w-full overflow-x-auto snap-center">
                    <div className="flex flex-row items-center justify-center gap-8">
                      <NodeProp />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-full gap-4 mt-20">
                    <div className="mb-4 text-3xl text-white">이름 카테고리 선택</div>
                    <CategoryBox categories={categories} selectedCategories={selectedCategories} onCategorySelect={handleCategorySelect} onCategoryAdd={handleCategoryAdd} />
                  </div>
                  <div className="flex items-center justify-center mt-10 text-lg text-blue-400 cursor-pointer" onClick={handleClose}>
                    확인
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
          <div className="flex flex-row w-full">
            {isCollapsed && <div className="flex items-center mr-6 text-xl text-white transition-opacity duration-300 sarina-regular">Linkin</div>}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isFocused ? '' : '만들고 싶은 관계를 정리해 주세요!'}
              className={`h-12 w-full px-4 text-lg shadow-md rounded-xl duration-300 bg-customColor/70 text-white backdrop-blur-md border-2 border-customColor2`}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Typing
