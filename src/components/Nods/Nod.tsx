import React, { useState, useEffect } from 'react';



const Nod: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true); // Nod 표시 여부 상태
  const [isExpanded, setIsExpanded] = useState(false); // Nod 창 크기 상태
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // 페이지 전체 스크롤 비활성화
  useEffect(() => {
    document.body.style.overflow = 'hidden';

  // 컴포넌트 언마운트 시 스크롤 복구
    return () => {
      document.body.style.overflow = '';
    };
  });

 // 카테고리 선택
  const handleCategorySelect = (category: string): void => {
    setSelectedCategory(category);
  }

  // 닫기 버튼 클릭 처리 함수
  const handleClose = (): void => {
    setIsVisible(false);
  };

  // 확대 버튼 클릭 처리 함수
  const handleExpand = (): void => {
    setIsExpanded(true);
  };

  // 축소 버튼 클릭 처리 함수
  const handleShrink = (): void => {
    setIsExpanded(false);
  };

  // Nod 컴포넌트가 비활성화되면 null 반환
  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black/50">
      <div
        className={`relative bg-black rounded-[30px] flex flex-col items-center p-20 transition-all duration-300 ${
          isExpanded ? 'w-[800px] h-[800px]' : 'w-[500px] h-[660px]'}`}
      >
       
       {/* 닫기 버튼 */}
       <button
          onClick={handleClose}
          className="absolute top-4 right-8 p-2 rounded-full text-white"
          aria-label="Close"
        >
          ✖︎
        </button>

        {/* 확대 버튼 (축소 상태에서만 표시) */}
        {!isExpanded && (
          <button
            onClick={handleExpand}
            className="absolute top-4 left-6 p-4 rounded-full text-white"
            aria-label="Expand"
          >
            <img
              src="/src/assets/확대.png"
              alt="Expand"
              className="w-4 h-4"
            />
          </button>
        )}

        {/* 축소 버튼 (확대 상태에서만 표시) */}
        {isExpanded && (
          <button
            onClick={handleShrink}
            className="absolute top-4 left-4 p-4 rounded-full text-white"
            aria-label="Shrink"
          >
            <img
              src="/src/assets/축소.png"
              alt="Shrink"
              className="w-6 h-6"
            />
          </button>
        )}
       
        {/* 상단 프로필 */}
        <div className="flex flex-col items-center mt-0">

          {/* 프로필 사진 영역 */}
          <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center"></div>

          {/* 이름 */}
          <h2 className="mt-4 text-2xl font-bold text-white">이름</h2>
        </div>

        {/* 카테고리 선택 */}
        <div className="mt-4 w-full flex justify-center gap-4">
          {['친구', '직장','+'].map((category) => (
            <div
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`w-24 h-12 flex items-center justify-center rounded-[30px] cursor-pointer border-2 transition-all duration-300 ${
                selectedCategory === category
                  ? 'border-blue-500 text-blue-500'
                  : 'border-gray-400 text-white'
              }`}
            >
              {category}
            </div>
          ))}
        </div>

        {/* 수정 버튼 */}
        <div className="mt-3 w-full flex justify-center">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-[30px] hover:bg-blue-600">
            수정
          </button>
        </div>

        {/* 메모 공간 (축소 상태일 때만 표시) */}
        {!isExpanded && (
          <div className="mt-0 w-full px-4">
            <div className="block text-white text-lg font-semibold mb-2">
              메모
            </div>
            <div className="text-white border-y-2 p-4 text-gray-800 bg-black/70">
              텍스트가 여기에 표시됩니다.
            </div>
          </div>
        )}

        {/* 작성 글 공간 (확대 상태일 때만 표시) */}
        {isExpanded && (
          <div className="mt-0 w-full px-4">
            <div className="block text-white text-lg font-semibold mb-2">
              작성 글
            </div>
            <div className="text-white border-y-2 p-4 text-gray-800 bg-black/70">
              작성 글이 여기에 표시됩니다.
            </div>
          </div>
        )}

       
      </div>
    </div>
  );
};


export default Nod
