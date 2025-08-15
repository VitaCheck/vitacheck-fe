import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface Nutrient {
  name: string;
  intake: number;
  recommended: number;
  upperLimit: number;
}

const IngredientTab = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nutrientData, setNutrientData] = useState<Nutrient[]>([]);
  const firstNutrientName = nutrientData[0]?.name ?? "";

  const goToIngredientPage = () => {
    if (!firstNutrientName) return;
    navigate(`/ingredients/${encodeURIComponent(firstNutrientName)}`);
  };

  useEffect(() => {
    if (!id) return;

    const fetchSupplementDetails = async () => {
      try {
        const response = await axios.get(`http://vita-check.com/api/v1/supplements/detail`, {
          params: { id },
          headers: { accept: "*/*" },
        });

        const mapped = response.data.ingredients.map((ing: any) => ({
          name: ing.name,
          intake: Math.min(ing.visualization.normalizedAmountPercent, 100),
          recommended: ing.visualization.recommendedStartPercent,
          upperLimit: ing.visualization.recommendedEndPercent,
        }));

        setNutrientData(mapped);
      } catch (error) {
        console.error("❌ INGREDIENT TAB API 호출 오류:", error);
      }
    };

    fetchSupplementDetails();
  }, [id]);

  const renderNutrientRow = (nutrient: Nutrient, barWidth: number, barHeight: number) => (
    <div key={nutrient.name} className="flex items-center justify-between gap-[30px]">
      <div onClick={goToIngredientPage} className="flex justify-center items-center gap-[15px] cursor-pointer">
        <span className={`font-medium`} style={{ fontSize: barHeight * 0.7 }}>{nutrient.name}</span>
        <MdOutlineArrowForwardIos className="text-[16px]" />
      </div>

      <div className="relative rounded-full bg-gray-200 overflow-hidden" style={{ width: `${barWidth}px`, height: `${barHeight}px` }}>
        <div className="h-full bg-[#FFE178] rounded-full" style={{ width: `${nutrient.intake}%` }} />
        <div className="absolute top-0 bottom-0 w-[1px] border-l border-black border-dotted" style={{ left: `${nutrient.recommended}%` }} />
        <div className="absolute top-0 bottom-0 w-[1px] border-l border-black border-dotted" style={{ left: `${nutrient.upperLimit}%` }} />
      </div>
    </div>
  );

  return (
    <>
      {/* 모바일 */}
      <div className="sm:hidden">
        <div className="flex flex-col items-center w-full mt-[28px] mb-[50px]">
          <div className="flex items-center justify-center w-[356px] h-[56px] bg-[#F2F2F2] rounded-[12px] cursor-pointer" onClick={goToIngredientPage}>
            <span className="font-Regular text-[14px] tracking-[-0.32px]">{firstNutrientName}에 대해 더 자세히 알고 싶다면 ?</span>
            <MdOutlineArrowForwardIos className="h-[22px] ml-[20px]" />
          </div>

          <div className="mt-[24px] ml-[148px] w-[203px] flex justify-center gap-[41px]">
            <span className="text-[13px] font-medium">권장</span>
            <span className="text-[13px] font-medium">상한</span>
          </div>

          <div className="flex flex-col gap-[28px] mt-[15px] w-full max-w-[351px]">
            {nutrientData.map((nutrient) => renderNutrientRow(nutrient, 203, 24.16))}
          </div>
        </div>
      </div>

      {/* PC */}
      <div className="hidden sm:block">
        <div className="flex flex-col items-center w-[567px] mt-[36px]">
          <div className="flex items-center justify-between w-full h-[67px] bg-[#F2F2F2] rounded-[16px] px-[25px] cursor-pointer" onClick={goToIngredientPage}>
            <div className="flex-1 text-center">
              <span className="font-Regular text-[22px] tracking-[-1px]">{firstNutrientName}에 대해 더 자세히 알고 싶다면 ?</span>
            </div>
            <MdOutlineArrowForwardIos className="text-[22px]" />
          </div>

          <div className="mt-[40px] ml-[227px] w-[133px] flex justify-between">
            <span className="text-[14px] font-medium">권장</span>
            <span className="text-[14px] font-medium">상한</span>
          </div>

          <div className="flex flex-col gap-[32px] mt-[16px] w-full">
            {nutrientData.map((nutrient) => renderNutrientRow(nutrient, 338, 33))}
          </div>
        </div>
      </div>
    </>
  );
};

export default IngredientTab;
