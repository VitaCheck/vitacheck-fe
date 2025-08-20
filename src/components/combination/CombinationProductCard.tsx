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
  // 모바일/PC 임계 길이 분리
  const isLongNameMobile = useMemo(() => item.supplementName.length > 18, [item.supplementName]);
  const isLongNamePC = useMemo(() => item.supplementName.length > 24, [item.supplementName]);

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
        title={item.supplementName}
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
        {/* 텍스트: 두 줄 고정 + 말줄임 */}
        <div className="mt-2 h-[36px] flex items-center justify-center px-2">
          <p
            className={clsx(
              "text-center font-pretendard tracking-[-0.02em] leading-[120%]",
              isLongNameMobile ? "text-[12px]" : "text-[14px]",
              "line-clamp-2 break-keep break-words overflow-hidden"
            )}
          >
            {item.supplementName}
          </p>
        </div>
      </div>

      {/* PC 카드 */}
      <div
        onClick={onToggle}
        className={clsx(
          "hidden md:block relative box-border cursor-default",
          isSelected ? "bg-[#EEEEEE]" : "bg-white",
          "w-full h-[220px] rounded-[25px] p-6 shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)] hover:shadow-lg"
        )}
        title={item.supplementName} // 툴팁으로 전체명 제공
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={clsx(
            "absolute top-[10px] right-[15px] text-[#1C1B1F]",
            isSelected ? "text-[20px] mt-2 font-bold" : "text-[30px]"
          )}
        >
          {isSelected ? "—" : "+"}
        </button>

        <img
          src={item.imageUrl}
          alt={item.supplementName}
          className="mx-auto w-[130px] h-[100px] object-contain mt-3"
        />

        {/* 텍스트: 고정 높이(두 줄) + 말줄임 + 단어 제어 */}
        <div className="mt-3 h-[50px] flex items-center justify-center px-2">
          <p
            className={clsx(
              "text-center font-pretendard font-medium tracking-[-0.02em] leading-[120%]",
              isLongNamePC ? "text-[16px]" : "text-[18px]",
              "line-clamp-2 break-keep break-words overflow-hidden"
            )}
          >
            {item.supplementName}
          </p>
        </div>
      </div>
    </>
  );
}
