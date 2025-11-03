// (링크 복사 등이 완료되었을 때 뜨는 확인 모달입니다.)
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

function ConfirmModal({ open, onClose, message }: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="absolute top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
        <p className="mb-5 text-center whitespace-pre-line text-gray-700">
          {message}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="h-10 min-w-[120px] rounded-xl bg-[#FFE17E] font-semibold text-black hover:brightness-95"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
