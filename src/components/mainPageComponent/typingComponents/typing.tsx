import React, { useState, useEffect } from 'react'
import Profilename from './profileName'
import CategoryBox from './categorySelection'
import { motion } from 'framer-motion'
import '../../../animation/typing.css'
import axios from 'axios'

type TypingProps = {
  isCollapsed: boolean
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>
  addLog: (log: { createdAt: string; name: string; content: string }) => void
}

const Typing: React.FC<TypingProps> = ({ isCollapsed, addLog }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showFirstBox, setShowFirstBox] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]) // ✅ 초기값 수정
  const [animationActive, setAnimationActive] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isFirstBoxFadingOut, setIsFirstBoxFadingOut] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<{ id: string; name: string; icon: string }[]>([]) // 동적 프로필 데이터

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.link-in.site/relations/types')
        console.log('카테고리 API 응답:', response.data)

        const categoryList = response.data.map((item: { relation_type_id: number; name: string }) => ({
          id: item.relation_type_id, // ✅ relation_type_id → id
          name: item.name, // ✅ name 유지
        }))

        setCategories(categoryList) // ✅ 업데이트
      } catch (error) {
        console.error('카테고리 데이터를 불러오는 중 오류 발생:', error)
      }
    }

    fetchCategories()
  }, [])



  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      console.log('Input Submitted:', inputValue)
      setShowFirstBox(true)
      setIsLoading(true)
      setAnimationActive(true)
      setDisplayText(inputValue)
      setInputValue('')

      try {
        const userId = Number(localStorage.getItem('userId'))
        console.log('✅ 현재 로그인한 User ID:', userId)
        const token = localStorage.getItem('accessToken')

        if (!userId || !token) {
          console.error('User ID or Token is missing.')
          setIsLoading(false)
          return
        }
        const requestData = {
          user_id: Number(userId), // API에 맞게 수정
          content: inputValue.trim(),
        }

        console.log('📡 [API 요청 시작] 전송 데이터:', requestData)

        if (!token) {
          console.error('❌ Access Token이 존재하지 않음. API 요청 중단')
          alert('인증이 만료되었습니다. 다시 로그인하세요.')
          return
        }

        const response = await axios.post(
          'http://localhost:8000/controller',
          {
            user: userId,
            content: inputValue.trim(),
          },
          {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          },
        )

        console.log('✅ API Response:', response.data) // 서버 응답 전체 확인

        type RelationType = {
          relation_type_id: number
          name: string
        }

        type CategoryResponse = {
          category: RelationType[][]
        }

        // ✅ category 필드에서 relation_type_id와 name 가져오기
        const categoryData: CategoryResponse = response.data
        const relationTypes: RelationType[][] = categoryData.category || []

        console.log('📌 관계 유형 리스트:', relationTypes) // 콘솔 확인

        if (relationTypes.length > 0) {
          // ✅ relation_type_id와 name을 올바르게 매핑
          const extractedCategories = relationTypes
            .map((item: any) => ({
              id: item[0]?.relation_type_id, // 첫 번째 객체에서 relation_type_id 가져오기
              name: item[1]?.name, // 두 번째 객체에서 name 가져오기
            }))
            .filter((category) => category.id && category.name) // ✅ 유효한 값만 필터링

          console.log('🟢 변환된 카테고리:', extractedCategories)

          // ✅ 기존 categories에 relation_types 추가
          const updatedCategories = [...categories, ...extractedCategories]

          // ✅ 중복 제거
          const uniqueCategories = Array.from(new Map(updatedCategories.map((c) => [c.id, c])).values())

          setCategories(uniqueCategories)
          setSelectedCategories(relationTypes.flat().map((item: RelationType) => item.name))
        }

        // ✅ 기존 로직 유지 (노드, 프로필 추가 등)
        const createdAt = response.data?.write?.data?.created_at || 'No Time'
        const name = response.data?.nodes?.group1?.[0]?.name || 'Unknown Name'
        const content = response.data?.write?.data?.content || 'No Content'

        console.log('Extracted Data:', { createdAt, name, content })

        const nodes = response.data?.nodes || {}
        const updatedProfiles: { id: string; name: string; icon: string }[] = []

        Object.values(nodes).forEach((nodeArray) => {
          if (nodeArray && Array.isArray(nodeArray)) {
            nodeArray.forEach((node) => {
              if (node && typeof node.node_id === 'number' && typeof node.name === 'string') {
                updatedProfiles.push({
                  id: String(node.node_id),
                  name: node.name,
                  icon: '/path/to/default-icon.png',
                })
              }
            })
          }
        })

        console.log('Updated Profiles:', updatedProfiles)
        setProfiles(updatedProfiles)

        if (updatedProfiles.length > 0) {
          setSelectedNodeId(updatedProfiles[0].id)
          console.log(`Selected Node ID: ${updatedProfiles[0].id}`)
        }

        if (createdAt) {
          addLog({ createdAt, name, content })
        } else {
          console.log('Log Data to be Added:', { createdAt, name, content })
        }
      } catch (error: any) {
        if (error.response) {
          console.error('Server Error:', error.response.data)
          console.error('Status Code:', error.response.status)
        } else {
          console.error('Request Error:', error.message)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleConfirm = async () => {
    console.log('✅ Confirm 버튼 클릭됨')

    if (!selectedNodeId || selectedCategories.length === 0) {
      console.error('❌ 노드 선택 안 됨 or 카테고리 선택 안 됨')
      return
    }

    const userId = Number(localStorage.getItem('userId'))
    const token = localStorage.getItem('accessToken')

    if (!userId || !token) {
      console.error('❌ User ID 또는 Token 없음. API 요청 중단')
      return
    }

    // ✅ 현재 선택된 카테고리를 기반으로 relation_type_id 찾기
    const relationTypeIds = selectedCategories
      .map((categoryName) => {
        const category = categories.find((c) => c.name === categoryName)
        return category ? category.id : null // ✅ ID가 존재하면 반환, 없으면 null
      })
      .filter((id): id is number => id !== null) // ✅ null 값 제거

    console.log('📡 서버로 보낼 relationTypeIds:', relationTypeIds)

    if (relationTypeIds.length === 0) {
      console.error('❌ 유효한 relationTypeIds 없음')
      return
    }

    try {
      for (const relationTypeId of relationTypeIds) {
        console.log(`📌 API 요청: 노드 ${selectedNodeId}, 관계 ID ${relationTypeId}`)

        await axios.post(
          'https://api.link-in.site/relations/user-node-relations/create',
          {
            user_id: userId,
            node_id: selectedNodeId,
            relation_type_id: relationTypeId,
          },
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ 인증 추가
          },
        )
      }

      console.log('✅ 관계 추가 성공!')
      handleClose()
      window.location.reload()
    } catch (error: any) {
      console.error('❌ 관계 추가 중 오류 발생:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    console.log('isLoading changed:', isLoading)
    if (!isLoading) {
      console.log('✅ isLoading이 false → isExpanded true로 변경')
      setIsExpanded(true)
      setAnimationActive(false)
    }
  }, [isLoading])

  useEffect(() => {
    console.log('selectedNodeId changed:', selectedNodeId)
    if (!selectedNodeId) {
      setSelectedCategories([])
    }
  }, [selectedNodeId])

  const handleClose = () => {
    console.log('Close Button Clicked')
    setIsFirstBoxFadingOut(true)
    setIsFadingOut(true)
    setTimeout(() => {
      console.log('Animation Complete, Closing Box')
      setShowFirstBox(false)
      setIsExpanded(false)
      setIsFadingOut(false)
      setIsFirstBoxFadingOut(false)
    }, 500)
  }

  const handleNodeSelect = (id: string) => {
    console.log('Node Selected:', id)
    setSelectedNodeId(id)
  }

  const handleCategorySelect = (category: string) => {
    console.log('Category Selected:', category)

    setSelectedCategories(
      (prevSelected) =>
        prevSelected.includes(category)
          ? prevSelected.filter((c) => c !== category) // ✅ 이미 선택된 경우 해제
          : [...prevSelected, category], // ✅ 선택되지 않은 경우 추가
    )
  }

  const handleCategoryAdd = async (newCategory: string) => {
    if (newCategory.trim() === '') return

    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('accessToken')

    console.log('✅ 현재 로그인한 User ID:', userId)
    console.log('✅ 현재 Access Token:', token)

    if (!userId || !token) {
      console.error('❌ User ID 또는 Token 없음. API 요청 중단')
      return
    }

    const categoryData = {
      user_id: userId, // ✅ 로그인한 유저 ID 반영
      node_id: selectedNodeId, // ✅ 선택된 노드 ID 반영
      name: newCategory.trim(),
    }

    console.log('📡 서버로 전송할 데이터:', categoryData)

    try {
      const response = await axios.post('https://api.link-in.site/relations/types/create', categoryData, { headers: { Authorization: `Bearer ${token}` } })

      console.log('✅ 카테고리 추가 성공:', response.data)

      const newCategoryId = response.data?.relation_type_id // 서버에서 반환한 relation_type_id

      if (!newCategoryId) {
        console.error('❌ 서버에서 relation_type_id를 반환하지 않음')
        return
      }

      console.log(`✅ 새 카테고리 ID: ${newCategoryId}`)

      // ✅ 서버에서 받은 ID로 상태 업데이트
      setCategories((prevCategories) => [...prevCategories, { id: newCategoryId, name: newCategory.trim() }])

      // ✅ 새로 추가한 카테고리를 선택한 상태로 유지
      setSelectedCategories((prevSelected) => [...prevSelected, newCategory.trim()])

      newCategoryId('')
      setIsInputVisible(false)
    } catch (error: any) {
      console.error('❌ 카테고리 추가 중 오류 발생:', error.response?.data || error.message)
    }
  }

  return (
    <div
      className={`fixed z-20 bottom-6 flex px-4 duration-300 items-center`}
      style={{
        left: isCollapsed ? '24px' : '320px',
        right: '20px',
      }}
    >
      <div className="relative w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 max-w-[700px] w-full overflow-hidden">
            {showFirstBox && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isFirstBoxFadingOut ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`relative p-6 ml-auto mr-auto text-white transform border-2 rounded-t-lg shadow-md bg-loadingExpand/60 backdrop-blur-md border-recordColor/70 overflow-hidden animate-slide-up`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {animationActive && (
                    <>
                      <motion.div
                        key={inputValue + '-blur1'}
                        initial={{ x: -150, y: -150 }}
                        animate={{ x: [-150, 150, -150], y: [-150, -150, -150] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                        className="absolute w-[300px] h-[300px] bg-gray-400 opacity-70 rounded-full filter blur-[150px]"
                      ></motion.div>
                      <motion.div
                        key={inputValue + '-blur2'}
                        initial={{ x: 150, y: -150 }}
                        animate={{ x: [150, -150, 150], y: [-150, -150, -150] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                        className="absolute w-[250px] h-[250px] bg-white opacity-60 rounded-full filter blur-[120px]"
                      ></motion.div>
                      <motion.div
                        key={inputValue + '-blur3'}
                        initial={{ x: 0, y: 150 }}
                        animate={{ x: [0, 0, 0], y: [150, -150, 150] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 2 }}
                        className="absolute w-[200px] h-[200px] bg-gray-200 opacity-55 rounded-full filter blur-[100px]"
                      ></motion.div>
                    </>
                  )}
                </div>
                <div className="relative z-10 text-3xl">관계를 생성 중입니다!</div>
                <div className="relative z-10 mt-2 text-md">{displayText}</div>
              </motion.div>
            )}
            {showFirstBox && isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isFadingOut ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className={`ml-auto mr-auto overflow-hidden text-white transform border-2 rounded-b-lg shadow-md bg-loadingExpand/60 backdrop-blur-md border-recordColor/70`}
                style={{
                  height: 'auto',
                  paddingTop: '20px',
                }}
              >
                <motion.div initial={{ opacity: 1 }} animate={{ opacity: isFadingOut ? 0 : 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center mb-6">
                  <div className="flex justify-center mt-10 text-3xl text-white">인물</div>
                  <div className="w-full overflow-x-auto snap-center">
                    <div className="flex flex-row items-center justify-center gap-8">
                      <Profilename profiles={profiles} onSelectNode={handleNodeSelect} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-full gap-4 mt-20">
                    <CategoryBox
                      categories={Array.from(new Set(categories.map((c) => c.name)))}
                      selectedCategories={selectedCategories}
                      onCategoriesSelect={(newCategories) => setSelectedCategories(newCategories)} // ✅ 배열을 직접 전달하도록 수정
                      onCategoryAdd={handleCategoryAdd}
                      currentNodeId={selectedNodeId}
                    />
                  </div>
                  <div className="flex items-center justify-center mt-10 text-lg text-blue-400 cursor-pointer" onClick={handleConfirm}>
                    확인
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
          <div className="flex flex-row w-full">
            {isCollapsed && <div className="flex items-center mr-6 text-xl text-white transition-opacity duration-300 sarina-regular">Linkin</div>}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
              }}
              placeholder={isFocused ? '' : '만들고 싶은 관계를 정리해 주세요!'}
              className={`h-12 w-full px-4 text-lg shadow-md rounded-xl duration-300 bg-customColor/70 text-white backdrop-blur-md border-2 border-customColor2 focus:outline-none focus:ring focus:ring-blue-300`}
              onFocus={() => {
                setIsFocused(true)
              }}
              onBlur={() => {
                setIsFocused(false)
              }}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Typing
function setIsInputVisible(arg0: boolean) {
  throw new Error('Function not implemented.')
}
