import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { fetchIngredientDetail } from "@/apis/ingredient";

import IngredientTabs from "../../components/ingredient/IngredientTabs";
import IngredientInfo from "../../components/ingredient/IngredientInfo";
import IngredientAlternatives from "../../components/ingredient/IngredientAlternatives";
import IngredientSupplements from "../../components/ingredient/IngredientSupplements";
import { FiShare2, FiHeart } from "react-icons/fi";

// ✅ 로컬에서만 사용하는 QueryClient 인스턴스
const queryClient = new QueryClient();

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

// ✅ 실제 화면 로직은 내부 컴포넌트로 분리
const IngredientDetailInner = () => {
  const [activeTab, setActiveTab] = useState<
    "info" | "alternatives" | "supplements"
  >("info");
  const [liked, setLiked] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const id = location.state?.id; // 전달된 ID

  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ["ingredientDetail", id],
  //   queryFn: () => fetchIngredientDetail(id),
  //   enabled: true,
  // });

  // if (isLoading) return <div className="px-5 py-10">불러오는 중...</div>;
  // if (isError) return <div className="px-5 py-10">에러가 발생했습니다.</div>;
  const data = {
    isSuccess: true,
    code: "string",
    message: "string",
    result: {
      id: 0,
      name: "string",
      description: "string",
      effect: "string",
      caution: "string",
      gender: "MALE",
      age: 0,
      upperLimit: 0,
      recommendedDosage: 0,
      unit: "string",
    },
  };
  const result = data.result;

  return (
    <div
      className={`px-5 md:px-10 ${
        isMobile ? "pt-3 pb-5" : "py-10"
      } max-w-screen-xl mx-auto`}
    >
      <div className="flex justify-between items-center mb-6 ml-5 md:ml-50">
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

      {activeTab === "info" && <IngredientInfo id={id} data={result} />}
      {activeTab === "alternatives" && <IngredientAlternatives id={id} />}
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
