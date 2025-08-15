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
  const [product, setProduct] = useState<Product | null>(null);
  const [brandProducts, setBrandProducts] = useState<BrandProduct[]>([]);
  const [isLoading, setIsLoading] = useState(!state?.product);
  const [activeTab, setActiveTab] = useState<"ingredient" | "timing">(
    "ingredient"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!id) return;

    const fetchProductAndBrandDetails = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      try {
        // 서버에서 항상 제품 정보 가져오기 (liked 상태 포함)
        const accessToken = localStorage.getItem("accessToken");
        const productResponse = await axios.get<ApiProduct>(
          `/api/v1/supplements`,
          {
            params: { id },
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
          }
        );

        console.log("💊 제품 API 응답 데이터:", productResponse.data);

        const fetchedProduct: ApiProduct = productResponse.data;
        const mappedProduct: Product = {
          id: fetchedProduct.supplementId,
          ...fetchedProduct,
        };

        setProduct(mappedProduct);

        // ✅ 페이지 처음 로드 시 찜 상태 출력
        console.log(
          "💖 페이지 로드 시 서버 찜 상태:",
          mappedProduct.liked ? "찜 되어 있음" : "찜 안 되어 있음"
        );

        const brandIdToFetch =
          fetchedProduct.brandId || fetchedProduct.supplementId;
        const brandResponse = await axios.get<{ supplements: BrandProduct[] }>(
          `/api/v1/supplements/brand`,
          { params: { id: brandIdToFetch } }
        );
        setBrandProducts(brandResponse.data.supplements);
      } catch (error: any) {
        console.error("❌ 제품 정보를 불러오는데 실패했습니다:", error);

        if (error.response?.status === 401) {
          setIsLoginModalOpen(true);
        }

        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndBrandDetails();
  }, [id]);

  // -----------찜 기능  ----------------
  const toggleLike = async () => {
    if (!product) return;

    const accessToken = localStorage.getItem("accessToken");

    // 1️⃣ 로그인 안 되어 있으면 모달 띄우고 종료
    if (!accessToken) {
      setIsLoginModalOpen(true);
      console.log("💡 로그인 필요: 찜 기능 사용 불가");
      return;
    }

    console.log(
      "현재 찜 상태:",
      product.liked ? "찜 되어 있음" : "찜 안 되어 있음"
    );

    const newLikedState = !product.liked;

    // 화면에 즉시 반영
    setProduct((prev) => (prev ? { ...prev, liked: newLikedState } : null));

    console.log("찜 토글 후 상태:", newLikedState ? "찜 했다" : "찜 해제했다");

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

      // 실패하면 상태 되돌리기
      setProduct((prev) => (prev ? { ...prev, liked: !newLikedState } : null));
      console.log("⏪ 서버 실패로 상태 되돌림");
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
    return (
      <p className="mt-[122px] text-center">제품 정보를 불러오는 중입니다...</p>
    );
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
      <LoginPromptModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
      />
    </>
  );
};

export default ProductDetailPage;
