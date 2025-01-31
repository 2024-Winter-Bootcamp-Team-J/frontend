import React, { useState, useEffect } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

const Search: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  // ✅ JWT 토큰 & user_id 가져오기
  const token = localStorage.getItem('accessToken') || ''
  const userId = localStorage.getItem('userId') || ''

  console.log('✅ 현재 Access Token:', token)
  console.log('✅ 현재 User ID:', userId)

  // ✅ 토큰이 없으면 로그인 페이지로 리디렉트
  useEffect(() => {
    if (!token) {
      console.warn('❌ JWT 토큰이 없습니다. 로그인 페이지로 이동하세요.')
      alert('세션이 만료되었습니다. 다시 로그인해주세요.')
    }
  }, [token])

  // 검색 API 호출 함수
  const fetchSearchResults = async (searchQuery: string) => {
    if (!token) {
      console.error('❌ JWT 토큰 없음. 검색 요청 중단')
      return
    }

    setLoading(true)
    try {
      console.log(`📡 검색 요청: query="${searchQuery}"`)
      const response = await axios.get(`https://api.link-in.site/search`, {
        params: { query: searchQuery },
        headers: {
          Authorization: `Bearer ${token}`, // ✅ JWT 인증 헤더 추가
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true, // ✅ 쿠키 인증 (CSRF 대응)
      })

      console.log('🔹 검색 결과:', response.data)
      setResults(response.data.results || [])
    } catch (error: any) {
      console.error('❌ 검색 오류:', error.response?.data || error.message)

      // ✅ 인증 오류(401) 발생하면 로그아웃 처리
      if (error.response?.status === 401) {
        console.warn('⚠️ JWT 토큰 만료됨. 로그아웃 처리 필요')
        alert('세션이 만료되었습니다. 다시 로그인해주세요.')
      }

      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // 검색어 변경 시 API 호출
  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      return
    }
    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults(query)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleFocus = () => {
    setIsFocused(true)
    setTimeout(() => setShowResults(true), 300)
  }

  const handleBlur = () => {
    setShowResults(false)
    setTimeout(() => setIsFocused(false), 300)
  }

  return (
    <div className="relative">
      {/* 검색 입력창 */}
      <div
        className={`flex items-center h-[48px] transition-all duration-500 ease-in-out border-2 shadow-lg rounded-md border-customColor2 bg-customColor/70 backdrop-blur-md hover:bg-customColor2/70`}
        style={{
          width: isFocused ? '500px' : '300px',
          right: '0px',
          position: 'absolute',
        }}
      >
        <input
          type="text"
          placeholder="검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow py-2 ml-3 text-2xl text-white placeholder-white bg-transparent focus:outline-none"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {/* 검색 결과 */}
      {isFocused && query && (
        <div
          className={`absolute mt-2 bg-customColor2/70 border border-recordColor rounded-md shadow-lg overflow-y-auto max-h-[300px] backdrop-blur-md transition-opacity duration-500 ease-in-out ${
            showResults ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          style={{
            width: isFocused ? '500px' : '300px',
            top: '50px',
            right: '0px',
          }}
        >
          {loading ? (
            <div className="p-4 text-gray-400">로딩 중...</div>
          ) : results.length > 0 ? (
            results.map((item: any, index: number) => (
              <div key={index} className="flex items-center p-4 text-white border-b border-gray-700 last:border-b-0 hover:bg-gray-700">
                <div className="flex flex-col items-baseline justify-between w-full">
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
  )
}

export default Search
