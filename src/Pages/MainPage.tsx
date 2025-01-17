import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SideMenuBar from '../components/MainPageComponents/SideMenu'
import Group from '../components/MainPageComponents/Groups'
import Search from '../components/MainPageComponents/Search'
import Typing from '../components/MainPageComponents/Typing'
import D3Canvas from '../components/MainPageComponents/D3'

const MainPage: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs((prevLogs) => [...prevLogs, log])
  }

  return (
    <motion.div className="relative w-screen h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div className="fixed top-0 left-0 z-40">
        <SideMenuBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} logs={logs} />
      </div>

      <div className="absolute inset-0">
        <D3Canvas />
      </div>

      <div className="fixed z-30 top-10 right-10">
        <Search />
      </div>

      <div className="fixed z-30 top-10 left-10">
        <Group isCollapsed={isCollapsed} onCategorySelect={(category) => console.log(category)} />
      </div>

      <Typing isCollapsed={isCollapsed} addLog={addLog} />
    </motion.div>
  )
}

export default MainPage
