// src/pages/ingredients/IngredientDetailPage.tsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { fetchIngredientDetail, toggleIngredientLike } from "@/apis/ingredient";
import type { IngredientDetail } from "@/types/ingredient";

import IngredientTabs from "@/components/ingredient/IngredientTabs";
import IngredientInfo from "@/components/ingredient/IngredientInfo";
import IngredientAlternatives from "@/components/ingredient/IngredientAlternatives";
import IngredientSupplements from "@/components/ingredient/IngredientSupplements";
import { FiShare2, FiHeart } from "react-icons/fi";

// Kakao SDK 타입 정의
declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: any) => void;
      };
    };
  }
}


const queryClient = new QueryClient();

const BREAKPOINT = 640;
const KAKAO_APP_KEY =
  import.meta.env.VITE_KAKAO_JS_KEY || "16b75c5d816c501dec98d03ee4340883";

/* 공통 훅 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= BREAKPOINT : true
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= BREAKPOINT);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
};

/* 클립보드 */
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(el);
    }
  }
}

/* Kakao 로더 */
async function ensureKakaoReady(): Promise<boolean> {
  if (!KAKAO_APP_KEY) {
    console.warn("카카오 JavaScript 키가 설정되지 않았습니다.");
    return false;
  }

  // 카카오 SDK가 이미 로드되어 있는지 확인
  if (typeof window !== "undefined" && window.Kakao) {
    try {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_APP_KEY);
        console.log("카카오 SDK 초기화 완료");
      }
      return true;
    } catch (error) {
      console.error("카카오 SDK 초기화 실패:", error);
      return false;
    }
  }

  // 카카오 SDK가 로드되지 않은 경우 (index.html에서 이미 로드됨)
  try {
    // index.html에서 이미 로드했으므로 바로 초기화 시도
    if (typeof window !== "undefined" && window.Kakao) {
      window.Kakao.init(KAKAO_APP_KEY);
      console.log("카카오 SDK 초기화 완료");
      return true;
    }

    console.error("카카오 SDK가 로드되지 않았습니다.");
    return false;
  } catch (error) {
    console.error("카카오 SDK 설정 실패:", error);
    return false;
  }
}

/* 모바일 공유 바텀시트 */
function ShareSheet({
  open,
  onClose,
  onKakao,
  onCopy,
}: {
  open: boolean;
  onClose: () => void;
  onKakao: () => void;
  onCopy: () => void;
}) {
  if (!open) return null;
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
        className="absolute left-0 right-0 bottom-0 w-full"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-[440px] rounded-t-3xl bg-white shadow-xl">
          <div className="px-5 pt-6 pb-4">
            <h3 className="text-[15px] font-semibold text-center">공유하기</h3>
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

/* 확인 모달 */
function ConfirmModal({
  open,
  onClose,
  message,
}: {
  open: boolean;
  onClose: () => void;
  message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
        <p className="mb-5 whitespace-pre-line text-center text-gray-700">
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

const IngredientDetailInner = () => {
  const [activeTab, setActiveTab] = useState<
    "info" | "alternatives" | "supplements"
  >("info");
  const [tabHistory, setTabHistory] = useState<
    Array<"info" | "alternatives" | "supplements">
  >(["info"]);
  const [liked, setLiked] = useState(false);
  const isMobile = useIsMobile();
  const { ingredientName } = useParams<{ ingredientName: string }>();
  const navigate = useNavigate();

  // 제목/탭/액션 공통 래퍼(네비 안쪽 그리드와 좌우 정렬 맞춤)
  const WRAP = "mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8";

  // 로그인 상태 확인
  const isLoggedIn = () => {
    return !!localStorage.getItem("accessToken");
  };

  // 로그인 상태가 변경될 때마다 liked 상태 초기화
  useEffect(() => {
    if (!isLoggedIn()) {
      setLiked(false);
    }
  }, []);

  // 카카오 SDK 초기화
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.Kakao &&
      !window.Kakao.isInitialized()
    ) {
      window.Kakao.init(KAKAO_APP_KEY);
      console.log("카카오 SDK 초기화 완료");
    }
  }, []);

  const handleTabChange = (newTab: "info" | "alternatives" | "supplements") => {
    setTabHistory((p) => [...p, newTab]);
    setActiveTab(newTab);
    window.history.pushState(
      { tab: newTab, history: [...tabHistory, newTab] },
      "",
      window.location.href
    );
  };

  const handleBackClick = () => {
    if (tabHistory.length > 1) {
      const h = tabHistory.slice(0, -1);
      const prev = h[h.length - 1];
      setTabHistory(h);
      setActiveTab(prev);
      window.history.replaceState(
        { tab: prev, history: h },
        "",
        window.location.href
      );
    } else {
      setActiveTab("info");
      setTabHistory(["info"]);
    }
  };

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      if (e.state?.tab && e.state?.history) {
        setActiveTab(e.state.tab);
        setTabHistory(e.state.history);
      } else if (tabHistory.length > 1) {
        handleBackClick();
      }
    };
    window.history.replaceState(
      { tab: "info", history: ["info"] },
      "",
      window.location.href
    );
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [tabHistory]);

  const { data, isLoading, isError } = useQuery<IngredientDetail>({
    queryKey: ["ingredientDetail", ingredientName],
    queryFn: async () => {
      if (!ingredientName) throw new Error("Ingredient name is required");
      return await fetchIngredientDetail(ingredientName);
    },
    enabled: !!ingredientName,
    staleTime: 60_000,
  });

  const likeMutation = useMutation({
    mutationFn: toggleIngredientLike,
    onSuccess: (res) => {
      if (res?.result?.isLiked !== undefined) setLiked(res.result.isLiked);
    },
    onError: (error: any) => {
      // 401 에러인 경우 로그인 페이지로 이동
      if (error?.response?.status === 401) {
        navigate("/login");
        setLiked(false); // liked 상태를 false로 초기화
      } else {
        // 다른 에러의 경우 이전 상태로 되돌리기
        setLiked((prev) => !prev);
      }
    },
  });

  const handleLikeClick = () => {
    // 로그인 상태 확인
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!data?.id) return;

    // API 호출 전에 UI 상태 업데이트
    setLiked((prev) => !prev);
    likeMutation.mutate(data.id);
  };

  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const shareUrl = useMemo(() => window.location.href, []);
  const shareTitle = useMemo(() => data?.name ?? "VitaCheck", [data]);

  async function onClickShare() {
    if (isMobile) {
      setSheetOpen(true);
      return;
    }
    const ok = await copyToClipboard(shareUrl);
    setConfirmOpen(ok);
  }

  async function onShareKakao() {
    try {
      // 카카오 SDK 초기화 확인
      if (typeof window === "undefined" || !window.Kakao) {
        console.error("카카오 SDK가 로드되지 않았습니다.");
        // SDK 로드 실패 시 링크 복사로 대체
        const ok = await copyToClipboard(shareUrl);
        setSheetOpen(false);
        setConfirmOpen(ok);
        return;
      }

      // 카카오 SDK 초기화
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_APP_KEY);
        console.log("카카오 SDK 초기화 완료");
      }

      // 성분 정보를 포함한 공유 템플릿
      const shareDescription = data?.description
        ? `${data.description.substring(0, 100)}...`
        : "VitaCheck에서 성분 정보를 확인해 보세요.";

      // 기본 이미지 사용 (성분별 이미지가 없는 경우)
      const shareImageUrl =
        "https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png";

      // 공유 데이터 로깅
      const shareData = {
        objectType: "feed",
        content: {
          title: `${shareTitle} - VitaCheck`,
          description: shareDescription,
          imageUrl: shareImageUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: "바로 보기",
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      };

      console.log("🔥 [카카오톡] 공유 데이터:", shareData);
      console.log("🔥 [카카오톡] 공유 URL:", shareUrl);
      console.log("🔥 [카카오톡] 공유 제목:", shareTitle);

      // 카카오톡 공유 실행
      window.Kakao.Share.sendDefault(shareData);

      console.log("카카오톡 공유 성공");
      setSheetOpen(false);

      // 성공 메시지 표시 (카카오톡 앱이 설치된 경우)
      setConfirmOpen(true);

      // 카카오톡 앱이 설치되지 않은 경우를 대비한 대체 처리
      setTimeout(() => {
        // 3초 후에도 카카오톡이 열리지 않으면 링크 복사로 대체
        console.log("🔥 [카카오톡] 대체 처리: 링크 복사");
        copyToClipboard(shareUrl);
      }, 3000);
    } catch (error) {
      console.error("카카오톡 공유 실패:", error);

      // 공유 실패 시 링크 복사로 대체
      const ok = await copyToClipboard(shareUrl);
      setSheetOpen(false);
      setConfirmOpen(ok);
    }
  }

  async function onShareCopy() {
    const ok = await copyToClipboard(shareUrl);
    setSheetOpen(false);
    setConfirmOpen(ok);
  }

  if (!ingredientName)
    return (
      <div className="px-5 py-10">잘못된 접근입니다. 성분명이 없습니다.</div>
    );
  if (isLoading)
    return (
      <div className="px-5 py-10">
        <div className="flex items-center justify-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center text-gray-500">성분 정보를 불러오는 중...</p>
      </div>
    );
  if (isError)
    return (
      <div className="px-5 py-10">
        <div className="text-center">
          <p className="mb-2 text-lg text-red-500">
            성분 정보를 불러올 수 없습니다.
          </p>
          <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  if (!data)
    return (
      <div className="px-5 py-10">
        <div className="text-center">
          <p className="mb-2 text-lg text-gray-500">
            성분 정보를 찾을 수 없습니다.
          </p>
          <p className="text-sm text-gray-500">검색어를 다시 확인해주세요.</p>
        </div>
      </div>
    );

  const result = data;

  return (
    <div className={`${isMobile ? "pt-3 pb-5" : "py-10"}`}>
      {/* 제목 + 액션: 네비와 같은 내부 폭/인셋 */}
      <div className={`${WRAP} mb-4 sm:mb-6 flex items-center`}>
        <h1 className="text-2xl sm:text-2xl font-bold pl-4">{result.name}</h1>
        <div className="ml-auto flex space-x-3">
          <button
            onClick={onClickShare}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:border-gray-300"
            aria-label="공유"
          >
            <FiShare2 className="text-gray-700" size={18} />
          </button>
          <button
            onClick={handleLikeClick}
            disabled={likeMutation.isPending}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 transition-all duration-200 ${
              likeMutation.isPending
                ? "cursor-not-allowed opacity-50"
                : "hover:border-pink-300 hover:shadow-sm"
            }`}
            aria-label="좋아요"
          >
            {likeMutation.isPending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-pink-500"></div>
            ) : (
              <FiHeart
                className={
                  liked ? "fill-red-500 text-red-500" : "text-pink-500"
                }
                size={18}
              />
            )}
          </button>
        </div>
      </div>

      {/* 탭: 제목과 같은 시작점으로 정렬 */}
      <div className={`${WRAP}`}>
        <IngredientTabs activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>

      {/* 본문: 탭과 같은 시작점으로 정렬 */}
      <div className={`${WRAP}`}>
        {activeTab === "info" && (
          <IngredientInfo id={ingredientName!} data={result} />
        )}
        {activeTab === "alternatives" && (
          <IngredientAlternatives
            name={result.name}
            subIngredients={result.subIngredients}
            alternatives={result.alternatives}
          />
        )}
        {activeTab === "supplements" && <IngredientSupplements data={result} />}
      </div>

      <ShareSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onKakao={onShareKakao}
        onCopy={onShareCopy}
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message={
          "공유가 완료되었습니다!\n카카오톡으로 전송되었거나 링크가 복사되었습니다."
        }
      />
    </div>
  );
};

/* Provider */
const IngredientDetailPage = () => (
  <QueryClientProvider client={queryClient}>
    <IngredientDetailInner />
  </QueryClientProvider>
);

export default IngredientDetailPage;
