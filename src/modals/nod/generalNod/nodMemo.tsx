import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface NodeMemoProps {
  memos: {
    memo_id: number;
    content: string;
    created_at: string;
  }[];
}

// ✅ API의 `created_at`을 dayjs가 인식할 수 있는 형식으로 변환
const parseCustomDateFormat = (dateString: string) => {
  if (!dateString) return 'Invalid Date';

  // "2025-01-29-21-19-51" -> "2025-01-29T21:19:51"
  const formattedDateString = dateString.replace(/-/g, (match, offset) =>
    offset === 10 ? 'T' : offset === 13 || offset === 16 ? ':' : match
  );

  const date = dayjs.utc(formattedDateString).tz('Asia/Seoul');
  return date.isValid() ? date.format('YY/MM/DD HH:mm') : 'Invalid Date';
};

const NodeMemo: React.FC<NodeMemoProps> = ({ memos }) => {
  return (
    <div className="flex flex-col w-full text-white ">
      {memos.map((memo) => (
        <div key={memo.memo_id} className="mt-4 border-b-2 border-customColor2">
          <div className='mb-4 text-xl'>{memo.content}</div>
          <div className="flex justify-end mt-2 mb-2 text-sm text-gray-400">{parseCustomDateFormat(memo.created_at)}</div>
        </div>
      ))}
    </div>
  );
};

export default NodeMemo;
