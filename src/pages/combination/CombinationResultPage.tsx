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
import Navbar from "@/components/NavBar";
import line from "/images/PNG/조합 2-1/background line.png";

// 모바일 여부 판단용 훅
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return isMobile;
};

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
  const isMobile = useIsMobile();
  
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
  // 모든 게이지에서 공통 점선 위치(디자인 기준)
  const REC_LINE_POS = 45; // 권장선 45%
  const UPPER_LINE_POS = 80; // 상한선 80%

  // per-item으로 채워질 길이(%) 계산: 권장/상한에 맞춰 자연스러운 길이
  function computeFillPercent(ing: IngredientResult) {
    const total = ing.totalAmount ?? 0;
    const rec = ing.recommendedAmount ?? null;
    const upper = ing.upperAmount ?? null;

    if (upper && upper > 0) {
      if (rec && rec > 0) {
        if (total <= rec) {
          const r = total / rec;
          return Math.max(0, Math.min(100, r * REC_LINE_POS));
        }
        if (total <= upper) {
          const r = (total - rec) / Math.max(upper - rec, 1e-6);
          return Math.max(
            0,
            Math.min(100, REC_LINE_POS + r * (UPPER_LINE_POS - REC_LINE_POS))
          );
        }
        return 100; // 상한 초과는 100%로 캡
      }
      // 권장 없음: 0~upper → 0~UPPER_LINE_POS
      const r = total / upper;
      return Math.max(0, Math.min(100, r <= 1 ? r * UPPER_LINE_POS : 100));
    }

    if (rec && rec > 0) {
      const r = total / rec;
      return Math.max(0, Math.min(100, r <= 1 ? r * REC_LINE_POS : 100));
    }

    // 권장/상한 둘 다 없으면 살짝만 표시
    return Math.min(REC_LINE_POS, total > 0 ? REC_LINE_POS * 0.7 : 0);
  }

  function isOverUpper(ing: IngredientResult) {
    const total = ing.totalAmount ?? 0;
    const upper = ing.upperAmount ?? null;
    return !!(upper && upper > 0 && total > upper);
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
            recommendedAmount: i.recommendedAmount,
          });

          // 초과 탭에서는 다음 조건을 만족하는 성분을 표시:
          // 1. 권장량 초과 (dosageRatio > 1)
          // 2. 상한량 초과 (overRecommended)
          // 3. 상한값이 있고 총량이 상한값을 초과하는 경우
          // 4. API에서 권장량/상한량이 null이지만 실제로는 과다 섭취일 수 있는 경우
          const isOverRecommended = i.dosageRatio > 1;
          const isOverUpper = i.overRecommended;
          const isOverUpperLimit =
            i.upperAmount && i.totalAmount > i.upperAmount;

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
              if (
                i.ingredientName.includes("비타민 D") &&
                i.totalAmount > 4000
              ) {
                isOverGeneralLimit = true;
              }
              // 비타민 A: 일반적으로 10000 IU 이상을 과다로 간주
              else if (
                i.ingredientName.includes("비타민 A") &&
                i.totalAmount > 10000
              ) {
                isOverGeneralLimit = true;
              }
            } else if (i.unit === "mg") {
              // 비타민 C: 일반적으로 2000 mg 이상을 과다로 간주
              if (
                i.ingredientName.includes("비타민 C") &&
                i.totalAmount > 2000
              ) {
                isOverGeneralLimit = true;
              }
              // 기타 미네랄: 일반적으로 권장량의 3배 이상을 과다로 간주
              else if (i.totalAmount > 1000) {
                // 1000mg 이상은 일반적으로 과다
                isOverGeneralLimit = true;
              }
            }
          }

          const shouldShow =
            isOverRecommended ||
            isOverUpper ||
            isOverUpperLimit ||
            isOverUpperInGauge ||
            isOverUpperLine ||
            isOverGeneralLimit;
          console.log(`성분 ${i.ingredientName} 표시 여부:`, shouldShow, {
            isOverRecommended,
            isOverUpper,
            isOverUpperLimit,
            isOverUpperInGauge,
            isOverUpperLine,
            isOverGeneralLimit,
            widthPct: gauge.widthPct,
            upperPct: gauge.upperPct,
          });

          return shouldShow;
        });

  console.log("ingredientResults", ingredientResults); // API 응답
  console.log("filteredIngredients", filteredIngredients); // 필터링된 결과
  console.log("activeTab", activeTab); // 현재 선택된 탭
  console.log("필터링 결과 상세:", {
    전체: ingredientResults.length,
    초과: filteredIngredients.length,
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
      console.log(
        "API 응답 ingredientResults:",
        res.data.result?.ingredientResults
      );

      if (res.data.result?.ingredientResults) {
        console.log(
          "성분 결과 상세:",
          res.data.result.ingredientResults.map((i: any) => ({
            name: i.ingredientName,
            total: i.totalAmount,
            recommended: i.recommendedAmount,
            upper: i.upperAmount,
            ratio: i.dosageRatio,
            overRecommended: i.overRecommended,
          }))
        );
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

  // 모바일에서는 전역 헤더 숨김(있으면)
  useEffect(() => {
    if (!isMobile) return;
    const headerEl = document.querySelector("header");
    if (headerEl instanceof HTMLElement) {
      headerEl.style.display = "none";
    }
    return () => {
      if (headerEl instanceof HTMLElement) {
        headerEl.style.display = "";
      }
    };
  }, [isMobile]);

  // 카드 가로 사이즈를 전체 비율의 0.154로 설정
  const PAGE_COUNT = 4;
const GAP_W = 16; // tailwind gap과 맞추기
const cardWidthCSS = `calc((100% - ${GAP_W * (PAGE_COUNT - 1)}px) / ${PAGE_COUNT})`;

const handleScroll = (direction: "left" | "right") => {
  const el = scrollRef.current;
  if (!el) return;
  const page = el.clientWidth; // 현재 보이는 영역 너비
  const delta = direction === "right" ? page : -page;
  let target = el.scrollLeft + delta;
  // 경계 보정
  target = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));
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
    <div className="px-4 sm:px-36 pt-2 sm:pt-10 max-w-screen-xl mx-auto">
      {/* ✅ 모바일에서만 이 페이지의 Navbar 표시 (PC에서는 전역 Navbar만) */}
      <div className="md:hidden">
        <Navbar />
      </div>
      
      {/* 조합분석 - 모바일 */}
      <h1 className="block md:hidden font-pretendard font-bold text-[24px] leading-[100%] tracking-[-0.02em] mb-5 pl-2 pt-6">
        조합 분석
      </h1>
      
      {/* PC 제목 + 버튼들 한 줄 배치 */}
<div className="hidden md:flex items-center justify-between mb-8 px-8">
  <h1 className="text-2xl sm:text-4xl font-semibold">
    조합 분석
  </h1>
  <div className="flex gap-4">
    <button
      onClick={handleRecombination}
      className="w-[150px] h-[55px] bg-[#EEEEEE] rounded-full text-lg font-semibold flex items-center justify-center"
    >
      재조합
    </button>
    <button
      onClick={() => navigate("/alarm/settings")}
      className={`w-[280px] h-[55px] font-bold ${
        checkedIndices.length > 0 ? "bg-[#FFEB9D]" : "bg-[#EEEEEE]"
      } rounded-[62.5px] flex items-center justify-center`}
    >
      섭취알림 등록하기
    </button>
  </div>
</div>

             {/* PC 슬라이더 */}
<div className="hidden md:block px-4">
  {/* 래퍼: 화살표가 테두리 밖으로 반쯤 나오도록 overflow-visible */}
  <div className="relative w-full max-w-[1050px] mx-auto overflow-visible">
    {/* 컨테이너: 내용은 안에서만 보이도록 overflow-hidden */}
    <div
      className="relative h-[300px] bg-white border border-[#B2B2B2] rounded-[45.5px]
                 px-[60px] py-[30px] overflow-hidden"
    >
      {/* 👇 w-full로 두고, 카드 폭은 calc로 4등분 */}
      <div className="w-full">
        <div
          ref={scrollRef}
          className="flex gap-[16px] overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
        >
          {selectedItems.map((item: SupplementItem) => (
            <div
              key={item.supplementId}
              className={`h-[250px] rounded-[22.76px] flex flex-col items-center pt-[80px]
                          relative flex-shrink-0 snap-start
                          ${checkedIndices.includes(item.supplementId) ? "bg-[#EEEEEE]" : "bg-white"}`}
              style={{ width: cardWidthCSS, minWidth: cardWidthCSS }} // ⭐ 핵심: 4등분 고정
            >
              <img
                src={checkedIndices.includes(item.supplementId) ? checkedBoxIcon : boxIcon}
                alt="checkbox"
                onClick={() => handleToggleCheckbox(item.supplementId)}
                className="absolute top-[10px] left-[18px] w-[50px] h-[50px] cursor-pointer"
              />
              <img
                src={item.imageUrl}
                className="w-[120px] h-[100px] object-contain mb-3 mt-[-20px]"
              />
              <p
                className="text-center font-pretendard font-medium mt-1"
                style={{
                  fontSize: "18px",
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
    </div>

    {/* 좌우 화살표: 아이콘만 표시(반쯤 밖으로) */}
    {selectedItems.length > 4 && (
      <>
        <button
          onClick={() => handleScroll("left")}
          aria-label="왼쪽으로 스크롤"
          className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2"
        >
          <img
            src="/images/PNG/조합 3-1/Frame 724.png"
            alt="왼쪽"
            className="w-[65px] h-[65px] object-contain"
          />
        </button>
        <button
          onClick={() => handleScroll("right")}
          aria-label="오른쪽으로 스크롤"
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2"
        >
          <img
            src="/images/PNG/조합 3-1/Frame 667.png"
            alt="오른쪽"
            className="w-[65px] h-[65px] object-contain"
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
          onClick={() => navigate("/alarm/settings")}
          className="w-[370px] h-[54px] bg-[#FFEB9D] rounded-[14px] flex justify-center items-center mt-2"
        >
          <span className="text-[20px] font-medium">섭취알림 등록하기 →</span>
        </button>
      </div>
      {/* PC 섭취량 탭 - 전체 / 초과 */}
<div className="hidden md:block mt-[55px]">
  <div className="relative w-full max-w-[850px] mx-auto">
    {/* 배경 라인 */}
    <div
  className="w-full"
  style={{ borderTop: "8px solid var(--F4-Gray, #F4F4F4)" }}
/>

    {/* 탭 */}
    <div className="grid grid-cols-2 w-full max-w-[1100px] mx-auto text-center relative z-10">
      {["전체", "초과"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as "전체" | "초과")}
          className="py-2 font-pretendard font-semibold text-[30px] leading-[120%] tracking-[-0.02em] relative mb-5"
        >
          <span className={activeTab === tab ? "text-black" : "text-[#9C9A9A]"}>{tab}</span>

          {/* 활성 언더바 */}
          {activeTab === tab && (
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-20px] w-[140px] h-[8px] bg-black rounded-full" />
          )}
        </button>
      ))}
    </div>
  </div>
</div>

      {/* 모바일 버전 탭 */}
<div className="md:hidden mt-10 mb-2">
  <div className="relative w-[350px] mx-auto">
    {/* 배경 라인 */}
    <img
      src={line}
      alt=""
      className="pointer-events-none select-none absolute bottom-0 left-0 w-full h-[6px]"
    />

    {/* 탭 */}
    <div className="grid grid-cols-2 text-center relative z-10">
      {["전체", "초과"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as "전체" | "초과")}
          className="py-2 relative"
        >
          <span className={`text-[20px] font-pretendard font-medium ${activeTab === tab ? "text-black" : "text-[#9C9A9A]"}`}>
            {tab}
          </span>

          {/* 활성 언더바 */}
          {activeTab === tab && (
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-[100px] h-[6px] bg-black rounded-full" />
          )}
        </button>
      ))}
    </div>
  </div>
</div>

      {activeTab === "초과" && (
        <>
          {/* PC 버전 */}
          <div className="hidden md:flex justify-center mt-5">
            <div
              className="flex items-center justify-center"
              style={{
                width: "1100px",
                height: "102px",
                background: "#F2F2F2",
                borderRadius: "22px",
                opacity: 1,
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
                  opacity: 1,
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
                opacity: 1,
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
                  opacity: 1,
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
          {/* 권장/상한 라벨 - 공통 위치 */}
          <div className="relative w-[370px] h-[24px] mt-3 mb-1 ml-8">
            <span
              className="absolute -top-1 text-[14px] font-medium text-black whitespace-nowrap translate-x-[-50%] z-20"
              style={{ left: `${REC_LINE_POS}%` }}
            >
              권장
            </span>
            <span
              className="absolute -top-1 text-[14px] font-medium text-black whitespace-nowrap translate-x-[-50%] z-20"
              style={{ left: `${UPPER_LINE_POS}%` }}
            >
              상한
            </span>
          </div>

          {filteredIngredients
            .slice(0, showAllIngredients ? filteredIngredients.length : 5)
            .map((ingredient) => {
              const { ingredientName } = ingredient;

              // ✅ 항목별 채움 비율/초과여부 계산
              const fillPct = computeFillPercent(ingredient);
              const over = isOverUpper(ingredient);

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
                    <span
                      className="inline-block text-[18px] font-medium font-pretendard"
                      style={{ lineHeight: "100%", letterSpacing: "-2%" }}
                    >
                      {ingredientName}
                    </span>
                    <img
                      src={vitaminArrow}
                      alt="화살표"
                      className="ml-3 mt-1"
                      style={{ width: 20, height: 15 }}
                    />
                  </div>

                  {/* 게이지 (공통 점선 + 단색 채움) */}
                  <div className="flex-1">
                    <div className="relative w-[240px] h-[40px] bg-[#EFEFEF] rounded-full overflow-hidden">
                      {/* 채워진 막대: 상한 이하 노랑 / 초과 시 전체 빨강 */}
                      <div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{
                          width: `${fillPct}%`,
                          background: over ? "#FF7E7E" : "#FFE17E",
                        }}
                      />

                      {/* 권장/상한 점선: 전 항목 공통 위치 */}
                      <div
                        className="absolute top-0 h-full border-l-2 border-dashed z-10"
                        style={{
                          left: `${REC_LINE_POS}%`,
                          borderColor: "#000000",
                        }}
                      />
                      <div
                        className="absolute top-0 h-full border-l-2 border-dashed z-10"
                        style={{
                          left: `${UPPER_LINE_POS}%`,
                          borderColor: "#000000",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

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
        <div className="hidden md:block w-full">
          {/* 상단 라벨: 이름 칼럼 폭과 정렬을 맞추기 위해 동일한 그리드 사용 */}
          <div className="grid grid-cols-[200px_1fr] items-center gap-6 w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-5">
            <div />
            <div className="relative h-6">
              <span
                className="absolute -top-1 text-[16px] lg:text-[18px] font-medium text-black whitespace-nowrap translate-x-[-50%] z-20"
                style={{ left: `${REC_LINE_POS}%` }}
              >
                권장
              </span>
              <span
                className="absolute -top-1 text-[16px] lg:text-[18px] font-medium text-black whitespace-nowrap translate-x-[-50%] z-20"
                style={{ left: `${UPPER_LINE_POS}%` }}
              >
                상한
              </span>
            </div>
          </div>

          {/* 게이지 리스트 */}
          <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-2 space-y-5">
            {filteredIngredients
              .slice(0, showAllIngredients ? filteredIngredients.length : 5)
              .map((ingredient) => {
                const { ingredientName } = ingredient;

                // ✅ 항목별 채움 비율/초과여부
                const fillPct = computeFillPercent(ingredient);
                const over = isOverUpper(ingredient);

                return (
                  <div
                    key={ingredientName}
                    className="grid grid-cols-[200px_1fr] items-center gap-6 w-full"
                  >
                    {/* 이름 + 꺾쇠 */}
                    <div
                      className="flex items-center h-[48px] cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/ingredient?name=${encodeURIComponent(ingredientName)}`
                        )
                      }
                    >
                      <span className="text-[20px] lg:text-[24px] font-medium">
                        {ingredientName}
                      </span>
                      <img
                        src={vitaminArrow}
                        alt="화살표"
                        className="ml-3 mt-1"
                        style={{ width: 25, height: 20 }}
                      />
                    </div>

                    {/* 게이지(공통 점선 + 단색 채움) */}
                    <div className="relative w-full">
                      <div className="relative w-full h-[48px] lg:h-[56px] bg-[#EFEFEF] rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full"
                          style={{
                            width: `${fillPct}%`,
                            background: over ? "#FF7E7E" : "#FFE17E",
                          }}
                        />
                        <div
                          className="absolute top-0 h-full border-l-2 border-dashed z-10"
                          style={{
                            left: `${REC_LINE_POS}%`,
                            borderColor: "#000000",
                          }}
                        />
                        <div
                          className="absolute top-0 h-full border-l-2 border-dashed z-10"
                          style={{
                            left: `${UPPER_LINE_POS}%`,
                            borderColor: "#000000",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* PC 더보기 버튼 */}
            {filteredIngredients.length > 5 && !showAllIngredients && (
              <div className="flex flex-col items-center justify-center mt-6 w-full">
                <img
                  src="/images/PNG/조합 3-1/펼쳐보기 arrow.png"
                  alt="더보기"
                  className="w-[55px] h-[20px] cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowAllIngredients(true)}
                />
                <p className="text-[16px] lg:text-[18px] text-[#666] mt-3 font-pretendard">
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
                  className="w-full max-w-[1100px] h-[92px] cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowAllIngredients(false)}
                />
              </div>
            )}
          </div>
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
                <FlipCard
                  key={combo.id}
                  name={combo.name}
                  description={combo.description}
                />
              ))}
            </div>
          </div>

          {/* 💻 PC - 주의 조합 */}
          <div className="hidden md:block px-4 lg:px-[80px] xl:px-[120px] 2xl:px-[550px] mt-10">
            <h2 className="w-full h-auto text-[24px] lg:text-[28px] xl:text-[32px] font-bold font-Pretendard leading-[120%] tracking-[-0.02em] text-black mb-1 mt-3 text-left">
              주의가 필요한 조합 TOP 5
            </h2>
            <span className="text-[18px] lg:text-[20px] xl:text-[22px] font-semibold font-Pretendard leading-[120%] tracking-[-0.02em] text-[#6B6B6B] text-left">
              카드를 눌러서 확인해 보세요 !
            </span>
            <div className="flex justify-center mt-8 mb-15">
              <div className="flex gap-[15px] lg:gap-[25px] xl:gap-[55px] w-[1200px]">
                {cautionCombinations.map((combo: Combination) => (
                  <FlipCard
                    key={combo.id}
                    name={combo.name}
                    description={combo.description}
                  />
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
                <FlipCard
                  key={combo.id}
                  name={combo.name}
                  description={combo.description}
                />
              ))}
            </div>
          </div>

          {/* 💻 PC - 좋은 조합 */}
          <div className="hidden md:block px-4 lg:px-[80px] xl:px-[120px] 2xl:px-[250px]">
            <h2 className="w-full h-auto text-[24px] lg:text-[28px] xl:text-[32px] font-bold font-Pretendard leading-[120%] tracking-[-0.02em] text-black mb-1 mt-3 text-left">
              궁합이 좋은 조합 TOP 5
            </h2>
            <span className="text-[18px] lg:text-[20px] xl:text-[22px] font-semibold font-Pretendard leading-[120%] tracking-[-0.02em] text-[#6B6B6B] text-left">
              카드를 눌러서 확인해 보세요 !
            </span>
            <div className="flex justify-center mt-8 mb-20">
              <div className="flex gap-[15px] lg:gap-[25px] xl:gap-[55px] w-[1200px]">
                {goodCombinations.map((combo: Combination) => (
                  <FlipCard
                    key={combo.id}
                    name={combo.name}
                    description={combo.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
