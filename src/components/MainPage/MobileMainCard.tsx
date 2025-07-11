interface MobileMainCardProps {
  title: string;
  icon: string;
}

const MobileMainCard = ({ title, icon }: MobileMainCardProps) => {
  return (
    <div className="flex flex-col items-center w-[80px] sm:w-[90px]">
      {/* 원형 배경 안의 아이콘 */}
      <div className="w-[70px] h-[70px] rounded-[18px] bg-[#f4f4f4] flex items-center justify-center">
        <img src={icon} alt="icon" className="w-6 h-6 object-contain" />
      </div>

      {/* 텍스트 */}
      <p className="mt-2 text-center text-[14px] font-medium text-black">
        {title}
      </p>
    </div>
  );
};

export default MobileMainCard;
