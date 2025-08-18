import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (file: File) => void;
};

const ImagePickerModal: React.FC<Props> = ({ open, onClose, onSelect }) => {
  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onSelect(file); // 부모로 파일 전달
    onClose(); // 선택 후 모달 닫기
    e.currentTarget.value = ""; // 같은 파일 재선택 가능하도록 초기화
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end z-50"
      role="dialog"
      aria-modal="true"
      onClick={onClose} // 오버레이 클릭 시 닫기
    >
      <div
        className="w-full bg-white rounded-t-2xl px-6 py-4"
        onClick={(e) => e.stopPropagation()} // 내부 클릭은 버블링 막기
      >
        <p className="text-[18px] font-semibold mb-4">제품 사진 추가하기</p>

        <div className="flex flex-col">
          {/* 카메라 촬영 */}
          <label className="w-full h-[90px] text-left text-[18px] py-3 px-4 border-b border-[#D9D9D9] cursor-pointer flex items-center">
            <img
              src="/images/cameraModal.png"
              alt="camera icon"
              className="w-[50px] h-[50px] mr-[22px]"
            />
            카메라로 촬영하기
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleChange}
            />
          </label>

          {/* 앨범에서 선택 */}
          <label className="w-full h-[90px] text-left text-[18px] py-3 px-4 cursor-pointer flex items-center">
            <img
              src="/images/galleryModal.png"
              alt="gallery icon"
              className="w-[50px] h-[50px] mr-[22px]"
            />
            사진 앨범에서 선택하기
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImagePickerModal;
