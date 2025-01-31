import React, { useState } from 'react'
import axios from 'axios'

type CategoryBoxProps = {
  categories: string[]
  selectedCategories: string[] // 여러 개 선택 가능
  onCategoriesSelect: React.Dispatch<React.SetStateAction<string[]>>
  onCategoryAdd: (newCategory: string) => void
  currentNodeId: string | null // 선택된 노드 ID
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ categories = [], selectedCategories = [], onCategoriesSelect, onCategoryAdd, currentNodeId }) => {
  const [newCategory, setNewCategory] = useState('')
  const [isInputVisible, setIsInputVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') return

    if (!currentNodeId) {
      alert('노드를 선택하세요.')
      return
    }

    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('accessToken')

    console.log('✅ 현재 로그인한 User ID:', userId)
    console.log('✅ 현재 Access Token:', token)

    if (!userId || !token) {
      console.error('❌ User ID or Token is missing. API 요청 중단')
      return
    }

    const categoryData = {
      user_id: userId, // ✅ 로그인한 유저 ID 반영
      node_id: currentNodeId,
      name: newCategory.trim(),
    }

    console.log('📡 서버로 전송할 데이터:', categoryData) // 디버깅

    try {
      setIsSubmitting(true)
      const response = await axios.post(
        'https://api.link-in.site/relations/types/create',
        categoryData,
        { headers: { Authorization: `Bearer ${token}` } }, // ✅ 인증 추가
      )

      console.log('✅ 카테고리 추가 성공:', response.data)

      const createdCategory = {
        id: response.data.relation_type_id, // 서버에서 받은 실제 ID
        name: response.data.name, // 서버에서 받은 카테고리 이름
      };
      
      onCategoryAdd(createdCategory.name) // ✅ 기존 기능 유지
      setNewCategory('')
      setIsInputVisible(false)
    } catch (error: any) {
      console.error('❌ 카테고리 추가 중 오류 발생:', error.response?.data || error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCategoryClick = (category: string) => {
    if (selectedCategories.includes(category)) {
      // 이미 선택된 경우 → 해제
      onCategoriesSelect(selectedCategories.filter((c) => c !== category))
    } else {
      // 새로 선택된 경우 → 추가
      onCategoriesSelect([...selectedCategories, category])
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 mx-4 mb-4">
      {/* 현재 선택된 노드 표시 */}
      {currentNodeId && <div className="mb-2 text-3xl text-white">카테고리 선택</div>}

      {/* Grid 레이아웃 적용 */}
      <div className="grid grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="relative flex items-center justify-center p-2 text-lg font-bold text-white transition-all duration-300 cursor-pointer"
          >
            <div
              className={`z-50 ${selectedCategories.includes(category) ? 'border-blue-500' : ''} `}
              style={{
                transition: 'border 0.3s ease',
              }}
            >
              {category}
            </div>
            {selectedCategories.includes(category) && <div className="absolute inset-0 bg-blue-500 rounded-lg blur-md" style={{ filter: 'blur(5px)' }} />}
          </div>
        ))}

        {/* + 버튼 */}
        <button onClick={() => setIsInputVisible(!isInputVisible)} className="flex items-center justify-center text-lg font-bold text-white rounded-lg hover:bg-blue-500">
          +
        </button>
      </div>

      {isInputVisible && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="새 카테고리 이름"
            className={`p-2 border rounded-xl ${newCategory.trim() ? 'text-white bg-customColor2 border-recordColor' : 'text-gray-400 bg-customColor border-customColor2'}`}
          />
          <button
            onClick={handleAddCategory}
            className={`px-4 py-2 rounded ${newCategory.trim() && !isSubmitting ? 'text-red-500 bg-gray-800 hover:bg-gray-600' : 'text-gray-400 bg-gray-700 cursor-not-allowed'}`}
            disabled={!newCategory.trim() || isSubmitting}
          >
            {isSubmitting ? '추가 중...' : '추가'}
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryBox
