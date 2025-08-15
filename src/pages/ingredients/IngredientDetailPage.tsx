// src/pages/ingredients/IngredientDetailPage.tsx
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
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
import { FiShare2, FiHeart, FiLink } from "react-icons/fi";

// ---- Kakao 타입 선언(선택)
declare global {
  interface Window {
    Kakao?: any;
  }
}

// 로컬에서만 사용하는 QueryClient 인스턴스
const queryClient = new QueryClient();

// 640px 이하 = 모바일, 641px 이상 = PC
const BREAKPOINT = 640;
const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

/* -------------------------- 공통 훅/유틸 -------------------------- */
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

// 링크 복사
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
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

// Kakao SDK 로더 (필요할 때만 로드)
async function ensureKakaoReady(): Promise<boolean> {
  if (!KAKAO_APP_KEY) return false;

  // 이미 로드/초기화 되었으면 OK
  if (window.Kakao) {
    try {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_APP_KEY);
      }
      return true;
    } catch {
      return false;
    }
  }

  // 스크립트 동적 로드
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  }).catch(() => {});

  if (!window.Kakao) return false;
  try {
    window.Kakao.init(KAKAO_APP_KEY);
    return true;
  } catch {
    return false;
  }
}

// 바텀시트(모바일 공유 UI)
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
      {/* sheet */}
      <div
        className="absolute left-0 right-0 bottom-0 w-full"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-[440px] rounded-t-3xl bg-white shadow-xl">
          {/* title */}
          <div className="px-5 pt-6 pb-4">
            <h3 className="text-[15px] font-semibold text-center">공유하기</h3>
          </div>

          {/* Kakao share */}
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

          {/* Copy link */}
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

// 단순 확인 모달(PC + 모바일 복사완료 공용)
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

/* -------------------------- 페이지 본문 -------------------------- */
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

  // 탭 변경 시 히스토리에 추가
  const handleTabChange = (newTab: "info" | "alternatives" | "supplements") => {
    setTabHistory((prev) => [...prev, newTab]);
    setActiveTab(newTab);

    // 브라우저 히스토리에 탭 상태 추가
    window.history.pushState(
      { tab: newTab, history: [...tabHistory, newTab] },
      "",
      window.location.href
    );
  };

  // 뒤로가기 처리
  const handleBackClick = () => {
    if (tabHistory.length > 1) {
      const newHistory = tabHistory.slice(0, -1);
      const previousTab = newHistory[newHistory.length - 1];
      setTabHistory(newHistory);
      setActiveTab(previousTab);

      window.history.replaceState(
        { tab: previousTab, history: newHistory },
        "",
        window.location.href
      );
    } else {
      setActiveTab("info");
      setTabHistory(["info"]);
    }
  };

  // 브라우저 뒤로가기/앞으로가기 버튼 처리
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab && event.state.history) {
        setActiveTab(event.state.tab);
        setTabHistory(event.state.history);
      } else if (tabHistory.length > 1) {
        handleBackClick();
      }
    };

    // 초기 히스토리 상태
    window.history.replaceState(
      { tab: "info", history: ["info"] },
      "",
      window.location.href
    );

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [tabHistory]);

  const { data, isLoading, isError } = useQuery<IngredientDetail>({
    queryKey: ["ingredientDetail", ingredientName],
    queryFn: async () => {
      if (!ingredientName) throw new Error("Ingredient name is required");
      const response = await fetchIngredientDetail(ingredientName);
      return response;
    },
    enabled: !!ingredientName && typeof ingredientName !== "undefined",
    staleTime: 60_000,
  });

  // 찜하기
  const likeMutation = useMutation({
    mutationFn: toggleIngredientLike,
    onSuccess: (res) => {
      if (res?.result?.isLiked !== undefined) {
        setLiked(res.result.isLiked);
      }
    },
    onError: () => setLiked((prev) => !prev),
  });

  const handleLikeClick = () => {
    if (!data?.id) return;
    setLiked((prev) => !prev); // 낙관적 업데이트
    likeMutation.mutate(data.id);
  };

  // 공유 상태
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const shareUrl = useMemo(() => window.location.href, []);
  const shareTitle = useMemo(() => data?.name ?? "VitaCheck", [data]);

  // ★ 모바일에서는 항상 우리 바텀시트 사용 (Web Share API 사용 안 함)
  async function onClickShare() {
    if (isMobile) {
      setSheetOpen(true);
      return;
    }
    // PC: 바로 복사 + 확인 모달
    const ok = await copyToClipboard(shareUrl);
    setConfirmOpen(ok);
  }

  async function onShareKakao() {
    const ready = await ensureKakaoReady();
    if (ready && window.Kakao?.Share) {
      try {
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: shareTitle,
            description: "VitaCheck에서 성분 정보를 확인해 보세요.",
            imageUrl:
              "https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png",
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
          buttons: [
            {
              title: "바로 보기",
              link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
            },
          ],
        });
        setSheetOpen(false);
        return;
      } catch {
        // 실패 시 아래 폴백
      }
    }
    const ok = await copyToClipboard(shareUrl);
    setSheetOpen(false);
    setConfirmOpen(ok);
  }

  async function onShareCopy() {
    const ok = await copyToClipboard(shareUrl);
    setSheetOpen(false);
    setConfirmOpen(ok);
  }

  // 렌더링 분기
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
    <div
      className={`px-5 sm:px-10 ${
        isMobile ? "pt-3 pb-5" : "py-10"
      } max-w-screen-xl mx-auto`}
    >
      {/* 헤더: 모든 해상도에서 좌측 제목, 우측 액션 */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h1 className="text-xl font-bold sm:text-2xl">{result.name}</h1>

        <div className="flex space-x-3">
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

      {/* 탭: 제목과 같은 시작선(좌측)에서 시작 */}
      <div className="mb-6">
        <IngredientTabs activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>

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

      {/* 공유 UI */}
      <ShareSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onKakao={onShareKakao}
        onCopy={onShareCopy}
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message={"링크가 복사되었습니다.\n원하는 곳에 붙여넣기 하세요."}
      />
    </div>
  );
};

/* -------------------------- Provider 래퍼 -------------------------- */
const IngredientDetailPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <IngredientDetailInner />
    </QueryClientProvider>
  );
};

export default IngredientDetailPage;
