import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { fetchIngredientDetail, toggleIngredientLike } from "@/apis/ingredient";
import type {
  IngredientDetailResponse,
  IngredientDetail,
} from "@/types/ingredient";

import IngredientTabs from "../../components/ingredient/IngredientTabs";
import IngredientInfo from "../../components/ingredient/IngredientInfo";
import IngredientAlternatives from "../../components/ingredient/IngredientAlternatives";
import IngredientSupplements from "../../components/ingredient/IngredientSupplements";
import { FiShare2, FiHeart } from "react-icons/fi";

// 로컬에서만 사용하는 QueryClient 인스턴스
const queryClient = new QueryClient();

// 640px 이하 = 모바일, 641px 이상 = PC
const BREAKPOINT = 640;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= BREAKPOINT : true
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= BREAKPOINT);
    window.addEventListener("resize", onResize);
    // 초기 동기화
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile;
};

// 실제 화면 로직은 내부 컴포넌트로 분리
const IngredientDetailInner = () => {
  const [activeTab, setActiveTab] = useState<
    "info" | "alternatives" | "supplements"
  >("info");
  const [liked, setLiked] = useState(false);
  const isMobile = useIsMobile();
  const { ingredientName } = useParams<{ ingredientName: string }>();

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

  // 찜하기 API 호출을 위한 mutation
  const likeMutation = useMutation({
    mutationFn: toggleIngredientLike,
    onSuccess: (data) => {
      console.log("❤️ 찜하기 성공:", data);
      // API 응답에 따라 찜하기 상태 업데이트
      if (data?.result?.isLiked !== undefined) {
        setLiked(data.result.isLiked);
      }
    },
    onError: (error) => {
      console.error("❤️ 찜하기 실패:", error);
      // 에러 발생 시 이전 상태로 되돌리기
      setLiked(!liked);
    },
  });

  // 찜하기 버튼 클릭 핸들러
  const handleLikeClick = () => {
    if (!data?.id) {
      console.error("❤️ 성분 ID가 없습니다.");
      return;
    }

    // 낙관적 업데이트 (즉시 UI 반영)
    setLiked(!liked);

    // API 호출
    likeMutation.mutate(data.id);
  };

  if (!ingredientName)
    return (
      <div className="px-5 py-10">잘못된 접근입니다. 성분명이 없습니다.</div>
    );
  if (isLoading)
    return (
      <div className="px-5 py-10">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        </div>
        <p className="text-center text-gray-500">성분 정보를 불러오는 중...</p>
      </div>
    );
  if (isError)
    return (
      <div className="px-5 py-10">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">
            성분 정보를 불러올 수 없습니다.
          </p>
          <p className="text-gray-500 text-sm">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  if (!data)
    return (
      <div className="px-5 py-10">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">
            성분 정보를 찾을 수 없습니다.
          </p>
          <p className="text-gray-500 text-sm">검색어를 다시 확인해주세요.</p>
        </div>
      </div>
    );

  const result = data; // 직접 사용

  return (
    <div
      className={`px-5 sm:px-10 ${isMobile ? "pt-3 pb-5" : "py-10"} max-w-screen-xl mx-auto`}
    >
      <div className="flex justify-between items-center mb-6 ml-5 sm:ml-50">
        <h1 className="text-2xl font-bold">
          <span>{result.name}</span>
        </h1>
        <div className="flex space-x-3">
          <button
            className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center"
            aria-label="공유"
          >
            <FiShare2 className="text-gray-700" size={18} />
          </button>
          <button
            onClick={handleLikeClick}
            disabled={likeMutation.isPending}
            className={`w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center transition-all duration-200 ${
              likeMutation.isPending
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-pink-300 hover:shadow-sm"
            }`}
            aria-label="좋아요"
          >
            {likeMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
            ) : (
              <FiHeart
                className={
                  liked ? "text-red-500 fill-red-500" : "text-pink-500"
                }
                size={18}
              />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <IngredientTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === "info" && (
        <IngredientInfo id={ingredientName} data={result} />
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
  );
};

// ✅ QueryClientProvider로 이 페이지만 감싸기
const IngredientDetailPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <IngredientDetailInner />
    </QueryClientProvider>
  );
};

export default IngredientDetailPage;
