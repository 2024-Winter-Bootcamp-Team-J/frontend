import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import SideMenuBar from '../components/MainPageComponents/SideMenu'
import Typing from '../components/MainPageComponents/Typing'

const MainPage: React.FC = () => {
  const canvasRef = useRef<SVGSVGElement | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
              g.attr('transform', event.transform)
            }),
        )
        .on('dblclick.zoom', null)

      // Clear previous content
      svg.selectAll('*').remove()

      // 그룹 요소 추가 (모든 그래픽 요소를 포함)
      const g = svg.append('g')

      // 중앙 사각형 추가 (테스트용 요소)
      const rectWidth = 200
      const rectHeight = 100

      g.append('rect')
        .attr('x', -rectWidth / 2)
        .attr('y', -rectHeight / 2)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', '#4caf50')
        .attr('stroke', '#333')
        .attr('stroke-width', 2)

      // 초기 위치 설정 (화면 중앙으로 이동)
      const initialTransform = d3.zoomIdentity.translate(width / 2, height / 2)
      svg.call(d3.zoom<SVGSVGElement, unknown>().transform, initialTransform)
      g.attr('transform', initialTransform.toString())
    }

    const handleResize = () => {
      renderCanvas() // 화면 크기 변경 시 캔버스 다시 렌더링
    }

    renderCanvas() // 초기 렌더링
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize) // 클린업
    }
  }, [])

  return (
    <div className="relative w-screen h-screen">
      {/* SideMenuBar */}
      <div className="absolute top-0 left-0 z-50">
        <SideMenuBar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      </div>

      {/* D3 Canvas */}
      <svg ref={canvasRef} className="fixed top-0 left-0 z-10"></svg>

      {/* Input Box */}
      <Typing isSidebarCollapsed={isSidebarCollapsed} />
    </div>
  )
}

export default MainPage
