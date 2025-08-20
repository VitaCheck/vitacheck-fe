import { useQuery } from "@tanstack/react-query";
import { fetchIngredientAlternatives } from "@/apis/ingredient";

interface IngredientAlternative {
  name: string;
  imageOrEmoji: string;
}

interface Props {
  name?: string; // name 기반 조회
  subIngredients?: (string | { name: string; imageOrEmoji: string })[]; // 상세 정보에서 직접 받은 subIngredients
  alternatives?: IngredientAlternative[]; // 상세 정보에서 직접 받은 alternatives
}

export default function IngredientAlternatives({
  name,
  subIngredients,
  alternatives,
}: Props) {
  // alternatives가 있으면 직접 사용, 없으면 API 호출
  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ingredientAlternatives", name],
    queryFn: () => fetchIngredientAlternatives(name as string),
    enabled: !!name && !alternatives && !subIngredients,
    staleTime: 60_000,
  });

  // 데이터 우선순위: alternatives > subIngredients > API 데이터
  let items: IngredientAlternative[] = [];

  if (alternatives && alternatives.length > 0) {
    // alternatives 데이터가 있으면 그대로 사용
    items = alternatives;
  } else if (subIngredients && subIngredients.length > 0) {
    // subIngredients가 있으면 IngredientAlternative 형태로 변환
    items = subIngredients.map((item) => {
      // item이 문자열인 경우
      if (typeof item === "string") {
        return { name: item, imageOrEmoji: "🥗" };
      }
      // item이 객체인 경우 (name과 imageOrEmoji를 가진)
      if (item && typeof item === "object" && "name" in item) {
        return {
          name: String(item.name),
          imageOrEmoji: item.imageOrEmoji || "🥗",
        };
      }
      // 기본값
      return { name: "알 수 없는 식품", imageOrEmoji: "🥗" };
    });
  } else if (Array.isArray(apiData) && apiData.length > 0) {
    // API 데이터 사용
    items = apiData;
  }

  const isLoadingData = !alternatives && !subIngredients && isLoading;

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">대체 식품을 불러오는 중...</div>
      </div>
    );
  }

  if (!alternatives && !subIngredients && (isError || !apiData)) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">대체 식품을 불러올 수 없습니다.</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <img
          src="/images/PNG/성분 2-2/cat_character.png"
          alt="대체식품 없음"
          className="w-32 h-32 object-cover rounded-md mb-4"
        />
        <div className="text-gray-500 text-center">
          <p className="text-lg font-medium mb-2">대체식품이 없습니다</p>
          <p className="text-sm">
            이 성분은 대체할 수 있는 식품이 등록되지 않았습니다.
          </p>
        </div>
      </div>
    );
  }

  const renderIcon = (v: string | undefined) => {
    if (!v || typeof v !== "string") {
      return <span className="text-lg font-medium">🥗</span>; // 기본 이모지
    }

    const cleaned = v.trim().toLowerCase();

    // "null", "undefined", "", "NULL" 등은 이모지로 대체
    if (!cleaned || cleaned === "null" || cleaned === "undefined") {
      return <span className="text-lg font-medium"> </span>;
    }

    if (v.startsWith("http") || v.startsWith("/")) {
      return <img src={v} alt="" className="w-6 h-6 rounded object-cover" />;
    } else {
      return <span className="text-lg font-medium">{v}</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-5 sm:gap-x-8 md:gap-x-12 gap-y-4 sm:gap-y-8 md:gap-y-12 max-w-md sm:max-w-xl md:max-w-4xl mx-auto px-5 pb-8">
      {items.map((food, idx) => {
        // 안전한 값 추출
        const safeName = food?.name || `대체식품 ${idx + 1}`;
        const safeImageOrEmoji = food?.imageOrEmoji || "🥗";

        return (
          <div
            key={`${safeName}-${idx}`}
            className="flex items-center justify-start px-5 py-5 bg-gray-100 rounded-[35px] shadow-sm h-[64px] w-full"
          >
            {renderIcon(safeImageOrEmoji)}
            <span className="ml-3 text-base font-medium">{safeName}</span>
          </div>
        );
      })}
    </div>
  );
}
