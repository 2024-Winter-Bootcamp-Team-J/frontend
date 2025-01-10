import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import SideMenuBar from '../Modal/MainPageModal/SideMenu'

const MainPage: React.FC = () => {
  const canvasRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    const svg = d3
      .select<SVGSVGElement, unknown>(canvasRef.current!) // Non-Null Assertion 사용
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#232323') // 캔버스 배경색 설정
      .call(
        d3
          .zoom<SVGSVGElement, unknown>() // 줌 및 드래그 타입 지정
          .scaleExtent([0.5, 4]) // 줌 범위 설정 (0.5배 ~ 4배)
          .on('zoom', (event) => {
            g.attr('transform', event.transform) // 줌 및 드래그 적용
          }),
      )
      .on('dblclick.zoom', null) // 더블클릭 줌 비활성화

    // 그룹 요소 추가 (모든 그래픽 요소를 포함)
    const g = svg.append('g')

    // 중앙 사각형 추가 (테스트용 요소)
    const rectWidth = 200
    const rectHeight = 100

    g.append('rect')
      .attr('x', -rectWidth / 2) // 중앙 정렬
      .attr('y', -rectHeight / 2) // 중앙 정렬
      .attr('width', rectWidth)
      .attr('height', rectHeight)
      .attr('fill', '#4caf50') // 사각형 색상
      .attr('stroke', '#333') // 테두리 색상
      .attr('stroke-width', 2)

    // 초기 위치 설정 (화면 중앙으로 이동)
    svg.call(d3.zoom<SVGSVGElement, unknown>().transform, d3.zoomIdentity.translate(width / 2, height / 2))
  }, [])

  return (
    <div className="relative w-screen h-screen">
      {/* SideMenuBar */}
      <div className="absolute top-0 left-0 z-50">
        <SideMenuBar />
      </div>

      {/* D3 Canvas */}
      <svg ref={canvasRef} className="absolute top-0 left-0 z-10"></svg>
    </div>
  )
}

export default MainPage
