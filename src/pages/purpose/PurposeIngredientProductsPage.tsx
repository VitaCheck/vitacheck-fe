// src/pages/PurposeIngredientProducts.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "@/lib/axios";

interface Supplement {
  id: number;
  name: string;
  imageUrl: string;
}

const PurposeIngredientProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { ingredientId, ingredientName, initialSupplements } = location.state || {
    ingredientId: null,
    ingredientName: "성분",
    initialSupplements: [],
  };

  const [searchQuery, setSearchQuery] = useState("");
  
  // --- 상태 관리 로직 수정 ---
  const [supplements, setSupplements] = useState<Supplement[]>(initialSupplements || []);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  
  // --- API 호출 함수 ---
  const fetchSupplements = useCallback(async (cursor: number | null) => {
    console.log('API 요청 성분 ID:', ingredientId);
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (!ingredientId) {
        console.error("Ingredient ID가 없습니다.");
        setIsLoading(false);
        setHasMore(false);
        return;
    }
    
    if (cursor !== null) setIsFetchingMore(true);
    else setIsLoading(true);

    try {
      const response = await axios.get(`/api/v1/ingredients/${ingredientId}/supplements`, {
        params: {
          cursor: cursor || undefined,
          size: 20,
        },
      });

      console.log(response.data);
      
      const result = response.data.result;
      
      setSupplements(prev => {
        const existingSupplements = cursor ? prev : [];
        const newSupplements = result.supplements || [];

        const combined = [...prev, ...newSupplements];
        const uniqueSupplements = Array.from(
          new Map(combined.map(item => [item.id, item])).values()
        );
        
        return uniqueSupplements;
      });
      
      setNextCursor(result.nextCursor);
      
      if (result.nextCursor === null) {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error("❌ 성분 관련 영양제 조회 실패:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
      isFetchingRef.current = false;
    }
  }, [ingredientId]);

  useEffect(() => {
    fetchSupplements(null); // 최초 1회 호출
  }, [fetchSupplements]);

  // --- 초기 데이터 로딩 ---
 useEffect(() => {
    // IntersectionObserver의 콜백 함수 정의
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isFetchingRef.current) {
        setTimeout(() => {
          fetchSupplements(nextCursor);  // nextCursor를 state에서 바로 참조
        }, 0);
      }
    };

    // Observer 인스턴스 생성
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.5,
      
    });

    // 관찰할 요소(ref)가 있으면 관찰 시작
    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // 클린업 함수: 컴포넌트가 언마운트되거나, useEffect가 재실행될 때 기존 observer 연결 해제
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  // `nextCursor`가 바뀔 때마다 observer를 새로 설정하여 항상 최신 cursor 값을 사용하도록 함
  }, [hasMore, nextCursor, fetchSupplements]); 
  

  const filteredProducts = supplements.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // --- 렌더링 함수 (renderCards, renderSkeletonCard) ---
  // 이 부분은 기존 코드를 거의 그대로 사용하되,
  // `displayProducts` 대신 `filteredProducts`를 사용하고,
  // `Product` 타입을 `Supplement` 타입으로 통일합니다.
  
  const renderSkeletonCard = () => (
     <div className="flex flex-col items-center animate-pulse">
       {/* 모바일 */}
       <div className="w-full max-w-[166px] h-[150px] bg-gray-200 rounded-xl shadow-lg sm:hidden"></div>
       <div className="mt-[18px] h-[22px] w-3/4 bg-gray-200 rounded-full sm:hidden"></div>
       {/* PC */}
       <div className="hidden sm:block w-full h-[160px] bg-gray-200 rounded-[16px] shadow-lg"></div>
       <div className="hidden sm:block mt-[16px] h-[22px] w-3/4 bg-gray-200 rounded-full"></div>
     </div>
   );

  const renderCards = (isMobile: boolean) => {
    if (isLoading) {
      const count = isMobile ? 4 : 8;
      return Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-full">{renderSkeletonCard()}</div>
      ));
    }

    if (filteredProducts.length === 0) {
      return (
        <p className="col-span-2 sm:col-span-4 w-full text-center text-gray-500 mt-5">
          {searchQuery !== "" ? "검색 결과가 없습니다." : "관련 제품이 없습니다."}
        </p>
      );
    }
    
    return filteredProducts.map((product) => (
      <div
        key={`ingredient-${product.id}`}
        onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
        className="flex flex-col items-center cursor-pointer w-full"
      >
        <div
          className={`${
            isMobile
              ? "w-full aspect-square rounded-xl"
              : "w-full h-[160px] rounded-[16px]"
          } bg-white shadow-lg overflow-hidden flex items-center justify-center`}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className={`${
              isMobile
                ? "w-[70%] h-[70%]"
                : "w-[135px] h-[135px] mt-[14px]"
            } object-contain`}
          />
        </div>
        <p
          className={`${
            isMobile
              ? "mt-[12px] text-[16px]"
              : "mt-[16px] text-[22px]"
          } font-medium text-center line-clamp-2`}
        >
          {product.name}
        </p>
      </div>
    ));
  };

  return (
    <>
      {/* 모바일 */}
      <div className="sm:hidden">
        <div className="w-full max-w-[430px] mx-auto mt-[50px] pb-[100px]">
          <div className="flex flex-col ml-[38px]">
            <h1 className="text-[30px] tracking-[-0.6px] font-medium">
              {ingredientName}
            </h1>
          </div>
          <div className="mx-[32px]">
            <div className="flex items-center w-full max-w-[366px] h-[52px] mt-[20px] mx-auto px-4 py-2 rounded-full border-[#C7C7C7] border-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="찾고 싶은 제품을 입력해주세요."
                className="flex-grow font-light text-[18px] text-[#AAAAAA] outline-none truncate min-w-0"
              />
              <AiOutlineSearch className="text-gray-500 text-[30px] ml-2" />
            </div>
          </div>
          <div className="mt-[33px] max-w-[430px] w-full mx-auto justify-items-center grid grid-cols-2 gap-x-[22px] gap-y-[40px] px-[37px]">
            {renderCards(true)}
          </div>

          {/* 스켈레톤 UI */}
          {isFetchingMore && (
            <div className="mt-[33px] max-w-[430px] w-full mx-auto justify-items-center grid grid-cols-2 gap-x-[22px] gap-y-[40px] px-[37px]">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`skel-m-${i}`} className="w-full">
                  {renderSkeletonCard()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 데스크탑 */}
      <div className="hidden sm:block w-full px-[40px] bg-[#FAFAFA]">
        <div className="max-w-[845px] mx-auto pt-[70px] pb-[80px]">
          <h1 className="text-[30px] font-semibold">{ingredientName}</h1>
          <div className="flex items-center w-full h-[52px] mt-[26px] mx-auto px-[24px] rounded-full border-[#C7C7C7] border-[1px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="찾고 싶은 제품을 입력해주세요."
              className="flex-grow font-regular text-[#686666] text-[16px] outline-none"
            />
            <AiOutlineSearch className="text-[#686666] text-[37px] ml-1" />
          </div>
          <div className="mt-[55px] grid grid-cols-4 gap-x-[26px] gap-y-[40px]">
            {renderCards(false)}
          </div>
          {isFetchingMore && (
            <div className="mt-[55px] grid grid-cols-4 gap-x-[26px] gap-y-[40px]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`skel-d-${i}`} className="w-full">
                  {renderSkeletonCard()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div ref={loadMoreRef} style={{ height: "50px", width: "100%" }} />
    </>
  );
};

export default PurposeIngredientProducts;