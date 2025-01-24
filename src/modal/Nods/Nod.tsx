import React, { useState, useEffect } from 'react'
import NodeMemo from './NodMemo'

interface NodProps {
  node: {
    id: string
    profile?: string
    group: string[]
    memo?: string
    time?: string
  } | null
  onClose: () => void
}

const Nod: React.FC<NodProps> = ({ node, onClose }) => {
  const [isVisible, setIsVisible] = useState(false) // Nod 표시 여부 상태
  const [isExpanded, setIsExpanded] = useState(true) // Nod 창이 축소 상태로 시작되도록 설정
  const [isEditMode, setIsEditMode] = useState(false) // 수정 모드 활성화 여부
  const [categories, setCategories] = useState<string[]>(node?.group || []) // 현재 표시 중인 카테고리
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]) // 수정 중 선택된 카테고리
  const [customCategories, setCustomCategories] = useState<string[]>([]) // 사용자 추가 카테고리
  const predefinedCategories = ['가족', '친구', '지인', '직장', '게임'] // 기본 제공 카테고리

  // 페이지 전체 스크롤 비활성화
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    // 컴포넌트 언마운트 시 스크롤 복구
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Nod가 활성화될 때 Fade-In 효과 적용
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // 수정 모드가 활성화될 때 초기화
  useEffect(() => {
    if (isEditMode) {
      // 수정 모드로 진입 시 현재 카테고리를 선택된 상태로 초기화
      setSelectedCategories(categories)
    }
  }, [isEditMode, categories])

  // 닫기 버튼 클릭 처리 함수
  const handleClose = (): void => {
    setIsVisible(false)
    setTimeout(() => {
      onClose() // 부모 컴포넌트에서 전달된 onClose 호출
    }, 300) // Fade-Out 효과 시간과 일치
  }

  // 확대 버튼 클릭 처리 함수
  const handleExpand = (): void => {
    setIsExpanded(false) // 전체 화면 상태로 전환
  }

  // 축소 버튼 클릭 처리 함수
  const handleShrink = (): void => {
    setIsExpanded(true) // 축소 상태로 전환
  }

  // 카테고리 선택 핸들러 (수정 모드일 때만 동작)
  const handleCategorySelect = (category: string): void => {
    if (!isEditMode) return
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]))
  }

  // 카테고리 추가 핸들러
  const handleAddCategory = (): void => {
    const availableCategories = [...predefinedCategories, ...customCategories]
    const newCategory = prompt('추가할 카테고리 이름을 입력하세요:')
    if (newCategory && !availableCategories.includes(newCategory)) {
      setCustomCategories((prev) => [...prev, newCategory])
      setSelectedCategories((prev) => [...prev, newCategory])
    }
  }

  // 수정 완료 핸들러
  const handleCompleteEdit = (): void => {
    const userConfirmed = window.confirm('변경사항을 저장하시겠습니까?')
    if (userConfirmed) {
      setCategories(selectedCategories)
      setIsEditMode(false)
    }
  }

  if (!node) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xl transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`relative rounded-[30px] flex flex-col items-center py-4 px-10 transition-all duration-300 ${isExpanded ? 'w-[500px] h-[700px] bg-nodColor' : 'w-screen h-screen rounded-none'}`}>
        {/* 닫기 버튼 */}
        <button onClick={handleClose} className="absolute p-4 text-2xl text-white transition-transform duration-300 rounded-full top-4 right-6 hover:scale-125" aria-label="Close">
          <img src="/src/assets/CloseButton.png" alt="Close" className="w-8 h-8" />
        </button>

        {/* 확대 / 축소 버튼 */}
        {isExpanded ? (
          <button onClick={handleExpand} className="absolute p-4 text-white transition-transform duration-300 rounded-full top-4 left-6 hover:scale-125" aria-label="Expand">
            <img src="/src/assets/확대.png" alt="Expand" className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={handleShrink} className="absolute p-4 text-white transition-transform duration-300 rounded-full top-4 left-6 hover:scale-125" aria-label="Shrink">
            <img src="/src/assets/축소.png" alt="Shrink" className="w-6 h-6" />
          </button>
        )}

        {/* 내용 */}
        <div className="flex flex-col items-center w-full ">
          {/* 프로필 */}
          <div className="flex flex-col items-center w-full mb-4">
            <div className="flex items-center justify-center overflow-hidden bg-gray-300 border-4 border-double rounded-full h-36 w-36 border-recordColor">
              {node.profile ? <img src={node.profile} alt={`${node.id} Profile`} /> : <div className="text-white">No Image</div>}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">{node.id}</h2>
          </div>

          {/* 카테고리 */}
          <div className="flex flex-wrap items-center justify-center w-full gap-4 mt-4">
            {(isEditMode ? [...predefinedCategories, ...customCategories] : categories).map((category) => (
              <div
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-[30px] cursor-pointer border-2 transition-all duration-300 ${
                  selectedCategories.includes(category) ? 'border-blue-500 text-blue-500' : 'border-gray-400 text-white'
                }`}
              >
                {category}
              </div>
            ))}
            {isEditMode && (
              <button onClick={handleAddCategory} className="px-4 py-2 rounded-[30px] cursor-pointer border-2 border-gray-400 text-white hover:border-blue-500 hover:text-blue-500">
                +
              </button>
            )}
          </div>

          {/* 수정 / 완료 버튼 */}
          <div className="flex justify-center w-full mt-6">
            {isEditMode ? (
              <>
                <button
                  onClick={() => {
                    setIsEditMode(false)
                    setSelectedCategories(categories)
                  }}
                  className="px-6 py-2 text-red-400"
                >
                  취소
                </button>
                <button onClick={handleCompleteEdit} className="px-6 py-2 text-blue-500">
                  완료
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditMode(true)} className="px-6 py-2 text-red-400">
                수정
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full text-white ">
          <NodeMemo memo={node.memo} time={node.time} />
        </div>
      </div>
    </div>
  )
}

export default Nod

// node_id get
// 카테고리 get, post
// 메모, 시간 get

// 1. Nod.tsx 에서 get 요청으로 read 안에 있는 /memos{memo_id}  이거 연동 ㄱㄱ
// 2. Nod.tsx의 child 컨포넌트 (NodMemo.tsx) 가서 response body에 맞춰서 바꿈
// 3. Nod.tsx의 부모 컨포넌트 가서 (D3, UserNodeProfile.tsx) 가서 수정