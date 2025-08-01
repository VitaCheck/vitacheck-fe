import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

import { searchSupplements } from "@/lib/search";
import type { Supplement, Ingredient } from "@/lib/search";
import IngredientCard from "@/components/search/IngredientCard";

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("query") ?? "";
  const [results, setResults] = useState<Supplement[]>([]);
  const [matchedIngredients, setMatchedIngredients] = useState<Ingredient[]>(
    []
  );

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await searchSupplements(keyword);
        setResults(data.supplements.content);
        setMatchedIngredients(data.matchedIngredients);
      } catch (error) {
        console.error("검색 실패:", error);
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

        {/* 제품 카드 */}
        <div className="grid grid-cols-2 gap-y-6 justify-between mt-5">
          {results.map((product) => (
            <ProductCard
              key={product.supplementId}
              imageSrc={product.imageUrl}
              name={product.supplementName}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
