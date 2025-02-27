import React from 'react'

type LogProps = {
  content: string
  name: string
  createdAt: string
}

const Log: React.FC<LogProps> = ({ content, name, createdAt }) => {
  console.log('Log Component Props:', { content, name, createdAt })
  return (
    <div className="relative z-30 visible p-4 text-white border-r-2 bg-recordColor/60 border-y-2 border-customColor2 backdrop-blur-md">
      <div className="flex justify-between">
        <div className="text-[25px] text-white mb-3">{name}</div>
        <div className="mt-3 text-dateColor">{createdAt}</div>
      </div>
      <div className="relative overflow-hidden leading-relaxed text-justify text-white max-h-24">
        <p className="relative z-20">{content}</p>
      </div>
    </div>
  )
}

export default Log
