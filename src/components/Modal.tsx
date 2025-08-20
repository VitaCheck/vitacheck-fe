import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function Modal({
  open,
  title = "확인",
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="닫기"
        onClick={onCancel}
      />

      {/* panel */}
      <div
        ref={panelRef}
        className="relative w-[min(320px,92vw)] rounded-2xl bg-white p-5 shadow-xl"
      >
        <h3 className="text-center text-[18px] sm:text-[20px] font-semibold">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-center text-[14px] text-[#7A7A7A]">
            {description}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-lg bg-[#F1F1F1] text-[14px] text-[#1C1B1F] cursor-pointer hover:bg-[#bab8b8a7]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-lg bg-[#FF7E7E] text-[14px] text-white cursor-pointer hover:bg-[#f95d5d]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
