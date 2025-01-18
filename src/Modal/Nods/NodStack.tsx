import React, { useState } from 'react'
import { useSwipeable } from 'react-swipeable'

interface CardData {
  id: number
  name: string
  profile: string
  categories: string[]
  memo: string
  time: string
}

interface SwipeableCardUIProps {
  cards: CardData[] // 카드 데이터를 props로 받음
}

const SwipeableCardUI = ({ cards }: SwipeableCardUIProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
    },
    trackMouse: true, // 마우스 드래그 활성화
  })

  if (!cards || cards.length === 0) {
    return <div className="flex items-center justify-center h-screen text-white">카드 데이터가 없습니다.</div>
  }

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-800">
      <div {...swipeHandlers} className="w-[90%] max-w-md bg-black rounded-2xl shadow-lg p-6 relative transition-transform duration-300">
        {/* 이미지 */}
        <div className="flex justify-center">
          <img src={cards[currentIndex].profile} alt="Profile" className="w-24 h-24 border-4 border-gray-600 rounded-full" />
        </div>

        {/* 이름 */}
        <h2 className="mt-4 text-2xl font-semibold text-center text-white">{cards[currentIndex].name}</h2>

        {/* 카테고리 */}
        <div className="flex justify-center gap-2 mt-4">
          {cards[currentIndex].categories.map((category, idx) => (
            <span key={idx} className="px-4 py-2 text-sm text-white bg-blue-500 rounded-full">
              {category}
            </span>
          ))}
        </div>

        {/* 수정 버튼 */}
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600">수정</button>
        </div>

        {/* 메모 */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white">메모</h3>
          <p className="mt-2 text-gray-300">{cards[currentIndex].memo}</p>
          <p className="mt-2 text-sm text-right text-gray-500">{cards[currentIndex].time}</p>
        </div>

        {/* 카드 이동 상태 */}
        <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-4 left-1/2">
          {cards.map((_, idx) => (
            <div key={idx} className={`w-2 h-2 rounded-full ${currentIndex === idx ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SwipeableCardUI
