import { MdOutlineArrowForwardIos } from "react-icons/md";

const IngredientTab = () => {
  return (
    <>
      {/* 모바일 전용 */}
      <div className="md:hidden">
        <div className="flex flex-col items-center px-[10px] mt-[28px] w-full h-[235px] gap-y-[24px]">
          <div className="flex items-center justify-center w-[340px] h-[52px] bg-[#F2F2F2] rounded-[12px]">
            <span className="font-Regular text-[14px] tracking-[-0.32px]">
                오메가 3에 대해 더 자세히 알고 싶다면 ?
            </span>
            <MdOutlineArrowForwardIos className="h-[22px] ml-[20px]"/>
          </div>

          <div className="flex justify-center items-center w-[351px] h-[81px]">
            <span className="font-medium text-[21px]">⏰ 언제든 먹어도 괜찮아요!</span>
          </div>
        </div>
      </div>


      {/* PC 전용 */}
      <div className="hidden md:block">
        <div className="flex flex-col items-center w-full mt-[84px] h-[940px] gap-y-[72px]">
          <div className="flex items-center justify-center w-[1046px] h-[155px] bg-[#F2F2F2] rounded-[36px]">
            <span className="font-Regular text-[48px] tracking-[-1px]">
              오메가 3에 대해 더 자세히 알고 싶다면 ?
            </span>
            <MdOutlineArrowForwardIos className="text-[50px] ml-[75px]" />
          </div>
          <div className="flex justify-center items-center w-[1045px] h-[241px]">
            <span className="font-medium text-center text-[64px]">⏰ 언제든 먹어도 괜찮아요!</span>
          </div>
        </div>
      </div>
    </>
  );    
};

export default IngredientTab;