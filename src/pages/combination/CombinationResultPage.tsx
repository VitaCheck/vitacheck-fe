import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import backgroundLine from "../../assets/background line.png";
import boxIcon from "../../assets/box.png";
import vitaminArrow from "../../assets/비타민 C_arrow.png";
import selectionLine from "../../assets/selection line 1.png";

type ProductItem = {
  name: string;
  imageUrl: string;
};

export default function CombinationResultPage() {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
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
            onClick={() => navigate("/조합-2-2")}
            className="w-[150px] h-[70px] bg-[#EEEEEE] rounded-full text-lg font-semibold flex items-center justify-center"
          >
            재조합
          </button>
          <button
            onClick={() => navigate("/알림-2")}
            className="w-[280px] h-[70px] bg-[#FFEB9D] rounded-[62.5px] text-lg font-semibold text-center"
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
            {selectedItems.map(
              (item: { name: string; imageUrl: string }, idx: number) => (
                <div
                  key={idx}
                  className="w-[270px] h-[250px] bg-white rounded-[22.76px] flex flex-col items-center pt-[80px] relative flex-shrink-0"
                >
                  <img
                    src={boxIcon}
                    alt="checkbox"
                    className="absolute top-[10px] left-[18px] w-[50px] h-[50px]"
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
              )
            )}
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
              className="w-[130px] h-[130px] bg-white rounded-[10px] flex flex-col items-center relative flex-shrink-0 pt-[26px] pb-[12px]"
            >
              <input
                type="checkbox"
                className="absolute top-[8px] left-[8px] w-[18px] h-[18px] border border-[#9C9A9A] rounded-[3.33px] accent-black"
              />
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-[70px] h-[50px] object-contain mb-2"
              />
              <p className="text-xs text-center px-1">{item.name}</p>
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
      <div className="md:hidden px-4 hide-scrollbar overflow-x-auto">
        <div className="w-max flex gap-[10px] ml-4 mr-4">
          {riskyCombinations.map((combo, i) => (
            <div
              key={i}
              className="w-[130px] h-[114px] bg-white rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-center text-[16px] font-medium flex items-center justify-center relative mt-5 mb-5"
            >
              {combo}
              <span className="absolute top-[10px] right-[10px] text-xs text-gray-400">
                ⟳
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* 주의가 필요한 조합 안내 - PC */}
      <div className="hidden md:block px-[60px] mt-[80px]">
        <h2
          style={{
            marginLeft: "200px",
            width: "500px",
            height: "48px",
            fontFamily: "Pretendard",
            fontWeight: 700,
            fontStyle: "normal", // 명세에 Bold였지만 실제 CSS에서는 fontWeight로 표현
            fontSize: "40px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#000000",
            opacity: 1,
          }}
        >
          주의가 필요한 조합 TOP 5
        </h2>
        <p
          style={{
            marginLeft: "200px",
            width: "500px",
            height: "29px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontStyle: "normal", // SemiBold도 CSS에서는 fontWeight로 표현
            fontSize: "24px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#6B6B6B",
            opacity: 1,
            marginTop: "8px",
          }}
        >
          카드를 눌러서 확인해 보세요 !
        </p>
      </div>
      {/* 조합 카드들 - PC */}
      <div className="hidden md:flex overflow-x-auto px-[60px] justify-center">
        <div className="flex gap-15 w-max mt-10 mb-5">
          {riskyCombinations.map((combo, i) => (
            <div
              key={i}
              className="w-[222px] h-[150px] bg-white rounded-[14px] px-[6px] py-[10px] shadow-[2px_2px_12.2px_0px_rgba(0,0,0,0.25)] flex items-center justify-start relative"
            >
              <span className="w-[200px] h-[36px] font-pretendard font-medium text-[25px] leading-[100%] tracking-[0] text-[#414141] text-center mx-auto">
                {combo}
              </span>

              <span className="absolute top-[10px] right-[10px] text-xs text-gray-400">
                ⟳
              </span>
            </div>
          ))}
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
      {/* ===== 모바일 - 궁합 카드 ===== */}
      <div className="md:hidden px-4 hide-scrollbar overflow-x-auto mb-10">
        <div className="flex gap-3 w-max pl-4 pr-4">
          {goodCombinations.map((combo, i) => (
            <div
              key={i}
              className="w-[130px] h-[114px] bg-white rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-center text-[16px] font-medium flex items-center justify-center relative mt-5 mb-10"
            >
              {combo}
              <span className="absolute top-[10px] right-[10px] text-xs text-gray-400">
                ⟳
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* ===== PC - 궁합이 좋은 조합 안내 ===== */}
      <div className="hidden md:block px-[60px] mt-[80px]">
        <h2
          style={{
            marginLeft: "200px",
            width: "407px",
            height: "48px",
            fontFamily: "Pretendard",
            fontWeight: 700,
            fontSize: "40px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#000000",
          }}
        >
          궁합이 좋은 조합 TOP 5
        </h2>
        <p
          style={{
            marginLeft: "200px",
            width: "500px",
            height: "29px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "24px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#6B6B6B",
            marginTop: "8px",
          }}
        >
          카드를 눌러서 확인해 보세요 !
        </p>
      </div>
      {/* ===== PC - 궁합 카드 ===== */}
      <div className="hidden md:flex overflow-x-auto px-[60px] justify-center">
        <div className="flex gap-15 w-max mt-10 mb-30">
          {goodCombinations.map((combo, i) => (
            <div
              key={i}
              className="w-[222px] h-[150px] bg-white rounded-[14px] px-[6px] py-[10px] shadow-[2px_2px_12.2px_0px_rgba(0,0,0,0.25)] flex items-center justify-start relative"
            >
              <span className="w-[200px] h-[36px] font-pretendard font-medium text-[25px] leading-[100%] tracking-[0] text-[#414141] text-center mx-auto">
                {combo}
              </span>

              <span className="absolute top-[10px] right-[10px] text-xs text-gray-400">
                ⟳
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
