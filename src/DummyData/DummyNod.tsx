import React from 'react'

type DummyNodProps = {
  width?: number
  height?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  onClose: () => void // 닫기 버튼 클릭 시 실행될 콜백 함수
}

const DummyNod: React.FC<DummyNodProps> = ({
  width = 450, // 기본값 설정
  height = 550,
  fill = '#FFFFFF',
  stroke = '#333',
  strokeWidth = 2,
  onClose,
}) => {
  return (
    <div
      className="relative border rounded-lg shadow-lg"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: fill,
        border: `${strokeWidth}px solid ${stroke}`,
      }}
    >
      {/* 닫기 버튼 */}
      <button onClick={onClose} className="absolute flex items-center justify-center w-6 h-6 text-gray-600 bg-gray-200 rounded-full top-2 right-2 hover:bg-gray-300">
        ✕
      </button>
      {/* Nod 내용 */}
      <div className="flex items-center justify-center h-full">
        <p className="text-lg font-bold text-gray-800">Hello, Dummy Node!</p>
      </div>
    </div>
  )
}

export default DummyNod
