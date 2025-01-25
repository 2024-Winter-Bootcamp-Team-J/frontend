import React, { useState } from 'react'
import dummyData from '../../DummyData/Dummy'
import Nod from './Nod'

const ProfileCard: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => {
  const [selectedNode, setSelectedNode] = useState<any>(null)

  const handleClick = (item: any) => {
    setSelectedNode(item)
  }

  const handleClose = () => {
    setSelectedNode(null)
  }

  // 데이터를 동적으로 나누는 함수
  const chunkArray = (array: any[], chunkSize: number) => {
    const chunks = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  // isExpanded에 따라 열의 개수 설정
  const columns = isExpanded ? 6 : 3

  // 데이터를 동적으로 나누기
  const chunkedData = chunkArray(dummyData, columns)

  return (
    <div className="p-4">
      {/* ProfileCard 리스트 */}
      <div className="w-full space-y-4">
        {chunkedData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`, // 열 개수를 동적으로 설정
            }}
          >
            {row.map((item) => (
              <div
                key={item.name}
                className={`flex flex-col items-center justify-center w-full h-auto p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-all duration-200`}
                onClick={() => handleClick(item)}
              >
                <div
                  className={`flex items-center justify-center w-20 h-20 mb-4 bg-gray-500 rounded-full`}
                  style={{
                    backgroundImage: `url(${item.profile})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
                <div className="text-lg text-white">{item.name}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Nod 컴포넌트 */}
      {selectedNode && (
        <Nod
          node={{
            id: selectedNode.name,
            profile: selectedNode.profile,
            group: selectedNode.category || [],
            memo: selectedNode.memo,
            time: selectedNode.time,
          }}
          onClose={handleClose}
        />
      )}
    </div>
  )
}

export default ProfileCard
