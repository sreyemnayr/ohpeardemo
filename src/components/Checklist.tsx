import React, { useState } from 'react';
import { CheckCircle, CircleDashed } from 'lucide-react';

interface ChecklistProps {
  items: string[];
}

export const Checklist: React.FC<ChecklistProps> = ({ items }) => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(items.length).fill(false));

  const toggleItem = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  return (
    <ul className="list-none flex flex-wrap items-center justify-center text-sm text-raisin-black mb-4">
      {items.map((item, index) => (
        <li 
          key={`${item}-${index}`} 
          className={`mr-4 cursor-pointer ${checkedItems[index] ? 'opacity-60' : ''}`}
          onClick={() => toggleItem(index)}
        >
          {checkedItems[index] ? (
            <CheckCircle className="w-3 h-3 mr-1 inline-block" />
          ) : (
            <CircleDashed className="w-3 h-3 mr-1 inline-block" />
          )}
          {item}
        </li>
      ))}
    </ul>
  );
};

export default Checklist;
