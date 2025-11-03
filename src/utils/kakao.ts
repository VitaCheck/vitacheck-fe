type KakaoSDK = {
  init(key: string): void;
  isInitialized(): boolean;
  Share: { sendDefault(options: any): void };
};

const KAKAO_APP_KEY =
  import.meta.env.VITE_KAKAO_JS_KEY || "4b2032ace7d33963b0fb79993ff3c951"; // 원본 키

const SHARE_IMAGE_PATH = "/images/PNG/조합 3-1/인스타 분할 포스터-08.png";

/** SSR/CSR 환경을 고려하여 Kakao 객체를 안전하게 가져옵니다. */
const getKakao = (): KakaoSDK | undefined => {
  if (typeof window !== "undefined" && (window as any).Kakao) {
    return (window as any).Kakao as KakaoSDK;
  }
  return undefined;
};

/** 카카오 SDK가 준비되었는지 확인하고 초기화합니다. */
export async function ensureKakaoReady(): Promise<boolean> {
  if (!KAKAO_APP_KEY) {
    console.warn("카카오 JavaScript 키가 설정되지 않았습니다.");
    return false;
  }

  const Kakao = getKakao();

  if (Kakao) {
    try {
      if (!Kakao.isInitialized()) {
        Kakao.init(KAKAO_APP_KEY);
        console.log("카카오 SDK 초기화 완료");
      }
      return true;
    } catch (e) {
      console.error("카카오 SDK 초기화 실패:", e);
      return false;
    }
  }

  console.error("카카오 SDK가 로드되지 않았습니다.");
  return false;
}

/** 공유 이미지의 절대 URL을 반환합니다. */
export const getShareImageUrl = () =>
  typeof window !== "undefined"
    ? `${window.location.origin}${encodeURI(SHARE_IMAGE_PATH)}`
    : encodeURI(SHARE_IMAGE_PATH);

/** 카카오 공유를 실행합니다. */
export const shareToKakao = (shareUrl: string, title: string) => {
  const Kakao = getKakao();
  if (!Kakao) {
    console.error("Kakao SDK not available for sharing.");
    return;
  }

  Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: `${title} - VitaCheck`,
      description: "VitaCheck에서 성분 정보를 확인해 보세요.",
      imageUrl: getShareImageUrl(),
      imageWidth: 400,
      imageHeight: 400,
      link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
    },
    buttons: [
      {
        title: "자세히 보기",
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
    ],
  });
};
