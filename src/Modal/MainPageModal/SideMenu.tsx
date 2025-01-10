import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const SideMenuBar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false) // 사이드바 상태
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center h-screen">
      {/* 메뉴바 */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isCollapsed ? -250 : 0 }} // 사이드바 애니메이션
        transition={{ duration: 0.3 }} // 애니메이션 속도
        className="flex flex-col w-64 h-full text-white bg-blue-500 shadow-lg"
      >
        <h2 className="p-4 text-xl font-bold">사이드 메뉴</h2>
        <div className="p-4 space-y-2">
          <button onClick={() => navigate('/')} className="w-full text-left">
            온보딩
          </button>
          <li>메뉴 2</li>
          <li>메뉴 3</li>
        </div>
      </motion.div>

      {/* 토글 버튼 */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        initial={{ x: 0 }}
        animate={{ x: isCollapsed ? -250 : 0 }} // 버튼도 같이 움직임
        transition={{ duration: 0.3 }} // 메뉴바와 같은 애니메이션 속도
        className="flex items-center justify-center w-5 h-40 text-white bg-gray-800 rounded-r-lg"
      >
        {isCollapsed ? '>' : '<'}
      </motion.button>
    </div>
  )
}

export default SideMenuBar
