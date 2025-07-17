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
  return (
    <div
      onClick={onToggle}
      className={`relative cursor-pointer box-border
        ${isSelected ? "bg-[#EEEEEE]" : "bg-white"}

        // 모바일
        w-[156px] h-[156px] pt-[34px] pr-[17px] pb-[14px] pl-[17px] rounded-[13px]
        shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)]

        // PC
        md:w-[299px] md:h-[246px] md:pt-[15px] md:pr-[24px] md:pb-[15px] md:pl-[24px] md:rounded-[25px]
        md:shadow-md md:hover:shadow-lg
      `}
    >
      <img
        src={item.imageUrl}
        alt={item.name}
        className="mx-auto mb-auto object-contain
          w-[64px] h-[64px] md:w-[150px] md:h-[150px]"
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
        className="hidden md:block absolute text-[22px] text-[#1C1B1F]"
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
