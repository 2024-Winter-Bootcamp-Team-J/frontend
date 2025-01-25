import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import dummyData from '../../dummyData/Dummy'
import Nod from '../../modal/nods/nod'
import UserNod from '../../modal/nods/userNod'

type D3Node = d3.SimulationNodeDatum & {
  id: string
  group: string[]
  profile?: string
  memo?: string
  time?: string
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
  const [selectedNode, setSelectedNode] = useState<D3Node | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  useEffect(() => {
    const svg = d3.select<SVGSVGElement, unknown>(canvasRef.current!).style('background-color', '#232323')
    const g = svg.append('g')

    const canvasWidth = 3000
    const canvasHeight = 2000
    svg.attr('width', canvasWidth).attr('height', canvasHeight)

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoomBehavior)

    const initialTransform = d3.zoomIdentity.translate(window.innerWidth / 2 - canvasWidth / 2, window.innerHeight / 2 - canvasHeight / 2)
    svg.call(zoomBehavior.transform, initialTransform)

    const userNode: D3Node = {
      id: 'User',
      group: ['user'],
      profile: localStorage.getItem('profileImage') || '/path/to/default-profile.png',

      fx: canvasWidth / 2,
      fy: canvasHeight / 2,
    }

    const categories = Array.from(new Set(dummyData.flatMap((item) => item.category)))

    const groupNodes: D3Node[] = categories.map((category) => ({
      id: category,
      group: [category],

      x: canvasWidth / 2 + (Math.random() - 0.5) * 300,
      y: canvasHeight / 2 + (Math.random() - 0.5) * 300,
    }))

    const itemNodes: D3Node[] = dummyData.map((item) => ({
      id: item.name,
      group: item.category,
      profile: item.profile || '/path/to/default-item-profile.png',
      memo: item.memo || '',
      time: item.time || '',
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
          .distance(300),
      )
      .force('charge', d3.forceManyBody().strength(-1700))
      .force('center', d3.forceCenter(canvasWidth / 2, canvasHeight / 2))
      .on('tick', () => {
        g.selectAll<SVGLineElement, Link>('.link')
          .attr('x1', (d) => (d.source as D3Node).x!)
          .attr('y1', (d) => (d.source as D3Node).y!)
          .attr('x2', (d) => (d.target as D3Node).x!)
          .attr('y2', (d) => (d.target as D3Node).y!)

        g.selectAll<SVGGElement, D3Node>('g').attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      })

    g.selectAll<SVGLineElement, Link>('.link')
      .data(links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .delay((_, i) => i * 200)
      .attr('opacity', 0.8)

    const node = g
      .selectAll<SVGGElement, D3Node>('g')
      .data(nodes)
      .join('g')
      .on('click', (_event, d) => {
        if (d.id === 'User') {
          setIsUserModalOpen(true)
          return
        }
        if (categories.includes(d.id)) return
        setSelectedNode(d)
      })
      .on('mouseenter', function (_event, d) {
        if (d.id === 'User' || categories.includes(d.id)) return

        const currentNode = d3.select(this)

        currentNode.select('circle').transition().duration(500).attr('r', 70)

        currentNode.select('clipPath circle').transition().duration(500).attr('r', 70)

        currentNode
          .append('circle')
          .attr('class', 'hover-ripple')
          .attr('r', 70)
          .attr('fill', 'none')
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 2)
          .attr('opacity', 0.6)
          .transition()
          .duration(500)
          .ease(d3.easeCubicOut)
          .attr('r', 100)
          .attr('opacity', 0)
          .on('end', function () {
            d3.select(this).remove()
          })

        currentNode.select('image').transition().duration(500).attr('width', 140).attr('height', 140).attr('x', -70).attr('y', -70)
      })
      .on('mouseleave', function (_event, d) {
        if (d.id === 'User' || categories.includes(d.id)) return

        const currentNode = d3.select(this)

        currentNode.select('circle').transition().duration(500).attr('r', 60)
        currentNode.select('clipPath circle').transition().duration(500).attr('r', 60)
        currentNode.select('image').transition().duration(500).attr('width', 120).attr('height', 120).attr('x', -60).attr('y', -60)
      })
      .call(d3.drag<SVGGElement, D3Node>().on('start', dragstarted).on('drag', dragged).on('end', dragended))

    node.each(function (d) {
      const currentNode = d3.select<SVGGElement, D3Node>(this)

      const delay = Math.random() * 1000 // 노드 등장 순서 랜덤화

      if (d.id === 'User') {
        currentNode.append('circle').attr('r', 0).attr('fill', '#3A3A3A').attr('stroke', '#FFFFFF').attr('stroke-width', 4)

        currentNode.append('text').text(d.id).attr('y', 150).attr('text-anchor', 'middle').attr('font-size', '30px').attr('font-weight', 'bold').attr('fill', '#fff').style('opacity', 0)

        currentNode.select('circle').transition().duration(2000).delay(delay).attr('r', 80)

        currentNode.select('text').transition().duration(2000).delay(delay).style('opacity', 1)

        const ripple = currentNode.append('circle').attr('r', 80).attr('fill', 'none').attr('stroke', '#FFFFFF').attr('stroke-width', 2).attr('opacity', 0.6)

        function animateRipple() {
          ripple.attr('r', 80).attr('opacity', 0.6).transition().duration(2000).ease(d3.easeCubicOut).attr('r', 150).attr('opacity', 0).on('end', animateRipple)
        }

        animateRipple()
      } else {
        currentNode.append('circle').attr('r', 0).attr('fill', '#037EC8').attr('stroke', '#FFFFFF').attr('stroke-width', 3)

        if (d.profile) {
          currentNode.append('clipPath').attr('id', `clip-${d.id}`).append('circle').attr('r', 0).attr('cx', 0).attr('cy', 0)

          const image = currentNode
            .append('image')
            .attr('href', d.profile)
            .attr('width', 0)
            .attr('height', 0)
            .attr('x', 0)
            .attr('y', 0)
            .attr('preserveAspectRatio', 'xMidYMid slice')
            .attr('clip-path', `url(#clip-${d.id})`)

          image.transition().duration(2000).delay(delay).attr('width', 120).attr('height', 120).attr('x', -60).attr('y', -60)

          currentNode.select('clipPath circle').transition().duration(2000).delay(delay).attr('r', 60)
        }

        currentNode.append('text').text(d.id).attr('y', 120).attr('text-anchor', 'middle').attr('font-size', '30px').attr('fill', '#fff').style('opacity', 0)

        currentNode.select('circle').transition().duration(2000).delay(delay).attr('r', 60)

        currentNode.select('text').transition().duration(2000).delay(delay).style('opacity', 1)
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
      {isUserModalOpen && <UserNod node={{ id: 'User', profile: '/path/to/default-profile.png' }} onClose={() => setIsUserModalOpen(false)} />}
      {selectedNode && <Nod node={selectedNode} onClose={() => setSelectedNode(null)} />}
    </>
  )
}

export default D3Canvas

// node_id, memo, time, 등등 get
