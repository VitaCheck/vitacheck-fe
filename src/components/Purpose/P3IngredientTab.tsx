// src/components/Purpose/P3IngredientTab.tsx
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Nutrient {
  name: string;
  intake: number;
  recommended: number;
  upperLimit: number;
}

interface IngredientTabProps {
  supplementId: number;
  onFirstNutrientChange?: React.Dispatch<React.SetStateAction<string>>;
}

const IngredientTab: React.FC<IngredientTabProps> = ({ supplementId, onFirstNutrientChange }) => {
  const navigate = useNavigate();
  const [nutrientData, setNutrientData] = useState<Nutrient[]>([]);
  const firstNutrientName = nutrientData[0]?.name ?? "";

  const goToIngredientPage = () => {
    if (!firstNutrientName) return;
    navigate(`/ingredients/${encodeURIComponent(firstNutrientName)}`);
  };

useEffect(() => {
  if (!supplementId) return;

  const fetchSupplementDetails = async () => {
    try {
      const apiURL = `http://vita-check.com/api/v1/supplements/detail`;
      const response = await axios.get(apiURL, {
        params: { id: supplementId },
        headers: { accept: "*/*" },
      });

      const mapped = response.data.ingredients.map((ing: any) => ({
        name: ing.name,
        intake: Math.min(ing.visualization.normalizedAmountPercent, 100),
        recommended: ing.visualization.recommendedStartPercent,
        upperLimit: ing.visualization.recommendedEndPercent,
      }));

      setNutrientData(mapped);

      // 부모로 firstNutrientName 전달
      if (mapped[0]?.name && onFirstNutrientChange) {
        onFirstNutrientChange(mapped[0].name);
      }
    } catch (error) {
      console.error("❌ INGREDIENT TAB API 호출 오류:", error);
    }
  };

  fetchSupplementDetails();
}, [supplementId, onFirstNutrientChange]);


  return (
    <>
      {/* 모바일 전용 */}
      <div className="sm:hidden">
        <div className="flex flex-col items-center w-full mt-[28px] mb-[50px]">
          <div className="flex items-center justify-center w-full max-w-[356px] h-[56px] bg-[#F2F2F2] rounded-[12px]">
            <span
              onClick={goToIngredientPage}
              className="font-Regular text-[14px] tracking-[-0.32px] cursor-pointer"
            >
              {firstNutrientName}에 대해 더 자세히 알고 싶다면 ?
            </span>
            <MdOutlineArrowForwardIos className="h-[22px] ml-[20px]" />
          </div>

          <div className="mt-[24px] ml-[148px] w-full max-w-[203px] flex justify-center gap-[41px]">
            <span className="text-[13px] font-medium">권장</span>
            <span className="text-[13px] font-medium">상한</span>
          </div>

          {/* 성분 함량 그래프 */}
          <div className="flex flex-col gap-[28px] mt-[15px] w-[351px]">
            {nutrientData.map((nutrient) => (
              <div key={nutrient.name} className="flex items-center justify-between">
                <div
                  onClick={goToIngredientPage}
                  className="flex justify-center items-center gap-[15px] cursor-pointer"
                >
                  <span className="h-[26px] tracking-[-0.432px] font-medium">
                    {nutrient.name}
                  </span>
                  <MdOutlineArrowForwardIos className="text-[16px]" />
                </div>

                <div className="relative w-full max-w-[203px] h-[24.16px] rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-[#FFE178] rounded-full"
                    style={{ width: `${nutrient.intake}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-[1px] border-l border-black border-dotted"
                    style={{ left: `${nutrient.recommended}%` }}
                  />
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
      <div className="hidden sm:block">
        <div className="flex flex-col items-center w-[567px] mt-[36px]">
          <div className="flex items-center justify-between w-full h-[67px] bg-[#F2F2F2] rounded-[16px] px-[25px]">
            <div className="flex-1 text-center">
              <span
                onClick={goToIngredientPage}
                className="font-Regular text-[22px] tracking-[-1px] cursor-pointer"
              >
                {firstNutrientName}에 대해 더 자세히 알고 싶다면 ?
              </span>
            </div>
            <MdOutlineArrowForwardIos className="text-[22px]" />
          </div>

          <div className="mt-[40px] ml-[227px] w-[133px] flex justify-between">
            <span className="text-[14px] font-medium">권장</span>
            <span className="text-[14px] font-medium">상한</span>
          </div>

          <div className="flex flex-col gap-[32px] mt-[16px] w-full">
            {nutrientData.map((nutrient) => (
              <div key={nutrient.name} className="flex items-center justify-between">
                <div
                  onClick={goToIngredientPage}
                  className="flex justify-center items-center gap-[15px] cursor-pointer"
                >
                  <span className="text-[22px] tracking-[-0.4px] font-medium">
                    {nutrient.name}
                  </span>
                  <MdOutlineArrowForwardIos className="text-[16px]" />
                </div>

                <div className="relative w-[338px] h-[33px] rounded-full bg-[#E9E9E9] overflow-hidden">
                  <div
                    className="h-full bg-[#FFE178] rounded-full"
                    style={{ width: `${nutrient.intake}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-[1.5px] border-l border-black border-dotted"
                    style={{ left: `${nutrient.recommended}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-[1.5px] border-l border-black border-dotted"
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
