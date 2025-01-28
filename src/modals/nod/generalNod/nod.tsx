import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NodeMemo from './nodMemo';
import NodImg from './nodImg';

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

  // 화면 열릴 때 body 스크롤 비활성화
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 모달이 표시되도록 설정
  useEffect(() => {
    console.log('모달 표시: node 데이터 확인', node); // 디버깅: 초기 node 데이터 확인
    setIsVisible(true);
  }, []);

  // 메모 데이터 가져오기
  useEffect(() => {
    if (node?.node_id) {
      const fetchMemos = async () => {
        try {
          const url = `http://localhost:8000/memos/memoListByUser/${node.node_id}`;
          console.log('메모 데이터 요청 URL:', url);
          const response = await axios.get(url);
          console.log('메모 데이터 응답:', response.data);
          setMemos(response.data);
        } catch (error) {
          console.error('메모 데이터를 가져오는 중 오류 발생:', error);
        }
      };
      fetchMemos();
    } else {
      console.log('node_id가 없습니다. 메모 데이터를 가져올 수 없습니다.');
    }
  }, [node?.node_id]);

  // 이미지 업로드 후 업데이트
  const handleImageUpdate = (newImageUrl: string) => {
    console.log('업데이트된 node_img URL:', newImageUrl); // 디버깅: 새로운 이미지 URL 확인
    setNodeImg(newImageUrl);
  };

  // 모달 닫기
  const handleClose = (): void => {
    console.log('모달 닫기 실행');
    window.location.reload();
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // 모달 확장
  const handleExpand = (): void => {
    console.log('모달 확장 실행');
    setIsExpanded(false);
  };

  // 모달 축소
  const handleShrink = (): void => {
    console.log('모달 축소 실행');
    setIsExpanded(true);
  };

  if (!node) {
    console.log('노드 데이터가 없습니다.');
    return null;
  }

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
          <NodImg nodeImg={node.node_img || '/path/to/default-image.png'} nodeId={node.node_id!} onImageUpload={handleImageUpdate} />
          <h2 className="mt-4 text-2xl font-bold text-white">{node.id}</h2>
        </div>

        {/* 메모 목록 */}
        <div className="flex flex-col w-full mt-6 text-white">
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
