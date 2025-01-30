import React from 'react'

type LogProps = {
  content: string
  name: string
  createdAt: string
}

const Log: React.FC<LogProps> = ({ content, name, createdAt }) => {
  // createdAt을 Date 객체로 변환하고 포맷팅
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const year = date.getFullYear().toString().slice(-2) // 마지막 두 자릿수만
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // 월은 0부터 시작하므로 +1
    const day = date.getDate().toString().padStart(2, '0') // 두 자리로 맞추기
    const hours = date.getHours().toString().padStart(2, '0') // 두 자리로 맞추기
    const minutes = date.getMinutes().toString().padStart(2, '0') // 두 자리로 맞추기

    return `${year}/${month}/${day} ${hours}:${minutes}`
  }

  const formattedDate = formatDate(createdAt)

  console.log('Log Component Props:', { content, name, createdAt, formattedDate })

  return (
    <div className="relative z-30 visible p-4 text-white border-r-2 bg-recordColor/60 border-y-2 border-customColor2 backdrop-blur-md">
      <div className="flex justify-between">
        <div className="text-[25px] text-white mb-3">{name}</div>
        <div className="mt-3 text-dateColor">{formattedDate}</div>
      </div>
      <div className="relative overflow-hidden leading-relaxed text-justify text-white max-h-24">
        <p className="relative z-20">{content}</p>
      </div>
    </div>
  )
}

export default Log
