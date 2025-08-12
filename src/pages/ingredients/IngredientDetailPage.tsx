import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { fetchIngredientDetail } from "@/apis/ingredient";
import type { IngredientDetailResponse } from "@/types/ingredient";

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

  const { data, isLoading, isError } = useQuery<IngredientDetailResponse>({
    queryKey: ["ingredientDetail", ingredientName],
    queryFn: () => {
      if (!ingredientName) throw new Error("Ingredient name is required");
      return fetchIngredientDetail(ingredientName);
    },
    enabled: !!ingredientName && typeof ingredientName !== "undefined",
    staleTime: 60_000,
  });

  if (!ingredientName)
    return (
      <div className="px-5 py-10">잘못된 접근입니다. 성분명이 없습니다.</div>
    );
  if (isLoading) return <div className="px-5 py-10">불러오는 중...</div>;
  if (isError) return <div className="px-5 py-10">에러가 발생했습니다.</div>;
  if (!data)
    return <div className="px-5 py-10">데이터를 찾을 수 없습니다.</div>;

  const result = data;

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
            onClick={() => setLiked(!liked)}
            className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center"
            aria-label="좋아요"
          >
            <FiHeart
              className={liked ? "text-red-500 fill-red-500" : "text-pink-500"}
              size={18}
            />
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
        <IngredientAlternatives name={result.name} />
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
