// src/components/RecommendedProductSection.tsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RecommendedProductSectionMobile from "./2MobilePurpose2Section";
import RecommendedProductSectionDesktop from "./2DesktopPurposeSection";
import useMediaQuery from "@/hooks/useMediaQuery";

interface RecommendedProductSectionProps {
  ingredientName: string;
  purposes: string[];
  supplements: [string, string][];
  isLoading: boolean;
  goToAllIngredientPage: () => void;
}

interface Product {
  id: number;
  title: string;
  imageUrl: string;
}

const RecommendedProductSection = ({
  ingredientName,
  purposes,
  supplements,
  isLoading,
  goToAllIngredientPage,
}: RecommendedProductSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 767px)"); // MD breakpoint: 768px

  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = isMobile ? 4 : 4; // 모바일/PC 모두 4개씩
  const maxItems = 16;

  useEffect(() => {
    if (supplements) {
      const mappedProducts: Product[] = supplements.map(
        (item: [string, string], idx: number) => ({
          id: idx + 1,
          title: item[0],
          imageUrl: `/images/${item[1]}`,
        })
      );
      setProducts(mappedProducts.slice(0, maxItems));
      setCurrentPage(0);
    }
  }, [supplements]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const goToIngredientPage = () => {
    if (!ingredientName) return;
    navigate(`/ingredients/${encodeURIComponent(ingredientName)}`);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const commonProps = {
    ingredientName,
    purposes,
    isLoading,
    paginatedProducts,
    goToIngredientPage,
    goToAllIngredientPage, // props로 받은 함수를 그대로 사용
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
    navigate,
  };

  return isMobile ? (
    <RecommendedProductSectionMobile {...commonProps} />
  ) : (
    <RecommendedProductSectionDesktop {...commonProps} />
  );
};

export default RecommendedProductSection;