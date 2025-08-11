// src/components/Purpose/3DShareModal.tsx

import React from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50">
      <div className="bg-white rounded-2xl w-[324px] pt-10 pb-6 px-6 shadow-lg">
        <div className="text-center text-[16px] font-medium mb-6">
          URL이 클립보드에 복사되었습니다.
        </div>
        <button
          onClick={onClose}
          className="w-full bg-[#FFEB9D] text-black font-semibold py-3 rounded-xl text-[16px]"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default ShareModal;