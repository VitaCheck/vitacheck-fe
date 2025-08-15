import React, { useState } from 'react'; 

interface BSMDropdownPopupProps {
  onClose: () => void;
  selectedItems: string[];
  onApply: (item: string) => void;
  activeItem: string;
}

const BSMDropdownPopup: React.FC<BSMDropdownPopupProps> = ({ 
  onClose, 
  selectedItems, 
  onApply, 
  activeItem
}) => {

  const [tempSelected, setTempSelected] = useState(activeItem);

  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const toggleSelect = (item: string) => {
    setTempSelected(item);
  };

  const handleApply = () => {
    onApply(tempSelected);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50 bg-gray-800/50"
      onClick={onClose} 
    >
      <div
        className="bg-white rounded-t-[30px] shadow-lg relative w-full text-left"
        onClick={handlePopupClick}
      >
        <div className="flex flex-col pt-[20px] pb-[30px]">
          <h2 className="px-[32px] text-[22px] font-semibold mb-[15px]">성별 선택</h2>
          
          <div className="flex flex-col">
            {selectedItems.map((item, index) => (
               <React.Fragment key={item}>
                  <div
                  className="px-[32px] flex justify-between h-[70px] items-center cursor-pointer"
                  onClick={() => toggleSelect(item)}
                  >
                     <span className="text-[18px] font-medium">{item}</span>
                     <div
                        className={`w-[24px] h-[24px] rounded-[4px] flex items-center border-none justify-center
                           ${tempSelected === item ? 'bg-[#FFC200]' : 'bg-[#EEEEEE]'}`}
                     >
                        {tempSelected === item && (
                           <svg
                           className="w-[24px] h-[20px] text-white"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           viewBox="0 0 24 24"
                           >
                           <path strokeLinecap="butt" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                           </svg>
                        )}
                     </div>
                  </div>

                  {/* 마지막 버튼 뒤에는 선을 넣지 않음 */}
                  {index < selectedItems.length - 1 && (
                     <div className="h-[0.5px] bg-[#C7C7C7] w-full" />
                  )}
               </React.Fragment>
               ))}
            </div>

            <div className='px-[20px] mt-[10px] '>
               <button
                  onClick={handleApply}
                  className="w-full bg-[#FFEB9D] text-black text-[20px] font-semibold h-[58px] rounded-[10px]"
               >
                  적용하기
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BSMDropdownPopup;
