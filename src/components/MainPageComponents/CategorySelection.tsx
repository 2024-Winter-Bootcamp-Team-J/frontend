import React from 'react'

const CategoryBox: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      {/* 박스 */}
      <div className="flex items-center justify-center w-64 h-64 bg-blue-500 border-4 border-blue-700 rounded-lg shadow-lg">
        <span className="text-xl font-bold text-white">박스</span>
      </div>
    </div>
  )
}

export default CategoryBox
