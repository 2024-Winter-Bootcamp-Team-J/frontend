import React, { useState, useEffect } from 'react';
import axios from "axios";
import dayjs from 'dayjs';

const Search: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false); // 검색 결과 표시 상태
  const [results, setResults] = useState([]); // 검색 결과 상태
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 검색 API 호출 함수
  const fetchSearchResults = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/search`, {
        params: { query: searchQuery },
      });
      setResults(response.data.results || []); // API 응답 구조에 맞게 결과 상태 설정
    } catch (error) {
      console.error('검색 결과를 가져오는 중 오류 발생:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 검색어 변경 시 API 호출
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]); // 검색어가 없으면 결과 초기화
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults(query); // 결과를 string
    }, 500); // 검색어 입력 후 500ms 대기

    return () => clearTimeout(delayDebounceFn); // 이전 호출 취소
  }, [query]);

  const handleFocus = () => {
    setIsFocused(true);
    setTimeout(() => setShowResults(true), 300); // 입력창이 길어진 후 결과 표시
  };

  const handleBlur = () => {
    setShowResults(false);
    setTimeout(() => setIsFocused(false), 300); // 결과가 사라진 후 입력창 줄이기
  };

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
          className="flex-grow py-2 ml-3 text-2xl text-white placeholder-white bg-transparent focus:outline-none"
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
          {loading ? (
            <div className="p-4 text-gray-400">로딩 중...</div>
          ) : results.length > 0 ? (
            results.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center p-4 text-white border-b border-gray-700 last:border-b-0 hover:bg-gray-700"
              >
                <div className='flex flex-col items-baseline justify-between w-full'>
                  <div className="mt-1 text-xl text-gray-300">{item.content || ''}</div>
                  <div className="flex justify-end w-full mt-2 text-base text-gray-500">
                    {item.name} {item.created_at ? dayjs(item.created_at).format('YY/MM/DD HH:mm') : ''}
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
  );
};

export default Search;
