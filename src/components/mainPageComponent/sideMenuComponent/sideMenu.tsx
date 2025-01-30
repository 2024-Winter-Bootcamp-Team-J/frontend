import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../../../assets/Logo.png'
import Log from '../sideMenuComponent/log'
import LoginStatus from '../../../modals/userModal/loginStatus'

type LogItem = {
  content: string
  name: string
  createdAt: string
}

type SideMenuBarProps = {
  isCollapsed: boolean
  setIsCollapsed: Dispatch<SetStateAction<boolean>>
  logs: LogItem[];  // `logs` 속성 추가
}

const SideMenuBar: React.FC<SideMenuBarProps> = ({ isCollapsed, setIsCollapsed, logs }) => {  // `logs` 속성 받기
  const [logsState, setLogsState] = useState<LogItem[]>(logs);  // 상태로 설정

  const navigate = useNavigate()

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const storedLogs = localStorage.getItem('logs')
        if (storedLogs) {
          setLogsState(JSON.parse(storedLogs))
        }
      } catch (error) {
        console.error('로그 데이터를 가져오는 중 오류 발생:', error)
      }
    }

    fetchLogs()
  }, [])

  useEffect(() => {
    if (logsState.length > 0) {
      localStorage.setItem('logs', JSON.stringify(logsState))  // 로그 데이터를 로컬스토리지에 저장
    }
  }, [logsState])

  const handleLogout = () => {
    navigate('/')
    alert('로그아웃 되었습니다.')
  }

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
            className="absolute left-0 z-10 flex flex-col h-full shadow-lg w-[300px]"
          >
            <div className="absolute inset-0 border-r-2 bg-customColor/80 backdrop-blur-md border-customColor2"></div>
            <div className="flex items-center justify-center mt-5">
              <img src={Logo} alt={Logo} className="z-50 items-center h-20 w-44"></img>
            </div>
            <div className="z-20 mb-3 ml-4 text-2xl text-white mt-7">기록</div>

            {/* 로그 출력 */}
            <div className="z-40 overflow-y-auto h-[750px] relative">
              {logsState.map((log, index) => {
                return (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
                    <Log content={log.content} name={log.name} createdAt={log.createdAt} />
                  </motion.div>
                )
              })}
            </div>

            <div className="z-20 ml-4 mt-28 justify-items-start">
              <LoginStatus onLogout={handleLogout} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        initial={{ x: 0 }}
        animate={{ x: isCollapsed ? 0 : 300 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center w-5 h-40 text-white rounded-r-lg cursor-pointer bg-customColor2 hover:bg-menuButton"
      >
        {isCollapsed ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </motion.button>
    </div>
  )
}

export default SideMenuBar
