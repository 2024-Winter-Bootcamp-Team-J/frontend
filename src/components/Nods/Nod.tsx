import React, { useState, useEffect } from 'react'

interface NodProps {
  node: {
    id: string
    profile?: string
    group: string[] // 그룹 정보 추가
  } | null
  onClose: () => void
}

const Nod: React.FC<NodProps> = ({ node, onClose }) => {
  const [isVisible, setIsVisible] = useState(true) // Nod 표시 여부 상태
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
    onClose() // 부모 컴포넌트에서 전달된 onClose 호출
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
    if (!isEditMode) return // 수정 모드가 아니면 동작하지 않음
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]))
  }

  // 카테고리 추가 핸들러
  const handleAddCategory = (): void => {
    const availableCategories = [...predefinedCategories, ...customCategories]
    const newCategory = prompt('추가할 카테고리 이름을 입력하세요:')
    if (newCategory && !availableCategories.includes(newCategory)) {
      setCustomCategories((prev) => [...prev, newCategory]) // 사용자 정의 카테고리 추가
      setSelectedCategories((prev) => [...prev, newCategory]) // 새 카테고리 선택
    }
  }

  // 수정 완료 핸들러
  const handleCompleteEdit = (): void => {
    const userConfirmed = window.confirm('변경사항을 저장하시겠습니까?') // 확인 메시지
    if (userConfirmed) {
      setCategories(selectedCategories) // 수정된 카테고리를 최종 업데이트
      setIsEditMode(false) // 수정 모드 종료
    }
  }

  // Nod 컴포넌트가 비활성화되면 null 반환
  if (!isVisible || !node) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl">
      <div className={`relative rounded-[30px] flex flex-col items-center py-4 px-10 transition-all duration-300 ${isExpanded ? 'w-[500px] h-[700px] bg-nodColor' : 'w-screen h-screen rounded-none'}`}>
        {/* 닫기 버튼 */}
        <button onClick={handleClose} className="absolute p-2 text-2xl text-white rounded-full top-4 right-8" aria-label="Close">
          X
        </button>

        {/* 확대 버튼 (축소 상태에서만 표시) */}
        {isExpanded && (
          <button onClick={handleExpand} className="absolute p-4 text-white rounded-full top-4 left-6" aria-label="Expand">
            <img src="/src/assets/확대.png" alt="Expand" className="w-6 h-6" />
          </button>
        )}

        {/* 축소 버튼 (확대 상태에서만 표시) */}
        {!isExpanded && (
          <button onClick={handleShrink} className="absolute p-4 text-white rounded-full top-4 left-4" aria-label="Shrink">
            <img src="/src/assets/축소.png" alt="Shrink" className="w-6 h-6" />
          </button>
        )}

        <div className="flex flex-col items-center w-full overflow-y-scroll">
          <div className="flex flex-col ">
            {/* 상단 프로필 */}
            <div className="flex flex-col items-center w-full mb-4">
              {/* 프로필 사진 영역 */}
              <div className="flex items-center justify-center overflow-hidden bg-gray-300 border-4 border-double rounded-full h-36 w-36 border-recordColor">
                {node.profile ? <img src={node.profile} alt={`${node.id} Profile`} /> : <div className="text-white">No Image</div>}
              </div>

              {/* 이름 */}
              <h2 className="mt-4 text-2xl font-bold text-white">{node.id}</h2>
            </div>

            {/* 카테고리 목록 */}
            <div className="flex flex-wrap items-center justify-center w-full gap-4 mt-4" style={{ maxWidth: '100%' }}>
              {(isEditMode ? [...predefinedCategories, ...customCategories] : categories).map((category) => (
                <div
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-auto px-4 py-2 flex items-center justify-center rounded-[30px] cursor-pointer border-2 transition-all duration-300 ${
                    selectedCategories.includes(category) ? 'border-blue-500 text-blue-500' : 'border-gray-400 text-white'
                  }`}
                >
                  {category}
                </div>
              ))}
              {/* 추가 버튼 */}
              {isEditMode && (
                <button
                  onClick={handleAddCategory}
                  className="w-16 h-10 flex items-center justify-center rounded-[30px] cursor-pointer border-2 border-gray-400 text-white transition-all duration-300 hover:border-blue-500 hover:text-blue-500"
                >
                  +
                </button>
              )}
            </div>

            {/* 수정 / 완료 & 삭제 버튼 */}
            <div className="flex justify-center w-full mt-3">
              {isEditMode ? (
                <>
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => {
                      setIsEditMode(false) // 수정 모드 종료
                      setSelectedCategories(categories) // 기존 선택 복원
                    }}
                    className="px-6 py-2 text-red-400"
                  >
                    취소
                  </button>
                  {/* 완료 버튼 */}
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
        </div>
        <div className="flex flex-col items-start justify-start w-full gap-4">
          <div className="w-full text-3xl text-white">메모</div>
          <div className="w-full py-4 text-lg text-white border-white border-y-2">여기 메모 들어올 예정</div>
        </div>
      </div>
    </div>
  )
}

export default Nod
