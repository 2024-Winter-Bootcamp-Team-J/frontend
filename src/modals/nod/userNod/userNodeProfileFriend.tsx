import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nod from '../generalNod/nod';
import generalP from '../../../assets/generalP.png'; // 기본 이미지 import

const ProfileCard: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [profileData, setProfileData] = useState<any[]>([]);

  // API 호출하여 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/node');
        const dataWithDefaultImages = response.data.map((item: any) => ({
          ...item,
          node_img: item.node_img || generalP, // 기본 이미지 설정
        }));
        console.log('Profile data:', dataWithDefaultImages);
        setProfileData(dataWithDefaultImages);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (item: any) => {
    setSelectedNode(item);
  };

  const handleClose = () => {
    setSelectedNode(null);
  };

  const chunkArray = (array: any[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const columns = isExpanded ? 6 : 3;
  const chunkedData = chunkArray(profileData, columns);

  return (
    <div className="p-4">
      {/* ProfileCard 리스트 */}
      <div className="w-full space-y-4">
        {chunkedData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`, // 열 개수를 동적으로 설정
            }}
          >
            {row.map((item) => (
              <div
                key={item.node_id} // node_id를 key로 사용
                className="flex flex-col items-center justify-center w-full h-auto p-4 transition-all duration-200 rounded-lg cursor-pointer hover:bg-gray-600"
                onClick={() => handleClick(item)}
              >
                <div className="flex items-center justify-center w-20 h-20 mb-4">
                  {/* <img> 태그로 이미지 렌더링 */}
                  <img
                    src={item.node_img} // 서버에서 받은 이미지 URL
                    alt={`${item.name} Profile`}
                    className="object-cover w-full h-full rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = generalP; // 로드 실패 시 기본 이미지 설정
                      console.error(`이미지 로드 실패: ${item.node_img}`);
                    }}
                  />
                </div>
                <div className="text-lg text-white">{item.name}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Nod 컴포넌트 */}
      {selectedNode && (
        <Nod
          node={{
            id: selectedNode.name,
            node_img: selectedNode.node_img,
            relation_type_id: selectedNode.relation_type_ids || [],
            name: selectedNode.name,
            time: selectedNode.time,
            node_id: selectedNode.node_id,
          }}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default ProfileCard;
