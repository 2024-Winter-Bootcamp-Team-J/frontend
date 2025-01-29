import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SideMenuBar from '../components/mainPageComponent/sideMenuComponent/sideMenu'
import Group from '../components/mainPageComponent/groups'
// import Search from '../components/mainPageComponent/search'
import Typing from '../components/mainPageComponent/typingComponents/typing/typing'
import D3Canvas from '../components/mainPageComponent/d3/d3'
import LocationButton from '../components/mainPageComponent/locationButton'

type Log = {
  createdAt: string;
  name: string;
  content: string;
};


const MainPage: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [logs, setLogs] = useState<Log[]>([])

  const addLog = (log: Log) => {
    console.log('Log added:', log);
    setLogs((prevLogs) => [...prevLogs, log]);
  };

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

      {/* <div className="fixed z-40 top-10 right-10">
        <Search />
      </div> */}

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
