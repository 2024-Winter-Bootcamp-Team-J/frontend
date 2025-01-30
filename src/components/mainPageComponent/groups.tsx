import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full px-4 py-2 text-xl text-white border-2 rounded-t-lg border-recordColor bg-customColor/60 backdrop-blur-lg ">
        그룹 목록 {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="text-xl text-white border-2 rounded-b-xl bg-customColor/70 backdrop-blur-xl border-recordColor">
          {groupItems.map((item) => (
            <div
              key={item.id}
              className="p-3 cursor-pointer hover:bg-recordColor/70"
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
