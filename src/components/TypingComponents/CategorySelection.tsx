import React, { useState } from 'react'

type CategoryBoxProps = {
  categories: string[]
  selectedCategories: string[] // 다중 선택 상태 관리
  onCategorySelect: (category: string) => void
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ categories, selectedCategories, onCategorySelect }) => {
  return (
    <div className="flex flex-row items-center justify-center gap-10 mx-4 mb-4">
      {categories.map((category) => (
        <div key={category} onClick={() => onCategorySelect(category)} className="relative flex p-2 text-lg font-bold text-white transition-all duration-300 cursor-pointer">
          <div
            className={`z-50 ${selectedCategories.includes(category) ? '' : ''}`}
            style={{
              transition: 'border 0.3s ease',
            }}
          >
            {category}
          </div>
          {selectedCategories.includes(category) && <div className="absolute inset-0 bg-blue-700 rounded-full blur-lg" style={{ filter: 'blur(10px)' }} />}
        </div>
      ))}
    </div>
  )
}

export default CategoryBox
