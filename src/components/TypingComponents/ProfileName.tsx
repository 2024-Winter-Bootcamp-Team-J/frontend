import React, { useState } from 'react'
import UserIcon from '../../assets/UserIcon.png'

const NodeProp: React.FC = () => {
  const [isSelected, setIsSelected] = useState(false)

  const handleSelect = () => {
    setIsSelected((prev) => !prev) // 선택 상태 토글
  }

  return (
    <div className="relative flex flex-col items-center justify-center gap-5 mx-4 mt-5 snap-x">
      <div className="flex items-center justify-center">
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
              className="absolute -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full top-1/2 left-1/2 blur-lg"
              style={{
                width: '100px',
                height: '100px',
                filter: 'blur(15px)',
                zIndex: -1, // 블러 효과가 이미지 뒤에 오도록 설정
              }}
            />
          )}
        </div>
      </div>
      <div className={`text-lg text-white ${isSelected ? 'text-blue-400' : ''}`}>name</div>
    </div>
  )
}

export default NodeProp


//받아오는 데이터 -> GET
//node_id
//name

//CategoryBox로 전달
//node_id 전달
//name 전달

//categoryBox
//받아온 데이터에 데이터 추가
//

//부모 컨포너트로 전달
//API 연동 -> POST