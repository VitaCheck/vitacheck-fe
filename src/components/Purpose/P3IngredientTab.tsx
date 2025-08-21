// src/components/Purpose/P3IngredientTab.tsx
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";

interface Nutrient {
  name: string;
  originalIntake: number;       // API 원본 섭취량 % (텍스트 표시용)
  originalRecommended: number;  // API 원본 권장량 % (텍스트 표시용)
  barWidthPercent: number;      // 리스케일링된 막대 너비 % (노란 막대용)
  labelPositionPercent: number; // 리스케일링된 권장량 위치 % (텍스트 위치용)
}

interface IngredientTabProps {
  supplementId: number;
  onFirstNutrientChange?: React.Dispatch<React.SetStateAction<string>>;
}

const STANDARD_UPPER_LIMIT_LINE_PERCENT = 66.66;

const IngredientTab: React.FC<IngredientTabProps> = ({ supplementId, onFirstNutrientChange }) => {
  const navigate = useNavigate();
  const [nutrientData, setNutrientData] = useState<Nutrient[]>([]);
  const [hiddenNutrients, setHiddenNutrients] = useState<string[]>([]);
  const firstNutrientName = nutrientData[0]?.name ?? "";

  const goToFirstIngredientPage = () => {
    if (!firstNutrientName) return;
    navigate(`/ingredients/${encodeURIComponent(firstNutrientName)}`);
  };

  // intake/권장량 모두 같은 스케일로 계산
  const getScaledValue = (value: number, upper: number): number => {
    if (upper <= 0) return 0;
    const percent = (value / upper) * STANDARD_UPPER_LIMIT_LINE_PERCENT;
    return Math.min(percent, 100);
  };

  useEffect(() => {
    if (!supplementId) return;

    const fetchSupplementDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/supplements/detail`, {
          params: { id: supplementId },
        });

        console.log(response.data);

        if (response.data && response.data.ingredients) {
          const hidden: string[] = [];

          const mapped: Nutrient[] = response.data.ingredients
            .filter((ing: any) => ing.visualization)
            .map((ing: any) => {
              const intake = ing.visualization.normalizedAmountPercent || 0;
              const recommended = ing.visualization.recommendedStartPercent || 0;
              const upper = ing.visualization.recommendedEndPercent || 0;

              if (intake <= 0) {
                hidden.push(ing.name); // 0% 성분 기록
              }

              return {
                name: ing.name,
                originalIntake: intake,
                originalRecommended: recommended,
                barWidthPercent: getScaledValue(intake, upper),
                labelPositionPercent: getScaledValue(recommended, upper),
              };
            })
            // intake 0인 성분은 화면에서 제외
            .filter((nutrient: Nutrient) => nutrient.originalIntake > 0);

          // 콘솔에 추가 성분 출력
          if (hiddenNutrients.length > 0) {
            console.log("💡 추가 성분(0%로 표시 제외):", hiddenNutrients);
          }

          setNutrientData(mapped);
          setHiddenNutrients(hidden);
          if (mapped[0]?.name && onFirstNutrientChange) {
            onFirstNutrientChange(mapped[0].name);
          }
        } else {
          setNutrientData([]);
          setHiddenNutrients([]);
        }
      } catch (error) {
        console.error("❌ INGREDIENT TAB API 호출 오류:", error);
        setNutrientData([]);
        setHiddenNutrients([]);
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
              onClick={goToFirstIngredientPage}
              className="font-Regular text-[14px] tracking-[-0.32px] cursor-pointer"
            >
              {firstNutrientName ? `${firstNutrientName}에 대해 더 자세히 알고 싶다면 ?` : "성분 정보가 없습니다."}
            </span>
            {firstNutrientName && <MdOutlineArrowForwardIos className="h-[22px] ml-[20px]" />}
          </div>

          {nutrientData.length > 0 && (
            <>
              <div className="w-full max-w-[351px] flex justify-end">
                <div className="w-[203px] relative pt-[24px] pb-[14px]">
                  <span className="text-[13px] font-medium absolute -translate-x-1/2" style={{ left: `${STANDARD_UPPER_LIMIT_LINE_PERCENT}%`}}>상한</span>
                </div>
              </div>
              <div className="flex flex-col gap-[28px] mt-[15px] w-full max-w-[351px]">
                {nutrientData.map((nutrient) => (
                  <div key={nutrient.name} className="flex items-center justify-between">
                    <div
                      onClick={() => navigate(`/ingredients/${encodeURIComponent(nutrient.name)}`)}
                      className="flex justify-center items-center gap-[15px] cursor-pointer"
                    >
                      <span className="h-[26px] tracking-[-0.432px] font-medium max-w-[100px] truncate">
                        {nutrient.name}
                      </span>
                      <MdOutlineArrowForwardIos className="text-[16px]" />
                    </div>
                    <div className="relative w-full max-w-[203px] h-[24.16px] rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-[#FFE178] rounded-full" style={{ width: `${nutrient.barWidthPercent}%` }} />
                      <span
                        className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 text-[10px] font-medium text-black"
                        style={{ left: `33.33%` }}
                      >
                        {`${Math.round(nutrient.originalIntake)}%`}
                      </span>
                      <div className="absolute top-0 bottom-0 w-[1px] border-l border-black border-dotted" style={{ left: `${STANDARD_UPPER_LIMIT_LINE_PERCENT}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full max-w-[351px] flex justify-start">
                {hiddenNutrients.length > 0 && (
                <div className="mt-[40px] text-[12px] max-w-[351px] text-left truncate">
                  추가 함유 성분: {hiddenNutrients.join(", ")}
                </div>
              )}
              </div>
              
            </>
          )}
        </div>
      </div>

      {/* PC 전용 */}
      <div className="hidden sm:block">
        <div className="flex flex-col items-center w-[567px] mt-[36px]">
          <div className="flex items-center justify-between w-full h-[67px] bg-[#F2F2F2] rounded-[16px] px-[25px]">
            <div className="flex-1 text-center">
              <span
                onClick={goToFirstIngredientPage}
                className="font-Regular text-[22px] tracking-[-1px] cursor-pointer"
              >
                {firstNutrientName ? `${firstNutrientName}에 대해 더 자세히 알고 싶다면 ?` : "성분 정보가 없습니다."}
              </span>
            </div>
            {firstNutrientName && <MdOutlineArrowForwardIos className="text-[22px]" />}
          </div>

          {nutrientData.length > 0 && (
            <>
              <div className="mt-[40px] mx-auto pr-[100px] w-full flex justify-end">
                <span className="text-[14px] font-medium">상한</span>
              </div>
              <div className="flex flex-col gap-[32px] mt-[16px] w-full">
                {nutrientData.map((nutrient) => (
                  <div key={nutrient.name} className="flex items-center justify-between">
                    <div
                      onClick={() => navigate(`/ingredients/${encodeURIComponent(nutrient.name)}`)}
                      className="flex justify-center items-center gap-[15px] cursor-pointer"
                    >
                      <span className="text-[22px] tracking-[-0.4px] font-medium max-w-[180px] truncate">
                        {nutrient.name}
                      </span>
                      <MdOutlineArrowForwardIos className="text-[16px]" />
                    </div>
                    <div className="relative w-[338px] h-[33px] rounded-full bg-[#E9E9E9] overflow-hidden">
                      <div className="h-full bg-[#FFE178] rounded-full" style={{ width: `${nutrient.barWidthPercent}%` }} />
                      <div className="absolute top-0 bottom-0 w-[1.5px] border-l border-black border-dotted" style={{ left: `${STANDARD_UPPER_LIMIT_LINE_PERCENT}%` }} />
                      <span
                        className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 text-[14px] font-medium text-black"
                        style={{ left: `33.33%` }}
                      >
                        {`${Math.round(nutrient.originalIntake)}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {hiddenNutrients.length > 0 && (
                <div className="mt-[54px] text-[14px] text-left max-w-[567px] self-start truncate">
                  추가 함유 성분: {hiddenNutrients.join(", ")}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default IngredientTab;
