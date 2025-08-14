// src/components/Purpose/LoginPromptModal.tsx
import React from "react";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50">
      <div className="bg-white p-6 rounded-lg w-[300px] text-center">
        <h2 className="text-lg font-medium mb-4">로그인이 필요합니다</h2>
        <p className="mb-6">로그인 후 사용 가능합니다. </p>
        <button
          className="px-4 py-2 bg-[#FFEB9D] rounded"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default LoginPromptModal;
