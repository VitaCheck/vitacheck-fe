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
  recommendedAmount: number | null;
  upperAmount: number | null;
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
  // 선택: 더 촘촘한 올림 (1250 -> 1300)
  function niceRoundUp(n: number) {
    if (n <= 0) return 1;
    const step = 100; // 필요하면 50/100/200 등으로 조정
    return Math.ceil(n / step) * step;
  }

  const clamp = (x: number) => Math.max(0, Math.min(100, x));
  function toPct(n: number, max: number) {
    if (!max || max <= 0) return 0;
    return clamp((n / max) * 100);
  }

  function calcGauge(ing: IngredientResult) {
    const total = ing.totalAmount ?? 0;
    const unit = ing.unit ?? "";
    const rec = ing.recommendedAmount;
    const upper = ing.upperAmount;

    // 1) max 결정
    let max = Math.max(total, rec ?? 0, upper ?? 0, 1);
    if (rec == null && upper == null) {
      max = niceRoundUp(total * 1.25); // 기준 없으면 여유 + 보기 좋은 숫자
    } else if (upper == null && rec != null) {
      max = Math.max(max, rec * 1.5); // 권장만 있으면 우측 여유
    }

    // 2) 퍼센트 위치
    const widthPct = toPct(total, max);
    const recPct = rec != null ? toPct(rec, max) : 33.33; // 가이드
    const upperPct = upper != null ? toPct(upper, max) : 66.67; // 가이드
    const hasRealRec = rec != null;
    const hasRealUpper = upper != null;
    const isFallbackGuide = !hasRealRec && !hasRealUpper;

         // 3) 색상 구간(노랑/주황/빨강) 폭
     const yellowWidth = hasRealRec ? Math.min(widthPct, recPct) : widthPct;
     const orangeLeft = hasRealRec ? recPct : null;
     const orangeRight = hasRealUpper ? Math.min(widthPct, upperPct) : widthPct;
     const orangeWidth =
       orangeLeft != null ? Math.max(0, orangeRight - orangeLeft) : 0;
     const redLeft = hasRealUpper ? upperPct : null;
     const redWidth =
       redLeft != null && widthPct > redLeft ? widthPct - redLeft : 0;
     
     // 상한 초과 여부를 명확하게 계산
     // 상한선(66.67% 또는 실제 upper 값) 이상인 경우를 초과로 판단
     const isOverUpperLimit = hasRealUpper && widthPct > upperPct;

         return {
       unit,
       total,
       widthPct,
       recPct,
       upperPct,
       hasRealRec,
       hasRealUpper,
       isFallbackGuide,
       yellowWidth,
       orangeLeft,
       orangeWidth,
       redLeft,
       redWidth,
       isOverUpperLimit,
     };
  }

  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

     const selectedItems = location.state?.selectedItems || [];
   console.log("selectedItems:", selectedItems);
   console.log("location.state:", location.state);
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);

  const [activeTab, setActiveTab] = useState<"전체" | "초과">("전체");
  const [allOverUpper, setAllOverUpper] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

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
      : ingredientResults.filter((i) => {
          console.log(`필터링 중인 성분: ${i.ingredientName}`, {
            dosageRatio: i.dosageRatio,
            overRecommended: i.overRecommended,
            upperAmount: i.upperAmount,
            totalAmount: i.totalAmount,
            recommendedAmount: i.recommendedAmount
          });
          
          // 초과 탭에서는 다음 조건을 만족하는 성분을 표시:
          // 1. 권장량 초과 (dosageRatio > 1)
          // 2. 상한량 초과 (overRecommended)
          // 3. 상한값이 있고 총량이 상한값을 초과하는 경우
          // 4. API에서 권장량/상한량이 null이지만 실제로는 과다 섭취일 수 있는 경우
          const isOverRecommended = i.dosageRatio > 1;
          const isOverUpper = i.overRecommended;
          const isOverUpperLimit = i.upperAmount && i.totalAmount > i.upperAmount;
          
          // 게이지 계산에서 상한 초과 여부도 확인 (중요!)
          const gauge = calcGauge(i);
          const isOverUpperInGauge = gauge.isOverUpperLimit;
          
          // 상한선(66.67% 또는 실제 upper 값) 이상인 경우를 명확하게 확인
          const isOverUpperLine = gauge.widthPct > gauge.upperPct;
          
          // API에서 권장량/상한량이 null인 경우, 일반적인 기준값으로 판단
          let isOverGeneralLimit = false;
          if (i.recommendedAmount === null && i.upperAmount === null) {
            // 일반적인 영양소별 권장량 기준 (IU, mg 단위별)
            if (i.unit === "IU") {
              // 비타민 D: 일반적으로 4000 IU 이상을 과다로 간주
              if (i.ingredientName.includes("비타민 D") && i.totalAmount > 4000) {
                isOverGeneralLimit = true;
              }
              // 비타민 A: 일반적으로 10000 IU 이상을 과다로 간주
              else if (i.ingredientName.includes("비타민 A") && i.totalAmount > 10000) {
                isOverGeneralLimit = true;
              }
            } else if (i.unit === "mg") {
              // 비타민 C: 일반적으로 2000 mg 이상을 과다로 간주
              if (i.ingredientName.includes("비타민 C") && i.totalAmount > 2000) {
                isOverGeneralLimit = true;
              }
              // 기타 미네랄: 일반적으로 권장량의 3배 이상을 과다로 간주
              else if (i.totalAmount > 1000) { // 1000mg 이상은 일반적으로 과다
                isOverGeneralLimit = true;
              }
            }
          }
          
          const shouldShow = isOverRecommended || isOverUpper || isOverUpperLimit || isOverUpperInGauge || isOverUpperLine || isOverGeneralLimit;
          console.log(`성분 ${i.ingredientName} 표시 여부:`, shouldShow, {
            isOverRecommended,
            isOverUpper,
            isOverUpperLimit,
            isOverUpperInGauge,
            isOverUpperLine,
            isOverGeneralLimit,
            widthPct: gauge.widthPct,
            upperPct: gauge.upperPct
          });
          
          return shouldShow;
        });

  console.log("ingredientResults", ingredientResults); // API 응답
  console.log("filteredIngredients", filteredIngredients); // 필터링된 결과
  console.log("activeTab", activeTab); // 현재 선택된 탭
  console.log("필터링 결과 상세:", {
    전체: ingredientResults.length,
    초과: filteredIngredients.length
  });

     const fetchCombinationResult = async () => {
    try {
      const supplementIds = selectedItems.map(
        (item: { supplementId: number }) => item.supplementId
      );
      console.log("API 호출 시작 - supplementIds:", supplementIds);
      console.log("selectedItems 전체:", selectedItems);
      
      const res = await axios.post("/api/v1/combinations/analyze", {
        supplementIds,
      });
      console.log("API 응답 전체:", res.data);
      console.log("API 응답 result:", res.data.result);
      console.log("API 응답 ingredientResults:", res.data.result?.ingredientResults);
      
      if (res.data.result?.ingredientResults) {
        console.log("성분 결과 상세:", res.data.result.ingredientResults.map((i: any) => ({
          name: i.ingredientName,
          total: i.totalAmount,
          recommended: i.recommendedAmount,
          upper: i.upperAmount,
          ratio: i.dosageRatio,
          overRecommended: i.overRecommended
        })));
        setIngredientResults(res.data.result.ingredientResults);
      } else {
        console.warn("ingredientResults가 없습니다:", res.data);
        setIngredientResults([]);
      }
    } catch (error) {
      console.error("조합 결과 조회 실패:", error);
      setIngredientResults([]);
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
     if (selectedItems.length > 0) {
       fetchCombinationResult();
       fetchCombinationRecommendations();
     }
   }, [selectedItems]);

  const CARD_W = 270;
  const GAP_W = 22.76;
  const PAGE_COUNT = 4;
  const PAGE_W = CARD_W * PAGE_COUNT + GAP_W * (PAGE_COUNT - 1);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
  
    const current = el.scrollLeft;
    const pageIndex = Math.round(current / PAGE_W);
    const nextIndex = direction === "right" ? pageIndex + 1 : pageIndex - 1;
    const maxIndex = Math.ceil((el.scrollWidth - el.clientWidth) / PAGE_W);
    const clamped = Math.max(0, Math.min(nextIndex, maxIndex));
    const target = clamped * PAGE_W;
    
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const handleToggleCheckbox = (idx: number) => {
    setCheckedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleRecombination = () => {
    const selectedFiltered = selectedItems.filter((item: SupplementItem) =>
      checkedIndices.includes(item.supplementId)
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
          className="block md:hidden w-[150px] h-[135px] perspective cursor-pointer"
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
        <div className="mx-auto" style={{ width: `${PAGE_W}px` }}> 
          <div
            ref={scrollRef}
            className="flex gap-[22.76px] overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
          >
            {selectedItems.map((item: SupplementItem) => (
              <div
                key={item.supplementId}
                className={`w-[270px] h-[250px] rounded-[22.76px] flex flex-col items-center pt-[80px] relative flex-shrink-0 snap-start
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
          </div>

          {/* 좌우 스크롤 버튼 (4개 초과일 때만 표시) */}
          {selectedItems.length > 4 && (
            <>
              <button
                onClick={() => handleScroll("left")}
                className="absolute top-1/2 left-6 -translate-y-1/2"
              >
                <img
                  src="/images/PNG/조합 3-1/Frame 724.png"
                  alt="왼쪽 스크롤"
                  className="w-[80px] h-[80px] object-contain"
                />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="absolute top-1/2 right-6 -translate-y-1/2"
              >
                <img
                  src="/images/PNG/조합 3-1/Frame 667.png"
                  alt="오른쪽 스크롤"
                  className="w-[80px] h-[80px] object-contain"
                />
              </button>
            </>
          )}
        </div>
      </div>
      {/* 모바일 슬라이더 */}
      <div className="md:hidden w-[370px] h-[165px] bg-white border border-[#B2B2B2] rounded-[20px] mx-auto overflow-x-auto scrollbar-hide px-4 py-3 mt-3">
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
        <div className="flex justify-center gap-[450px] w-full z-10">
          {["전체", "초과"].map((tab) => (
            <div
              key={tab}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setActiveTab(tab as "전체" | "초과")}
            >
                             <span
                 className={`w-[100px] h-[58px] font-pretendard font-semibold text-[42px] leading-[120%] tracking-[-0.02em] text-center ${
                   activeTab === tab 
                     ? (tab === "초과" ? "text-[#E70000]" : "text-black") 
                     : "text-[#9C9A9A]"
                 }`}
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
            width: "1300px",
            height: "6px",
            opacity: 1,
          }}
        />
      </div>
      {/* 모바일 버전 탭 */}
      <div className="relative flex flex-col items-center md:hidden mt-10 mb-2">
        {/* 탭 버튼 */}
        <div className="flex justify-center gap-25 w-full z-10">
          {["전체", "초과"].map((tab) => (
            <div
              key={tab}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setActiveTab(tab as "전체" | "초과")}
            >
                             <span
                 className={`w-[50px] h-[24px] font-pretendard font-medium text-[20px] leading-[100%] tracking-[-0.02em] text-center ${
                   activeTab === tab 
                     ? (tab === "초과" ? "text-[#E70000]" : "text-black") 
                     : "text-[#9C9A9A]"
                 }`}
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
        <>
                       {/* PC 버전 */}
             <div className="hidden md:flex justify-center mt-2">
            <div 
              className="flex items-center justify-center"
              style={{
                width: "1100px",
                height: "102px",
                background: "#F2F2F2",
                borderRadius: "22px",
                opacity: 1
              }}
            >
              <p 
                className="font-pretendard font-normal text-center"
                style={{
                  width: "500px",
                  height: "38px",
                  fontSize: "32px",
                  lineHeight: "100%",
                  letterSpacing: "-2%",
                  opacity: 1
                }}
              >
                적정 섭취량을 준수하세요!
              </p>
            </div>
          </div>

                       {/* 모바일 버전 */}
             <div className="md:hidden flex justify-center mt-2">
            <div 
              className="flex items-center justify-center"
              style={{
                width: "350px",
                height: "68px",
                background: "#F4F4F4",
                borderRadius: "15px",
                opacity: 1
              }}
            >
              <p 
                className="font-inter font-medium text-center text-black"
                style={{
                  width: "300px",
                  height: "22px",
                  fontSize: "20px",
                  lineHeight: "22px",
                  letterSpacing: "0px",
                  opacity: 1
                }}
              >
                적정 섭취량을 준수하세요!
              </p>
            </div>
          </div>
        </>
      )}
             {/* 모바일 섭취량 그래프 */}
       {filteredIngredients && filteredIngredients.length > 0 ? (
         <div className="md:hidden space-y-4 px-2 ml-5 ">
          {/* 권장/상한 라벨 - 한 번만 표시 */}
          <div className="relative w-[370px] h-[20px] mt-3 mb-1 ml-8">
            {filteredIngredients[0] && (() => {
              const firstIngredient = filteredIngredients[0];
              const {
                recPct,
                upperPct,
              } = calcGauge(firstIngredient);
              
              return (
                <>
                  {recPct != null && (
                    <span
                      className={`absolute text-[16px] font-medium text-[#000000] font-pretendard`}
                      style={{ 
                        left: `calc(${recPct}% + 28px)`,
                        top: '0px',
                        zIndex: 10
                      }}
                    >
                      권장
                    </span>
                  )}
                  {upperPct != null && (
                    <span
                      className={`absolute text-[16px] font-medium text-[#000000] font-pretendard`}
                      style={{ 
                        left: `calc(${upperPct}% - 10px)`,
                        top: '0px',
                        zIndex: 10
                      }}
                    >
                      상한
                    </span>
                  )}
                </>
              );
            })()}
          </div>
          
          {filteredIngredients.slice(0, showAllIngredients ? filteredIngredients.length : 5).map((ingredient) => {
              const { ingredientName } = ingredient;
              const {
                widthPct,
                recPct,
                upperPct,
                unit,
                total,
                isFallbackGuide,
                yellowWidth,
                orangeLeft,
                orangeWidth,
                redLeft,
                redWidth,
                isOverUpperLimit,
              } = calcGauge(ingredient);

              return (
                <div
                  key={ingredientName}
                  className="flex justify-start items-center w-[370px]"
                >
                  {/* 이름 + 꺾쇠 */}
                  <div
                    className="flex items-center cursor-pointer w-[120px]"
                    onClick={() =>
                      navigate(
                        `/ingredient?name=${encodeURIComponent(ingredientName)}`
                      )
                    }
                  >
                     <span className="inline-block text-[18px] font-medium font-pretendard" style={{ lineHeight: "100%", letterSpacing: "-2%" }}>
                       {ingredientName}
                     </span>
                     <img
                       src={vitaminArrow}
                       alt="화살표"
                       className="ml-3 mt-1"
                       style={{ width: 20, height: 15 }}
                     />
                   </div>

                  {/* 게이지(라벨 포함) */}
                  <div className="flex-1">
                    {/* 바 + 가이드선 + 퍼센트/수치 */}
                    <div className="relative w-[240px] h-[40px] bg-[#EFEFEF] rounded-full">
                      {/* 노랑(권장 이하) */}
                      <div
                        className="absolute h-[40px] bg-[#FFE17E] rounded-full"
                        style={{ width: `${yellowWidth}%` }}
                      />
                      {/* 주황(권장~상한) */}
                      {orangeWidth > 0 && (
                        <div
                          className="absolute h-[40px] bg-[#FFCC66]"
                          style={{
                            left: `${orangeLeft}%`,
                            width: `${orangeWidth}%`,
                          }}
                        />
                      )}
                      {/* 빨강(상한 초과) */}
                      {redWidth > 0 && (
                        <div
                          className="absolute h-[24px] bg-[#FF7070] rounded-r-full"
                          style={{ left: `${redLeft}%`, width: `${redWidth}%` }}
                        />
                      )}

                      {/* 가이드/기준선 */}
                      <div
                        className="absolute top-0 h-full border-l-2 border-dashed"
                        style={{ left: `${recPct}%`, borderColor: "#000000" }}
                      />
                      <div
                        className="absolute top-0 h-full border-l-2 border-dashed"
                        style={{ left: `${upperPct}%`, borderColor: "#000000" }}
                      />
                    </div>
                  </div>
                </div>
              );
            }
          )}
          
          {/* 모바일 더보기 버튼 */}
          {filteredIngredients.length > 5 && !showAllIngredients && (
            <div className="flex flex-col items-center justify-center mt-7 w-[370px]">
              <img
                src="/images/PNG/조합 3-1/펼쳐보기 arrow.png"
                alt="더보기"
                className="w-[40px] h-[20px] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowAllIngredients(true)}
              />
              <p className="text-[14px] text-[#666] mt-3 font-pretendard">
                클릭하여 모든 성분 보기
              </p>
            </div>
          )}
          
          {/* 모바일 접기 버튼 */}
          {filteredIngredients.length > 5 && showAllIngredients && (
            <div className="flex flex-col items-center justify-center mt-10 w-[370px]">
              <img
                src="/images/PNG/Frame 499.png"
                alt="접기"
                className="w-[80px] h-[80px] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowAllIngredients(false)}
              />
              <p className="text-[14px] text-[#666] mt-2 font-pretendard">
                클릭하여 접기
              </p>
            </div>
          )}
         </div>
       ) : (
         <div className="md:hidden px-4 text-center text-gray-500 mt-6">
           {ingredientResults.length === 0 
             ? "영양제를 선택해주세요." 
             : activeTab === "초과" 
               ? "초과된 성분이 없습니다." 
               : "데이터를 불러오는 중입니다..."}
         </div>
       )}

             {/* PC 섭취량 그래프 */}
       {filteredIngredients && filteredIngredients.length > 0 ? (
         <div className="hidden md:flex flex-col items-center space-y-6 px-[60px] mt-5 w-full">

<div
      className="relative w-[800px] h-[24px] mb-6"
      style={{ marginLeft: 'calc(200px + 24px)' }} // 왼쪽 "이름 영역(200px) + 간격(24px)"
    >
      {(() => {
        const first = filteredIngredients[0];
        const { recPct, upperPct } = calcGauge(first);
        return (
          <>
            {recPct != null && (
              <span
                className="absolute text-[25px] font-medium text-black font-pretendard"
                style={{ left: `calc(${recPct}% + 15px)` }}
              >
                권장
              </span>
            )}
            {upperPct != null && (
              <span
                className="absolute text-[25px] font-medium text-black font-pretendard"
                style={{ left: `calc(${upperPct}% + 15px)` }}
              >
                상한
              </span>
            )}
          </>
        );
      })()}
    </div>
    
          {filteredIngredients.slice(0, showAllIngredients ? filteredIngredients.length : 5).map((ingredient) => {
            const { ingredientName } = ingredient;
            const {
              widthPct,
              recPct,
              upperPct,
              unit,
              total,
              isFallbackGuide,
              yellowWidth,
              orangeLeft,
              orangeWidth,
              redLeft,
              redWidth,
              isOverUpperLimit,
            } = calcGauge(ingredient);

            return (
              <div
                key={ingredientName}
                className="flex flex-col gap-2 w-full max-w-[1100px]"
              >
                <div className="flex items-center justify-between w-full">
                  {/* 이름 + 꺾쇠 */}
                  <div
                    className="flex items-center w-[200px] h-[48px] cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/ingredient?name=${encodeURIComponent(ingredientName)}`
                      )
                    }
                  >
                    <span className="text-[24px] font-medium">
                      {ingredientName}
                    </span>
                    <img
                      src={vitaminArrow}
                      alt="화살표"
                      className="ml-3 mt-1"
                      style={{ width: 25, height: 20 }}
                    />
                  </div>

                  {/* 게이지 바 + 라벨 */}
                  <div className="relative w-[800px]">
                    
                    {/* 게이지 바 */}
                    <div className="relative w-full h-[56px] bg-[#E9E9E9] rounded-full">
                      {/* 노랑 */}
                      <div
                        className="absolute h-full bg-[#FFE17E] rounded-full"
                        style={{ width: `${yellowWidth}%` }}
                      />
                      {/* 주황 */}
                      {orangeWidth > 0 && (
                        <div
                          className="absolute h-full bg-[#FFCC66]"
                          style={{
                            left: `${orangeLeft}%`,
                            width: `${orangeWidth}%`,
                          }}
                        />
                      )}
                      {/* 빨강 */}
                      {redWidth > 0 && (
                        <div
                          className="absolute h-full bg-[#FF7070] rounded-r-full"
                          style={{ left: `${redLeft}%`, width: `${redWidth}%` }}
                        />
                      )}

                      {/* 가이드/기준선 */}
                      <div
                        className="absolute top-0 h-full border-l-2 border-dashed"
                        style={{ left: `${recPct}%`, borderColor: "#000000" }}
                      />
                      <div
                        className="absolute top-0 h-full border-l-2 border-dashed"
                        style={{ left: `${upperPct}%`, borderColor: "#000000" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        
        {/* PC 더보기 버튼 */}
        {filteredIngredients.length > 5 && !showAllIngredients && (
          <div className="flex flex-col items-center justify-center mt-8 w-full">
            <img
              src="/images/PNG/조합 3-1/펼쳐보기 arrow.png"
              alt="더보기"
              className="w-[55px] h-[20px] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowAllIngredients(true)}
            />
            <p className="text-[18px] text-[#666] mt-5 font-pretendard">
              클릭하여 모든 성분 보기
            </p>
          </div>
        )}
        
        {/* PC 접기 버튼 */}
        {filteredIngredients.length > 5 && showAllIngredients && (
          <div className="flex flex-col items-center justify-center w-full mt-3">
            <img
              src="/images/PNG/조합 3-1/Frame 499.png"
              alt="접기"
              className="w-[1100px] h-[92px] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowAllIngredients(false)}
            />
          </div>
        )}
        </div>
       ) : (
         <div className="hidden md:flex flex-col items-center px-[60px] mt-20 text-center text-gray-500">
           {ingredientResults.length === 0 
             ? "영양제를 선택해주세요." 
             : activeTab === "초과" 
               ? "초과된 성분이 없습니다." 
               : "데이터를 불러오는 중입니다..."}
         </div>
       )}

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
