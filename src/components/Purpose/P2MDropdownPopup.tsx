import React from 'react'; 

interface P2MDropdownPopupProps {
  onClose: () => void;
  selectedItems: string[];
  onSelect: (item: string) => void;
  activeItem: string;
}

const P2MDropdownPopup: React.FC<P2MDropdownPopupProps> = ({ 
  onClose, 
  selectedItems, 
  onSelect, 
  activeItem
}) => {

  
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleButtonClick = (item: string) => {
    onSelect(item); 
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50 bg-gray-800/50"
      onClick={onClose} 
    >
      <div
        className="bg-white min-h-[150px] rounded-t-[30px] shadow-lg relative w-full text-center"
        onClick={handlePopupClick}
      >
        <div className="px-[32px] flex flex-col items-start pt-[20px] pb-[27px]">
          <h2 className="text-[22px] font-semibold">목적 선택</h2>
          <div className="w-full flex flex-wrap gap-[12px] mt-[15px]">
            {selectedItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(item)}
                className={`h-[38px] text-[16px] font-medium cursor-pointer rounded-full px-[24px] whitespace-nowrap border
                  ${activeItem === item ? 'bg-[#FFEC8F] border-transparent' : 'bg-white border-[#C7C7C7]'}
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default P2MDropdownPopup;