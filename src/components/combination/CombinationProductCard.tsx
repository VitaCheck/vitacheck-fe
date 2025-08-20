import { useState, useMemo } from "react";
import clsx from "clsx";
import boxIcon from "../../assets/box.png";
import checkboxIcon from "../../assets/check box.png";

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
  item: Product;
  isSelected: boolean;
  onToggle: () => void;
}

export default function CombinationProductCard({
  item,
  isSelected,
  onToggle,
}: Props) {
  const isLongName = useMemo(() => item.supplementName.length > 18, [item.supplementName]);

  return (
    <>
      {/* 모바일 카드 */}
      <div
        onClick={onToggle}
        className={clsx(
          "relative md:hidden box-border cursor-default",
          isSelected ? "bg-[#EFEFEF]" : "bg-white",
          "w-[156px] h-[156px] p-[17px] pt-[34px] rounded-[13px] shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)]"
        )}
        title={item.supplementName} // 길면 툴팁으로 전체명 제공
      >
        <img
          src={isSelected ? checkboxIcon : boxIcon}
          alt="check"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[12px] left-[12px] w-[30px] h-[30px] cursor-pointer"
        />

        <img
          src={item.imageUrl}
          alt={item.supplementName}
          className="mx-auto w-[80px] h-[80px] object-contain -mt-2"
        />

        {/* 텍스트 래퍼: 고정 높이 + 중앙 정렬 */}
        <div className="mt-2 h-[36px] flex items-center justify-center px-2">
          <p
            className={clsx(
              "text-center font-pretendard tracking-[-0.02em] leading-[120%]",
              // 길면 살짝 폰트 축소
              isLongName ? "text-[12px]" : "text-[14px]",
              // 2줄 말줄임
              "line-clamp-2",
              // 한글 어절 유지 + 영어 단어 깨기 허용
              "break-keep break-words",
              // 말줄임 안전장치
              "overflow-hidden"
            )}
          >
            {item.supplementName}
          </p>
        </div>
      </div>

      {/* PC 카드 */}
      <div
        onClick={onToggle}
        className={`hidden md:block relative box-border cursor-default
        ${isSelected ? "bg-[#EEEEEE]" : "bg-white"}
        w-[230px] h-[220px] rounded-[25px] p-[30px]
        shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)] hover:shadow-lg`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`absolute top-[10px] left-[190px] text-[#1C1B1F] ${
            isSelected ? "text-[22px] mt-2 font-bold" : "text-[35px]"
          }`}
        >
          {isSelected ? "—" : "+"}
        </button>
        <img
          src={item.imageUrl}
          alt={item.supplementName}
          className="mx-auto w-[130px] h-[120px] object-contain"
        />
        <p className="text-center font-pretendard font-medium text-[20px] tracking-[-0.02em] leading-[100%] mt-2">
          {item.supplementName}
        </p>
      </div>
    </>
  );
}
