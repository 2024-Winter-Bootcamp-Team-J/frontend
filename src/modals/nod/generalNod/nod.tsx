import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NodeMemo from './nodMemo';
import NodImg from './nodImg';
import '../../../index.css'

interface NodProps {
  node: {
    id: string;
    node_img?: string;
    relation_type_id?: number[];
    name?: string;
    memo?: string;
    time?: string;
    node_id?: number;
  } | null;
  onClose: () => void;
}

const Nod: React.FC<NodProps> = ({ node, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [nodeImg, setNodeImg] = useState<string | undefined>(node?.node_img);
  const [memos, setMemos] = useState<{ memo_id: number; content: string; created_at: string }[]>([]);
  const [relationTypes, setRelationTypes] = useState<{ [key: number]: string }>({});

  // ✅ relation_type_id 별 관계명 가져오기 (중복 제거)
  useEffect(() => {
    const fetchRelationTypes = async () => {
      if (!node?.relation_type_id || node.relation_type_id.length === 0) {
        console.log('❌ 관계 유형 ID 없음');
        return;
      }

      try {
        const typeMap: { [key: number]: string } = {};

        await Promise.all(
          node.relation_type_id.map(async (id) => {
            try {
              const response = await axios.get(`http://localhost:8000/relations/types/${id}`);
              console.log(`📌 관계 유형 응답 (${id}):`, response.data);

              if (response.data && response.data.name) {
                typeMap[id] = response.data.name;
              } else {
                console.warn(`⚠️ ID ${id} 관계명 없음, 기본값 사용`);
                typeMap[id] = '알 수 없음';
              }
            } catch (error) {
              console.error(`❌ ID ${id} 관계 유형 요청 실패:`, error);
              typeMap[id] = '에러 발생';
            }
          })
        );

        console.log('📌 최종 관계 유형:', typeMap);
        setRelationTypes(typeMap);
      } catch (error) {
        console.error('❌ 관계 유형 데이터 가져오기 실패:', error);
      }
    };

    fetchRelationTypes();
  }, [node?.relation_type_id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (node?.node_id) {
      const fetchMemos = async () => {
        try {
          const url = `http://localhost:8000/memos/memoListByUser/${node.node_id}`;
          const response = await axios.get(url);
          setMemos(response.data);
        } catch (error) {
          console.error('메모 데이터를 가져오는 중 오류 발생:', error);
        }
      };
      fetchMemos();
    }
  }, [node?.node_id]);

  const handleImageUpdate = (newImageUrl: string) => {
    setNodeImg(newImageUrl);
  };

  const handleClose = (): void => {
    window.location.reload();
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleExpand = (): void => {
    setIsExpanded(false);
  };

  const handleShrink = (): void => {
    setIsExpanded(true);
  };

  if (!node) return null;

  // ✅ 중복 제거된 관계 유형 목록 생성
  const uniqueCategories = Array.from(new Set(Object.values(relationTypes)));

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xl transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`relative rounded-[30px] flex flex-col items-center py-4 px-10 transition-all duration-300 ${
          isExpanded ? 'w-[500px] h-[700px] bg-nodColor' : 'w-screen h-screen rounded-none'
        }`}
      >
        {/* 닫기 버튼 */}
        <button onClick={handleClose} className="absolute p-4 text-2xl text-white top-4 right-6 hover:scale-125">
          <img src="/src/assets/CloseButton.png" alt="Close" className="w-8 h-8" />
        </button>
        
        {/* 확장/축소 버튼 */}
        {isExpanded ? (
          <button onClick={handleExpand} className="absolute p-4 text-white top-4 left-6 hover:scale-125">
            <img src="/src/assets/확대.png" alt="Expand" className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={handleShrink} className="absolute p-4 text-white top-4 left-6 hover:scale-125">
            <img src="/src/assets/축소.png" alt="Shrink" className="w-6 h-6" />
          </button>
        )}

        {/* 프로필 이미지 및 ID */}
        <div className="flex flex-col items-center w-full">
          <NodImg nodeImg={nodeImg || '/path/to/default-image.png'} nodeId={node.node_id!} onImageUpload={handleImageUpdate} />
          <h2 className="mt-4 text-2xl font-bold text-white">{node.id}</h2>
        </div>

        {/* ✅ 카테고리 UI (중복 제거) */}
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {uniqueCategories.length > 0 ? (
            uniqueCategories.map((category, index) => (
              <span key={index} className="px-3 py-1 mt-4 text-sm text-white border-2 border-white rounded-full">
                {category}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">관계 없음</span>
          )}
        </div>

        {/* 메모 목록 */}
        <div className='w-full mt-6 text-3xl text-white border-b-2'>메모</div>
        <div className="flex flex-col w-full mt-6 mb-4 overflow-y-auto text-white transition-opacity duration-300 scrollbar-hidden">
          {memos.length > 0 ? (
            <NodeMemo memos={memos} />
          ) : (
            <div>No memos available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nod;
