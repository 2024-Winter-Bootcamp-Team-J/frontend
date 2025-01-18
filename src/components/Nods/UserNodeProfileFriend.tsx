import React, { useState } from 'react'
import UserIcon from '../../assets/UserIcon.png'

const NodeProp: React.FC = () => {
  const [isSelected, setIsSelected] = useState(false)

  const handleSelect = () => {
    setIsSelected((prev) => !prev) // 선택 상태 토글
  }

  return (
    <div className="relative flex flex-col items-center justify-center gap-5 mt-5 snap-x">
      <div
        onClick={handleSelect}
        className={`relative rounded-full w-[90px] h-[90px] bg-customColor2 bg-center bg-cover border-2 border-white cursor-pointer transition-all duration-300 ${isSelected ? 'border-2 border-blue-400' : ''}`}
        style={{
          backgroundImage: `url(${UserIcon})`,
        }}
      >
        {/* 후광처럼 빛나는 블러 효과 */}
        {isSelected && (
          <div
            className="absolute inset-0 mx-4 bg-blue-700 rounded-full blur-lg"
            style={{
              filter: 'blur(15px)',
              zIndex: -1, // 블러 효과가 이미지 뒤에 오도록 설정
            }}
          />
        )}
      </div>
      <div className={`text-lg text-white ${isSelected ? 'text-blue-400' : ''}`}>name</div>
    </div>
  )
}

export default NodeProp
