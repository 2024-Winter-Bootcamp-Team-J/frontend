import { useState } from 'react'
import axios from 'axios'

const useNodeData = () => {
  const [profiles, setProfiles] = useState<{ id: string; name: string; icon: string }[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleConfirm = async (relationTypeMap: { [key: number]: string }) => {
    if (!selectedNodeId || selectedCategories.length === 0) {
      console.error('No node selected or no category selected.')
      return
    }

    try {
      const relationTypeIds = selectedCategories
        .map((category) =>
          Object.keys(relationTypeMap).find((key) => relationTypeMap[parseInt(key)] === category)
        )
        .filter(Boolean)
        .map(Number)

      for (const relationTypeId of relationTypeIds) {
        await axios.post('http://localhost:8000/relations/user-node-relations/create', {
          user_id: 1,
          node_id: selectedNodeId,
          relation_type_id: relationTypeId,
        })
      }

      window.location.reload()
    } catch (error: any) {
      console.error('Error sending relation data:', error.message)
    }
  }

  return { profiles, setProfiles, selectedNodeId, setSelectedNodeId, selectedCategories, setSelectedCategories, handleConfirm }
}

export default useNodeData
