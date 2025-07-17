import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";

export default function CombinationResultPage() {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const ingredientData = [
    { name: "비탄민 C", value: 70, recommended: 60, upper: 100 },
    { name: "유산광", value: 80, recommended: 70, upper: 120 },
    { name: "역산", value: 50, recommended: 60, upper: 100 },
    { name: "그루타치온", value: 90, recommended: 80, upper: 110 },
    { name: "비탄민 A", value: 95, recommended: 90, upper: 100 },
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
    "철분 + 칼슘",
    "아연 + 철분",
    "아연 + 구리",
    "비타민C + 철분",
    "칼슘 + 마그네슘",
  ];
  const goodCombinations = [
    "비타민D + 칼슘",
    "철분 + 비타민C",
    "마그네슘 + 비타민B6",
    "유산균 + 아연",
    "오메가3 + 비타민E",
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "right" ? 400 : -400,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-pretendard">
      <div className="w-full max-w-[1280px] mx-auto px-4 pb-40">
        {/* 모바일 제목 및 버튼 */}
        <div className="md:hidden flex justify-between items-center mb-10">
          <h1 className="block md:hidden font-pretendard font-bold text-[30px] leading-[120%] tracking-[-0.02em] px-[38px]">
            조합분석
          </h1>
          <div className="flex gap-2 items-center">
            <button className="w-[32px] h-[32px] flex items-center justify-center rounded-full border border-[#AAAAAA] bg-white p-[14px]"></button>
            <button
              onClick={() => navigate("/조합-2-2")}
              className="w-[80px] h-[36px] flex items-center justify-center bg-[#EEEEEE] rounded-full text-sm font-semibold"
            >
              재조합
            </button>
          </div>
        </div>

        {/* 데스크탑 제목 및 버튼 */}
        <div className="hidden md:flex justify-between items-center mt-16 mb-10 px-[60px]">
          <h1 className="font-bold leading-[120%] tracking-[-0.02em] text-[52px]">
            조합 분석
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/조합-2-2")}
              className="w-[150px] h-[0px] flex items-center justify-center bg-[#EEEEEE] rounded-full text-lg font-semibold"
            >
              재조합
            </button>
            <button
              onClick={() => navigate("/알림-2")}
              className="w-[280px] h-[70px] px-[28px] py-[20px] bg-[#FFEB9D] rounded-[62.5px] text-lg font-semibold text-center whitespace-nowrap"
            >
              섭취알림 등록하기
            </button>
          </div>
        </div>

        {/* 슬라이더 */}
        <div className="hidden md:block relative w-[1280px] h-[356px] bg-white rounded-[45.51px] border border-[#B2B2B2] mx-auto px-[60px] py-[30px] overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-[22.76px] overflow-x-auto scrollbar-hide scroll-smooth pr-[80px]"
          >
            {selectedItems.map((item: any, idx: number) => (
              <div
                key={idx}
                className="relative w-[270px] h-[250px] bg-white rounded-[22.76px] flex flex-col items-center pt-[80px] flex-shrink-0"
              >
                <input
                  type="checkbox"
                  className="absolute top-[18px] left-[18px] w-[42px] h-[42px] border-2 border-[#9C9A9A] rounded-[7px] accent-black"
                />
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-[100px] h-[100px] object-contain mb-2"
                />
                <p className="text-sm font-medium text-center">{item.name}</p>
              </div>
            ))}
          </div>

          {selectedItems.length > 4 && (
            <>
              <button
                onClick={() => handleScroll("left")}
                className="absolute top-1/2 left-6 -translate-y-1/2 w-[74px] h-[74px] bg-white rounded-full shadow-md flex items-center justify-center z-10"
              >
                <MdArrowBackIos className="text-[#1C1B1F] w-[18.14px] h-[32.66px]" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="absolute top-1/2 right-6 -translate-y-1/2 w-[74px] h-[74px] bg-white rounded-full shadow-md flex items-center justify-center z-10"
              >
                <MdArrowForwardIos className="text-[#1C1B1F] w-[18.14px] h-[32.66px]" />
              </button>
            </>
          )}
        </div>

        {/* 모바일 섭취알림 버튼 */}
        <div className="w-full mb-6 flex justify-center md:hidden">
          <button
            onClick={() => navigate("/알림-편집-1")}
            className="w-[370px] h-[54px] px-[22px] py-[11px] bg-[#FFEB9D] rounded-[14px] text-sm font-semibold text-center"
          >
            섭취알림 등록하기 →
          </button>
        </div>

        {/* 탭 */}
        <div className="flex items-center justify-center gap-6 my-8">
          <button
            className={`text-xl font-bold pb-2 ${
              activeTab === "전체"
                ? "text-black border-b-4 border-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("전체")}
          >
            전체
          </button>
          <button
            className={`text-xl font-bold pb-2 ${
              activeTab === "초과"
                ? "text-red-500 border-b-4 border-red-500"
                : !allOverUpper
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-400"
            }`}
            onClick={() => allOverUpper && setActiveTab("초과")}
          >
            초과
          </button>
        </div>

        {activeTab === "초과" && (
          <div className="bg-gray-100 rounded-xl py-3 px-4 text-center mb-6">
            <p className="text-sm text-gray-700 font-semibold">
              적정 섭취량을 준수하세요!
            </p>
          </div>
        )}

        {/* 섭취량 그래프 */}
        <div className="space-y-6">
          {filteredIngredients.map(({ name, value, upper }) => {
            const barWidth = `${(value / 120) * 100}%`;
            return (
              <div key={name} className="flex items-center gap-4">
                <div
                  className="cursor-pointer text-lg font-bold w-40 whitespace-nowrap"
                  onClick={() =>
                    navigate(`/ingredient?name=${encodeURIComponent(name)}`)
                  }
                >
                  {name} &gt;
                </div>
                <div className="relative w-full h-4 bg-[#EFEFEF] rounded-full">
                  <div
                    className="absolute h-4 bg-[#FFE17E] rounded-full"
                    style={{ width: barWidth }}
                  />
                  <div
                    className="absolute top-0 h-4 border-l-2 border-dashed border-black"
                    style={{ left: "33.33%" }}
                  />
                  <div
                    className="absolute top-0 h-4 border-l-2 border-dashed border-black"
                    style={{ left: "66.66%" }}
                  />
                  <div className="absolute -top-6 left-[28%] text-xs font-semibold">
                    권장
                  </div>
                  <div className="absolute -top-6 left-[61%] text-xs font-semibold">
                    상한
                  </div>
                </div>
                <div className="w-16 text-xs text-right">
                  {value} / {upper}
                </div>
              </div>
            );
          })}
        </div>

        {filteredIngredients.length > 5 && (
          <div className="flex justify-center my-4">
            <button className="text-sm text-gray-500">필터보기 ⌄</button>
          </div>
        )}

        {/* 조합 카드 */}
        <div className="mt-20 mb-10 max-w-[1248px] mx-auto">
          <h2 className="text-lg font-bold mb-2">주의가 필요한 조합 TOP 5</h2>
          <p className="text-sm text-gray-500 mb-4">
            카드를 눌러서 확인해 보세요!
          </p>
          <div className="overflow-x-auto">
            <div className="flex gap-4 w-[1248px] px-1">
              {riskyCombinations.map((combo, i) => (
                <div
                  key={i}
                  className="w-[224px] h-[170px] bg-white shadow-md rounded-[14px] px-[6px] py-[10px] text-center text-[25px] font-normal flex items-center justify-center relative"
                >
                  {combo}
                  <span className="absolute top-[10px] right-[10px] text-xs text-gray-400">
                    ⟳
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-10 max-w-[1248px] mx-auto">
          <h2 className="text-lg font-bold mb-4">궁합이 좋은 조합 TOP 5</h2>
          <div className="overflow-x-auto">
            <div className="flex gap-4 w-[1248px] px-1">
              {goodCombinations.map((combo, i) => (
                <div
                  key={i}
                  className="w-[224px] h-[170px] bg-white shadow-md rounded-[14px] px-[6px] py-[10px] text-center text-[25px] font-normal flex items-center justify-center relative"
                >
                  {combo}
                  <span className="absolute top-[10px] right-[10px] text-xs text-gray-400">
                    ⟳
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
