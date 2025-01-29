import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

type GroupProps = {
  isCollapsed: boolean;
  onCategorySelect: (category: string) => void;
};

const Group: React.FC<GroupProps> = ({ isCollapsed, onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupItems, setGroupItems] = useState<{ id: number; name: string }[]>([]);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/relations/types');
        const categories = response.data.map((item: any) => ({ id: item.relation_type_id, name: item.name }));
        setGroupItems([{ id: -1, name: '전체' }, ...categories]);
      } catch (error) {
        console.error('Error fetching relation types:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (groupRef.current && !groupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={groupRef} className={`fixed w-[300px] ${isCollapsed ? '' : 'ml-[300px]'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-4 py-2 border-2 rounded-md">
        그룹 목록 ▼
      </button>
      {isOpen && (
        <div className="bg-gray-700 border-2 rounded-md">
          {groupItems.map((item) => (
            <div
              key={item.id}
              className="p-2 cursor-pointer hover:bg-gray-600"
              onClick={() => onCategorySelect(item.name)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Group;
