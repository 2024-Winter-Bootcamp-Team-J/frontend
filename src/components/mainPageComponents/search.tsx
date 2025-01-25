import React, { useState } from 'react'
import dummyData from '../../dummyData/Dummy' // Dummy 데이터를 불러옴

const Search: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false) // 검색 결과 표시 상태

  // 검색어로 필터링된 데이터
  const filteredData = dummyData.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.memo.toLowerCase().includes(query.toLowerCase()) ||
      item.category.some((cat: string) => cat.toLowerCase().includes(query.toLowerCase())), // 카테고리 배열 필터링
  )

  const handleFocus = () => {
    setIsFocused(true)
    setTimeout(() => setShowResults(true), 300) // 입력창이 길어진 후 결과 표시
  }

  const handleBlur = () => {
    setShowResults(false)
    setTimeout(() => setIsFocused(false), 300) // 결과가 사라진 후 입력창 줄이기
  }

  return (
    <div className="relative">
      {/* 검색 입력창 */}
      <div
        className={`flex items-center h-[44px] transition-all duration-500 ease-in-out border-2 shadow-lg rounded-md border-customColor2 bg-customColor/70 backdrop-blur-md hover:bg-customColor2/70`}
        style={{
          width: isFocused ? '500px' : '300px', // 좌측으로 길어지게 설정
          right: '0px', // 우측 고정
          position: 'absolute', // 위치 고정
        }}
      >
        <input
          type="text"
          placeholder="검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // 검색어 상태 업데이트
          className="flex-grow ml-3 text-white placeholder-gray-400 bg-transparent focus:outline-none"
          onFocus={handleFocus} // 포커스 시 상태 변경
          onBlur={handleBlur} // 포커스 해제 시 상태 변경
        />
      </div>

      {/* 검색 결과 */}
      {isFocused && query && (
        <div
          className={`absolute mt-2 bg-customColor2/70 border border-recordColor rounded-md shadow-lg overflow-y-auto max-h-[300px] backdrop-blur-md transition-opacity duration-500 ease-in-out ${
            showResults ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          style={{
            width: isFocused ? '500px' : '300px', // 검색창과 같은 너비
            top: '50px', // 검색창 바로 아래로 위치
            right: '0px', // 우측 고정
          }}
        >
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div key={index} className="flex items-center p-4 text-white border-b border-gray-700 last:border-b-0 hover:bg-gray-700">
                {/* 1번 공간: 프로필 이미지 + 이름 */}
                <div className="flex-shrink-0 w-[150px] flex items-center">
                  {/* 프로필 이미지 */}
                  <div className="flex items-center justify-center w-10 h-10 mr-4 text-white bg-gray-500 rounded-full">
                    <img src={item.profile} alt="profile" className="object-cover w-full h-full rounded-full" />
                  </div>
                  {/* 이름 */}
                  <div className="text-base font-bold">{item.name}</div>
                </div>

                {/* 2번 공간: 메모, 카테고리, 시간 */}
                <div className="flex-grow pl-4 border-l-2 border-gray-600">
                  <div className="mb-2 text-sm text-gray-400">{item.memo}</div>
                  <div className="flex items-center justify-between pr-3">
                    <div className="flex space-x-2">
                      {/* 다중 카테고리 렌더링 */}
                      {item.category.map((cat, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-400">검색 결과가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
