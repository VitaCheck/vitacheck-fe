// src/pages/PurposeBrandProducts.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "@/lib/axios";

interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

const PurposeBrandProducts = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const brand = searchParams.get("brand");
  const brandId = searchParams.get("id");
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);

  const mobileLoadMoreRef = useRef<HTMLDivElement>(null);
  const pcLoadMoreRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const batchSize = typeof window !== "undefined" && window.innerWidth >= 768 ? 4 : 2;

  // --- API 호출 함수 ---
  const fetchBrandProducts = useCallback(
    async (cursor: number = 0) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (!brandId) {
        setIsLoading(false);
        setHasMore(false);
        return;
      }

      cursor === 0 ? setIsLoading(true) : setIsFetchingMore(true);

      try {
        const response = await axios.get(`/api/v1/supplements/brand`, {
          params: { id: brandId, cursor, size: batchSize },
        });

        const result: Product[] = Object.values(response.data)
          .flat()
          .map((item: any) => ({
            id: item.id,
            name: item.name,
            imageUrl: item.imageUrl?.startsWith("http")
              ? item.imageUrl
              : `/images/${item.imageUrl}`,
          }));

        setProducts((prev) => {
          const combined = cursor === 0 ? result : [...prev, ...result];
          return Array.from(new Map(combined.map((item) => [item.id, item])).values());
        });

        setDisplayProducts((prev) => {
          const combined = cursor === 0 ? result : [...prev, ...result];
          return Array.from(new Map(combined.map((item) => [item.id, item])).values());
        });

        if (result.length < batchSize) {
          setHasMore(false);
        } else {
          setNextCursor(cursor + batchSize);
        }
      } catch (error) {
        console.error("브랜드 제품 목록을 불러오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
        isFetchingRef.current = false;
      }
    },
    [brandId, batchSize]
  );


  useEffect(() => {
    fetchBrandProducts(0);
    window.scrollTo(0, 0);
  }, [fetchBrandProducts]);

  // --- IntersectionObserver로 무한 스크롤 ---
  const loadNextBatch = useCallback(() => {
    if (isLoading || !hasMore) return;
    fetchBrandProducts(nextCursor);
  }, [isLoading, hasMore, fetchBrandProducts, nextCursor]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingRef.current) {
          loadNextBatch();
        }
      },
      { threshold: 1 }
    );

    if (mobileLoadMoreRef.current) observer.observe(mobileLoadMoreRef.current);
    if (pcLoadMoreRef.current) observer.observe(pcLoadMoreRef.current);

    return () => {
      if (mobileLoadMoreRef.current) observer.unobserve(mobileLoadMoreRef.current);
      if (pcLoadMoreRef.current) observer.unobserve(pcLoadMoreRef.current);
    };
  }, [loadNextBatch]);

  const renderSkeletonCard = () => (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-full max-w-[166px] h-[150px] bg-gray-200 rounded-xl shadow-lg sm:hidden"></div>
      <div className="mt-[18px] h-[22px] w-3/4 bg-gray-200 rounded-full sm:hidden"></div>
      <div className="hidden sm:block w-full h-[160px] bg-gray-200 rounded-[16px] shadow-lg"></div>
      <div className="hidden sm:block mt-[16px] h-[22px] w-3/4 bg-gray-200 rounded-full"></div>
    </div>
  );

  const filteredProducts = displayProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCards = (isMobile: boolean) => {
    if (isLoading) {
      const count = isMobile ? 2 : 4;
      return Array.from({ length: count }).map((_, index) => <div key={index}>{renderSkeletonCard()}</div>);
    }
    if (filteredProducts.length === 0 && searchQuery !== "") {
      return (
        <p className="w-full text-center text-gray-500 mt-5 col-span-full">
          검색 결과가 없습니다.
        </p>
      );
    }
    return filteredProducts.map(product => (
      <div
        key={`brand-${product.id}`}
        onClick={() => navigate(`/product/${product.id}`, { state: product })}
        className="flex-shrink-0 flex flex-col items-center cursor-pointer"
      >
        <div
          className={`${
            isMobile ? "w-full aspect-square rounded-xl" : "w-full h-[160px] rounded-[16px]"
          } bg-white shadow-lg overflow-hidden flex items-center justify-center`}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className={`${isMobile ? "w-[70%] h-[70%]" : "w-[135px] h-[135px] mt-[14px]"} object-contain`}
          />
        </div>
        <p className={`${isMobile ? "mt-[18px] text-[18px]" : "mt-[16px] text-[22px]"} font-medium text-center whitespace-normal break-keep line-clamp-2`}>
          {product.name}
        </p>
      </div>
    ));
  };

  return (
    <>
      {/* 모바일 */}
      <div className="sm:hidden">
        <div className="max-w-[430px] mx-auto mt-[50px] pb-[100px]">
          <div className="flex flex-col ml-[38px]">
            <h1 className="text-[30px] tracking-[-0.6px] font-medium">{brand}</h1>
          </div>
          <div className="mx-[32px]">
            <div className="flex items-center w-full max-w-[366px] h-[52px] mt-[20px] mx-auto px-4 py-2 rounded-full border-[#C7C7C7] border-1">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="찾고 싶은 제품을 입력해주세요."
                className="flex-grow font-light text-[18px] text-[#AAAAAA] outline-none truncate min-w-0"
              />
              <AiOutlineSearch className="text-gray-500 text-[30px] ml-2" />
            </div>
          </div>
          <div className="mt-[33px] max-w-[430px] w-full justify-items-center grid grid-cols-2 gap-x-[22px] gap-y-[40px] px-[37px]">
            {renderCards(true)}
          </div>
          {isFetchingMore && (
            <div className="mt-[33px] max-w-[430px] w-full justify-items-center grid grid-cols-2 gap-x-[22px] gap-y-[40px] px-[37px]">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`skel-m-${i}`}>{renderSkeletonCard()}</div>
              ))}
            </div>
          )}
          <div ref={mobileLoadMoreRef} style={{ height: "50px", width: "100%" }} />
        </div>
      </div>

      {/* PC */}
      <div className="hidden sm:block w-full px-[40px] bg-[#FAFAFA]">
        <div className="max-w-[845px] mx-auto pt-[70px] pb-[80px]">
          <h1 className="text-[30px] font-semibold">{brand}</h1>
          <div className="flex items-center w-full h-[52px] mt-[26px] mx-auto px-[24px] rounded-full border-[#C7C7C7] border-[1px]">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
                <div key={`skel-d-${i}`}>{renderSkeletonCard()}</div>
              ))}
            </div>
          )}
          <div ref={pcLoadMoreRef} style={{ height: "50px", width: "100%" }} />
        </div>
      </div>
    </>
  );
};

export default PurposeBrandProducts;
