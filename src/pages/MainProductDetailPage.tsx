// import { useParams, useLocation } from "react-router-dom";
// import { useEffect, useState, useCallback } from "react";
// import axios from "@/lib/axios";
// import MainDetailPageMobile from "@/components/Purpose/P3MMainDetailPage";
// import MainDetailPageDesktop from "@/components/Purpose/P3DMainDetailPage";
// import ShareModal from "@/components/Purpose/P3DShareModal";
// import LoginPromptModal from "@/components/Purpose/LoginPromptModal";

// interface ApiProduct {
//   supplementId: number;
//   brandId: number;
//   brandName: string;
//   brandImageUrl: string | null;
//   supplementName: string;
//   supplementImageUrl: string;
//   liked: boolean;
//   coupangLink: string | null;
//   intakeTime: string;
//   ingredients: Ingredient[];
// }

// interface Ingredient {
//   name: string;
//   amount: string;
// }

// interface Product {
//   id: number;
//   brandId: number;
//   brandName: string;
//   brandImageUrl: string | null;
//   supplementName: string;
//   supplementImageUrl: string;
//   liked: boolean;
//   coupangLink: string | null;
//   intakeTime: string;
//   ingredients: Ingredient[];
// }

// interface BrandProduct {
//   id: number;
//   name: string;
//   imageUrl: string;
// }

// const ProductDetailPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();
//   const state = location.state as { product?: Product } | undefined;

//   const [product, setProduct] = useState<Product | null>(null);
//   const [brandProducts, setBrandProducts] = useState<BrandProduct[]>([]);
//   const [isLoading, setIsLoading] = useState(!state?.product);
//   const [activeTab, setActiveTab] = useState<"ingredient" | "timing">("ingredient");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   /** 서버 내 찜 상태로 liked 업데이트 + 콘솔 출력 */
//   const refreshLikedState = useCallback(async (supplementId: number) => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) return;

//     try {
//       const res = await axios.get("/api/v1/likes/me", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       // 서버 응답 배열 안전 처리
//       const likedList = Array.isArray(res.data.result)
//         ? res.data.result
//         : Array.isArray(res.data)
//         ? res.data
//         : [];

//       const likedIds = new Set(likedList.map((x: { supplementId: number }) => x.supplementId));
//       const isLiked = likedIds.has(supplementId);

//       setProduct((prev) => (prev ? { ...prev, liked: isLiked } : prev));

//       console.log(
//         `💖 서버 찜 상태 확인 (supplementId=${supplementId}):`,
//         isLiked ? "찜 되어 있음 ❤️" : "찜 안 되어 있음 🤍"
//       );
//     } catch (e) {
//       console.warn("[likes/me] refresh failed", e);
//     }
//   }, []);

//   useEffect(() => {
//     if (!id) return;

//     const fetchProductAndBrandDetails = async () => {
//       setIsLoading(true);

//       try {
//         const supplementId = Number(id);
//         const accessToken = localStorage.getItem("accessToken");

//         // 상세 정보(liked 포함)
//         const productResponse = await axios.get<ApiProduct>("/api/v1/supplements", {
//           params: { id: supplementId },
//           headers: {
//             Authorization: accessToken ? `Bearer ${accessToken}` : "",
//           },
//         });

//         const fetchedProduct = productResponse.data;
//         const mappedProduct: Product = {
//           id: fetchedProduct.supplementId,
//           ...fetchedProduct,
//         };

//         setProduct(mappedProduct);

//         // 서버 찜 상태로 재확정 및 콘솔 출력
//         refreshLikedState(mappedProduct.id);

//         // 브랜드 제품 리스트
//         const brandIdToFetch = fetchedProduct.brandId || fetchedProduct.supplementId;
//         const brandResponse = await axios.get<{ [key: string]: BrandProduct[] }>(
//           "/api/v1/supplements/brand",
//           { params: { id: brandIdToFetch } }
//         );

//         const brandProductsArray: BrandProduct[] = Object.values(brandResponse.data)
//           .flat()
//           .map((item) => ({
//             id: item.id,
//             name: item.name,
//             imageUrl: item.imageUrl,
//           }));

//         setBrandProducts(brandProductsArray);
//       } catch (error: any) {
//         console.error("❌ 제품 정보를 불러오는데 실패했습니다:", error);
//         if (error.response?.status === 401) setIsLoginModalOpen(true);
//         setProduct(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProductAndBrandDetails();
//   }, [id, refreshLikedState]);

//   /** 찜 토글 */
//   const toggleLike = async () => {
//     if (!product) return;

//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       setIsLoginModalOpen(true);
//       console.log("💡 로그인 필요: 찜 기능 사용 불가");
//       return;
//     }

//     const supplementId = product.id;
//     const newLikedState = !product.liked;

//     // Optimistic UI
//     setProduct((prev) => (prev ? { ...prev, liked: newLikedState } : null));

//     try {
//       await axios.post(
//         `/api/v1/supplements/${supplementId}/like`,
//         {}, // API 토글용 빈 body
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("✅ 서버에 찜 상태 반영 완료");
//     } catch (error) {
//       console.error("❌ 찜 상태 업데이트 실패:", error);
//       setProduct((prev) => (prev ? { ...prev, liked: !newLikedState } : null));
//     } finally {
//       // 최종 서버 상태로 동기화 + 콘솔 출력
//       refreshLikedState(supplementId);
//     }
//   };

//   const handleCopyUrl = async () => {
//     try {
//       await navigator.clipboard.writeText(window.location.href);
//       setIsModalOpen(true);
//     } catch (err) {
//       console.error("URL 복사 실패:", err);
//     }
//   };

//   const handleCloseModal = () => setIsModalOpen(false);
//   const handleCloseLoginModal = () => setIsLoginModalOpen(false);

//   if (isLoading) {
//     return <p className="mt-[122px] text-center">제품 정보를 불러오는 중입니다...</p>;
//   }

//   if (!product) {
//     return (
//       <p className="mt-[122px] text-center text-red-500">
//         ❗제품 정보를 불러올 수 없습니다.❗
//       </p>
//     );
//   }

//   return (
//     <>
//       <MainDetailPageMobile
//         product={product}
//         liked={product.liked}
//         toggleLike={toggleLike}
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         showButton={true}
//         brandProducts={brandProducts}
//         brandId={product.brandId ?? product.id}
//         intakeTime={product.intakeTime}
//       />
//       <MainDetailPageDesktop
//         product={product}
//         liked={product.liked}
//         toggleLike={toggleLike}
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         brandProducts={brandProducts}
//         brandId={product.brandId ?? product.id}
//         intakeTime={product.intakeTime}
//         onCopyUrl={handleCopyUrl}
//       />

//       <ShareModal isOpen={isModalOpen} onClose={handleCloseModal} />
//       <LoginPromptModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
//     </>
//   );
// };

// export default ProductDetailPage;

import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "@/lib/axios";
import MainDetailPageMobile from "@/components/Purpose/P3MMainDetailPage";
import MainDetailPageDesktop from "@/components/Purpose/P3DMainDetailPage";
import ShareModal from "@/components/Purpose/P3DShareModal";
import LoginPromptModal from "@/components/Purpose/LoginPromptModal";

/** 공통 응답 래퍼 */
interface ApiEnvelope<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

interface Ingredient {
  name: string;
  amount: string;
}

/** 서버 result 스키마 (너가 준 JSON) */
interface ApiProductResult {
  supplementId: number;
  brandId: number;
  brandName: string;
  brandImageUrl: string | null;
  supplementName: string;
  supplementImageUrl: string;
  coupangLink: string | null;
  intakeTime: string;
  ingredients: Ingredient[];
}

/** 화면에서 쓰는 도메인 모델 */
interface Product {
  id: number;
  brandId: number;
  brandName: string;
  brandImageUrl: string | null;
  supplementName: string;
  supplementImageUrl: string;
  liked: boolean; // 서버엔 없으므로 클라이언트에서 관리(이후 /likes/me로 동기화)
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
  const [activeTab, setActiveTab] = useState<"ingredient" | "timing">(
    "ingredient"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /** 서버 내 찜 상태로 liked 업데이트 + 콘솔 출력 */
  const refreshLikedState = useCallback(async (supplementId: number) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const res = await axios.get("/api/v1/likes/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const likedList = Array.isArray(res.data?.result)
        ? res.data.result
        : Array.isArray(res.data)
          ? res.data
          : [];

      const likedIds = new Set(
        likedList.map((x: { supplementId: number }) => x.supplementId)
      );
      const isLiked = likedIds.has(supplementId);

      setProduct((prev) => (prev ? { ...prev, liked: isLiked } : prev));
      console.log(
        `서버 찜 상태 확인 (supplementId=${supplementId}):`,
        isLiked ? "찜 되어 있음" : "찜 안 되어 있음"
      );
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
        if (Number.isNaN(supplementId)) {
          throw new Error("잘못된 제품 ID");
        }

        const accessToken = localStorage.getItem("accessToken");

        // 상세 정보 호출: 응답이 ApiEnvelope<ApiProductResult> 형태
        const productResponse = await axios.get<ApiEnvelope<ApiProductResult>>(
          "/api/v1/supplements",
          {
            params: { id: supplementId },
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
          }
        );

        const r = productResponse.data.result;

        // 서버 스키마 -> 화면 모델 매핑 (liked은 일단 false)
        const mappedProduct: Product = {
          id: r.supplementId,
          brandId: r.brandId,
          brandName: r.brandName,
          brandImageUrl: r.brandImageUrl ?? null,
          supplementName: r.supplementName,
          supplementImageUrl: r.supplementImageUrl,
          liked: false,
          coupangLink: r.coupangLink ?? null,
          intakeTime: r.intakeTime,
          ingredients: r.ingredients ?? [],
        };

        setProduct(mappedProduct);

        // 서버 찜 상태로 재확정
        refreshLikedState(mappedProduct.id);

        // 브랜드 제품 리스트(엔드포인트 스키마는 기존대로 가정)
        const brandIdToFetch = r.brandId || r.supplementId;
        const brandResponse = await axios.get<{
          [key: string]: BrandProduct[];
        }>("/api/v1/supplements/brand", { params: { id: brandIdToFetch } });

        const brandProductsArray: BrandProduct[] = Object.values(
          brandResponse.data
        )
          .flat()
          .map((item) => ({
            id: item.id,
            name: item.name,
            imageUrl: item.imageUrl,
          }));

        setBrandProducts(brandProductsArray);
      } catch (error: any) {
        console.error("제품 정보를 불러오는데 실패했습니다:", error);
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
      console.log("로그인 필요: 찜 기능 사용 불가");
      return;
    }

    const supplementId = product.id;
    const newLikedState = !product.liked;

    // Optimistic UI
    setProduct((prev) => (prev ? { ...prev, liked: newLikedState } : null));

    try {
      await axios.post(
        `/api/v1/supplements/${supplementId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("서버에 찜 상태 반영 완료");
    } catch (error) {
      console.error("찜 상태 업데이트 실패:", error);
      setProduct((prev) => (prev ? { ...prev, liked: !newLikedState } : null));
    } finally {
      // 최종 서버 상태로 동기화
      refreshLikedState(supplementId);
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
        제품 정보를 불러올 수 없습니다.
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
