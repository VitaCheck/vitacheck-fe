import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import backgroundLine from "../../assets/background line.png";
import checkedBoxIcon from "../../assets/check box.png";
import vitaminArrow from "../../assets/비타민 C_arrow.png";
import selectionLine from "../../assets/selection line 1.png";
import checkboxIcon from "../../assets/check box.png";
import boxIcon from "../../assets/box.png";
import flipIcon from "../../assets/flip.png";
import {
  useCombinationAnalyze,
  useCombinationRecommendations,
} from "../../features/combination/hooks/useCombination";

type ProductItem = {
  id: number;
  name: string;
  imageUrl: string;
};

export default function CombinationResultPage() {
  const location = useLocation();
  const selectedItems: ProductItem[] = location.state?.selectedItems || [];

  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const ingredientData = [
    { name: "비타민 C", value: 70, recommended: 60, upper: 100 },
    { name: "유산광", value: 80, recommended: 70, upper: 120 },
    { name: "역산", value: 50, recommended: 60, upper: 100 },
    { name: "그루타치온", value: 90, recommended: 80, upper: 110 },
    { name: "비타민 A", value: 95, recommended: 90, upper: 100 },
  ];

  const [activeTab, setActiveTab] = useState<"전체" | "초과">("전체");
  const [allOverUpper, setAllOverUpper] = useState(false);

  useEffect(() => {
    const isAllOverUpper = ingredientData.every((i) => i.value >= i.upper);
    setAllOverUpper(isAllOverUpper);
    if (isAllOverUpper) setActiveTab("초과");
  }, []);

  const filteredIngredients =
    activeTab === "전체"
      ? ingredientData
      : ingredientData.filter((i) => i.value > i.upper);

  const riskyCombinations = [
    { front: "철분 + 칼슘", back: "흡수를 방해할 수 있어요!" },
    { front: "아연 + 철분", back: "같이 먹으면 경쟁 작용이 생겨요!" },
    { front: "아연 + 구리", back: "상호 흡수 저해 우려가 있어요!" },
    {
      front: "비타민C + 철분",
      back: "흡수는 증가하지만 속이 불편할 수 있어요.",
    },
    { front: "칼슘 + 마그네슘", back: "흡수율이 낮아질 수 있어요." },
  ];

  const goodCombinations = [
    {
      front: "비타민D + 칼슘",
      back: "비타민D가 칼슘의 흡수를 도와줘요!",
    },
    {
      front: "철분 + 비타민C",
      back: "비타민C가 철분의 흡수를 촉진해요!",
    },
    {
      front: "마그네슘 + 비타민B6",
      back: "신경 안정과 에너지 생성에 시너지를 줘요!",
    },
    {
      front: "유산균 + 아연",
      back: "면역력 향상에 함께 작용해요!",
    },
    {
      front: "오메가3 + 비타민E",
      back: "세포 보호 효과가 상승해요!",
    },
  ];

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

  const { mutate: analyzeCombination, data: analysisResult } =
    useCombinationAnalyze();
  const { data: recommendationResult } = useCombinationRecommendations();

  const handleAnalyze = () => {
    const supplementIds = selectedItems.map((item) => item.id);
    analyzeCombination(supplementIds);
  };

  interface FlipCardProps {
    frontText: string;
    backText: string;
  }

  const FlipCard: React.FC<FlipCardProps> = ({ frontText, backText }) => {
    const [flipped, setFlipped] = useState(false);

    return (
      <div
        className="w-[130px] h-[114px] perspective cursor-pointer"
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* 앞면 */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[20px] font-medium flex items-center justify-center text-center text-[#414141]">
            {frontText}
            <img
              src={flipIcon}
              alt="회전 아이콘"
              className="absolute top-[10px] right-[10px] w-[25px] h-[25px] opacity-100"
            />
          </div>

          {/* 뒷면 */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#FFFBCC] rounded-[14px] px-[6px] py-[10px] text-[20px] font-medium flex items-center justify-center text-center text-[#414141]">
            {backText}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] md:bg-[#FAFAFA] px-0 md:px-4 py-0 font-pretendard flex flex-col">
      {" "}
      {/* 조합분석 - 모바일 버전 */}
      <h1 className="block md:hidden font-Pretendard font-bold text-[32px] leading-[100%] tracking-[-0.02em] mb-2 px-10 pt-10">
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
            className={`w-[280px] h-[70px] ${
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
            {selectedItems.map((item: ProductItem, idx: number) => (
              <div
                key={idx}
                className={`w-[270px] h-[250px] rounded-[22.76px] flex flex-col items-center pt-[80px] relative flex-shrink-0
                ${checkedIndices.includes(idx) ? "bg-[#EEEEEE]" : "bg-white"}`}
              >
                <img
                  src={checkedIndices.includes(idx) ? checkedBoxIcon : boxIcon}
                  alt="checkbox"
                  onClick={() => handleToggleCheckbox(idx)}
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
                  {item.name}
                </p>
              </div>
            ))}
          </div>

          {selectedItems.length > 4 && (
            <>
              <button
                onClick={() => handleScroll("left")}
                className="absolute top-1/2 left-6 -translate-y-1/2 w-[74px] h-[74px] bg-white rounded-full shadow-md flex items-center justify-center"
              >
                <MdArrowBackIos className="text-[#1C1B1F] w-[18px] h-[32px]" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="absolute top-1/2 right-6 -translate-y-1/2 w-[74px] h-[74px] bg-white rounded-full shadow-md flex items-center justify-center"
              >
                <MdArrowForwardIos className="text-[#1C1B1F] w-[18px] h-[32px]" />
              </button>
            </>
          )}
        </div>
      </div>
      {/* 모바일 슬라이더 */}
      <div className="md:hidden w-[370px] h-[156px] bg-white border border-[#B2B2B2] rounded-[20px] mx-auto overflow-x-auto scrollbar-hide px-4 py-3 mt-3">
        <div className="flex gap-3 w-max">
          {selectedItems.map((item: ProductItem, idx: number) => (
            <div
              key={idx}
              className={`w-[130px] h-[130px] rounded-[10px] flex flex-col items-center relative flex-shrink-0 pt-[26px] pb-[12px]
        ${checkedIndices.includes(idx) ? "bg-[#EFEFEF]" : "bg-white"}
        ${checkedIndices.includes(idx) ? "shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)]" : ""}
        `}
            >
              {/* 이미지 체크박스 */}
              <img
                src={checkedIndices.includes(idx) ? checkboxIcon : boxIcon}
                alt="checkbox"
                onClick={() => handleToggleCheckbox(idx)}
                className="absolute top-[2px] left-[2px] w-[30px] h-[30px] cursor-pointer"
              />

              {/* 제품 이미지 */}
              <img
                src={item.imageUrl}
                className="w-[70px] h-[70px] object-contain -mt-2 mb-2"
              />

              {/* 제품 이름 */}
              <p className="font-pretendard font-medium text-[15px] leading-[100%] tracking-[-0.02em] text-center text-black">
                {item.name}
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
      <div className="hidden md:block relative mt-[50px] mb-[40px]">
        {/* 탭 버튼 영역 */}
        <div className="flex justify-center gap-[475px] z-10 relative">
          {["전체", "초과"].map((tab) => (
            <div
              key={tab}
              className="flex flex-col items-center"
              onClick={() =>
                allOverUpper || tab === "전체"
                  ? setActiveTab(tab as "전체" | "초과")
                  : null
              }
            >
              <span
                style={{
                  width: "100px",
                  height: "58px",
                  fontFamily: "Pretendard",
                  fontWeight: 500,
                  fontSize: "45px",
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

        {/* 탭 아래 selection line 이미지 */}
        <img
          src={selectionLine}
          alt="선택 라인"
          className="absolute top-[72px] left-1/2 -translate-x-1/2"
          style={{
            width: "1350px",
            height: "6px",
            opacity: 1,
            marginTop: "8px",
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
              onClick={() =>
                allOverUpper || tab === "전체"
                  ? setActiveTab(tab as "전체" | "초과")
                  : null
              }
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

        {/* selection line 이미지 */}
        <img
          src={selectionLine}
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
      <div className="md:hidden space-y-4 px-4">
        {filteredIngredients.map(({ name, value, upper }) => {
          const barWidth = `${(value / 120) * 100}%`;
          return (
            <div
              key={name}
              className="flex justify-center items-center gap-10 mt-6"
            >
              {/* 약 이름 + 이미지 꺾쇠 */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() =>
                  navigate(`/ingredient?name=${encodeURIComponent(name)}`)
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
                  {name}
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
      {/* PC 섭취량 그래프 */}
      <div className="hidden md:flex flex-col items-center space-y-6 px-[60px] mt-20">
        {filteredIngredients.map(({ name, value, upper }) => {
          const barWidth = `${(value / 120) * 100}%`;
          return (
            <div key={name} className="flex items-center gap-6">
              <div
                className="flex items-center w-[200px] h-[48px] cursor-pointer"
                onClick={() =>
                  navigate(`/ingredient?name=${encodeURIComponent(name)}`)
                }
              >
                <span className="text-[30px] font-medium">{name}</span>
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
          );
        })}
      </div>
      {/* 주의가 필요한 조합 안내 - 모바일 */}
      <div className="md:hidden px-7 mt-10">
        <h2
          style={{
            width: "390px",
            height: "26px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "22px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#000000",
          }}
        >
          주의가 필요한 조합 TOP 5
        </h2>
        <p
          style={{
            width: "200px",
            height: "17px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#6B6B6B",
            marginTop: "4px",
          }}
        >
          카드를 눌러서 확인해 보세요 !
        </p>
      </div>
      {/* 조합 카드들 - 모바일 */}
      <div className="md:hidden px-3 hide-scrollbar overflow-x-auto">
        <div className="w-max flex gap-[16px] ml-4 mr-4 mb-5 mt-5">
          {riskyCombinations.map((combo, i) => (
            <FlipCard key={i} frontText={combo.front} backText={combo.back} />
          ))}
        </div>
      </div>
      {/* PC용 제목 및 카드 wrapper - 주의가 필요한 조합 */}
      <div className="hidden md:block px-[230px]">
        <h2 className="w-[1500px] h-[38px] text-[32px] font-bold font-Pretendard leading-[120%] tracking-[-0.02em] text-black mb-1 mt-25">
          주의가 필요한 조합 TOP 5
        </h2>
        <span className="text-[22px] font-semibold font-Pretendard leading-[120%] tracking-[-0.02em] text-[#6B6B6B]">
          카드를 눌러서 확인해 보세요 !
        </span>

        {/* 카드 목록 */}
        <div className="flex justify-start mt-8">
          <div className="flex gap-[50px]">
            {riskyCombinations.map((combo, i) => (
              <FlipCard key={i} frontText={combo.front} backText={combo.back} />
            ))}
          </div>
        </div>
      </div>
      {/* ===== 모바일 - 궁합이 좋은 조합 안내 ===== */}
      <div className="md:hidden px-7 mt-10">
        <h2
          style={{
            width: "390px",
            height: "26px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "22px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#000000",
          }}
        >
          궁합이 좋은 조합 TOP 5
        </h2>
        <p
          style={{
            width: "300px",
            height: "17px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#6B6B6B",
            marginTop: "4px",
          }}
        >
          카드를 눌러서 확인해 보세요 !
        </p>
      </div>
      {/* 조합 카드들 - 모바일 */}
      <div className="md:hidden px-3 hide-scrollbar overflow-x-auto">
        <div className="w-max flex gap-[16px] ml-4 mr-4 mb-5 mt-5">
          {goodCombinations.map((combo, i) => (
            <FlipCard key={i} frontText={combo.front} backText={combo.back} />
          ))}
        </div>
      </div>
      {/* PC용 제목 및 카드 wrapper - 궁합이 좋은 조합 */}
      <div className="hidden md:block px-[230px]">
        <h2 className="w-[1500px] h-[38px] text-[32px] font-bold font-Pretendard leading-[120%] tracking-[-0.02em] text-black mb-1 mt-20">
          궁합이 좋은 조합 TOP 5
        </h2>
        <span className="text-[22px] font-semibold font-Pretendard leading-[120%] tracking-[-0.02em] text-[#6B6B6B]">
          카드를 눌러서 확인해 보세요 !
        </span>

        {/* 카드 목록 */}
        <div className="flex justify-start">
          <div className="flex gap-[50px] mt-8 mb-20">
            {goodCombinations.map((combo, i) => (
              <FlipCard key={i} frontText={combo.front} backText={combo.back} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
