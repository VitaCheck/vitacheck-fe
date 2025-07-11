import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function CombinationResultPage() {
  const location = useLocation();
  const selectedItems = location.state || [];
  const navigate = useNavigate();

  const ingredientData = [
    { name: "비타민 C", value: 70, recommended: 60, upper: 100 },
    { name: "유산균", value: 80, recommended: 70, upper: 120 },
    { name: "엽산", value: 50, recommended: 60, upper: 100 },
    { name: "글루타치온", value: 90, recommended: 80, upper: 110 },
    { name: "비타민 A", value: 95, recommended: 90, upper: 100 },
  ];

  const [activeTab, setActiveTab] = useState<"전체" | "초과">("전체");
  const [allOverUpper, setAllOverUpper] = useState(false);

  useEffect(() => {
    const isAllOverUpper = ingredientData.every((i) => i.value >= i.upper);
    setAllOverUpper(isAllOverUpper);
    if (isAllOverUpper) {
      setActiveTab("초과");
    }
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

  return (
    <div className="w-full max-w-[1280px] mx-auto p-4 font-pretendard pb-40">
      <NavBar />

      {/* 제목 + 재조합 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold">조합 분석</h1>
        <button className="border px-3 py-1 text-sm rounded-full">
          재조합
        </button>
      </div>

      {/* 선택 제품 목록 */}
      <div className="w-full overflow-x-auto mb-8 scrollbar-hide px-2">
        <div className="flex gap-15 min-w-max">
          {selectedItems.map((item: any, idx: number) => (
            <div key={idx} className="w-[120px] flex-shrink-0 text-center">
              <div className="flex justify-center mb-3">
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-[100px] h-[100px] object-contain mx-auto mb-1"
              />
              <p className="text-xs whitespace-nowrap">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 섭취알림 버튼 */}
      <button
        onClick={() => navigate("/register-reminder")}
        className="bg-yellow-300 hover:bg-yellow-400 transition px-4 py-3 w-full rounded-xl font-semibold text-center mt-3 mb-5"
      >
        섭취알림 등록하기 →
      </button>

      {/* 전체 / 초과 탭 */}
      <div className="flex items-center justify-center gap-6 my-8">
        <button
          className={`relative text-xl font-bold leading-none pb-3 ${
            activeTab === "전체"
              ? "text-black border-b-3 border-black bottom-[3px]"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("전체")}
        >
          전체
        </button>
        <button
          className={`text-xl font-bold pb-5 ${
            activeTab === "초과"
              ? "text-red-500 border-b-4 border-red-500"
              : !allOverUpper
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-400"
          }`}
          onClick={() => {
            if (allOverUpper) {
              setActiveTab("초과");
            }
          }}
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

      {/* 성분 섭취 바 */}
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
                ></div>
                <div
                  className="absolute top-0 h-4 border-l-2 border-dashed border-black"
                  style={{ left: "33.33%" }}
                ></div>
                <div
                  className="absolute top-0 h-4 border-l-2 border-dashed border-black"
                  style={{ left: "66.66%" }}
                ></div>
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

      {/* 필터 보기 조건 */}
      {filteredIngredients.length > 5 && (
        <div className="flex justify-center my-4">
          <button className="text-sm text-gray-500">필터보기 ⌄</button>
        </div>
      )}

      {/* 주의 조합 */}
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

      {/* 좋은 조합 */}
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
  );
}
