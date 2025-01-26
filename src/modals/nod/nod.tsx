import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NodeMemo from './nodMemo';

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
  const [memos, setMemos] = useState<{ memo_id: number; content: string; created_at: string }[]>([]);
  const [categories, setCategories] = useState<number[]>(node?.relation_type_id || []);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [customCategories, setCustomCategories] = useState<number[]>([]);

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
    if (node?.relation_type_id) {
      setCategories(node.relation_type_id);
    }
  }, [node?.relation_type_id]);

  useEffect(() => {
    if (node?.node_id) {
      const fetchMemos = async () => {
        try {
          const url = `http://localhost:8000/memos/memoListByUser/${node.node_id}`;
          console.log(`API 요청 URL: ${url}`);
          const response = await axios.get(url);
          console.log('API 응답 데이터:', response.data);
          setMemos(response.data);
        } catch (error) {
          console.error('메모를 가져오는 중 오류 발생:', error);
          setMemos([]);
        }
      };
      fetchMemos();
    }
  }, [node?.node_id]);

  const handleCategorySelect = (category: number): void => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  };

  const handleAddCategory = (): void => {
    const newCategory = parseInt(prompt('추가할 카테고리 번호를 입력하세요:') || '', 10);
    if (!isNaN(newCategory) && !categories.includes(newCategory)) {
      setCustomCategories((prev) => [...prev, newCategory]);
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  const handleClose = (): void => {
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
        <button onClick={handleClose} className="absolute p-4 text-2xl text-white top-4 right-6 hover:scale-125">
          <img src="/src/assets/CloseButton.png" alt="Close" className="w-8 h-8" />
        </button>
        {isExpanded ? (
          <button onClick={handleExpand} className="absolute p-4 text-white top-4 left-6 hover:scale-125">
            <img src="/src/assets/확대.png" alt="Expand" className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={handleShrink} className="absolute p-4 text-white top-4 left-6 hover:scale-125">
            <img src="/src/assets/축소.png" alt="Shrink" className="w-6 h-6" />
          </button>
        )}
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center justify-center overflow-hidden bg-gray-300 border-4 rounded-full h-36 w-36">
            {node.node_img ? (
              <img src={node.node_img} alt={`${node.id} Profile`} className="object-cover w-full h-full" />
            ) : (
              <img src="/path/to/default-image.png" alt="Default Profile" className="object-cover w-full h-full" />
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">{node.id}</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center w-full gap-4 mt-5">
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 rounded-[30px] cursor-pointer border-2 ${
                selectedCategories.includes(category) ? 'border-blue-500 text-blue-500' : 'border-gray-400 text-white'
              }`}
            >
              {`Category ${category}`}
            </div>
          ))}
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 rounded-[30px] border-2 border-gray-400 text-white hover:border-blue-500"
          >
            +
          </button>
        </div>
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
