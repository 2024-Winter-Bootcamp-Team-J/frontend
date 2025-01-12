import React, { useState } from 'react'

type TypingProps = {
  isSidebarCollapsed: boolean
}

const Typing: React.FC<TypingProps> = ({ isSidebarCollapsed }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`fixed bottom-4 left-0 z-20 px-4 transition-all duration-300 ${isSidebarCollapsed ? 'ml-3 w-[calc(100%-20px)]' : 'ml-72 w-[calc(100%-288px)]'} shadow-md`}>
      <input
        type="text"
        placeholder={isFocused ? '' : '만들고 싶은 관계를 정리해 주세요!'}
        className={`w-full h-12 px-4 text-lg shadow-md rounded-xl transition-all duration-300 ${
          isFocused ? 'bg-customColor text-white opacity-100 backdrop-blur-none border-none' : 'bg-customColor/70 text-white opacity-80 backdrop-blur-md border-4 border-customColor2'
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}

export default Typing
