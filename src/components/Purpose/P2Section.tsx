// src/components/RecommendedProductSection.tsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RecommendedProductSectionMobile from "./P2MSection";
import RecommendedProductSectionDesktop from "./P2DSection";
import useMediaQuery from "@/hooks/useMediaQuery";

interface RecommendedProductSectionProps {
  ingredientName: string;
  purposes: string[];
  supplements: Supplement[];
  isLoading: boolean;
  goToAllIngredientPage: () => void;
}

interface Supplement {
  id: number;
  name: string;
  imageUrl: string;
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
  const isMobile = useMediaQuery("(max-width: 639px)"); //  sm breakpoint: 640px

  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const maxItems = 16;

  useEffect(() => {
    if (supplements) {
      const mappedProducts: Product[] = supplements.map((item) => ({
        id: item.id,
        title: item.name,
        imageUrl: item.imageUrl.startsWith("http")
          ? item.imageUrl
          : `/images/${item.imageUrl}`,
      }));
      setProducts(mappedProducts.slice(0, maxItems));
      setCurrentPage(0);
    }
  }, [supplements]);

  const itemsPerPage = isMobile ? products.length : 4;
  
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
    goToAllIngredientPage,
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