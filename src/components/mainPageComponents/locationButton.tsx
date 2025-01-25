import React from 'react'
import LocationIcon from '../../assets/LocationIcon.png'

type LocationButtonProps = {
  moveToUserNode: () => void // 사용자 노드로 이동하는 함수
}

const LocationButton: React.FC<LocationButtonProps> = ({ moveToUserNode }) => {
  return (
    <div
      onClick={moveToUserNode} // 버튼 클릭 시 이동
      className="flex items-center justify-center w-10 h-10 rounded-full shadow-md cursor-pointer bg-customColor2/80 hover:bg-customColor2 backdrop-blur-md"
    >
      <img src={LocationIcon} alt="Location Icon" className="w-6 h-6" />
    </div>
  )
}

export default LocationButton
