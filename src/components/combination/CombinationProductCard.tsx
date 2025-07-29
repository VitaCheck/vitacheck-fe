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
  const [checkedMobile] = useState(false);

  const handleMobileToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <>
      {/* 모바일 카드 */}
      <div
        className={`relative md:hidden box-border cursor-default
        ${isSelected ? "bg-[#EFEFEF]" : "bg-white"}
        w-[156px] h-[156px] p-[17px] pt-[34px] rounded-[13px]
        shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)]`}
      >
        <img
          src={isSelected ? checkboxIcon : boxIcon}
          alt="check"
          onClick={handleMobileToggle}
          className="absolute top-[12px] left-[12px] w-[30px] h-[30px] cursor-pointer"
        />
        <img
          src={item.imageUrl}
          className="mx-auto w-[80px] h-[80px] object-contain -mt-2"
        />
        <p className="text-center font-pretendard font-medium text-[14px] mt-2 tracking-[-0.02em] leading-[120%]">
          {item.name}
        </p>
      </div>

      {/* PC 카드 */}
      <div
        className={`hidden md:block relative box-border cursor-default
        ${isSelected ? "bg-[#EEEEEE]" : "bg-white"}
        w-[299px] h-[246px] rounded-[25px] p-[30px]
        shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)] hover:shadow-lg`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="absolute top-[10px] left-[245px] text-[40px] text-[#1C1B1F]"
        >
          {isSelected ? "—" : "+"}
        </button>
        <img
          src={item.imageUrl}
          className="mx-auto w-[145px] h-[145px] object-contain mt-2"
        />
        <p className="text-center font-pretendard font-medium text-[20px] tracking-[-0.02em] leading-[100%] mt-4">
          {item.name}
        </p>
      </div>
    </>
  );
}
