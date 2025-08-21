import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface TimingTabProps {
  intakeTime: string;
  ingredientName: string; // firstNutrientName 값이 들어옴
}

const TimingTab = ({ intakeTime, ingredientName }: TimingTabProps) => {
  const navigate = useNavigate();

  const goToIngredientPage = () => {
    if (!ingredientName) return;
    navigate(`/ingredients/${encodeURIComponent(ingredientName)}`);
  };

// 1. 1회 섭취량 추출
const amountMatch = intakeTime.match(/1회\s*([\d]+)\s*([가-힣\w]+)/);
let amount = "";
if (amountMatch) {
  const num = amountMatch[1];           // 숫자
  let unit = amountMatch[2];            // 단위
  unit = unit.replace(/[을를]/g, "");   // 조사 제거
  unit = unit.replace(/\(.*?\)/g, ""); // 괄호 제거
  amount = `${num} ${unit}`.trim();
}

// 2. -일 -회 추출
const prefixMatch = intakeTime.match(/(\d+일\s*\d+회)/);
const prefix = prefixMatch ? prefixMatch[1] : "";

// 3. 최종 출력: "-일 -회 섭취 (amount)"
const displayText = `${prefix} 섭취 (${amount})`;
console.log(displayText); // 예: "1일 2회 섭취 (1포)"

  return (
    <>
      {/* 모바일 */}
      <div className="sm:hidden">
        <div className="flex flex-col items-center w-full mt-[28px] mb-[50px]">
          <div className="flex items-center justify-center w-full max-w-[356px] h-[56px] bg-[#F2F2F2] rounded-[12px]">
            <span
              onClick={goToIngredientPage}
              className="font-Regular text-[14px] tracking-[-0.32px] cursor-pointer"
            >
              {ingredientName}에 대해 더 자세히 알고 싶다면 ?
            </span>
            <MdOutlineArrowForwardIos className="h-[22px] ml-[20px]" />
          </div>

          <div className="flex justify-center items-center bg-white px-[34px] border-[#AAAAAA] border-[0.5px] rounded-[16px] w-full max-w-[356px] mt-[26px] h-[81px]">
            <div className="w-full max-w-[294px] h-[30px] flex justify-between gap-[20px] items-center">
              <p className="font-medium text-[20px]">{prefix} 섭취</p>
              <p className="bg-[#EEEEEE] font-semibold text-[12px] px-[12px] py-[6px] flex justify-center items-center rounded-[20px]">{amount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PC */}
      <div className="hidden sm:block">
        <div className="flex flex-col items-center w-[567px] mt-[36px]">
          <div className="flex items-center justify-between w-full h-[67px] bg-[#F2F2F2] rounded-[16px] px-[25px]">
            <div className="flex-1 text-center">
              <span
                onClick={goToIngredientPage}
                className="font-Regular text-[22px] tracking-[-1px] cursor-pointer"
              >
                {ingredientName}에 대해 더 자세히 알고 싶다면 ?
              </span>
            </div>
            <MdOutlineArrowForwardIos className="text-[22px]" />
          </div>
          
          <div className="flex justify-center items-center w-full mt-[26px] border-[#AAAAAA] border-1 rounded-[18px]">
            <div className="flex justify-between gap-[20px] w-full px-[40px] py-[30px]">
              <p className="font-medium text-[21px]">{prefix} 섭취</p>
              <span className="bg-[#EEEEEE] rounded-[20px] text-[18px] px-[18px] py-[4px] flex justify-center items-center font-medium">{amount}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimingTab;
