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
          <div className="flex items-center justify-center w-[340px] h-[52px] bg-[#F2F2F2] rounded-[12px]">
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
        <div className="flex flex-col items-center w-full mt-[84px]">
          <div className="flex items-center justify-center w-[1046px] h-[155px] bg-[#F2F2F2] rounded-[36px]">
            <span className="font-Regular text-[48px] tracking-[-1px]">
              오메가 3에 대해 더 자세히 알고 싶다면 ?
            </span>
            <MdOutlineArrowForwardIos className="text-[50px] ml-[75px]" />
          </div>

          <div className="mt-[90px] ml-[370px] w-[225px] flex justify-between">
            <span className="text-[32px] font-medium">권장</span>
            <span className="text-[32px] font-medium">상한</span>
          </div>

          {/* 성분 함량 그래프 */}
          <div className="flex flex-col gap-[72px] mt-[37.36px] w-[896px]">
            {nutrientData.map((nutrient) => (
              <div key={nutrient.name} className="flex items-center justify-between">
                {/* 성분 이름 */}
                <span className="text-[52px] tracking-[-0.432px] font-medium">{nutrient.name}</span>

                {/* 막대 그래프 */}
                <div className="relative w-[518px] h-[62px] rounded-full bg-[#E9E9E9] overflow-hidden">
                  {/* 실제 섭취량 */}
                  <div
                    className="h-full bg-[#FFE178] rounded-full"
                    style={{ width: `${nutrient.intake}%` }}
                  />

                  {/* 권장 기준선 */}
                  <div
                    className="absolute top-0 bottom-0 w-[2.3px] border-l border-black border-dotted"
                    style={{ left: `${nutrient.recommended}%` }}
                  />

                  {/* 상한 기준선 */}
                  <div
                    className="absolute top-0 bottom-0 w-[2.3px] border-l border-black border-dotted"
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