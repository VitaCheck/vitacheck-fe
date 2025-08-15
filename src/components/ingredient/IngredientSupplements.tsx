import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import searchIcon from "../../assets/search.png";
import { fetchIngredientSupplements } from "@/apis/ingredient";
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
  imageUrl: string; // 문자열 보장
};

const FALLBACK_IMG = "/images/PNG/성분 2-2/cat_character.png";
const API_BASE = import.meta.env.VITE_SERVER_API_URL ?? "";

// 백엔드가 절대경로/상대경로/빈 값 등으로 내려줘도 안전하게 보정
const normalizeImageUrl = (url?: string, coupangUrl?: string) => {
  console.log("🏠 [Image] normalizeImageUrl 호출:", {
    url,
    coupangUrl,
    type: typeof url,
  });

  // 1) imageUrl이 있으면 그대로 사용 (coupangUrl 처리는 건너뜀)
  if (url) {
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:")
    ) {
      console.log("🏠 [Image] 절대 URL 사용:", url);
      return url;
    }

    // 상대경로인 경우 API_BASE와 결합
    const path = url.startsWith("/") ? url : `/${url}`;
    const fullUrl = `${API_BASE}${path}`;
    console.log("🏠 [Image] 상대경로를 절대경로로 변환:", {
      original: url,
      full: fullUrl,
    });
    return fullUrl;
  }

  // 2) imageUrl이 없을 때만 coupangUrl 처리 (백엔드에서 imageUrl을 제공하므로 이 부분은 거의 실행되지 않음)
  if (coupangUrl && !url) {
    console.log(
      "🏠 [Image] imageUrl이 없어서 coupangUrl을 활용한 이미지 생성 시도:",
      coupangUrl
    );

    // 쿠팡 상품 ID 추출 시도
    const coupangMatch = coupangUrl.match(/products\/(\d+)/);
    if (coupangMatch) {
      const productId = coupangMatch[1];
      console.log("🏠 [Image] 쿠팡 상품 ID 추출:", productId);

      // 실제 제품 이미지를 가져오는 방법들 시도
      if (coupangUrl.includes("smartstore.naver.com")) {
        // 네이버 스마트스토어인 경우
        const naverImageUrl = `https://shopping-phinf.pstatic.net/${productId}_1.jpg`;
        console.log("🏠 [Image] 네이버 이미지 URL 시도:", naverImageUrl);
        return naverImageUrl;
      } else if (coupangUrl.includes("coupang.com")) {
        // 쿠팡인 경우
        const coupangImageUrl = `https://image.coupangcdn.com/image/retail/images/${productId}_1.jpg`;
        console.log("🏠 [Image] 쿠팡 이미지 URL 시도:", coupangImageUrl);
        return coupangImageUrl;
      } else {
        // 기타 쇼핑몰인 경우
        console.log("🏠 [Image] 알 수 없는 쇼핑몰, 로컬 fallback 사용");
        return FALLBACK_IMG;
      }
    }
  }

  // 3) 모든 방법이 실패하면 fallback 이미지 사용
  console.log("🏠 [Image] URL이 없음, fallback 이미지 사용");
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1) 상세 응답에 supplements가 이미 포함된 경우 (Swagger: getIngredientDetails)
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
              return {
                id: item.id,
                name: item.name,
                imageUrl: normalizeImageUrl(item.imageUrl, item.coupangUrl),
              };
            }
          );
          setProducts(formatted);
          setIsLoading(false);
          return;
        }

        // 2) 없으면 보조 API로 조회
        const supplements = await fetchIngredientSupplements(data.name);
        console.log(
          "🏠 [Supplements] API에서 supplements 데이터:",
          supplements
        );
        if (!supplements || supplements.length === 0) {
          setProducts([]);
        } else {
          console.log(
            "🏠 [Supplements] 첫 번째 API 아이템 구조:",
            supplements[0]
          );
          const formatted: CardSupplement[] = supplements.map((item: any) => ({
            id: item.id ?? item.supplementId,
            name: item.name ?? item.supplementName,
            imageUrl: normalizeImageUrl(item.imageUrl, item.coupangUrl),
          }));
          setProducts(formatted);
        }
      } catch (err: unknown) {
        const axiosErr = err as AxiosError;
        console.error(
          "영양제 정보 불러오기 실패:",
          axiosErr.response?.data || axiosErr.message
        );
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (data.name) {
      fetchData();
    }
  }, [data.name, data.supplements]);

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
    <div className="px-4 md:px-30 max-w-screen-xl mx-auto">
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-20 gap-y-6 md:gap-x-2">
        {filteredProducts.map((product) => (
          <div key={product.id} className="flex justify-center">
            <ProductCard
              id={product.id}
              name={product.name}
              imageSrc={product.imageUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientSupplements;
