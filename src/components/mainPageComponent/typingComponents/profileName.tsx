import React, { useState, useEffect } from 'react'
import UserIcon from '../../../assets/UserIcon.png'
interface Profile {
  id: string
  name: string
  icon?: string
}

interface ProfilenameProps {
  profiles: Profile[] // 여러 프로필 정보를 받음
  onSelectNode: (id: string) => void // 선택된 프로필 ID를 부모에 전달
}

const Profilename: React.FC<ProfilenameProps> = ({ profiles, onSelectNode }) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)

  useEffect(() => {
    if (profiles.length > 0 && !selectedProfile) {
      const defaultProfileId = profiles[0].id // 기본으로 첫 번째 프로필 선택
      setSelectedProfile(defaultProfileId)
      onSelectNode(defaultProfileId)
    }
  }, [profiles, selectedProfile, onSelectNode])

  const handleSelect = (id: string) => {
    setSelectedProfile((prev) => (prev === id ? null : id)) // 선택된 프로필 토글
    onSelectNode(id) // 선택된 프로필 ID 전달
  }

  return (
    <div className="relative flex flex-wrap items-center justify-center gap-5 mx-4 mt-7">
      {profiles.map((profile) => (
        <div key={profile.id} className="flex flex-col items-center justify-center">
          <div
            onClick={() => handleSelect(profile.id)}
            className={`relative rounded-full w-[90px] h-[90px] bg-customColor2 bg-center bg-cover border-2 border-white cursor-pointer transition-all duration-300 ${
              selectedProfile === profile.id ? 'border-2 border-blue-400' : ''
            }`}
            style={{
              backgroundImage: `url(${profile.icon || UserIcon})`,
            }}
          >
            {selectedProfile === profile.id && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full top-1/2 left-1/2 blur-lg"
                style={{
                  width: '100px',
                  height: '100px',
                  filter: 'blur(15px)',
                  zIndex: -1,
                }}
              />
            )}
          </div>
          <div className={`text-lg text-white mt-4 ${selectedProfile === profile.id ? 'text-blue-400' : ''}`}>{profile.name}</div>
        </div>
      ))}
    </div>
  )
}

export default Profilename
