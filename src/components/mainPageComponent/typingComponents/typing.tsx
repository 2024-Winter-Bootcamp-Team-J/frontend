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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null) // 단일 선택
  const [categories, setCategories] = useState(['친구', '가족', '게임', '지인', '직장']) // 초기 카테고리
  const [animationActive, setAnimationActive] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isFirstBoxFadingOut, setIsFirstBoxFadingOut] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<{ id: string; name: string; icon: string }[]>([]) // 동적 프로필 데이터

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      console.log('Input Submitted:', inputValue)
      setShowFirstBox(true)
      setIsLoading(true)
      setAnimationActive(true)
      setDisplayText(inputValue)
      setInputValue('')

      try {
        const response = await axios.post('http://localhost:8000/controller', {
          user: 1,
          content: inputValue.trim(),
        })

        console.log('API Response:', response.data)

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
        setIsLoading(true)
      }
    }
  }

  const handleConfirm = async () => {
    console.log('Confirm Button Clicked')
    if (!selectedNodeId || !selectedCategory) {
      console.error('No node selected or no category selected.')
      return
    }

    try {
      const relationTypeMapping: { [key: string]: number } = {
        친구: 1,
        가족: 2,
        게임: 3,
        지인: 4,
        직장: 5,
      }

      const relationTypeId = relationTypeMapping[selectedCategory]
      if (!relationTypeId) {
        console.error(`Invalid category: ${selectedCategory}`)
        return
      }

      const response = await axios.post('http://localhost:8000/relations/user-node-relations/create', {
        user_id: 1,
        node_id: selectedNodeId,
        relation_type_id: relationTypeId,
      })

      console.log('Relation API Response:', response.data)
      handleClose()
    } catch (error: any) {
      console.error('Error sending relation data:', error.message)
    }
  }

  useEffect(() => {
    console.log('isLoading changed:', isLoading)
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.log('Loading Timeout Reached')
        setIsLoading(false)
        setIsExpanded(true)
        setAnimationActive(false)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [isLoading])

  useEffect(() => {
    console.log('selectedNodeId changed:', selectedNodeId)
    if (!selectedNodeId) {
      setSelectedCategory(null)
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
    setSelectedCategory(category)
  }

  const handleCategoryAdd = (newCategory: string) => {
    console.log('New Category Added:', newCategory)
    setCategories((prevCategories) => [...prevCategories, newCategory])
    setSelectedCategory(newCategory)
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
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onCategorySelect={handleCategorySelect}
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
