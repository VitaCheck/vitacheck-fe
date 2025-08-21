import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "@/lib/axios";
import MainDetailPageMobile from "@/components/Purpose/P3MMainDetailPage";
import MainDetailPageDesktop from "@/components/Purpose/P3DMainDetailPage";
import ShareModal from "@/components/Purpose/P3DShareModal";
import LoginPromptModal from "@/components/Purpose/LoginPromptModal";

interface ApiProduct {
  supplementId: number;
  brandId: number;
  brandName: string;
  brandImageUrl: string | null;
  supplementName: string;
  supplementImageUrl: string;
  liked: boolean;
  coupangLink: string | null;
  intakeTime: string;
  ingredients: Ingredient[];
}

interface Ingredient {
  name: string;
  amount: string;
}

interface Product {
  id: number;
  brandId: number;
  brandName: string;
  brandImageUrl: string | null;
  supplementName: string;
  supplementImageUrl: string;
  liked: boolean;
  coupangLink: string | null;
  intakeTime: string;
  ingredients: Ingredient[];
}

interface BrandProduct {
  id: number;
  name: string;
  imageUrl: string;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as { product?: Product } | undefined;

  const [product, setProduct] = useState<Product | null>(null);
  const [brandProducts, setBrandProducts] = useState<BrandProduct[]>([]);
  const [isLoading, setIsLoading] = useState(!state?.product);
  const [activeTab, setActiveTab] = useState<"ingredient" | "timing">("ingredient");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /** 내 찜 목록으로 liked 상태 재확정 */
  const refreshLikedState = useCallback(async (supplementId: number) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return; // 비로그인 시 스킵

    try {
      const res = await axios.get<{ id: number }[]>("/api/v1/likes/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const likedIds = new Set(res.data.map((x) => x.id));
      const isLiked = likedIds.has(supplementId);
      setProduct((prev) => (prev ? { ...prev, liked: isLiked } : prev));
    } catch (e) {
      console.warn("[likes/me] refresh failed", e);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchProductAndBrandDetails = async () => {
      setIsLoading(true);

      try {
        const supplementId = Number(id);
        // 상세 정보(liked 포함)
        const productResponse = await axios.get<ApiProduct>("/api/v1/supplements", {
          params: { id: supplementId },
          headers: {
            Authorization: localStorage.getItem("accessToken")
              ? `Bearer ${localStorage.getItem("accessToken")}`
              : "",
          },
        });

        const fetchedProduct = productResponse.data;
        const mappedProduct: Product = {
          id: fetchedProduct.supplementId,
          ...fetchedProduct,
        };

        setProduct(mappedProduct);
        // 상세의 liked와 서버 '내 찜' 목록이 다를 수 있으므로 재확정
        refreshLikedState(mappedProduct.id);

        console.log(
          "💖 페이지 로드 시 서버 찜 상태:",
          mappedProduct.liked ? "찜 되어 있음" : "찜 안 되어 있음"
        );

        // 브랜드 제품 리스트
        const brandIdToFetch = fetchedProduct.brandId || fetchedProduct.supplementId;
        const brandResponse = await axios.get<{ [key: string]: BrandProduct[] }>(
          "/api/v1/supplements/brand",
          { params: { id: brandIdToFetch } }
        );

        const brandProductsArray: BrandProduct[] = Object.values(brandResponse.data)
          .flat()
          .map((item) => ({
            id: item.id,
            name: item.name,
            imageUrl: item.imageUrl,
          }));

        setBrandProducts(brandProductsArray);
      } catch (error: any) {
        console.error("❌ 제품 정보를 불러오는데 실패했습니다:", error);
        if (error.response?.status === 401) setIsLoginModalOpen(true);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndBrandDetails();
  }, [id, refreshLikedState]);

  /** 찜 토글 */
  const toggleLike = async () => {
    if (!product) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoginModalOpen(true);
      console.log("💡 로그인 필요: 찜 기능 사용 불가");
      return;
    }

    const newLikedState = !product.liked;
    // Optimistic UI
    setProduct((prev) => (prev ? { ...prev, liked: newLikedState } : null));

    try {
      await axios.post(
        `/api/v1/supplements/${product.id}/like`,
        { supplementId: product.id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ 서버에 찜 상태 반영 완료");
    } catch (error) {
      console.error("❌ 찜 상태 업데이트 실패:", error);
      // 롤백
      setProduct((prev) => (prev ? { ...prev, liked: !newLikedState } : null));
    } finally {
      // 최종 서버 상태로 동기화
      refreshLikedState(product.id);
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
