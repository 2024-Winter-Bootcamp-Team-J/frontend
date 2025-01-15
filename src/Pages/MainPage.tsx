import React, { useState } from 'react'
import SideMenuBar from '../components/MainPageComponents/SideMenu'
import Group from '../components/MainPageComponents/Groups'
import Search from '../components/MainPageComponents/Search'
import Typing from '../components/MainPageComponents/Typing'
import D3Canvas from '../components/MainPageComponents/D3'

const MainPage: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="relative w-screen h-screen">
      <div className="fixed top-0 left-0 z-40">
        <SideMenuBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
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
      <Typing isCollapsed={isCollapsed} />
    </div>
  )
}

export default MainPage
