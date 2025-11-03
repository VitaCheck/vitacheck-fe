// (모바일용 공유하기 바텀시트입니다.)
interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  onKakao: () => void;
  onCopy: () => void;
}

function ShareSheet({ open, onClose, onKakao, onCopy }: ShareSheetProps) {
  if (!open) return null;

  // TODO: 아이콘 경로는 실제 프로젝트 위치에 맞게 확인해주세요.
  const KAKAO_ICON = "/images/PNG/성분 2-1/kakao.png";
  const LINK_ICON = "/images/PNG/성분 2-1/link.png";

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="닫기"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        className="absolute right-0 bottom-0 left-0 w-full"
        // style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto rounded-t-3xl bg-white shadow-xl">
          <div className="px-5 pt-6 pb-4">
            <h3 className="text-center text-[15px] font-semibold">공유하기</h3>
          </div>
          <button
            onClick={onKakao}
            className="flex w-full items-center gap-3 px-5 py-4 active:bg-gray-50"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full">
              <img
                src={KAKAO_ICON}
                alt="카카오톡"
                className="h-9 w-9 object-contain"
                loading="lazy"
              />
            </span>
            <span className="text-[15px]">카카오톡으로 공유하기</span>
          </button>
          <div className="h-px w-full bg-gray-200" />
          <button
            onClick={onCopy}
            className="flex w-full items-center gap-3 px-5 py-4 active:bg-gray-50"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full">
              <img
                src={LINK_ICON}
                alt="링크"
                className="h-9 w-9 object-contain"
                loading="lazy"
              />
            </span>
            <span className="text-[15px]">링크 복사하기</span>
          </button>
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

export default ShareSheet;
