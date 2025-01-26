import React, { useState } from 'react'
import axios from 'axios'

type CategoryBoxProps = {
  categories: string[]
  selectedCategory: string | null
  onCategorySelect: (category: string) => void
  onCategoryAdd: (newCategory: string) => void
  currentNodeId: string | null // 선택된 노드 ID
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ categories = [], selectedCategory = null, onCategorySelect, onCategoryAdd, currentNodeId }) => {
  const [newCategory, setNewCategory] = useState('')
  const [isInputVisible, setIsInputVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') return

    if (!currentNodeId) {
      alert('노드를 선택하세요.')
      return
    }

    const categoryData = {
      user_id: 1, // 예제 사용자 ID
      node_id: currentNodeId, // 선택된 노드 ID
      name: newCategory.trim(),
      is_default: categories.includes(newCategory.trim()),
    }

    console.log('Request Data:', categoryData) // 디버깅: 서버에 보낼 데이터

    // is_default가 true면 요청 차단
    if (categoryData.is_default) {
      alert('이미 존재하는 카테고리입니다') // 경고 메시지 표시
      setNewCategory('') // 입력 필드 초기화
      setIsInputVisible(false) // 입력 필드 숨기기
      return
    }

    try {
      setIsSubmitting(true)
      const response = await axios.post('http://localhost:8000/relationsrelation-types/create', categoryData)

      console.log('Category added successfully', response.data)

      onCategoryAdd(newCategory.trim()) // 부모 컴포넌트로 새 카테고리 전달
      setNewCategory('') // 입력 필드 초기화
      setIsInputVisible(false) // 입력 필드 숨기기
    } catch (error) {
      console.error('Error adding category:', error)
    } finally {
      setIsSubmitting(false) // 로딩 상태 초기화
    }
  }

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      // 동일 카테고리를 선택한 경우 선택 해제
      onCategorySelect('')
    } else {
      // 새로운 카테고리 선택
      onCategorySelect(category)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 mx-4 mb-4">
      {/* 현재 선택된 노드 표시 */}
      {currentNodeId && <div className="mb-2 text-lg text-white">카테고리 선택</div>}

      {/* Grid 레이아웃 적용 */}
      <div className="grid grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="relative flex items-center justify-center p-2 text-lg font-bold text-white transition-all duration-300 cursor-pointer "
          >
            <div
              className={`z-50 ${selectedCategory === category ? 'border-blue-500' : ''} `}
              style={{
                transition: 'border 0.3s ease',
              }}
            >
              {category}
            </div>
            {selectedCategory === category && <div className="absolute inset-0 bg-blue-500 rounded-lg blur-md" style={{ filter: 'blur(5px)' }} />}
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
