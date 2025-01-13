import React, { useState, useEffect, useRef } from 'react'

type GroupProps = {
  isCollapsed: boolean
}

const Group: React.FC<GroupProps> = ({ isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false)
  const groupRef = useRef<HTMLDivElement>(null) // 참조를 사용해 외부 클릭 감지

  // 그룹 항목 데이터
  const groupItems = ['group 1', 'group 2']

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
        <div className="bg-gray-800 border-2 rounded-md shadow-lg border-customColor2">
          {groupItems.map((item, index) => (
            <div
              key={index}
              className="p-2 text-white cursor-pointer hover:bg-gray-700"
              onClick={closeDropdown} // 클릭 시 닫기
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
