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

    const canvasWidth = 2000 // 캔버스 전체 너비
    const canvasHeight = 2000 // 캔버스 전체 높이
    svg.attr('width', canvasWidth).attr('height', canvasHeight)

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4]) // 줌 가능 범위 설정 (최소 0.5배 ~ 최대 4배)
      .on('zoom', (event) => {
        g.attr('transform', event.transform) // 줌/팬 이벤트 발생 시 g 요소 이동
      })

    svg.call(zoomBehavior)

    // const categoryColors: Record<string, string> = {
    //   친구: '#FF5733',
    //   지인: '#5733FF',
    //   게임: '#FFA500',
    //   가족: '#800080',
    //   직장: '#33FF57',
    // }

    // User 노드 데이터
    const userNodeData = dummyData.find((item) => item.name === 'User')
    if (!userNodeData) {
      console.error('User 데이터가 누락되었습니다.')
      return
    }
    const storedProfileImage = localStorage.getItem('profileImage') // 로컬스토리지에서 이미지 가져오기
    // "User" 노드 생성
    const userNode: D3Node = {
      id: userNodeData.name,
      group: userNodeData.category,
      profile: storedProfileImage || userNodeData.profile,
      fx: canvasWidth / 2, // X 위치 고정
      fy: canvasHeight / 2, // Y 위치 고정
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
      .attr('stroke', (_d) => {
        // const sourceNode = nodes.find((node) => node.id === (d.source as D3Node).id)
        // const targetNode = nodes.find((node) => node.id === (d.target as D3Node).id)

        // if (sourceNode?.id === 'User') {
        //   if (targetNode && targetNode.group.length > 0) {
        //     return categoryColors[targetNode.group[0]] || '#999'
        //   }
        // }

        // if (sourceNode && sourceNode.group.length > 0) {
        //   return categoryColors[sourceNode.group[0]] || '#999'
        // }

        return '#037EC8'
      })
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8)

    // Nodes
    const node = g.selectAll<SVGGElement, D3Node>('g').data(nodes).join('g').call(d3.drag<SVGGElement, D3Node>().on('start', dragstarted).on('drag', dragged).on('end', dragended))

    node.each(function (d) {
      const currentNode = d3.select<SVGGElement, D3Node>(this)

      if (d.id === 'User') {
        currentNode.append('circle').attr('r', 80).attr('fill', '#3A3A3A').attr('stroke', '#FFFFFF').attr('stroke-width', 4)

        currentNode.append('text').text(d.id).attr('y', 150).attr('text-anchor', 'middle').attr('font-size', '30px').attr('font-weight', 'bold').attr('fill', '#fff')
      } else if (categories.includes(d.id)) {
        // 그룹 노드 색상 적용
        currentNode
          .append('circle')
          .attr('r', 70)
          // .attr('fill', categoryColors[d.id])
          .attr('stroke', '#037EC8')
          .attr('stroke-width', 2)
          .attr('fill', '#037EC8')

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

    svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(window.innerWidth / 2 - canvasWidth / 2, window.innerHeight / 2 - canvasHeight / 2).scale(1))

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
