import { useState, useEffect } from 'react'
import axios from 'axios'

const useRelationTypes = () => {
  const [relationTypeMap, setRelationTypeMap] = useState<{ [key: number]: string }>({})
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchRelationTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/relations/types')
        const typeMap: { [key: number]: string } = {}

        response.data.forEach((type: { relation_type_id: number; name: string }) => {
          typeMap[type.relation_type_id] = type.name
        })

        setRelationTypeMap(typeMap)
        setCategories(Array.from(new Set(Object.values(typeMap)))) // 중복 제거 후 설정
      } catch (error) {
        console.error('Error fetching relation types:', error)
      }
    }

    fetchRelationTypes()
  }, [])

  return { relationTypeMap, categories, setCategories }
}

export default useRelationTypes
