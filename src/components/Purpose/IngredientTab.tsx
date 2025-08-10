import { MdOutlineArrowForwardIos } from "react-icons/md";

const nutrientData = [
  { name: "오메가 3", intake: 70, recommended: 33, upperLimit: 66 },
  { name: "비타민 E", intake: 45, recommended: 33, upperLimit: 66 },
  { name: "은행잎추출물", intake: 50, recommended: 33, upperLimit: 66 },
];

const IngredientTab = () => {
  return (
    <>
      {/* 모바일 전용 */}
      <div className="md:hidden">
        <div className="flex flex-col items-center w-full mt-[28px]">
          <div className="flex items-center justify-center w-[356px] h-[56px] bg-[#F2F2F2] rounded-[12px]">
            <span className="font-Regular text-[14px] tracking-[-0.32px]">
              오메가 3에 대해 더 자세히 알고 싶다면 ?
            </span>
            <MdOutlineArrowForwardIos className="h-[22px] ml-[20px]" />
          </div>

          <div className="mt-[24px] ml-[148px] w-[203px] flex justify-center gap-[41px]">
            <span className="text-[13px] font-medium">권장</span>
            <span className="text-[13px] font-medium">상한</span>
          </div>

          {/* 성분 함량 그래프 */}
          <div className="flex flex-col gap-[28px] mt-[15px] w-[351px]">
            {nutrientData.map((nutrient) => (
              <div key={nutrient.name} className="flex items-center justify-between">
                {/* 성분 이름 */}
                <span className="h-[26px] tracking-[-0.432px] font-medium">{nutrient.name}</span>

                {/* 막대 그래프 */}
                <div className="relative w-[203px] h-[24.16px] rounded-full bg-gray-200 overflow-hidden">
                  {/* 실제 섭취량 */}
                  <div
                    className="h-full bg-[#FFE178] rounded-full"
                    style={{ width: `${nutrient.intake}%` }}
                  />

                  {/* 권장 기준선 */}
                  <div
                    className="absolute top-0 bottom-0 w-[1px] border-l border-black border-dotted"
                    style={{ left: `${nutrient.recommended}%` }}
                  />

                  {/* 상한 기준선 */}
                  <div
                    className="absolute top-0 bottom-0 w-[1px] border-l border-black border-dotted"
                    style={{ left: `${nutrient.upperLimit}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* PC 전용 */}
      <div className="hidden md:block">
        <div className="flex flex-col items-center w-full mt-[55px]">
          <div className="flex items-center justify-center w-[690px] h-[102px] bg-[#F2F2F2] rounded-[24px]">
            <span className="font-Regular text-[32px] tracking-[-1px]">
              오메가 3에 대해 더 자세히 알고 싶다면 ?
            </span>
            <MdOutlineArrowForwardIos className="text-[33px] ml-[50px]" />
          </div>

          <div className="mt-[60px] ml-[244px] w-[148px] flex justify-between">
            <span className="text-[22px] font-medium">권장</span>
            <span className="text-[22px] font-medium">상한</span>
          </div>

          {/* 성분 함량 그래프 */}
          <div className="flex flex-col gap-[48px] mt-[24px] w-[592px]">
            {nutrientData.map((nutrient) => (
              <div key={nutrient.name} className="flex items-center justify-between">
                {/* 성분 이름 */}
                <span className="text-[35px] tracking-[-0.321px] font-medium">{nutrient.name}</span>

                {/* 막대 그래프 */}
                <div className="relative w-[342px] h-[42px] rounded-full bg-[#E9E9E9] overflow-hidden">
                  {/* 실제 섭취량 */}
                  <div
                    className="h-full bg-[#FFE178] rounded-full"
                    style={{ width: `${nutrient.intake}%` }}
                  />

                  {/* 권장 기준선 */}
                  <div
                    className="absolute top-0 bottom-0 w-[2px] border-l border-black border-dotted"
                    style={{ left: `${nutrient.recommended}%` }}
                  />

                  {/* 상한 기준선 */}
                  <div
                    className="absolute top-0 bottom-0 w-[2px] border-l border-black border-dotted"
                    style={{ left: `${nutrient.upperLimit}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default IngredientTab;