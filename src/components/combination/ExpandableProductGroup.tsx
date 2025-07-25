import React, { useState } from "react";
import CombinationProductCard from "./CombinationProductCard";
import { FiChevronDown } from "react-icons/fi";

interface Product {
  name: string;
  imageUrl: string;
}

interface Props {
  title: string;
  products: Product[];
  selectedItems: Product[];
  onToggle: (item: Product) => void;
  hideTitle?: boolean;
}

const ExpandableProductGroup = ({
  title,
  products,
  selectedItems,
  onToggle,
  hideTitle = false,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const visibleProducts = expanded ? products : products.slice(0, 2);

  return (
    <div className="mb-8">
      {/* 카테고리 제목 (조건부) */}
      {!hideTitle && <h2 className="text-[22px] font-bold mb-4">{title}</h2>}

      {/* 카드 리스트 */}
      <div className="flex flex-wrap justify-center gap-8">
        {visibleProducts.map((item, idx) => (
          <CombinationProductCard
            key={idx}
            item={item}
            isSelected={selectedItems.some((i) => i.name === item.name)}
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
    </div>
  );
};

export default ExpandableProductGroup;
