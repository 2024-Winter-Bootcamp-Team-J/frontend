import React from 'react'

type NodeProps = {
  data: {
    id: string
    group: string[]
    x?: number
    y?: number
  }
  isGroupNode: boolean
}

const Node: React.FC<NodeProps> = ({ data, isGroupNode }) => {
  return (
    <g transform={`translate(${data.x ?? 0}, ${data.y ?? 0})`}>
      <circle r={isGroupNode ? 30 : 20} fill={isGroupNode ? '#ff7f0e' : '#69b3a2'} />
      <text x={isGroupNode ? 35 : 25} y={5} fontSize={12} textAnchor="start" fill="#fff">
        {isGroupNode ? data.id.replace('Group_', '') : data.id}
      </text>
    </g>
  )
}

export default Node
