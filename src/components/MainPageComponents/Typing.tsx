import React, { useState } from 'react'

type TypingProps = {
  isCollapsed: boolean
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>> // 선택적으로 추가
}

const Typing: React.FC<TypingProps> = ({ isCollapsed }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div
      className={`fixed z-20 bottom-6 flex items-center px-4  duration-300`}
      style={{
        left: isCollapsed ? '24px' : '320px', // 왼쪽 위치 변경
        right: '20px', // 오른쪽 위치 고정
      }}
    >
      {isCollapsed && <div className="mr-4 text-xl text-white transition-opacity duration-300">LOGO</div>}
      <input
        type="text"
        placeholder={isFocused ? '' : '만들고 싶은 관계를 정리해 주세요!'}
        className={`w-full h-12 px-4 text-lg shadow-md rounded-xl  duration-300 bg-customColor/70 text-white backdrop-blur-md border-2 border-customColor2`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}

export default Typing
