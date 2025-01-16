import React from 'react'

const CategoryBox: React.FC = () => {
  return (
    <div className='flex flex-row items-center justify-center gap-10'>
      <div className="text-lg font-bold text-white cursor-pointer">친구</div>
      <div className="text-lg font-bold text-white cursor-pointer">가족</div>
      <div className="text-lg font-bold text-white cursor-pointer">게임</div>
      <div className="text-lg font-bold text-white cursor-pointer">지인</div>
      <div className="text-lg font-bold text-white cursor-pointer">직장</div>
    </div>
  )
}

export default CategoryBox
