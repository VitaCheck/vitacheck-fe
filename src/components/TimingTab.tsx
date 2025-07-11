import { MdOutlineArrowForwardIos } from "react-icons/md";

const IngredientTab = () => {
  return (
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
  );
};

export default IngredientTab;