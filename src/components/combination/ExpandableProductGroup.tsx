import React, { useEffect, useState } from "react";
import CombinationProductCard from "./CombinationProductCard";
import { FiChevronDown } from "react-icons/fi";
import axios from "@/lib/axios";

interface Product {
  supplementId: number;
  supplementName: string;
  imageUrl: string;
  price: number;
  description: string;
  method: string;
  caution: string;
  brandName: string;
  ingredients: {
    ingredientName: string;
    amount: number;
    unit: string;
  }[];
}

interface Props {
  title: string;
  selectedItems: Product[];
  onToggle: (item: Product) => void;
  hideTitle?: boolean;
}

const ExpandableProductGroup = ({
  title,
  selectedItems,
  onToggle,
  hideTitle = false,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const visibleProducts = expanded ? products : products.slice(0, 2);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/supplements/search", {
        params: { keyword: title },
      });

      const content = res.data.result?.supplements?.content || [];
      setProducts(content);
    } catch (error) {
      console.error("영양제 검색 실패:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [title]);

  return (
    <div className="mb-8">
      {/* 카테고리 제목 (조건부) */}
      {!hideTitle && <h2 className="text-[22px] font-bold mb-4">{title}</h2>}

      {/* 로딩 중 표시 */}
      {loading ? (
        <p className="text-center text-gray-500">로딩 중...</p>
      ) : (
        <>
          {/* 카드 리스트 */}
          <div className="flex flex-wrap justify-center gap-8">
            {visibleProducts.map((item) => (
              <CombinationProductCard
                key={item.supplementId}
                item={item}
                isSelected={selectedItems.some(
                  (i) => i.supplementId === item.supplementId
                )}
                onToggle={() => onToggle(item)}
              />
            ))}
          </div>

          {/* 펼쳐보기 섹션 */}
          {!expanded && products.length > 2 && (
            <div className="mt-4 w-full">
              <div
                className="flex justify-center items-center cursor-pointer"
                onClick={() => setExpanded(true)}
              >
                <span
                  className="text-[12px] font-medium leading-[120%] tracking-[-0.02em] text-center font-pretendard text-black"
                  style={{ width: "50px", height: "14px" }}
                >
                  펼쳐보기
                </span>
                <span className="ml-1" style={{ marginTop: "3px" }}>
                  <FiChevronDown size={16} color="#1C1B1F" />
                </span>
              </div>

              {/* 하단 회색 선 */}
              <div
                className="mt-2 mx-auto"
                style={{
                  width: "360px",
                  height: "0px",
                  borderTop: "0.52px solid #B2B2B2",
                  opacity: 1,
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpandableProductGroup;
