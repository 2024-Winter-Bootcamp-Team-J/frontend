import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SideMenuBar from '../components/mainPageComponents/sideMenu'
import Group from '../components/mainPageComponents/groups'
import Search from '../components/mainPageComponents/search'
import Typing from '../components/mainPageComponents/typing'
import D3Canvas from '../components/mainPageComponents/d3'
import LocationButton from '../components/mainPageComponents/locationButton'

type Log = {
  createdAt: string
  name: string
  content: string
}

const MainPage: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [logs, setLogs] = useState<Log[]>([])

  const addLog = (log: Log) => {
    setLogs((prevLogs) => [...prevLogs, log])
    console.log('Log added:', log) // Optional: 로그가 추가되었음을 확인하기 위한 콘솔 출력
  }

  const moveToUserNode = () => {
    console.log('Moving to user node')
    // Add logic to move to the user node on the D3 canvas
  }

  return (
    <motion.div className="relative w-screen h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div className="fixed top-0 left-0 z-40">
        <SideMenuBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} logs={logs} />
      </div>

      <div className="absolute inset-0">
        <D3Canvas />
      </div>

      <div className="fixed z-40 top-10 right-10">
        <Search />
      </div>

      <div className="fixed z-30 top-10 left-10">
        <Group isCollapsed={isCollapsed} onCategorySelect={(category) => console.log(category)} />
      </div>

      <div className="fixed z-30 mb-4 bottom-20 right-10">
        <LocationButton moveToUserNode={moveToUserNode} />
      </div>

      <Typing isCollapsed={isCollapsed} addLog={addLog} />
    </motion.div>
  )
}

export default MainPage
