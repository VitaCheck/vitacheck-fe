import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import MainDetailPageMobile from "@/components/Purpose/MobileMainDetailPage";
import MainDetailPageDesktop from "@/components/Purpose/DesktopMainDetailPage";

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
}

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InVzZXJAdml0YWNoZWNrLmNvbSIsImlhdCI6MTc1NDU1NjYyMywiZXhwIjoxNzU0NTU4NDIzfQ.bDWXfR-Qc7gEwl44e3a8y9Q0PeUTxkMNhYIlidJCQXo";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ingredient" | "timing">("ingredient");
  const [liked, setLiked] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://3.35.50.61:8080/api/v1/supplements`, {
          params: { id },
          headers: {
            'X-User-Id': 987,
            'Authorization': `Bearer ${AUTH_TOKEN}`,
          },
        });
        
        if (response.status === 200) {
          setProduct(response.data);
          setLiked(response.data.liked);
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

  const toggleLike = async() => {
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
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
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
      // 에러 발생 시, 로컬 상태를 이전 상태로 되돌림 (롤백)
      setLiked(!newLikedState);
    }
  };

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
        liked={liked}
        toggleLike={toggleLike}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showButton={showButton}
      />
      <MainDetailPageDesktop
        product={product}
        liked={liked}
        toggleLike={toggleLike}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
};

export default ProductDetailPage;