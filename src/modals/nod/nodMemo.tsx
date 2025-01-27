import React from 'react';

interface NodeMemoProps {
  memos: {
    memo_id: number;
    content: string;
    created_at: string;
  }[];
}

const NodeMemo: React.FC<NodeMemoProps> = ({ memos }) => {
  return (
    <div className="flex flex-col w-full text-white ">
      <div className="items-start w-full pb-2 text-3xl border-b-2 border-white">메모</div>
      {memos.map((memo) => (
        <div key={memo.memo_id} className="mt-4 border-b-2 border-customColor2">
          <div className='mb-4 text-xl'>{memo.content}</div>
          <div className="flex justify-end mt-2 mb-2 text-sm text-gray-400">{memo.created_at}</div>
        </div>
      ))}
    </div>
  );
};

export default NodeMemo;
