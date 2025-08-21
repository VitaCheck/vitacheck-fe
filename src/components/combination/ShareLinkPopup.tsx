import React, { useEffect, useState } from "react";
import ShareModal from "../Purpose/P3DShareModal";
import link from "@/assets/link/link.png";
import kakaolink from "@/assets/link/kakaolink.png";

declare global {
  interface Window {
    Kakao: any;
  }
}

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

// 중복 로딩 방지용(한 번만 로딩)
let kakaoLoadingPromise: Promise<boolean> | null = null;

function isMobileUA() {
  return /iPhone|Android/i.test(navigator.userAgent);
}

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

async function ensureKakaoReady(): Promise<boolean> {
  // 키 없으면 바로 실패
  if (!KAKAO_JS_KEY) {
    console.warn("VITE_KAKAO_JS_KEY 가 설정되어 있지 않습니다.");
    return false;
  }

  // 이미 초기화됨
  if (window.Kakao?.isInitialized?.()) return true;

  // 로딩 중인 요청이 있으면 공유
  if (kakaoLoadingPromise) return kakaoLoadingPromise;

  kakaoLoadingPromise = new Promise<boolean>((res, rej) => {
    // 스크립트가 없다면 주입
    if (!window.Kakao) {
      const s = document.createElement("script");
      s.src = "https://developers.kakao.com/sdk/js/kakao.js";
      s.async = true;
      s.onload = () => {
        try {
          if (!window.Kakao.isInitialized()) {
            window.Kakao.init(KAKAO_JS_KEY);
          }
          res(true);
        } catch (e) {
          rej(e);
        }
      };
      s.onerror = rej;
      document.head.appendChild(s);
    } else {
      try {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_JS_KEY);
        }
        res(true);
      } catch (e) {
        rej(e);
      }
    }
  });

  try {
    const ok = await kakaoLoadingPromise;
    return ok;
  } finally {
    // 성공/실패와 무관하게 다음 호출을 위해 해제
    kakaoLoadingPromise = null;
  }
}

interface Props {
  onClose: () => void;
  supplementUrl: string;
  supplementImageUrl?: string;
  supplementName?: string;

  /** 커스텀 템플릿을 쓰고 싶다면 templateId를 넘겨주면 sendCustom으로 전송 */
  templateId?: number;
  /** 커스텀 템플릿에 치환할 값(없으면 기본적으로 WEB_URL/MOBILE_WEB_URL만 넣어줌) */
  templateArgs?: Record<string, any>;
}

const ShareLinkPopup: React.FC<Props> = ({
  onClose,
  supplementUrl,
  supplementImageUrl,
  supplementName,
  templateId,
  templateArgs = {},
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    // 페이지 진입 시 미리 준비(실패해도 무시)
    ensureKakaoReady().catch(() => {});
  }, []);

  const handleCopyLink = async () => {
    const ok = await copyWithFallback(supplementUrl);
    if (ok) setIsShareModalOpen(true);
  };

  const handleKakaoShare = async () => {
    // 데스크탑에서는 카카오톡 앱을 열 수 없어 사용성 저하 → 링크복사 폴백
    if (!isMobileUA()) {
      const ok = await copyWithFallback(supplementUrl);
      if (ok) setIsShareModalOpen(true);
      return;
    }

    try {
      const ready = await ensureKakaoReady();
      if (!ready) throw new Error("Kakao SDK not ready");

      if (templateId) {
        // ✅ 커스텀 템플릿 사용 (콘솔에서 #{변수}로 치환)
        window.Kakao.Share.sendCustom({
          templateId,
          templateArgs: {
            // URL 키는 콘솔에서 "웹링크" 필드에 매핑되도록 동일 키로 사용
            WEB_URL: supplementUrl,
            MOBILE_WEB_URL: supplementUrl,
            ...templateArgs,
          },
        });
      } else {
        // ✅ 기본 feed 템플릿 사용
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: supplementName || "추천 영양제",
            description: "이 영양제를 VitaCheck에서 확인해보세요!",
            imageUrl:
              supplementImageUrl ||
              "https://vitachecking.com/static/share-default.png", // 공개 HTTPS 이미지 권장
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
      }
    } catch (e) {
      console.error(e);
      alert("공유에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
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
