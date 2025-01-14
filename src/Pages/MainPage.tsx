import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import dummyData from '../DummyData/Dummy'

import SideMenuBar from '../../src/components/MainPageComponents/SideMenu'

import Typing from '../components/MainPageComponents/Typing'
import LocationButton from '../components/MainPageComponents/locationButton'
import Group from '../components/MainPageComponents/Groups'
import Search from '../components/MainPageComponents/Search'

type D3Node = d3.SimulationNodeDatum & {
  id: string
  group: string
  profile: string
  x?: number
  y?: number
}

type Link = d3.SimulationLinkDatum<D3Node> & {
  source: string | D3Node
  target: string | D3Node
}

const MainPage: React.FC = () => {
  const canvasRef = useRef<SVGSVGElement | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [nodes, setNodes] = useState<D3Node[]>([])
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null)

  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    const svg = d3.select<SVGSVGElement, unknown>(canvasRef.current!).attr('width', width).attr('height', height).style('background-color', '#232323')

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)
    zoomRef.current = zoom

    const g = svg.append('g')
    gRef.current = g

    const initialNodes: D3Node[] = dummyData.map((item) => ({
      id: item.name,
      group: item.category[0],
      profile: item.profile,
      x: Math.random() * width,
      y: Math.random() * height,
    }))
    setNodes(initialNodes)

    const links: Link[] = []
    dummyData.forEach((item, index) => {
      item.category.forEach((cat) => {
        dummyData.forEach((otherItem, otherIndex) => {
          if (index !== otherIndex && otherItem.category.includes(cat)) {
            links.push({ source: item.name, target: otherItem.name })
          }
        })
      })
    })

    const simulation = d3
      .forceSimulation<D3Node>(initialNodes)
      .force(
        'link',
        d3
          .forceLink<D3Node, Link>(links)
          .id((d) => d.id)
          .distance(150),
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', ticked)

    const link = g.selectAll('line').data(links).enter().append('line').attr('stroke', '#999').attr('stroke-width', 1.5).attr('opacity', 0.6)

    const node = g.selectAll('g').data(initialNodes).enter().append('g').call(d3.drag<SVGGElement, D3Node>().on('start', dragstarted).on('drag', dragged).on('end', dragended))

    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d) => (d.group === '리더' ? '#ff7f0e' : '#69b3a2'))

    node
      .append('text')
      .text((d) => d.id)
      .attr('x', 25)
      .attr('y', 5)
      .attr('font-size', '12px')
      .attr('fill', '#fff')

    function ticked() {
      link
        .attr('x1', (d) => (d.source as D3Node).x ?? 0)
        .attr('y1', (d) => (d.source as D3Node).y ?? 0)
        .attr('x2', (d) => (d.target as D3Node).x ?? 0)
        .attr('y2', (d) => (d.target as D3Node).y ?? 0)

      node.attr('transform', (d) => `translate(${d.x ?? 0}, ${d.y ?? 0})`)
    }

    function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, node: D3Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      node.fx = node.x
      node.fy = node.y
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, node: D3Node) {
      node.fx = event.x
      node.fy = event.y
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, node: D3Node) {
      if (!event.active) simulation.alphaTarget(0)
      node.fx = null
      node.fy = null
    }

    return () => {
      svg.selectAll('*').remove()
      simulation.stop()
    }
  }, [])

  const moveToUserNode = () => {
    const userNode = nodes.find((node) => node.id === '이연규')
    if (userNode && gRef.current && zoomRef.current && canvasRef.current) {
      const transform = d3.zoomIdentity.translate(window.innerWidth / 2 - (userNode.x ?? 0), window.innerHeight / 2 - (userNode.y ?? 0))
      d3.select(canvasRef.current).call(zoomRef.current.transform, transform)
    }
  }

  return (
    <div className="relative w-screen h-screen">
      <div className="fixed top-0 left-0 z-40">
        <SideMenuBar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      </div>
      <svg ref={canvasRef} className="fixed top-0 left-0 z-10"></svg>
      <div className="fixed z-30 top-10 right-10">
        <Search />
      </div>
      <div className="fixed z-30 top-10 left-10">
        <Group isCollapsed={isSidebarCollapsed} />
      </div>
      <div className="fixed z-30 bottom-28 right-9">
        <LocationButton moveToUserNode={moveToUserNode} />
      </div>
      <Typing isCollapsed={isSidebarCollapsed} />
    </div>
  )
}

export default MainPage
