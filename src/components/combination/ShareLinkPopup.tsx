import React, { useEffect, useState } from "react";
import ShareModal from "../Purpose/P3DShareModal";
import link from "@/assets/link/link.png";
import kakaolink from "@/assets/link/kakaolink.png";

/** Kakao SDK 타입(전역 선언 안 함: 중복충돌 방지) */
type KakaoSDK = {
  init(key: string): void;
  isInitialized(): boolean;
  Share: { sendDefault(options: any): void };
};

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined;

/** 중복 로딩 방지 */
let kakaoLoadingPromise: Promise<boolean> | null = null;

/** SDK 로드+초기화 보장 */
async function ensureKakaoReady(): Promise<boolean> {
  if (!KAKAO_JS_KEY) {
    console.warn("VITE_KAKAO_JS_KEY 가 설정되어 있지 않습니다.");
    return false;
  }

  const w = window as any;

  // 이미 로드 & 초기화
  if (w.Kakao?.isInitialized?.()) return true;

  // 로드O, 초기화만 X
  if (w.Kakao?.init && !w.Kakao.isInitialized()) {
    w.Kakao.init(KAKAO_JS_KEY);
    return true;
  }

  // 스크립트 로드 (중복 방지)
  if (!kakaoLoadingPromise) {
    kakaoLoadingPromise = new Promise<boolean>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://developers.kakao.com/sdk/js/kakao.js";
      s.async = true;
      s.onload = () => {
        try {
          const Kakao = (window as any).Kakao as KakaoSDK;
          if (!Kakao.isInitialized()) Kakao.init(KAKAO_JS_KEY!);
          resolve(true);
        } catch (e) {
          reject(e);
        }
      };
      s.onerror = reject;
      document.head.appendChild(s);
    }).finally(() => {
      kakaoLoadingPromise = null;
    });
  }

  return kakaoLoadingPromise;
}

/** 모바일 UA 판별 */
function isMobileUA() {
  return /iPhone|Android/i.test(navigator.userAgent);
}

/** 클립보드 복사(폴백 포함) */
async function copyWithFallback(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  }
}

interface Props {
  onClose: () => void;
  supplementUrl: string;       // 공유할 절대 URL
  supplementImageUrl?: string; // 공개 HTTPS 이미지
  supplementName?: string;     // 제목
}

const ShareLinkPopup: React.FC<Props> = ({
  onClose,
  supplementUrl,
  supplementImageUrl,
  supplementName,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // SDK 준비 (실패해도 무시)
  useEffect(() => {
    ensureKakaoReady().catch(() => {});
  }, []);

  const handleCopyLink = async () => {
    const ok = await copyWithFallback(supplementUrl);
    if (ok) setIsShareModalOpen(true);
  };

  const handleKakaoShare = async () => {
    // 데스크톱은 카카오 앱이 없어 UX 저하 → 링크복사로 폴백
    if (!isMobileUA()) {
      const ok = await copyWithFallback(supplementUrl);
      if (ok) setIsShareModalOpen(true);
      return;
    }

    // SDK 준비 시도
    const ready = await ensureKakaoReady();
    if (!ready) {
      const ok = await copyWithFallback(supplementUrl);
      if (ok) setIsShareModalOpen(true);
      return;
    }

    const Kakao = (window as any).Kakao as KakaoSDK | undefined;
    if (!Kakao) {
      const ok = await copyWithFallback(supplementUrl);
      if (ok) setIsShareModalOpen(true);
      return;
    }

    // 기본 피드 템플릿으로 공유(콘솔 템플릿 불필요)
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: supplementName || "VitaCheck",
        description: "내 영양제 조합 결과를 확인해보세요!",
        imageUrl:
          supplementImageUrl || "https://vitachecking.com/static/share-default.png",
        link: {
          mobileWebUrl: supplementUrl,
          webUrl: supplementUrl,
        },
      },
      buttons: [
        {
          title: "자세히 보기",
          link: {
            mobileWebUrl: supplementUrl,
            webUrl: supplementUrl,
          },
        },
      ],
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-end justify-center z-50 bg-gray-800/50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-t-4xl shadow-lg relative w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-start">
            <div className="ml-[32px]">
              <h2 className="text-[22px] mt-[20px] font-semibold mb-[4px]">공유하기</h2>
            </div>

            {/* 카카오톡 공유 */}
            <div className="ml-[32px]">
              <button
                onClick={handleKakaoShare}
                className="w-full py-2 flex items-center h-[90px] gap-[22px]"
              >
                <img src={kakaolink} alt="카카오톡" className="rounded-full w-[50px] h-[50px]" />
                <span className="text-[18px] font-medium">카카오톡으로 공유하기</span>
              </button>
            </div>

            <div className="border-[#C7C7C7] w-full border-[0.3px]" />

            {/* 링크 복사 */}
            <div className="ml-[32px]">
              <button
                onClick={handleCopyLink}
                className="w-full py-2 flex items-center h-[90px] gap-[22px]"
              >
                <img src={link} alt="링크 복사" className="rounded-full w-[50px] h-[50px]" />
                <span className="text-[18px] font-medium">링크 복사하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          onClose();
        }}
      />
    </>
  );
};

export default ShareLinkPopup;
