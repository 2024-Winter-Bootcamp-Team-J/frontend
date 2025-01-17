import React, { useState, useEffect } from 'react'
import NodeProp from '../TypingComponents/ProfileName'
import CategoryBox from '../TypingComponents/CategorySelection'
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]) // 다중 카테고리 선택 상태 관리

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (isLoading) {
      timeout = setTimeout(() => {
        setIsLoading(false)
        setIsExpanded(true)
      }, 5000)
    }
    return () => clearTimeout(timeout)
  }, [isLoading])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setShowFirstBox(true)
      setIsLoading(true)
      setDisplayText(inputValue)
      setInputValue('')
    }
  }

  const handleClose = () => {
    setShowFirstBox(false)
    setIsExpanded(false)
    addLog(displayText) // 로그 추가
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategories(
      (prevCategories) =>
        prevCategories.includes(category)
          ? prevCategories.filter((item) => item !== category) // 이미 선택된 카테고리면 제거
          : [...prevCategories, category], // 아니면 추가
    )
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
              <div className={`p-6 ml-auto mr-auto text-white transform border-2 rounded-t-lg shadow-md bg-loadingExpand/60 backdrop-blur-md border-recordColor/70 overflow-hidden animate-slide-up`}>
                <div className="text-3xl">관계를 생성 중입니다!</div>
                <div className="mt-2 text-md">{displayText}</div>
              </div>
            )}
            {showFirstBox && isExpanded && (
              <div
                className={`ml-auto mr-auto overflow-hidden text-white transform border-2 rounded-b-lg shadow-md bg-loadingExpand/60 backdrop-blur-md border-recordColor/70  animate-slide-down`}
                style={{
                  height: isExpanded ? 'auto' : '0px', // 높이를 자동으로 늘려서 애니메이션 효과 주기
                  paddingTop: isExpanded ? '20px' : '0px', // 패딩을 추가해서 부드럽게 보이게
                  transition: 'height 1s ease-out, padding-top 1s ease-out',
                }}
              >
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="flex justify-center mt-10 text-3xl text-white">인물</div>
                  <div className="flex flex-row items-center justify-center gap-8 overflow-x-auto snap-center">
                    <NodeProp />
                  </div>
                  <div className="flex flex-col items-center justify-center w-full gap-4 mt-20">
                    <div className="mb-4 text-3xl text-white">이름 카테고리 선택</div>
                    <CategoryBox categories={['친구', '가족', '게임', '지인', '직장']} selectedCategories={selectedCategories} onCategorySelect={handleCategorySelect} />
                  </div>
                  <div className="flex items-center justify-center mt-10 text-lg text-blue-400 cursor-pointer" onClick={handleClose}>
                    확인
                  </div>
                </div>
              </div>
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
