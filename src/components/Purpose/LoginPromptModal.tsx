import React from "react";
import { useNavigate } from "react-router-dom";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirm = () => {
    navigate('/login');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50">
      <div className="bg-white rounded-[20px] w-[324px] pt-10 pb-6 px-6 shadow-lg">
        <div className="text-center text-[16px] font-medium mb-[20px]">
          로그인 후 이용할 수 있는 기능입니다.
        </div>
        <button
          onClick={handleConfirm}
          className="w-full bg-[#FFEB9D] text-black font-semibold py-3 rounded-xl text-[16px]"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default LoginPromptModal;