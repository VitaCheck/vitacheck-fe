import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import RecommendedProductSection from "../../components/Purpose/PurposeRecommendedProductSection";
import useIsMobile from "@/hooks/useIsMobile";

// API 응답 result 타입 정의
interface SupplementInfo {
  purposes: string[];
  supplements: [string, string][];
}

type ResultData = Record<string, SupplementInfo>;

const PurposeProductList = () => {
  const location = useLocation();
  const selected = location.state?.selectedDescriptions || [];
  const selectedCodes = location.state?.selectedCodes || [];
  const isMobile = useIsMobile();

  const [data, setData] = useState<ResultData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCodes.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const payload = {
        purposeNames: selectedCodes,
      };

      console.log("📤 보내는 데이터:", JSON.stringify(payload, null, 2));

      try {
        const response = await axios.post("/api/v1/supplements/by-purposes", payload);
        console.log("✅ API 응답:", response.data);

        if (response.data?.isSuccess && response.data?.result) {
          setData(response.data.result);
        } else {
          console.warn("⚠️ 응답 성공했지만 result가 비어있거나 형식이 다름:", response.data);
          setData({});
        }
      } catch (error) {
        console.error("❌ 추천 성분 불러오기 실패:", error);
        setData({
          '루테인': {
            purposes: ["눈건강"],
            supplements: [["루테인1", "lutein.jpg"], ["루테인2", "lutein.jpg"], ["루테인3", "lutein.jpg"], ["루테인4", "lutein.jpg"],
                          ["루테인5", "lutein.jpg"], ["루테인6", "lutein.jpg"], ["루테인7", "lutein.jpg"], ["루테인8", "lutein.jpg"],
                          ["루테인9", "lutein.jpg"], ["루테인10", "lutein.jpg"], ["루테인11", "lutein.jpg"], ["루테인12", "lutein.jpg"],
                          ["루테인13", "lutein.jpg"], ["루테인14", "lutein.jpg"], ["루테인15", "lutein.jpg"], ["루테인16", "lutein.jpg"],
                        ["루테인17", "lutein.jpg"],],
          },
          '오메가3': {
            purposes: ["눈건강"],
            supplements: [["오메가3 골드", "omega3.jpg"]],
          },
          '오메가4': {
            purposes: ["눈건강"],
            supplements: [["오메가3 골드", "omega3.jpg"]],
          },
          '오메가5': {
            purposes: ["눈건강"],
            supplements: [["오메가3 골드", "omega3.jpg"]],
          },
          '오메가6': {
            purposes: ["눈건강"],
            supplements: [["오메가3 골드", "omega3.jpg"]],
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCodes]);

  // 제목 텍스트 처리
  let titleText: string | JSX.Element = "";
  if (isMobile) {
    titleText =
      selected.length === 1
        ? selected[0]
        : `${selected[0]} 외 ${selected.length - 1}`;
  } else {
    if (selected.length === 1) {
      titleText = selected[0];
    } else if (selected.length === 2) {
      titleText = (
        <>
          {selected[0]} <span className="font-light">&</span> {selected[1]}
        </>
      );
    } else if (selected.length === 3) {
      titleText = (
        <>
          {selected[0]} <span className="font-light">&</span> {selected[1]}{" "}
          <span className="font-light">&</span> {selected[2]}
        </>
      );
    }
  }

  // 각 성분별 섹션 렌더링
  const renderSections = () =>
    Object.entries(data).map(([ingredientName, info]) => (
      <div key={ingredientName} className="flex flex-col">
        <RecommendedProductSection
          ingredientName={ingredientName}
          purposes={info.purposes}
          supplements={info.supplements}
          // 수정: 로딩 상태도 props로 전달
          isLoading={isLoading}
        />
      </div>
    ));

  return (
    <>
      {/* 모바일 전용 */}
      <div className="md:hidden flex items-center gap-[22px] w-[430px] mx-auto mt-[70px]">
        <div className="ml-[38px]">
          <h1 className="text-[30px] tracking-[-0.6px] font-semibold">
            {titleText}
          </h1>
        </div>

        {/* 드롭다운 */}
        <div className="relative w-[78px] h-[28px]">
          <select
            className="w-full h-full pl-[15px] pr-[24px] text-[14px] font-medium
            rounded-[26px] border-[0.8px] border-[#AAA]
            text-black appearance-none focus:outline-none"
          >
            {selected.map((item: string, index: number) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute top-1/2 right-[8px] transform -translate-y-1/2">
            <svg
              className="w-[12px] h-[12px] text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 로딩 상태일 때 */}
      {isLoading && <p>데이터를 불러오는 중입니다...</p>}
      
      {/* 데이터가 있을 때만 섹션 렌더링 */}
      {!isLoading && Object.keys(data).length > 0 && (
        <div className="md:hidden w-[430px] mx-auto mt-[20px]">{renderSections()}</div>
      )}

      {/* PC 전용 - 배경색 포함 */}
      <div className="hidden md:block w-full bg-[#FAFAFA]">
        <div className="px-[200px] pt-[100px]">
          <div className="flex justify-between items-center">
            <h1 className="text-[30px] tracking-[-1px] font-semibold">{titleText}</h1>
          </div>
          {isLoading ? (
            <p className="mt-[40px]">데이터를 불러오는 중입니다...</p>
          ) : (
            <div className="mt-[40px]">{renderSections()}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default PurposeProductList;