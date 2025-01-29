import { useState } from 'react'
import axios from 'axios'

const useInputHandler = (addLog: Function, setProfiles: Function, setSelectedNodeId: Function) => {
  const [inputValue, setInputValue] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [showFirstBox, setShowFirstBox] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setShowFirstBox(true)
      setIsLoading(true)
      setDisplayText(inputValue)
      setInputValue('')

      try {
        const response = await axios.post('http://localhost:8000/controller', {
          user: 1,
          content: inputValue.trim(),
        })

        const createdAt = response.data?.write?.data?.created_at || 'No Time'
        const name = response.data?.nodes?.group1?.[0]?.name || 'Unknown Name'
        const content = response.data?.write?.data?.content || 'No Content'

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

        setProfiles(updatedProfiles)

        if (updatedProfiles.length > 0) {
          setSelectedNodeId(updatedProfiles[0].id)
        }

        if (createdAt) {
          addLog({ createdAt, name, content })
        }
      } catch (error: any) {
        console.error('Request Error:', error.message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return { inputValue, setInputValue, displayText, showFirstBox, handleKeyPress }
}

export default useInputHandler
