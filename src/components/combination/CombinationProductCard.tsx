import { useState } from "react";
import boxIcon from "../../assets/box.png";
import checkboxIcon from "../../assets/check box.png";

interface Props {
  item: {
    name: string;
    imageUrl: string;
  };
  isSelected: boolean;
  onToggle: () => void;
}

export default function CombinationProductCard({
  item,
  isSelected,
  onToggle,
}: Props) {
  const [checkedMobile, setCheckedMobile] = useState(false);

  const handleMobileToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 막기
    setCheckedMobile((prev) => !prev);
    onToggle();
  };

  return (
    <div
      className={`relative cursor-default box-border
        ${checkedMobile ? "bg-[#EFEFEF]" : isSelected ? "bg-[#EEEEEE]" : "bg-white"}

        // 모바일
        w-[156px] h-[156px] pt-[34px] pr-[17px] pb-[14px] pl-[17px] rounded-[13px]
        shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)]

        // PC
        md:w-[299px] md:h-[246px] md:p-[24px] md:rounded-[25px]
        md:shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)] 
        md:hover:shadow-lg
      `}
    >
      <img
        src={checkedMobile ? checkboxIcon : boxIcon}
        alt="check"
        onClick={handleMobileToggle}
        className="absolute top-[12px] left-[12px] w-[30px] h-[30px] md:hidden cursor-pointer"
      />

      <img
        src={item.imageUrl}
        className="mx-auto object-contain
        w-[80px] h-[80px] md:w-[150px] md:h-[150px]"
      />

      <div
        className="text-center font-pretendard font-medium
        text-[14px] leading-[120%] tracking-[-0.02em]
        md:text-[22px] md:leading-[100%]"
      >
        {item.name}
      </div>

      {/* 선택/해제 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="hidden md:block absolute text-[40px] text-[#1C1B1F]"
        style={{
          top: "26.57px",
          left: "237.45px",
          width: "27.2px",
          height: "27.19px",
        }}
      >
        {isSelected ? "—" : "+"}
      </button>
    </div>
  );
}
