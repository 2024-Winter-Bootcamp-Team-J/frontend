import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import dummyData from '../../DummyData/Dummy'
import Nod from '../../modal/Nods/Nod'
import UserNod from '../../modal/Nods/UserNod' // UserNod 컴포넌트 추가

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
  const [selectedNode, setSelectedNode] = useState<D3Node | null>(null) // State for other node modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false) // UserNod 모달 상태 관리

  useEffect(() => {
    const svg = d3.select<SVGSVGElement, unknown>(canvasRef.current!).style('background-color', '#232323')
    const g = svg.append('g')

    const canvasWidth = 2000
    const canvasHeight = 2000
    svg.attr('width', canvasWidth).attr('height', canvasHeight)

    // Initialize zoom behavior
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4]) // Zoom limits
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    // Apply zoom behavior to SVG
    svg.call(zoomBehavior)

    // Center the canvas on initial render
    const initialTransform = d3.zoomIdentity.translate(window.innerWidth / 2 - canvasWidth / 2, window.innerHeight / 2 - canvasHeight / 2)
    svg.call(zoomBehavior.transform, initialTransform)

    // Define the independent User node
    const userNode: D3Node = {
      id: 'User',
      group: ['user'], // User's group
      profile: localStorage.getItem('profileImage') || '/path/to/default-profile.png', // User's profile image
      fx: canvasWidth / 2, // Fix User node at canvas center (x-coordinate)
      fy: canvasHeight / 2, // Fix User node at canvas center (y-coordinate)
    }

    // Extract unique categories from dummyData
    const categories = Array.from(new Set(dummyData.flatMap((item) => item.category)))

    // Create group nodes for categories
    const groupNodes: D3Node[] = categories.map((category) => ({
      id: category,
      group: [category],
      x: canvasWidth / 2 + (Math.random() - 0.5) * 300,
      y: canvasHeight / 2 + (Math.random() - 0.5) * 300,
    }))

    // Create item nodes from dummyData
    const itemNodes: D3Node[] = dummyData.map((item) => ({
      id: item.name,
      group: item.category,
      profile: item.profile,
      x: canvasWidth / 2 + (Math.random() - 0.5) * 300,
      y: canvasHeight / 2 + (Math.random() - 0.5) * 300,
    }))

    // Combine all nodes
    const nodes = [userNode, ...groupNodes, ...itemNodes]

    const links: Link[] = []

    // Link User to all group nodes
    groupNodes.forEach((groupNode) => {
      links.push({ source: userNode.id, target: groupNode.id })
    })

    // Link group nodes to their respective item nodes
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
          .distance(300),
      )
      .force('charge', d3.forceManyBody().strength(-1700))
      .force('center', d3.forceCenter(canvasWidth / 2, canvasHeight / 2)) // Center the simulation
      .on('tick', () => {
        g.selectAll<SVGLineElement, Link>('.link')
          .attr('x1', (d) => (d.source as D3Node).x!)
          .attr('y1', (d) => (d.source as D3Node).y!)
          .attr('x2', (d) => (d.target as D3Node).x!)
          .attr('y2', (d) => (d.target as D3Node).y!)

        g.selectAll<SVGGElement, D3Node>('g').attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      })

    g.selectAll<SVGLineElement, Link>('.link').data(links).join('line').attr('class', 'link').attr('stroke', '#037EC8').attr('stroke-width', 1.5).attr('opacity', 0.8)

    const node = g
      .selectAll<SVGGElement, D3Node>('g')
      .data(nodes)
      .join('g')
      .on('click', (_event, d) => {
        if (d.id === 'User') {
          console.log('User node clicked')
          setIsUserModalOpen(true) // Open UserNod modal
          return
        }

        // Prevent interaction with group nodes
        if (categories.includes(d.id)) {
          console.log('Group node clicked')
          return
        }

        console.log('Node clicked:', d)
        setSelectedNode(d) // Open Nod modal for other nodes
      })
      .call(d3.drag<SVGGElement, D3Node>().on('start', dragstarted).on('drag', dragged).on('end', dragended))

    node.each(function (d) {
      const currentNode = d3.select<SVGGElement, D3Node>(this)

      if (d.id === 'User') {
        currentNode.append('circle').attr('r', 80).attr('fill', '#3A3A3A').attr('stroke', '#FFFFFF').attr('stroke-width', 4)

        currentNode.append('text').text(d.id).attr('y', 150).attr('text-anchor', 'middle').attr('font-size', '30px').attr('font-weight', 'bold').attr('fill', '#fff')
      } else if (categories.includes(d.id)) {
        currentNode.append('circle').attr('r', 70).attr('stroke', '#037EC8').attr('stroke-width', 2).attr('fill', '#037EC8')

        currentNode.append('text').text(d.id).attr('y', 100).attr('text-anchor', 'middle').attr('font-size', '30px').attr('fill', '#fff')
      } else {
        currentNode.append('circle').attr('r', 60).attr('fill', '#037EC8')

        if (d.profile) {
          currentNode.append('clipPath').attr('id', `clip-${d.id}`).append('circle').attr('r', 50).attr('cx', 0).attr('cy', 0)

          currentNode.append('image').attr('href', d.profile).attr('width', 170).attr('height', 170).attr('x', -85).attr('y', -85).attr('clip-path', `url(#clip-${d.id})`)
        } else {
          currentNode.append('circle').attr('r', 50).attr('fill', '#037EC8')
        }

        currentNode.append('text').text(d.id).attr('y', 100).attr('text-anchor', 'middle').attr('font-size', '30px').attr('fill', '#fff')
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

  return (
    <>
      <svg ref={canvasRef} className="fixed top-0 left-0 z-10"></svg>
      {/* UserNod 모달 */}
      {isUserModalOpen && <UserNod node={{ id: 'User', profile: '/path/to/default-profile.png' }} onClose={() => setIsUserModalOpen(false)} />}
      {/* Nod 모달 */}
      {selectedNode && <Nod node={selectedNode} onClose={() => setSelectedNode(null)} />}
    </>
  )
}

export default D3Canvas
