import React, { useState, useEffect } from 'react'
import NodeProp from '../TypingComponents/ProfileName'
import CategoryBox from './CategorySelection'

type TypingProps = {
  isCollapsed: boolean
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>
}

const Typing: React.FC<TypingProps> = ({ isCollapsed }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태
  const [showFirstBox, setShowFirstBox] = useState(false) // 첫 번째 박스 표시 여부
  const [isExpanded, setIsExpanded] = useState(false) // 두 번째 박스 확장 상태
  const [inputValue, setInputValue] = useState('') // 입력창의 값
  const [displayText, setDisplayText] = useState('') // 표시할 텍스트

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (isLoading) {
      timeout = window.setTimeout(() => {
        setIsLoading(false)
        setIsExpanded(true) // 로딩 완료 후 두 번째 박스 표시
      }, 5000) // 5초 로딩
    }
    return () => clearTimeout(timeout)
  }, [isLoading])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setShowFirstBox(true) // 첫 번째 박스 표시
      setIsLoading(true) // 로딩 시작
      setDisplayText(inputValue) // 입력된 값을 표시할 텍스트로 설정
      setInputValue('') // 입력창 초기화
    }
  }

  const handleClose = () => {
    setShowFirstBox(false) // 첫 번째 박스 숨기기
    setIsExpanded(false) // 두 번째 박스 숨기기
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
        <div className="flex flex-col items-center justify-center ">
          <div className="mb-4 max-w-[700px] w-full">
            {/* 첫 번째 박스 */}
            {showFirstBox && (
              <div className="p-6 ml-auto mr-auto text-white transform border-2 rounded-t-lg shadow-md bg-loadingExpand/60 backdrop-blur-md border-recordColor/70">
                <div className="text-3xl">관계를 생성중입니다!</div>
                <div className="mt-2 text-md">{displayText}</div>
              </div>
            )}
            {/* 두 번째 박스 */}
            {showFirstBox && isExpanded && (
              <div className="ml-auto mr-auto overflow-hidden text-white transform border-2 rounded-b-lg shadow-md bg-loadingExpand/60 backdrop-blur-md border-recordColor/70">
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="flex justify-center mt-10 text-3xl text-white">인물</div>
                  <div className="flex flex-row items-center justify-center gap-8 overflow-x-auto snap-center">
                    <NodeProp></NodeProp>
                    <NodeProp></NodeProp>
                  </div>
                  <div className="flex flex-col items-center justify-center w-full gap-4 mt-20">
                    <div className="mb-4 text-3xl text-white">인물_:카테고리</div>
                    <CategoryBox></CategoryBox>
                  </div>
                  <div className="flex items-center justify-center mt-10 text-lg text-blue-400 cursor-pointer" onClick={handleClose}>
                    확인
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* 입력창 */}
          <div className="flex flex-row w-full gap-2">
            {isCollapsed && <div className="flex items-center mr-4 text-xl text-white transition-opacity duration-300">LOGO</div>}

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} // 입력값 업데이트
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
