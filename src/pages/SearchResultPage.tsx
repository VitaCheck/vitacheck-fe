import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import IngredientCard from "@/components/search/IngredientCard";
import Notsearch from "../assets/notsearch.svg";

import {
  searchSupplements,
  searchIngredients,
  type SearchedSupplement,
  type IngredientSearchItem,
} from "@/apis/search";

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("query") ?? "";

  // 성분
  const [ingredients, setIngredients] = useState<IngredientSearchItem[]>([]);
  // 제품 (cursor 페이징)
  const [items, setItems] = useState<SearchedSupplement[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  /** 최초 로드 */
  useEffect(() => {
  const fetchAll = async () => {
    if (!keyword) return;
    setLoading(true);
    try {
      const [ingRes, supRes] = await Promise.allSettled([
        searchIngredients(keyword),
        searchSupplements(keyword, undefined, 40),
      ]);

      if (ingRes.status === "fulfilled") setIngredients(ingRes.value);
      else setIngredients([]);

      if (supRes.status === "fulfilled") {
        setItems(supRes.value.items);
        setNextCursor(supRes.value.nextCursor);
      } else {
        setItems([]);
        setNextCursor(null);
      }
    } finally {
      setLoading(false);
    }
  };
  fetchAll();
}, [keyword]);

  /** 더보기 (cursor 페이징) */
  const handleLoadMore = async () => {
    if (!keyword || nextCursor == null) return;
    setLoadingMore(true);
    try {
      const sup = await searchSupplements(keyword, nextCursor, 40);
      setItems((prev) => [...prev, ...sup.items]);
      setNextCursor(sup.nextCursor);
    } catch (e) {
      console.error("더보기 실패:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sm:w-[80%] w-[95%] mx-auto p-4">
        <div className="sm:mt-5">
          <SearchBar initialQuery={keyword} />
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-10">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#FFDB67] rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <>
            {/* 성분 섹션 */}
            {ingredients.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[18px] font-semibold mb-3">성분</h3>
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
                  {ingredients.map((ing) => (
                    <IngredientCard key={ing.id} id={ing.id} name={ing.name} />
                  ))}
                </div>
              </div>
            )}

            {/* 제품 섹션 */}
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-16">
                <img
                  src={Notsearch}
                  alt="검색 결과 없음"
                  className="w-[144px] h-[144px] object-contain mb-4"
                />
                <p className="text-[#808080] text-lg">일치하는 검색 결과가 없습니다.</p>
              </div>
            ) : (
              <>
                <div
                  className="
                    grid
                    [grid-template-columns:repeat(auto-fill,minmax(156px,1fr))]
                    gap-x-3 gap-y-6
                    sm:[grid-template-columns:repeat(auto-fill,minmax(172px,1fr))]
                    sm:gap-x-10
                    md:[grid-template-columns:repeat(auto-fill,minmax(188px,1fr))]
                    md:gap-x-6
                    mt-5
                  "
                >
                  {items.map((p) => {
                    // cursorId를 문자열로 변환 후 뒤에서 6자리만 추출
                    const cursorStr = String(p.cursorId);
                    const detailId = Number(
                      cursorStr.slice(-6) // 끝에서 6자리만 잘라냄
                    );

                    return (
                      <ProductCard
                        key={p.cursorId}
                        id={detailId}                         
                        imageSrc={p.imageUrl}
                        name={p.supplementName}
                        widthClass="w-full"
                        heightClass="h-[150px] sm:h-[160px] md:h-[180px]"
                        fontSizeClass="text-[14px] sm:text-[15px] md:text-[16px]"
                      />
                    );
                  })}
                </div>

                {/* 더보기 버튼 (nextCursor 있을 때만 노출) */}
                {nextCursor !== null && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-4 py-2 rounded-lg border border-black/10"
                    >
                      {loadingMore ? "불러오는 중..." : "더 보기"}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
