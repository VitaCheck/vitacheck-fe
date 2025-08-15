import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/lib/axios"; // 설정된 axios 인스턴스 사용
import MainDetailPageMobile from "@/components/Purpose/P3MMainDetailPage";
import MainDetailPageDesktop from "@/components/Purpose/P3DMainDetailPage";
import ShareModal from "@/components/Purpose/P3DShareModal";
import LoginPromptModal from "@/components/Purpose/LoginPromptModal";

// API 응답과 컴포넌트 내부에서 사용할 타입 정의
interface ApiProduct {
  supplementId: number;
  brandName: string;
  brandImageUrl: string | null;
  supplementName: string;
  supplementImageUrl: string;
  liked: boolean;
  coupangLink: string | null;
  intakeTime: string;
  ingredients: string[];
  brandId: number;
}

interface Product {
  id: number;
  brandName: string;
  brandImageUrl: string | null;
  supplementName: string;
  supplementImageUrl: string;
  liked: boolean;
  coupangLink: string | null;
  intakeTime: string;
  ingredients: string[];
  brandId: number;
}

interface BrandProduct {
  id: number;
  name: string;
  imageUrl: string;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [brandProducts, setBrandProducts] = useState<BrandProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ingredient" | "timing">("ingredient");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchProductAndBrandDetails = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');

      try {
        const productResponse = await axios.get<ApiProduct>(`/api/v1/supplements`, {
          params: { id },
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        });
        
        console.log("--- 페이지 로드 시 서버가 직접 보내준 데이터 ---", productResponse.data);
        const fetchedProduct = productResponse.data;
        const mappedProduct: Product = {
            id: fetchedProduct.supplementId,
            ...fetchedProduct
        };
        setProduct(mappedProduct);
        
        console.log("✅ 제품 상세 정보 로드 성공", fetchedProduct);

        // 브랜드 제품 목록 요청
        const brandIdToFetch = fetchedProduct.brandId || fetchedProduct.supplementId;
        const brandResponse = await axios.get<{ supplements: BrandProduct[] }>(
          `/api/v1/supplements/brand`, { params: { id: brandIdToFetch } }
        );
        setBrandProducts(brandResponse.data.supplements);

      } catch (error) {
        console.error("❌ 제품 정보를 불러오는데 실패했습니다:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndBrandDetails();
  }, [id]);

  const toggleLike = async () => {
    if (!product) return;

    const accessToken = localStorage.getItem('accessToken');
    console.log("--- 찜 버튼 클릭 시점 ---");
    console.log("[1] localStorage에서 'accessToken'을 찾습니다...");
    console.log(`[2] 찾은 토큰 값:`, accessToken);

    // [핵심] 1. 로그인 여부 확인
    if (!accessToken) {
      // 로그인이 안 되어 있으면 로그인 안내 모달 표시
      console.log("❌ [3] 토큰이 없으므로 로그인 안내 모달을 켭니다.");
      setIsLoginModalOpen(true);
      return; // API 요청 중단
    }

    // [핵심] 2. 로그인 상태라면 찜 API 요청
    console.log("✅ [3] 토큰이 있으므로 찜하기 API를 호출합니다.");
    const newLikedState = !product.liked;

    // UI 즉시 업데이트 (Optimistic Update)
    setProduct(prev => prev ? { ...prev, liked: newLikedState } : null);

    try {
      await axios.post(`/api/v1/supplements/${product.id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(`✅ 찜 상태 서버 업데이트 성공: ${newLikedState}`);
    } catch (error) {
      console.error("❌ 찜 상태 업데이트 실패:", error);
      // 실패 시 UI 원상 복구
      setProduct(prev => prev ? { ...prev, liked: !newLikedState } : null);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsModalOpen(true);
    } catch (err) {
      console.error("URL 복사 실패:", err);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseLoginModal = () => setIsLoginModalOpen(false);

  if (isLoading) {
    return <p className="mt-[122px] text-center">제품 정보를 불러오는 중입니다...</p>;
  }

  if (!product) {
    return (
      <p className="mt-[122px] text-center text-red-500">
        ❗제품 정보를 불러올 수 없습니다.❗
      </p>
    );
  }

  return (
    <>
      <MainDetailPageMobile
        product={product}
        liked={product.liked}
        toggleLike={toggleLike}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showButton={true} // 스크롤 관련 로직은 일단 제거
        brandProducts={brandProducts}
        brandId={product.brandId ?? product.id}
      />
      <MainDetailPageDesktop
        product={product}
        liked={product.liked}
        toggleLike={toggleLike}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        brandProducts={brandProducts}
        brandId={product.brandId ?? product.id}
        onCopyUrl={handleCopyUrl}
      />

      <ShareModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <LoginPromptModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
    </>
  );
};

export default ProductDetailPage;