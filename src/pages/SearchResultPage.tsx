// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import ProductCard from "@/components/ProductCard";
// import SearchBar from "@/components/SearchBar";

// import { searchSupplements } from "@/apis/search";
// import type { Supplement, Ingredient } from "@/apis/search";
// import IngredientCard from "@/components/search/IngredientCard";
// import Notsearch from "../assets/notsearch.svg";

// export default function SearchResultPage() {
//   const [searchParams] = useSearchParams();
//   const keyword = searchParams.get("query") ?? "";
//   const [results, setResults] = useState<Supplement[]>([]);
//   const [matchedIngredients, setMatchedIngredients] = useState<Ingredient[]>(
//     []
//   );
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         setLoading(true);
//         const data = await searchSupplements(keyword);
//         setResults(data.supplements.content);
//         setMatchedIngredients(data.matchedIngredients);
//       } catch (error) {
//         console.error("검색 실패:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (keyword) {
//       fetchResults();
//     }
//   }, [keyword]);

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="sm:w-[80%] w-[95%] mx-auto p-4">
//         <div className="sm:mt-5">
//           <SearchBar initialQuery={keyword} />
//         </div>

//         {/* 로딩 스피너 */}
//         {loading && (
//           <div className="flex justify-center items-center mt-10">
//             <div className="w-10 h-10 border-4 border-gray-300 border-t-[#FFDB67] rounded-full animate-spin"></div>
//           </div>
//         )}

//         {/* 검색 결과 */}
//         {!loading && (
//           <>
//             {/* 성분 카드 */}
//             {matchedIngredients.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-[18px] font-semibold mb-3">성분</h3>
//                 <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
//                   {matchedIngredients.map((ingredient) => (
//                     <IngredientCard
//                       key={ingredient.ingredientId}
//                       id={ingredient.ingredientId}
//                       name={ingredient.name}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* 결과 없음 */}
//             {results.length === 0 ? (
//               <div className="flex flex-col items-center justify-center mt-16">
//                 <img
//                   src={Notsearch}
//                   alt="검색 결과 없음"
//                   className="w-[144px] h-[144px] object-contain mb-4"
//                 />
//                 <p className="text-[#808080] text-lg">
//                   일치하는 검색 결과가 없습니다.
//                 </p>
//               </div>
//             ) : (
//               /* 제품 카드 */
//               <div
//                 className="
//     grid
//     [grid-template-columns:repeat(auto-fill,minmax(156px,1fr))]
//     gap-x-3 gap-y-6
//     sm:[grid-template-columns:repeat(auto-fill,minmax(172px,1fr))]
//     sm:gap-x-10
//     md:[grid-template-columns:repeat(auto-fill,minmax(188px,1fr))]
//     md:gap-x-6
//     mt-5
//   "
//               >
//                 {results.map((product) => (
//                   <ProductCard
//                     key={product.supplementId}
//                     id={product.supplementId}
//                     imageSrc={product.imageUrl}
//                     name={product.supplementName}
//                     // 그리드 셀 폭에 꽉 차도록
//                     widthClass="w-full"
//                     // 화면 크기에 따라 카드 높이 조절
//                     heightClass="h-[150px] sm:h-[160px] md:h-[180px]"
//                     // 글자 크기도 반응형
//                     fontSizeClass="text-[14px] sm:text-[15px] md:text-[16px]"
//                   />
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";

// import SearchBar from "@/components/SearchBar";
// import ProductCard from "@/components/ProductCard";
// import IngredientCard from "@/components/search/IngredientCard";
// import Notsearch from "../assets/notsearch.svg";

// import {
//   searchIngredients,
//   getSupplementsByIngredient,
//   type Supplement,
//   type Ingredient,
// } from "@/apis/search";

// export default function SearchResultPage() {
//   const [searchParams] = useSearchParams();
//   const keyword = searchParams.get("query") ?? "";

//   const [matchedIngredients, setMatchedIngredients] = useState<Ingredient[]>(
//     []
//   );
//   const [results, setResults] = useState<Supplement[]>([]);
//   const [loading, setLoading] = useState(false);

//   // (선택) 더보기 위해 보관
//   const [nextCursor, setNextCursor] = useState<number | null>(null);
//   const [selectedIngredientId, setSelectedIngredientId] = useState<
//     number | null
//   >(null);

//   // 키워드 바뀌면: 1) 성분 검색 → 2) 첫 성분의 제품 목록 가져오기
//   useEffect(() => {
//     const run = async () => {
//       if (!keyword) {
//         setMatchedIngredients([]);
//         setResults([]);
//         setSelectedIngredientId(null);
//         setNextCursor(null);
//         return;
//       }

//       try {
//         setLoading(true);

//         // 1) 성분 검색
//         const ingredients = await searchIngredients(keyword);
//         setMatchedIngredients(ingredients);

//         // 2) 첫 번째 성분 기준으로 제품 목록 초기 로드
//         if (ingredients.length > 0) {
//           const firstId = ingredients[0].id;
//           setSelectedIngredientId(firstId);

//           const { items, nextCursor } = await getSupplementsByIngredient(
//             firstId,
//             null,
//             40
//           );
//           setResults(items);
//           setNextCursor(nextCursor);
//         } else {
//           setResults([]);
//           setSelectedIngredientId(null);
//           setNextCursor(null);
//         }
//       } catch (e) {
//         console.error("검색 실패:", e);
//         setResults([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     run();
//   }, [keyword]);

//   // (선택) 성분 카드 클릭 시 해당 성분의 제품으로 갱신
//   const handleIngredientClick = async (id: number) => {
//     try {
//       setLoading(true);
//       setSelectedIngredientId(id);
//       const { items, nextCursor } = await getSupplementsByIngredient(
//         id,
//         null,
//         40
//       );
//       setResults(items);
//       setNextCursor(nextCursor);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="sm:w-[80%] w-[95%] mx-auto p-4">
//         <div className="sm:mt-5">
//           <SearchBar initialQuery={keyword} />
//         </div>

//         {loading && (
//           <div className="flex justify-center items-center mt-10">
//             <div className="w-10 h-10 border-4 border-gray-300 border-t-[#FFDB67] rounded-full animate-spin" />
//           </div>
//         )}

//         {!loading && (
//           <>
//             {/* 성분 카드 */}
//             {matchedIngredients.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-[18px] font-semibold mb-3">성분</h3>
//                 <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
//                   {matchedIngredients.map((ing) => (
//                     <div
//                       key={ing.id}
//                       onClick={() => handleIngredientClick(ing.id)}
//                       role="button"
//                     >
//                       <IngredientCard id={ing.id} name={ing.name} />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* 결과 없음: 성분도 없고 제품도 없을 때만 */}
//             {!loading &&
//               results.length === 0 &&
//               matchedIngredients.length === 0 && (
//                 <div className="flex flex-col items-center justify-center mt-16">
//                   <img
//                     src={Notsearch}
//                     alt="검색 결과 없음"
//                     className="w-[144px] h-[144px] object-contain mb-4"
//                   />
//                   <p className="text-[#808080] text-lg">
//                     일치하는 검색 결과가 없습니다.
//                   </p>
//                 </div>
//               )}

//             {/* 제품 카드: 제품이 있을 때만 */}
//             {!loading && results.length > 0 && (
//               <div
//                 className="
//       grid
//       [grid-template-columns:repeat(auto-fill,minmax(156px,1fr))]
//       gap-x-3 gap-y-6
//       sm:[grid-template-columns:repeat(auto-fill,minmax(172px,1fr))]
//       sm:gap-x-10
//       md:[grid-template-columns:repeat(auto-fill,minmax(188px,1fr))]
//       md:gap-x-6
//       mt-5
//     "
//               >
//                 {results.map((p) => (
//                   <ProductCard
//                     key={p.id}
//                     id={p.id}
//                     imageSrc={p.imageUrl}
//                     name={p.name}
//                     widthClass="w-full"
//                     heightClass="h-[150px] sm:h-[160px] md:h-[180px]"
//                     fontSizeClass="text-[14px] sm:text-[15px] md:text-[16px]"
//                   />
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import IngredientCard from "@/components/search/IngredientCard";
import Notsearch from "../assets/notsearch.svg";

import {
  searchIngredients,
  getSupplementsByIngredient,
  type Supplement,
  type Ingredient,
} from "@/apis/search";

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("query") ?? "";

  const [matchedIngredients, setMatchedIngredients] = useState<Ingredient[]>(
    []
  );
  const [results, setResults] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(false);

  const [, setSelectedIngredientId] = useState<number | null>(null);

  // 키워드 바뀌면: 1) 성분 검색 → 2) 첫 성분의 제품 목록 초기 로드
  useEffect(() => {
    const run = async () => {
      if (!keyword) {
        setMatchedIngredients([]);
        setResults([]);
        setSelectedIngredientId(null);
        return;
      }

      try {
        setLoading(true);

        const ingredients = await searchIngredients(keyword);
        setMatchedIngredients(ingredients);

        if (ingredients.length > 0) {
          const firstId = ingredients[0].id;
          setSelectedIngredientId(firstId);

          const { items } = await getSupplementsByIngredient(firstId, null, 40);
          setResults(items);
        } else {
          setResults([]);
          setSelectedIngredientId(null);
        }
      } catch (e) {
        console.error("검색 실패:", e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [keyword]);

  // 성분 카드 클릭 시 해당 성분의 제품으로 갱신
  const handleIngredientClick = async (id: number) => {
    try {
      setLoading(true);
      setSelectedIngredientId(id);
      const { items } = await getSupplementsByIngredient(id, null, 40);
      setResults(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
            {/* 성분 카드 */}
            {matchedIngredients.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[18px] font-semibold mb-3">성분</h3>
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
                  {matchedIngredients.map((ing) => (
                    <div
                      key={ing.id}
                      onClick={() => handleIngredientClick(ing.id)}
                      role="button"
                    >
                      <IngredientCard id={ing.id} name={ing.name} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 결과 없음: 성분도 없고 제품도 없을 때만 */}
            {results.length === 0 && matchedIngredients.length === 0 && (
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
            )}

            {/* 제품 카드: 제품이 있을 때만 */}
            {results.length > 0 && (
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
                {results.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    imageSrc={p.imageUrl}
                    name={p.name}
                    widthClass="w-full"
                    heightClass="h-[150px] sm:h-[160px] md:h-[180px]"
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
