import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import checkedBoxIcon from "../../assets/check box.png";
import vitaminArrow from "../../assets/비타민 C_arrow.png";
import checkboxIcon from "../../assets/check box.png";
import boxIcon from "../../assets/box.png";
import flipIcon from "../../assets/flip.png";
import axios from "@/lib/axios";
import selectionLine1 from "../../assets/selection line 1.png";
import selectionLine2 from "../../assets/selection line 2.png";

interface SupplementItem {
  supplementId: number;
  supplementName: string;
  imageUrl: string;
}

interface IngredientResult {
  ingredientName: string;
  totalAmount: number;
  unit: string;
  recommendedAmount: number;
  upperAmount: number;
  dosageRatio: number;
  overRecommended: boolean;
}

interface Combination {
  id: number;
  type: "GOOD" | "CAUTION";
  name: string;
  description: string;
  displayRank: number;
}

export default function CombinationResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedItems = location.state?.selectedItems || [];
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);

  const [activeTab, setActiveTab] = useState<"전체" | "초과">("전체");
  const [allOverUpper, setAllOverUpper] = useState(false);

  const [ingredientResults, setIngredientResults] = useState<
    IngredientResult[]
  >([]);

  const [goodCombinations, setGoodCombinations] = useState<Combination[]>([]);
  const [cautionCombinations, setCautionCombinations] = useState<Combination[]>(
    []
  );

  const filteredIngredients: IngredientResult[] =
    activeTab === "전체"
      ? ingredientResults
      : ingredientResults.filter((i) => i.dosageRatio > 1);

  console.log("ingredientResults", ingredientResults); // API 응답

  const fetchCombinationResult = async () => {
    try {
      const supplementIds = selectedItems.map((item: any) => item.id);
      const res = await axios.post("/api/v1/combinations/analyze", {
        supplementIds,
      });
      setIngredientResults(res.data.result.ingredientResults);
    } catch (error) {
      console.error("조합 결과 조회 실패:", error);
    }
  };

  const fetchCombinationRecommendations = async () => {
    try {
      const res = await axios.get("/api/v1/combinations/recommend");
      setGoodCombinations(res.data.result.goodCombinations);
      setCautionCombinations(res.data.result.cautionCombinations);
    } catch (error) {
      console.error("추천 조합 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchCombinationResult();

    fetchCombinationRecommendations();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "right" ? 400 : -400,
        behavior: "smooth",
      });
    }
  };

  const handleToggleCheckbox = (idx: number) => {
    setCheckedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleRecombination = () => {
    const selectedFiltered = selectedItems.filter((_: any, idx: number) =>
      checkedIndices.includes(idx)
    );

    navigate("/add-combination", {
      state: {
        selectedItems: selectedFiltered,
      },
    });
  };

  const FlipCard: React.FC<{ name: string; description: string }> = ({
    name,
    description,
  }) => {
    const [flipped, setFlipped] = useState(false);

    return (
      <>
        {/* 모바일용 카드 */}
        <div
          className="block md:hidden w-[130px] h-[114px] perspective cursor-pointer"
          style={{ perspective: "1000px" }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 ${
              flipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* 앞면 */}
            <div
              className="absolute w-full h-full bg-white rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[16px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{ backfaceVisibility: "hidden" }}
            >
              {name}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] w-[20px] h-[20px]"
              />
            </div>
            {/* 뒷면 */}
            <div
              className="absolute w-full h-full bg-[#FFEB9D] rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[16px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {description}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] w-[20px] h-[20px]"
              />
            </div>
          </div>
        </div>

        {/* PC용 카드 */}
        <div
          className="hidden md:block w-[245px] h-[170px] cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 ${
              flipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* 앞면 */}
            <div
              className="absolute w-full h-full bg-white rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[20px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{ backfaceVisibility: "hidden" }}
            >
              {name}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] w-[25px] h-[25px]"
              />
            </div>
            {/* 뒷면 */}
            <div
              className="absolute w-full h-full bg-[#FFEB9D] rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[20px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {description}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] w-[20px] h-[20px]"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] md:bg-[#FAFAFA] px-0 md:px-4 py-0 font-pretendard flex flex-col">

      {/* 조합분석 - 모바일 버전 */}
      <h1 className="block md:hidden font-pretendard font-bold text-[32px] leading-[100%] tracking-[-0.02em] mb-2 px-10 pt-10">
        조합 분석
      </h1>
      {/* 조합분석 - PC 버전 제목 + 버튼 수평 정렬 */}
      <div className="hidden md:flex justify-between items-start px-[230px] pt-[50px] mb-8">
        <h1 className="font-pretendard font-bold text-[52px] leading-[120%] tracking-[-0.02em]">
          조합 분석
        </h1>

        <div className="flex gap-4">
          <button
            onClick={handleRecombination}
            className="w-[150px] h-[70px] bg-[#EEEEEE] rounded-full text-lg font-semibold flex items-center justify-center"
          >
            재조합
          </button>
          <button
            onClick={() => navigate("/alarm/settings")}
            className={`w-[280px] h-[70px] font-bold ${
              checkedIndices.length > 0 ? "bg-[#FFEB9D]" : "bg-[#EEEEEE]"
            } rounded-[62.5px] flex items-center justify-center`}
          >
            섭취알림 등록하기
          </button>
        </div>
      </div>
      {/* PC 슬라이더 */}
      <div className="hidden md:block px-4">
        <div className="relative w-full max-w-[1430px] h-[300px] bg-white border border-[#B2B2B2] rounded-[45.51px] mx-auto px-[60px] py-[30px] overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-[22.76px] overflow-x-auto scrollbar-hide scroll-smooth pr-[80px]"
          >
            {selectedItems.map((item: SupplementItem) => (
              <div
                key={item.supplementId}
                className={`w-[270px] h-[250px] rounded-[22.76px] flex flex-col items-center pt-[80px] relative flex-shrink-0
          ${checkedIndices.includes(item.supplementId) ? "bg-[#EEEEEE]" : "bg-white"}`}
              >
                <img
                  src={
                    checkedIndices.includes(item.supplementId)
                      ? checkedBoxIcon
                      : boxIcon
                  }
                  alt="checkbox"
                  onClick={() => handleToggleCheckbox(item.supplementId)}
                  className="absolute top-[10px] left-[18px] w-[50px] h-[50px] cursor-pointer"
                />
                <img
                  src={item.imageUrl}
                  className="w-[120px] h-[120px] object-contain mb-3 mt-[-25px]"
                />
                <p
                  className="text-center font-pretendard font-medium mt-1"
                  style={{
                    fontSize: "23px",
                    lineHeight: "100%",
                    letterSpacing: "-0.02em",
                    color: "#000000",
                  }}
                >
                  {item.supplementName}
                </p>
              </div>
            ))}
          </div>

          {/* 좌우 스크롤 버튼 (4개 초과일 때만 표시) */}
          {selectedItems.length > 4 && (
            <>
              <button
                onClick={() => handleScroll("left")}
                className="absolute top-1/2 left-6 -translate-y-1/2 w-[74px] h-[74px] bg-white rounded-full shadow-md flex items-center justify-center"
              >
                <img
                  src="/images/PNG/조합3-1/Frame667.png"
                  alt="왼쪽 스크롤"
                  className="w-[18px] h-[32px] object-contain"
                />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="absolute top-1/2 right-6 -translate-y-1/2 w-[74px] h-[74px] bg-white rounded-full shadow-md flex items-center justify-center"
              >
                <img
                  src="/images/PNG/조합3-1/Frame724.png"
                  alt="오른쪽 스크롤"
                  className="w-[18px] h-[32px] object-contain"
                />
              </button>
            </>
          )}
        </div>
      </div>
      {/* 모바일 슬라이더 */}
      <div className="md:hidden w-[370px] h-[156px] bg-white border border-[#B2B2B2] rounded-[20px] mx-auto overflow-x-auto scrollbar-hide px-4 py-3 mt-3">
        <div className="flex gap-3 w-max">
          {selectedItems.map((item: SupplementItem) => (
            <div
              key={item.supplementId}
              className={`w-[135px] h-[135px] rounded-[22.76px] flex flex-col items-center pt-[35px] relative flex-shrink-0
              ${checkedIndices.includes(item.supplementId) ? "bg-[#EEEEEE]" : "bg-white"}`}
            >
              <img
                src={
                  checkedIndices.includes(item.supplementId)
                    ? checkedBoxIcon
                    : boxIcon
                }
                alt="checkbox"
                onClick={() => handleToggleCheckbox(item.supplementId)}
                className="absolute top-[1px] left-[103px] w-[30px] h-[30px] cursor-pointer"
              />
              <img
                src={item.imageUrl}
                className="w-[80px] h-[80px] object-contain mb-3 mt-[-25px]"
              />
              <p
                className="text-center font-pretendard font-medium"
                style={{
                  fontSize: "15px",
                  lineHeight: "100%",
                  letterSpacing: "-0.02em",
                  color: "#000000",
                }}
              >
                {item.supplementName}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* 모바일 섭취알림 버튼 */}
      <div className="md:hidden mt-4 flex justify-center">
        <button
          onClick={() => navigate("/알림-편집-1")}
          className="w-[370px] h-[54px] bg-[#FFEB9D] rounded-[14px] flex justify-center items-center mt-2"
        >
          <span className="text-[20px] font-medium">섭취알림 등록하기 →</span>
        </button>
      </div>
      {/* PC 섭취량 탭 - 전체 / 초과 */}
      <div className="hidden md:flex flex-col items-center mt-[60px] relative">
        {/* 탭 버튼 */}
        <div className="flex justify-center gap-[200px] w-full z-10">
          {["전체", "초과"].map((tab) => (
            <div
              key={tab}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setActiveTab(tab as "전체" | "초과")}
            >
              <span
                style={{
                  width: "100px",
                  height: "58px",
                  fontFamily: "Pretendard",
                  fontWeight: 600,
                  fontSize: "42px",
                  lineHeight: "120%",
                  letterSpacing: "-0.02em",
                  textAlign: "center",
                  color: tab === "초과" ? "#E70000" : "#000000",
                }}
              >
                {tab}
              </span>
            </div>
          ))}
        </div>

        {/* 선택 라인 */}
        <img
          src={activeTab === "초과" ? selectionLine2 : selectionLine1}
          alt="선택 라인"
          className="mt-4"
          style={{
            width: "730px",
            height: "6px",
            opacity: 1,
          }}
        />
      </div>
      {/* 모바일 버전 탭 */}
      <div className="relative flex flex-col items-center md:hidden mt-10">
        {/* 탭 버튼 */}
        <div className="flex justify-center gap-25 w-full z-10">
          {["전체", "초과"].map((tab) => (
            <div
              key={tab}
              className="flex flex-col items-center"
              onClick={() => setActiveTab(tab as "전체" | "초과")}
            >
              <span
                style={{
                  width: "50px",
                  height: "24px",
                  fontFamily: "Pretendard",
                  fontWeight: 500,
                  fontSize: "20px",
                  lineHeight: "100%",
                  letterSpacing: "-0.02em",
                  textAlign: "center",
                  color: tab === "초과" ? "#E70000" : "#000000",
                }}
              >
                {tab}
              </span>
            </div>
          ))}
        </div>

        {/* 모바일도 동일하게 이미지 조건부 처리 */}
        <img
          src={activeTab === "초과" ? selectionLine2 : selectionLine1}
          alt="선택 라인"
          className="absolute top-5"
          style={{
            width: "350px",
            height: "4px",
            opacity: 1,
            marginTop: "8px",
          }}
        />
      </div>
      {activeTab === "초과" && (
        <div className="bg-gray-100 rounded-xl py-3 px-4 text-center mb-6">
          <p className="text-sm font-semibold text-gray-700">
            적정 섭취량을 준수하세요!
          </p>
        </div>
      )}
      {/* 모바일 섭취량 그래프 */}
      {filteredIngredients.length > 0 && (
        <div className="md:hidden space-y-4 px-4">
          {filteredIngredients.map((ingredient: IngredientResult) => {
            const {
              ingredientName,
              totalAmount,
              recommendedAmount,
              upperAmount,
            } = ingredient;

            // null-safe 기준선 계산
            const recommended = recommendedAmount ?? 0;
            const upper = upperAmount ?? 0;
            const max = upper || recommended || 100; // fallback 100
            const barWidth = `${Math.min((totalAmount / max) * 100, 100)}%`;

            return (
              <div
                key={ingredientName}
                className="flex justify-center items-center gap-10 mt-6"
              >
                {/* 약 이름 + 꺾쇠 */}
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/ingredient?name=${encodeURIComponent(ingredientName)}`
                    )
                  }
                >
                  <span
                    style={{
                      width: "100px",
                      height: "24px",
                      fontFamily: "Pretendard",
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: "120%",
                      letterSpacing: "-0.02em",
                      color: "#000000",
                      display: "inline-block",
                    }}
                  >
                    {ingredientName}
                  </span>
                  <img
                    src={vitaminArrow}
                    alt="화살표"
                    className="ml-2"
                    style={{
                      width: "12px",
                      height: "12px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* 텍스트 라벨 */}
                <div className="relative w-[204px] h-[20px]">
                  <span className="absolute left-[33.33%] -translate-x-1/2 text-[10px] text-gray-500">
                    권장
                  </span>
                  <span className="absolute left-[66.66%] -translate-x-1/2 text-[10px] text-gray-500">
                    상한
                  </span>
                </div>

                {/* 섭취량 그래프 */}
                <div className="pt-[4px]">
                  <div className="relative w-[204px] h-[24px] bg-[#EFEFEF] rounded-full">
                    <div
                      className="absolute bg-[#FFE17E] h-[24px] rounded-full"
                      style={{ width: barWidth }}
                    />
                    <div
                      className="absolute top-0 h-full border-l-2 border-dashed border-black"
                      style={{ left: "33.33%" }}
                    />
                    <div
                      className="absolute top-0 h-full border-l-2 border-dashed border-black"
                      style={{ left: "66.66%" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* PC 섭취량 그래프 */}
      <div className="hidden md:flex flex-col items-center space-y-6 px-[60px] mt-20">
        {filteredIngredients.map((ingredient: IngredientResult) => {
          const {
            ingredientName,
            totalAmount,
            recommendedAmount,
            upperAmount,
          } = ingredient;

          const recommended = recommendedAmount ?? 0;
          const upper = upperAmount ?? 0;
          const max = upper || recommended || 100;
          const barWidth = `${Math.min((totalAmount / max) * 100, 100)}%`;

          return (
            <div key={ingredientName} className="flex flex-col gap-2">
              {/* 텍스트 라벨 */}
              <div className="relative w-[800px] h-[20px]">
                <span className="absolute left-[33.33%] -translate-x-1/2 text-[14px] text-gray-500">
                  권장
                </span>
                <span className="absolute left-[66.66%] -translate-x-1/2 text-[14px] text-gray-500">
                  상한
                </span>
              </div>

              <div className="flex items-center gap-6">
                {/* 이름 + 꺾쇠 */}
                <div
                  className="flex items-center w-[200px] h-[48px] cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/ingredient?name=${encodeURIComponent(ingredientName)}`
                    )
                  }
                >
                  <span className="text-[30px] font-medium">
                    {ingredientName}
                  </span>
                  <img
                    src={vitaminArrow}
                    alt="화살표"
                    className="ml-4"
                    style={{
                      width: "18px",
                      height: "31px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* 그래프 바 */}
                <div className="relative w-[800px] h-[56px] bg-[#E9E9E9] rounded-full">
                  <div
                    className="absolute bg-[#FFE17E] h-full rounded-full"
                    style={{ width: barWidth }}
                  />
                  <div
                    className="absolute top-0 h-full border-l-2 border-dashed border-black"
                    style={{ left: "33.33%" }}
                  />
                  <div
                    className="absolute top-0 h-full border-l-2 border-dashed border-black"
                    style={{ left: "66.66%" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* ⚠️ 주의가 필요한 조합 */}
      {cautionCombinations?.length > 0 && (
        <>
          {/* 📱 모바일 - 주의 조합 */}
          <div className="md:hidden px-7 mt-10">
            <h2 className="text-[22px] font-semibold text-black">
              주의가 필요한 조합 TOP 5
            </h2>
            <p className="text-[14px] text-[#6B6B6B] mt-1">
              카드를 눌러서 확인해 보세요 !
            </p>
          </div>
          <div className="md:hidden px-3 hide-scrollbar overflow-x-auto">
            <div className="w-max flex gap-[16px] ml-4 mr-4 mb-5 mt-5">
              {cautionCombinations.map((combo: Combination) => (
                <FlipCard name={combo.name} description={combo.description} />
              ))}
            </div>
          </div>

          {/* 💻 PC - 주의 조합 */}
          <div className="hidden md:block px-[230px]">
            <h2 className="text-[32px] font-bold text-black mb-1 mt-25">
              주의가 필요한 조합 TOP 5
            </h2>
            <span className="text-[22px] font-semibold text-[#6B6B6B]">
              카드를 눌러서 확인해 보세요 !
            </span>
            <div className="flex justify-start mt-8">
              <div className="flex gap-[50px]">
                {cautionCombinations.map((combo: Combination) => (
                  <FlipCard name={combo.name} description={combo.description} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {/* ===== 궁합이 좋은 조합 ===== */}
      {goodCombinations?.length > 0 && (
        <>
          {/* 📱 모바일 - 좋은 조합 */}
          <div className="md:hidden px-7 mt-10">
            <h2 className="text-[22px] font-semibold text-black">
              궁합이 좋은 조합 TOP 5
            </h2>
            <p className="text-[14px] text-[#6B6B6B] mt-1">
              카드를 눌러서 확인해 보세요 !
            </p>
          </div>
          <div className="md:hidden px-3 hide-scrollbar overflow-x-auto">
            <div className="w-max flex gap-[16px] ml-4 mr-4 mb-15 mt-5">
              {goodCombinations.map((combo: Combination) => (
                <FlipCard name={combo.name} description={combo.description} />
              ))}
            </div>
          </div>

          {/* 💻 PC - 좋은 조합 */}
          <div className="hidden md:block px-[230px]">
            <h2 className="text-[32px] font-bold text-black mb-1 mt-20">
              궁합이 좋은 조합 TOP 5
            </h2>
            <span className="text-[22px] font-semibold text-[#6B6B6B]">
              카드를 눌러서 확인해 보세요 !
            </span>
            <div className="flex justify-start">
              <div className="flex gap-[50px] mt-8 mb-20">
                {goodCombinations.map((combo: Combination) => (
                  <FlipCard name={combo.name} description={combo.description} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
