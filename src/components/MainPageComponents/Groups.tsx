import React, { useState, useEffect, useRef } from 'react'

type GroupProps = {
  isCollapsed: boolean
  onCategorySelect: (category: string) => void // 새로운 prop 추가
}

const Group: React.FC<GroupProps> = ({ isCollapsed, onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const groupRef = useRef<HTMLDivElement>(null) // 참조를 사용해 외부 클릭 감지

  // 그룹 항목 데이터
  const groupItems = ['전체', '가족', '친구', '게임', '지인', '직장'] // "전체" 추가

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  // 화면 외부 클릭 감지
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (groupRef.current && !groupRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleItemClick = (category: string) => {
    onCategorySelect(category) // 선택된 카테고리를 상위 컴포넌트로 전달
    closeDropdown() // 드롭다운 닫기
  }

  return (
    <div ref={groupRef} className={`fixed transition-all duration-300 w-[300px] ${isCollapsed ? '' : 'ml-[300px]'}`}>
      {!isOpen ? (
        // 버튼 상태
        <button
          onClick={toggleDropdown}
          className="w-full px-4 py-2 text-left text-white transition-all duration-500 ease-in-out border-2 rounded-md shadow-lg border-customColor2 bg-customColor/70 backdrop-blur-md hover:bg-customColor2/70"
        >
          <div className="flex items-center justify-between">
            <span>그룹 목록</span>
            <span className="transition-transform duration-300 ease-in-out transform">▼</span>
          </div>
        </button>
      ) : (
        // 드롭다운 상태
        <div className="border-2 rounded-md shadow-lg bg-customColor2/70 border-customColor2 backdrop-blur-md">
          {groupItems.map((item, index) => (
            <div
              key={index}
              className="p-2 text-white cursor-pointer hover:bg-customColor"
              onClick={() => handleItemClick(item)} // 선택 시 카테고리 전달
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Group
