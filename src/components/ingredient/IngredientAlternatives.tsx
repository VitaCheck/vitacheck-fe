import { useQuery } from "@tanstack/react-query";
import { fetchIngredientAlternatives } from "@/apis/ingredient";

interface IngredientAlternative {
  name: string;
  imageOrEmoji: string;
}

interface Props {
  name?: string; // name 기반 조회
}

export default function IngredientAlternatives({ name }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ingredientAlternatives", name],
    queryFn: () => fetchIngredientAlternatives(name as string),
    enabled: !!name,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">대체 식품을 불러오는 중...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">대체 식품을 불러올 수 없습니다.</div>
      </div>
    );
  }

  const items = Array.isArray(data) ? data : [];

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
    if (!v) {
      return <span className="text-lg font-medium">🥗</span>; // 기본 이모지
    }

    if (v.startsWith("http") || v.startsWith("/")) {
      return <img src={v} alt="" className="w-6 h-6 rounded object-cover" />;
    } else {
      return <span className="text-lg font-medium">{v}</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-5 sm:gap-x-8 md:gap-x-12 gap-y-4 sm:gap-y-8 md:gap-y-12 max-w-md sm:max-w-xl md:max-w-4xl mx-auto px-5 pb-8">
      {items.map((food, idx) => (
        <div
          key={`${food.name}-${idx}`}
          className="flex items-center justify-start px-5 py-5 bg-gray-100 rounded-[35px] shadow-sm h-[64px] w-full"
        >
          {renderIcon(food.imageOrEmoji)}
          <span className="ml-3 text-base font-medium">{food.name}</span>
        </div>
      ))}
    </div>
  );
}
