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
  const location = useLocation();
  // console.log("URL에서 받은 id:", id);
  // console.log("location.state로 받은 product:", location.state); 
  const state = location.state as { product?: Product } | undefined;
  const [product, setProduct] = useState<Product | null>(state?.product || null);
  const [brandProducts, setBrandProducts] = useState<BrandProduct[]>([]);
  const [isLoading, setIsLoading] = useState(!state?.product);
  const [activeTab, setActiveTab] = useState<"ingredient" | "timing">("ingredient");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!id || product) return;

    const fetchProductAndBrandDetails = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      try {
        const productResponse = await axios.get<ApiProduct>(`/api/v1/supplements`, {
          params: { id },
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        });

        console.log("💊 제품 API 응답 데이터:", productResponse.data);

        const fetchedProduct = productResponse.data;
        const mappedProduct: Product = { id: fetchedProduct.supplementId, ...fetchedProduct };
        setProduct(mappedProduct);

        // 브랜드 제품 목록 요청
        const brandIdToFetch = fetchedProduct.brandId || fetchedProduct.supplementId;
        const brandResponse = await axios.get<{ supplements: BrandProduct[] }>(
          `/api/v1/supplements/brand`,
          { params: { id: brandIdToFetch } }
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
  }, [id, product]);

  const toggleLike = async () => {
    if (!product) return;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoginModalOpen(true);
      return;
    }

    const newLikedState = !product.liked;
    setProduct((prev) => (prev ? { ...prev, liked: newLikedState } : null));

    try {
      await axios.post(`/api/v1/supplements/${product.id}/like`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (error) {
      console.error("❌ 찜 상태 업데이트 실패:", error);
      setProduct((prev) => (prev ? { ...prev, liked: !newLikedState } : null));
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
        showButton={true}
        brandProducts={brandProducts}
        brandId={product.brandId ?? product.id}
        intakeTime={product.intakeTime}
      />
      <MainDetailPageDesktop
        product={product}
        liked={product.liked}
        toggleLike={toggleLike}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        brandProducts={brandProducts}
        brandId={product.brandId ?? product.id}
        intakeTime={product.intakeTime}
        onCopyUrl={handleCopyUrl}
      />

      <ShareModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <LoginPromptModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
    </>
  );
};

export default ProductDetailPage;
