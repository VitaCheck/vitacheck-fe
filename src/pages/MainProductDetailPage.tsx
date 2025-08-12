// src/pages/ProductDetailPage.tsx

import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import MainDetailPageMobile from "@/components/Purpose/P3MMainDetailPage";
import MainDetailPageDesktop from "@/components/Purpose/P3DMainDetailPage";
import ShareModal from "@/components/Purpose/P3DShareModal"; // ShareModal 컴포넌트 import

interface Product {
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

interface BrandProduct {
  id: number;
  name: string;
  imageUrl: string;
}

const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [brandProducts, setBrandProducts] = useState<BrandProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ingredient" | "timing">(
    "ingredient"
  );
  const [liked, setLiked] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchBrandProducts = async (idToFetch: number) => {
      try {
        const brandResponse = await axios.get(
          `http://3.35.50.61:8080/api/v1/supplements/brand`,
          {
            params: { id: idToFetch },
            headers: {
              accept: "*/*",
            },
          }
        );

        if (brandResponse.status === 200) {
          console.log(
            "브랜드 제품 목록 데이터:",
            brandResponse.data.supplements
          );
          setBrandProducts(brandResponse.data.supplements);
        } else {
          setBrandProducts([]);
        }
      } catch (error) {
        console.error("브랜드 제품 목록을 불러오는데 실패했습니다:", error);
        setBrandProducts([]);
      }
    };

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://3.35.50.61:8080/api/v1/supplements`,
          {
            params: { id },
            headers: {
              "X-User-Id": 987,
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("제품 상세 페이지 데이터:", response.data);
          const productData = response.data;
          setProduct(productData);
          setLiked(productData.liked);

          const brandIdOrSupplementId =
            productData.brandId || productData.supplementId;
          fetchBrandProducts(brandIdOrSupplementId);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("제품 정보를 불러오는데 실패했습니다:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowButton(currentY < 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLike = async () => {
    if (!product) {
      console.error("제품 정보가 없어 좋아요를 누를 수 없습니다.");
      return;
    }
    const supplementId = product.supplementId;
    const newLikedState = !liked;

    setLiked(newLikedState);

    try {
      await axios.post(
        `http://3.35.50.61:8080/api/v1/supplements/${supplementId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (newLikedState) {
        console.log("찜한 상태로 요청되었습니다.");
      } else {
        console.log("찜을 취소했습니다.");
      }
    } catch (error) {
      console.error("좋아요 상태 업데이트에 실패했습니다:", error);
      setLiked(!newLikedState);
    }
  };

  // URL 복사 로직 추가
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsModalOpen(true);
    } catch (err) {
      console.error("URL 복사 실패:", err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
        liked={liked}
        toggleLike={toggleLike}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showButton={showButton}
        brandProducts={brandProducts}
      />
      <MainDetailPageDesktop
        product={product}
        liked={liked}
        toggleLike={toggleLike}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        brandProducts={brandProducts}
        onCopyUrl={handleCopyUrl} // 데스크탑 컴포넌트에 URL 복사 함수 전달
      />

      {/* 최상위 컴포넌트에서 모달을 렌더링 */}
      <ShareModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default ProductDetailPage;
