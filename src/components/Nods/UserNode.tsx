import React from 'react'

type UserNodeProps = {
  x: number
  y: number
}

const UserNode: React.FC<UserNodeProps> = ({ x, y }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className="user-node">
      <circle r={40} fill="#ffcc00" />
      <text x={50} y={5} fontSize={14} textAnchor="start" fill="#fff">
        User
      </text>
    </g>
  )
}

export default UserNode
