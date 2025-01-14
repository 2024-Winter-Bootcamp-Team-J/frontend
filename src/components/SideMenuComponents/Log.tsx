import React from 'react'

const Log: React.FC = () => {
  return (
    <div className="relative z-30 visible p-4 text-white border-r-2 bg-recordColor/60 border-y-2 border-customColor2 backdrop-blur-md">
      <div className="flex justify-between">
        <div className="text-[25px] text-white mb-3">이름</div>
        <div className="mt-3 text-dateColor">24.01.35 17:00</div>
      </div>
      <div className="relative overflow-hidden leading-relaxed text-justify text-white max-h-24">
        <p className="relative z-20">오늘 인천대 앞 단토리 술집에서 동아리 종총을 했다. 새로 알게된 ㅇㅇㅇ 친구와 이야기를 나눴는데 글쌔 테커에서 ㅇㅇㅇ과 친구였어.</p>
      </div>
    </div>
  )
}

export default Log
