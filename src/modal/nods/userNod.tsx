import React, { useState, useEffect } from 'react'
import ProfileCard from '../nods/userNodeProfileFriend'

interface NodProps {
  node: {
    id: string
    profile?: string
  } | null
  onClose: () => void
}

const UserNod: React.FC<NodProps> = ({ node, onClose }) => {
  const [isVisible, setIsVisible] = useState(true) // Nod 표시 여부 상태
  const [isExpanded, setIsExpanded] = useState(true) // Nod 창이 축소 상태로 시작되도록 설정

  // 페이지 전체 스크롤 비활성화
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    // 컴포넌트 언마운트 시 스크롤 복구
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

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

  // Nod 컴포넌트가 비활성화되면 null 반환
  if (!isVisible || !node) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div
        className={`relative rounded-[30px] flex flex-col py-4 px-10 transition-all duration-300 overflow-hidden ${isExpanded ? 'w-[500px] h-[700px] bg-nodColor' : 'w-screen h-screen rounded-none'}`}
        style={{ maxHeight: isExpanded ? '700px' : '100vh' }}
      >
        {/* 닫기 버튼 */}
        <button onClick={handleClose} className="absolute p-4 text-2xl text-white rounded-full top-4 right-6" aria-label="Close">
          <img src="/src/assets/CloseButton.png" alt="Close" className="w-8 h-8" />
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

        <div className="flex flex-col items-center w-full h-full">
          <div className="flex flex-col items-center w-full mb-4">
            {/* 상단 프로필 */}
            <div className="flex items-center justify-center bg-gray-300 rounded-full h-36 oveflow-hidden w-36">
              {node.profile ? <img src={node.profile} alt={`${node.id} Profile`} /> : <div className="text-white">No Image</div>}
            </div>

            {/* 이름 */}
            <h2 className="mt-4 text-2xl font-bold text-white">{node.id}</h2>
          </div>

          {/* 모달 하단 영역 */}
          <div className="flex flex-col flex-grow w-full">
            {/* 메모 공간 (축소 상태일 때만 표시) */}
            {isExpanded && (
              <div className="flex-grow w-full">
                <div className="justify-start mb-10 text-3xl text-white border-b-2 border-white">연관 인물</div>

                <div className="flex flex-wrap gap-4 overflow-y-scroll" style={{ maxHeight: '350px' }}>
                  <ProfileCard isExpanded={false} />
                </div>
              </div>
            )}

            {/* 작성 글 공간 (확대 상태일 때만 표시) */}
            {!isExpanded && (
              <div className="flex-grow w-full ">
                <div className="justify-start mb-10 text-lg text-white border-b-2 border-white">연관 인물</div>
                <div className="flex flex-wrap gap-4">
                  <ProfileCard isExpanded={true} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserNod
