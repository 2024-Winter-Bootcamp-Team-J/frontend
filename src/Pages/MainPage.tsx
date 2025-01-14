import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import SideMenuBar from '../modal/MainPageModal/SideMenu'
import Typing from '../components/MainPageComponents/Typing'
import LocationButton from '../components/MainPageComponents/locationButton'
import Group from '../components/MainPageComponents/Groups'
import Search from '../components/MainPageComponents/Search'
import DummyNod from '../DummyData/DummyNod'

const MainPage: React.FC = () => {
  const canvasRef = useRef<SVGSVGElement | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showDummyNod, setShowDummyNod] = useState(false)

  useEffect(() => {
    const renderCanvas = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      const svg = d3
        .select<SVGSVGElement, unknown>(canvasRef.current!)
        .attr('width', width)
        .attr('height', height)
        .style('background-color', '#232323')
        .call(
          d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 4])
            .on('zoom', (event) => {
              svg.select('g').attr('transform', event.transform)
            }),
        )
        .on('dblclick.zoom', null)

      svg.selectAll('g').remove() // 기존 요소 제거

      const g = svg.append('g')

      // D3로 클릭 가능한 박스 생성
      g.append('rect')
        .attr('x', 50)
        .attr('y', 50)
        .attr('width', 200)
        .attr('height', 100)
        .attr('fill', '#FFFFFF')
        .attr('stroke', '#333')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer') // 클릭 가능한 스타일
        .on('click', () => {
          setShowDummyNod(true) // 클릭 시 DummyNod 표시
        })
    }

    const handleResize = () => {
      renderCanvas()
    }

    renderCanvas()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="relative w-screen h-screen">
      {/* 사이드 메뉴 */}
      <div className="fixed top-0 left-0 z-50">
        <SideMenuBar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      </div>

      {/* D3 캔버스 */}
      <svg ref={canvasRef} className="fixed top-0 left-0 z-10"></svg>

      {/* DummyNod 중앙에 렌더링 */}
      {showDummyNod && (
        <div className="fixed z-40 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <DummyNod
            onClose={() => setShowDummyNod(false)} 
          />
        </div>
      )}

      {/* 검색창 */}
      <div className="fixed z-30 top-10 right-10">
        <Search />
      </div>

      {/* 그룹 컴포넌트 */}
      <div className="fixed z-30 top-10 left-10">
        <Group isCollapsed={isSidebarCollapsed} />
      </div>

      {/* 위치 버튼 */}
      <div className={`fixed bottom-28 right-9 z-30 transition-transform`}>
        <LocationButton />
      </div>

      {/* 입력창 */}
      <Typing isCollapsed={isSidebarCollapsed} />
    </div>
  )
}

export default MainPage
