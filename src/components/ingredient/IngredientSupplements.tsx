import { useState, useEffect, useCallback, useRef } from "react";
import ProductCard from "../../components/ProductCard";
import searchIcon from "../../assets/search.png";
import { fetchIngredientSupplementsPaging } from "@/apis/ingredient";
import type { AxiosError } from "axios";
import type {
  IngredientDetail,
  IngredientSupplement,
} from "@/types/ingredient";

interface Props {
  data: IngredientDetail;
}

// 카드 렌더용 슬림 타입
type CardSupplement = {
  id: number;
  name: string;
  imageUrl: string;
};

const FALLBACK_IMG = "/images/PNG/성분 2-2/cat_character.png";
const API_BASE = import.meta.env.VITE_SERVER_API_URL ?? "";

// 백엔드가 절대경로/상대경로/빈 값 등으로 내려줘도 안전하게 보정
const normalizeImageUrl = (url?: string, coupangUrl?: string) => {
  // 1) imageUrl이 있으면 그대로 사용
  if (url) {
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:")
    ) {
      return url;
    }

    // 상대경로인 경우 API_BASE와 결합
    const path = url.startsWith("/") ? url : `/${url}`;
    const fullUrl = `${API_BASE}${path}`;
    return fullUrl;
  }

  // 2) imageUrl이 없을 때는 바로 fallback 이미지 사용 (외부 이미지 서버 에러 방지)
  if (coupangUrl && !url) {
    // 외부 이미지 서버 URL 생성 대신 fallback 이미지 사용
    return FALLBACK_IMG;
  }

  // 3) 모든 방법이 실패하면 fallback 이미지 사용
  return FALLBACK_IMG;
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const IngredientSupplements = ({ data }: Props) => {
  const isMobile = useIsMobile();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [products, setProducts] = useState<CardSupplement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // 초기 데이터 로드
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setProducts([]);
        setNextCursor(null);
        setHasMore(true);

        // 1) 상세 응답에 supplements가 이미 포함된 경우
        if (data.supplements && data.supplements.length > 0) {
          console.log(
            "🏠 [Supplements] 상세 응답에서 supplements 데이터:",
            data.supplements
          );
          console.log(
            "🏠 [Supplements] 첫 번째 아이템 구조:",
            data.supplements[0]
          );

          const formatted: CardSupplement[] = data.supplements.map(
            (item: IngredientSupplement) => {
              console.log("🏠 [Supplements] 아이템 처리:", item);
              const imageUrl = normalizeImageUrl(
                item.imageUrl,
                item.coupangUrl
              );
              // 이미지 URL이 유효하지 않으면 fallback 이미지 사용
              return {
                id: item.id,
                name: item.name,
                imageUrl: imageUrl || FALLBACK_IMG,
              };
            }
          );
          setProducts(formatted);
          setIsLoading(false);
          return;
        }

        // 2) 없으면 새로운 페이징 API로 조회
        const result = await fetchIngredientSupplementsPaging(data.name);
        console.log(
          "🏠 [Supplements] 페이징 API에서 supplements 데이터:",
          result
        );

        if (!result.supplements || result.supplements.length === 0) {
          setProducts([]);
          setHasMore(false);
        } else {
          console.log(
            "🏠 [Supplements] 첫 번째 API 아이템 구조:",
            result.supplements[0]
          );
          const formatted: CardSupplement[] = result.supplements.map(
            (item: any) => {
              const imageUrl = normalizeImageUrl(
                item.imageUrl,
                item.coupangUrl
              );
              return {
                id: item.id ?? item.supplementId,
                name: item.name ?? item.supplementName,
                imageUrl: imageUrl || FALLBACK_IMG,
              };
            }
          );
          setProducts(formatted);
          setNextCursor(result.nextCursor);
          setHasMore(!!result.nextCursor);
        }
      } catch (err: unknown) {
        const axiosErr = err as AxiosError;
        console.error(
          "영양제 정보 불러오기 실패:",
          axiosErr.response?.data || axiosErr.message
        );
        setProducts([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (data.name) {
      fetchInitialData();
    }
  }, [data.name]);

  // 추가 데이터 로드
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return;

    try {
      setIsLoadingMore(true);
      const result = await fetchIngredientSupplementsPaging(
        data.name,
        nextCursor
      );

      if (result.supplements && result.supplements.length > 0) {
        const formatted: CardSupplement[] = result.supplements.map(
          (item: any) => {
            const imageUrl = normalizeImageUrl(item.imageUrl, item.coupangUrl);
            return {
              id: item.id ?? item.supplementId,
              name: item.name ?? item.supplementName,
              imageUrl: imageUrl || FALLBACK_IMG,
            };
          }
        );

        setProducts((prev) => [...prev, ...formatted]);
        setNextCursor(result.nextCursor);
        setHasMore(!!result.nextCursor);
      } else {
        setHasMore(false);
      }
    } catch (err: unknown) {
      console.error("추가 영양제 정보 불러오기 실패:", err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextCursor, data.name]);

  // 무한 스크롤 설정
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, isLoadingMore]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">영양제 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <img
          src={FALLBACK_IMG}
          alt="영양제 없음"
          className="w-32 h-32 object-cover rounded-md mb-4"
        />
        <div className="text-gray-500 text-center">
          <p className="text-lg font-medium mb-2">관련 영양제가 없습니다</p>
          <p className="text-sm">
            이 성분과 관련된 영양제가 아직 등록되지 않았습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 기존 검색바 UI 유지 */}
      <section className="flex justify-center mb-6">
        <div
          className={`flex items-center w-full ${
            isMobile
              ? "max-w-md px-4 py-3 rounded-[44px] bg-white border border-gray-300"
              : "max-w-4xl rounded-full border border-gray-300 px-5 py-4 bg-white shadow-sm"
          }`}
        >
          <input
            type="text"
            placeholder="찾고 싶은 제품을 입력해주세요."
            value={searchKeyword}
            onChange={handleSearch}
            className={`w-full outline-none ${
              isMobile
                ? "text-sm bg-transparent text-gray-400 placeholder-gray-300"
                : "text-gray-800 placeholder-gray-400"
            }`}
          />
          <img
            src={searchIcon}
            alt="검색"
            className={`ml-2 ${isMobile ? "w-5 h-5" : "w-6 h-6"}`}
          />
        </div>
      </section>

      {/* 기존 ProductCard 그리드 UI 유지 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-20 gap-y-6 md:gap-x-2">
        {filteredProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="flex justify-center"
            ref={index === filteredProducts.length - 1 ? lastElementRef : null}
          >
            <ProductCard
              id={product.id}
              name={product.name}
              imageSrc={product.imageUrl || FALLBACK_IMG}
            />
          </div>
        ))}
      </div>

      {/* 로딩 상태 표시 */}
      {isLoadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">더 많은 영양제를 불러오는 중...</div>
        </div>
      )}

      {/* 더 이상 데이터가 없음을 표시 */}
      {!hasMore && products.length > 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">모든 영양제를 불러왔습니다</div>
        </div>
      )}
    </div>
  );
};

export default IngredientSupplements;
