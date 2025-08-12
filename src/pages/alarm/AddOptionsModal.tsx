import { useEffect } from "react";
import { FiSearch, FiType } from "react-icons/fi";

interface Props {
  onClose: () => void;
  onSearch: () => void;
  onManual: () => void;
}

const AddOptionsModal = ({ onClose, onSearch, onManual }: Props) => {
  // Esc 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-end"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-2xl px-5 pt-4 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[16px] font-semibold mb-4">영양제 추가하기</div>

        <div className="grid grid-cols-2 gap-3">
          {/* 검색하기 */}
          <button
            onClick={onSearch}
            className="rounded-2xl border border-[#EEEEEE] bg-white px-4 py-5 text-left shadow-sm active:scale-[0.99]"
          >
            <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3">
              <FiSearch className="text-[22px]" />
            </div>
            <div className="text-[14px] font-medium">영양제 검색하기</div>
          </button>

          {/* 직접 입력하기 */}
          <button
            onClick={onManual}
            className="rounded-2xl border border-[#EEEEEE] bg-white px-4 py-5 text-left shadow-sm active:scale-[0.99]"
          >
            <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3">
              <FiType className="text-[22px]" />
            </div>
            <div className="text-[14px] font-medium">직접 입력하기</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOptionsModal;
