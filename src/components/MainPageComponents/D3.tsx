import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import dummyData from '../../DummyData/Dummy'

type D3Node = d3.SimulationNodeDatum & {
  id: string
  group: string[]
  profile?: string
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

type Link = d3.SimulationLinkDatum<D3Node> & {
  source: string | D3Node
  target: string | D3Node
}

const D3Canvas: React.FC = () => {
  const canvasRef = useRef<SVGSVGElement | null>(null)
  const simulationRef = useRef<d3.Simulation<D3Node, Link> | null>(null)

  useEffect(() => {
    const svg = d3.select<SVGSVGElement, unknown>(canvasRef.current!).style('background-color', '#232323')
    const g = svg.append('g')

    const canvasWidth = 2000
    const canvasHeight = 2000
    svg.attr('width', canvasWidth).attr('height', canvasHeight)

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoomBehavior)

    const categoryColors: Record<string, string> = {
      친구: '#FF5733',
      지인: '#5733FF',
      게임: '#FFA500',
      가족: '#800080',
      직장: '#33FF57',
    }

    const userNodeData = dummyData.find((item) => item.name === 'User')
    if (!userNodeData) {
      console.error('User 데이터가 누락되었습니다.')
      return
    }

    const userNode: D3Node = {
      id: userNodeData.name,
      group: userNodeData.category,
      profile: userNodeData.profile,
      fx: canvasWidth / 2,
      fy: canvasHeight / 2,
    }

    const categories = Array.from(new Set(dummyData.flatMap((item) => item.category)))
    const groupNodes: D3Node[] = categories.map((category) => ({
      id: `${category}`,
      group: [category],
      x: canvasWidth / 2 + (Math.random() - 0.5) * 300,
      y: canvasHeight / 2 + (Math.random() - 0.5) * 300,
    }))

    const itemNodes: D3Node[] = dummyData
      .filter((item) => item.name !== 'User')
      .map((item) => ({
        id: item.name,
        group: item.category,
        profile: item.profile,
        x: canvasWidth / 2 + (Math.random() - 0.5) * 300,
        y: canvasHeight / 2 + (Math.random() - 0.5) * 300,
      }))

    const nodes = [userNode, ...groupNodes, ...itemNodes]

    const links: Link[] = []

    groupNodes.forEach((groupNode) => {
      links.push({ source: userNode.id, target: groupNode.id })
    })

    itemNodes.forEach((node) => {
      node.group.forEach((groupName) => {
        const groupNode = groupNodes.find((group) => group.group.includes(groupName))
        if (groupNode) {
          links.push({ source: groupNode.id, target: node.id })
        }
      })
    })

    const simulation = d3
      .forceSimulation<D3Node>(nodes)
      .force(
        'link',
        d3
          .forceLink<D3Node, Link>(links)
          .id((d) => d.id)
          .distance(400),
      )
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(canvasWidth / 2, canvasHeight / 2))
      .on('tick', () => {
        g.selectAll<SVGLineElement, Link>('.user-link')
          .attr('x1', (d) => (d.source as D3Node).x!)
          .attr('y1', (d) => (d.source as D3Node).y!)
          .attr('x2', (d) => (d.target as D3Node).x!)
          .attr('y2', (d) => (d.target as D3Node).y!)

        g.selectAll<SVGLineElement, Link>('.other-link')
          .attr('x1', (d) => (d.source as D3Node).x!)
          .attr('y1', (d) => (d.source as D3Node).y!)
          .attr('x2', (d) => (d.target as D3Node).x!)
          .attr('y2', (d) => (d.target as D3Node).y!)

        g.selectAll<SVGGElement, D3Node>('g').attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      })

    // Render User-to-Category links
    g.selectAll<SVGLineElement, Link>('.user-link')
      .data(links.filter((d) => d.source === 'User'))
      .join('line')
      .attr('class', 'user-link') // Add a class for separation
      .attr('stroke', '#FFFFFF') // All User links are white
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8)

    // Render other links
    g.selectAll<SVGLineElement, Link>('.other-link')
      .data(links.filter((d) => d.source !== 'User'))
      .join('line')
      .attr('class', 'other-link') // Add a class for separation
      .attr('stroke', (d) => {
        const sourceNode = nodes.find((node) => node.id === (d.source as D3Node).id)
        if (sourceNode && sourceNode.group.length > 0) {
          return categoryColors[sourceNode.group[0]] || '#999'
        }
        return '#999' // Default fallback color
      })
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8)

    const node = g.selectAll<SVGGElement, D3Node>('g').data(nodes).join('g').call(d3.drag<SVGGElement, D3Node>().on('start', dragstarted).on('drag', dragged).on('end', dragended))

    node.each(function (d) {
      const currentNode = d3.select<SVGGElement, D3Node>(this)

      if (d.id === 'User') {
        currentNode.append('circle').attr('r', 50).attr('fill', '#3A3A3A').attr('stroke', '#FFFFFF').attr('stroke-width', 4)

        currentNode.append('text').text(d.id).attr('y', 80).attr('text-anchor', 'middle').attr('font-size', '20px').attr('font-weight', 'bold').attr('fill', '#fff')
      } else {
        currentNode.append('circle').attr('r', 40).attr('fill', '#444444').attr('stroke', '#6C6C6C').attr('stroke-width', 2)

        if (d.profile) {
          currentNode.append('image').attr('href', d.profile).attr('width', 50).attr('height', 50).attr('x', -25).attr('y', -25)
        } else {
          currentNode.append('circle').attr('r', 35).attr('fill', '#69b3a2')
        }

        currentNode.append('text').text(d.id).attr('y', 70).attr('text-anchor', 'middle').attr('font-size', '25px').attr('fill', '#fff')
      }
    })

    simulationRef.current = simulation

    function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, node: D3Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      node.fx = event.x
      node.fy = event.y
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
      simulation.stop()
      svg.selectAll('*').remove()
    }
  }, [])

  return <svg ref={canvasRef} className="fixed top-0 left-0 z-10"></svg>
}

export default D3Canvas


//LInk 수정
// 캔버스 중앙 정렬 수정