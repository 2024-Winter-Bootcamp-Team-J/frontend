import React from 'react'
import UserIcon from '../../assets/UserIcon.png'

const NodeProp: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 mt-10 snap-x">
      <div
        className="rounded-full w-[90px] h-[90px] bg-customColor2 bg-center bg-cover"
        style={{
          backgroundImage: `url(${UserIcon})`,
        }}
      ></div>
      <div className="text-lg text-white ">name</div>
    </div>
  )
}

export default NodeProp
