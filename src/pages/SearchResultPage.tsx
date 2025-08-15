import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

import { searchSupplements } from "@/apis/search";
import type { Supplement, Ingredient } from "@/apis/search";
import IngredientCard from "@/components/search/IngredientCard";
import Notsearch from "../assets/notsearch.svg";

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("query") ?? "";
  const [results, setResults] = useState<Supplement[]>([]);
  const [matchedIngredients, setMatchedIngredients] = useState<Ingredient[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await searchSupplements(keyword);
        setResults(data.supplements.content);
        setMatchedIngredients(data.matchedIngredients);
      } catch (error) {
        console.error("검색 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchResults();
    }
  }, [keyword]);

  return (
    <div className="min-h-screen bg-white">
      <div className="sm:w-[80%] w-[95%] mx-auto p-4">
        <div className="sm:mt-5">
          <SearchBar initialQuery={keyword} />
        </div>

        {/* 로딩 스피너 */}
        {loading && (
          <div className="flex justify-center items-center mt-10">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#FFDB67] rounded-full animate-spin"></div>
          </div>
        )}

        {/* 검색 결과 */}
        {!loading && (
          <>
            {/* 성분 카드 */}
            {matchedIngredients.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[18px] font-semibold mb-3">성분</h3>
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
                  {matchedIngredients.map((ingredient) => (
                    <IngredientCard
                      key={ingredient.ingredientId}
                      id={ingredient.ingredientId}
                      name={ingredient.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 결과 없음 */}
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-16">
                <img
                  src={Notsearch}
                  alt="검색 결과 없음"
                  className="w-[144px] h-[144px] object-contain mb-4"
                />
                <p className="text-[#808080] text-lg">
                  일치하는 검색 결과가 없습니다.
                </p>
              </div>
            ) : (
              /* 제품 카드 */
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
                {results.map((product) => (
                  <ProductCard
                    key={product.supplementId}
                    id={product.supplementId}
                    imageSrc={product.imageUrl}
                    name={product.supplementName}
                    // 그리드 셀 폭에 꽉 차도록
                    widthClass="w-full"
                    // 화면 크기에 따라 카드 높이 조절
                    heightClass="h-[150px] sm:h-[160px] md:h-[180px]"
                    // 글자 크기도 반응형
                    fontSizeClass="text-[14px] sm:text-[15px] md:text-[16px]"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
