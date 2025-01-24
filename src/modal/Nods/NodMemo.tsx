import React from 'react'

interface NodeMemoProps {
  memo?: string
  time?: string
}

const NodeMemo: React.FC<NodeMemoProps> = ({ memo, time }) => {
  return (
    <div className="flex flex-col w-full text-white ">
      <div className="items-start w-full pb-2 text-3xl border-b-2 border-white">메모</div>
      <div className="mt-4">{memo || ''}</div>
      <div className="flex justify-end mt-4 text-white">{time || ''}</div>
    </div>
  )
}

export default NodeMemo
