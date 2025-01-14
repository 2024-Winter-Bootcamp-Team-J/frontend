import React, { Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Log from '../SideMenuComponents/Log'

type SideMenuBarProps = {
  isCollapsed: boolean
  setIsCollapsed: Dispatch<SetStateAction<boolean>>
}

const SideMenuBar: React.FC<SideMenuBarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate()

  return (
    <div className="fixed flex items-center justify-start h-screen">
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            key="sidebar"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 z-10 flex flex-col h-full shadow-lg w-[300px] "
          >
            <div className="absolute inset-0 border-r-2 bg-customColor/80 backdrop-blur-md border-customColor2"></div>
            <h2 className="relative z-20 p-4 text-xl font-bold text-white">로고 위치</h2>
            <div className="z-20 mt-5 mb-4 ml-4 text-3xl text-white">기록</div>

            <div className="z-40 overflow-y-auto h-[750px] relative ">
              <Log />
              <Log />
              <Log />
              <Log />
              <Log />
            </div>

            <div className="z-20 ml-4 mb-7 justify-items-start">
              <button onClick={() => navigate('/')} className="mt-6 text-xl text-white">
                로그아웃
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        initial={{ x: 0 }}
        animate={{ x: isCollapsed ? 0 : 300 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center w-5 h-40 text-white rounded-r-lg cursor-pointer bg-customColor2"
      >
        {isCollapsed ? '>' : '<'}
      </motion.button>
    </div>
  )
}

export default SideMenuBar
