import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import axios, { AxiosError } from 'axios'
import Nod from '../../../modals/nod/generalNod/nod'
import UserNod from '../../../modals/nod/userNod/userNod'
import { renderGraph } from './render'
import generalP from '../../../assets/generalP.png'

type D3Node = d3.SimulationNodeDatum & {
  id: string
  name?: string
  node_img?: string
  relation_type_id?: number[]
  node_id?: number
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

type D3CanvasProps = {
  selectedCategory: string
}

const D3Canvas: React.FC<D3CanvasProps> = ({ selectedCategory }) => {
  const canvasRef = useRef<SVGSVGElement>(null!)
  const [selectedNode, setSelectedNode] = useState<D3Node | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [relationTypes, setRelationTypes] = useState<{ [key: number]: string }>({})

  // ✅ 현재 로그인한 유저 정보 가져오기
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('accessToken')

  console.log('✅ 현재 로그인한 User ID:', userId)
  console.log('✅ 현재 Access Token:', token)

  useEffect(() => {
    if (!userId || !token) {
      console.error('❌ User ID 또는 Token이 없음. API 요청 중단')
      return
    }

    const fetchData = async () => {
      try {
        console.log('📡 관계 유형 데이터 요청 시작')
        const relationTypesResponse = await axios.get('https://api.link-in.site/relations/types', {
          headers: { Authorization: `Bearer ${token}` },
          params: { user_id: userId },
        })

        const types = relationTypesResponse.data.reduce((acc: { [key: number]: string }, item: any) => {
          acc[item.relation_type_id] = item.name
          return acc
        }, {})
        setRelationTypes(types)
        console.log('📌 관계 유형 데이터:', types)

        console.log('📡 노드 데이터 요청 시작 (user_id:', userId, ')')
        const nodesResponse = await axios.get('https://api.link-in.site/node', {
          headers: { Authorization: `Bearer ${token}` },
          params: { user_id: userId }, // ✅ user_id 추가하여 해당 유저의 노드만 가져오기
        })

        console.log('📌 원본 노드 데이터 응답:', nodesResponse.data)
        const apiData = nodesResponse.data

        const userNode: D3Node = {
          id: 'User',
          name: 'User',
          node_img: localStorage.getItem('profileImage') || generalP,
          fx: 1500,
          fy: 1000,
        }

        const uniqueRelationIds = new Set<number>(apiData.flatMap((item: any) => (Array.isArray(item.relation_type_ids) ? item.relation_type_ids : [])))

        const groupNodes: D3Node[] = Array.from(uniqueRelationIds)
          .filter(
            (relationId) => apiData.some((item: any) => item.relation_type_ids?.includes(Number(relationId)) && item.user_id.toString() === userId), // ✅ 현재 로그인한 사용자의 관계만 추가
          )
          .map((relationId) => {
            const relationIdNumber = Number(relationId)
            return {
              id: `relation-${relationIdNumber}`,
              name: types[relationIdNumber] || `Unknown Relation`,
              x: 1500 + (Math.random() - 0.5) * 300,
              y: 1000 + (Math.random() - 0.5) * 300,
              user_id: Number(userId), // ✅ user_id 추가됨
            }
          })

        console.log('📌 필터링된 그룹 노드 데이터 (user_id 적용됨):', groupNodes)

        const nodes: D3Node[] = apiData
          .filter((item: any) => item.user_id.toString() === userId) // ✅ 현재 로그인한 user_id만 필터링
          .map((item: any) => ({
            id: item.name,
            name: item.name,
            node_img: item.node_img || generalP,
            relation_type_id: item.relation_type_ids,
            node_id: item.node_id,
            x: 1500 + (Math.random() - 0.5) * 300,
            y: 1000 + (Math.random() - 0.5) * 300,
            user_id: item.user_id,
          }))

        let filteredNodes = [userNode, ...groupNodes, ...nodes]

        if (selectedCategory !== '전체') {
          const categoryId = Number(Object.keys(types).find((key) => types[Number(key)] === selectedCategory))
          filteredNodes = [userNode, ...groupNodes.filter((group) => group.id === `relation-${categoryId}`), ...nodes.filter((node) => node.relation_type_id?.includes(categoryId))]
        }

        const links: Link[] = []
        filteredNodes.forEach((node) => {
          if (node.id.startsWith('relation-')) {
            links.push({ source: 'User', target: node.id })
          } else if (node.relation_type_id) {
            node.relation_type_id.forEach((relationId) => {
              if (filteredNodes.some((n) => n.id === `relation-${relationId}`)) {
                links.push({ source: `relation-${relationId}`, target: node.id })
              }
            })
          }
        })

        renderGraph(canvasRef, filteredNodes, links, setSelectedNode, setIsUserModalOpen)
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('❌ 서버 요청 실패:', error.response?.data || error.message)
        } else {
          console.error('❌ 알 수 없는 오류 발생:', error)
        }
      }
    }

    fetchData()
  }, [selectedCategory])

  return (
    <>
      <svg ref={canvasRef} className="fixed top-0 left-0 z-10"></svg>
      {isUserModalOpen && <UserNod node={{ id: 'User', name: 'User' }} onClose={() => setIsUserModalOpen(false)} />}
      {selectedNode && (
        <Nod
          node={{
            id: selectedNode.id,
            name: selectedNode.name,
            node_img: selectedNode.node_img,
            relation_type_id: selectedNode.relation_type_id,
            node_id: selectedNode.node_id,
            memo: selectedNode.memo,
            time: selectedNode.time,
          }}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </>
  )
}

export default D3Canvas
