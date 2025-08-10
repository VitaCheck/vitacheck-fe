import { useLocation, useNavigate } from "react-router-dom"; // useNavigate 추가
import { useEffect, useState } from "react";
import RecommendedProductSection from "@/components/Purpose/Purpose2Section";
import useIsMobile from "@/hooks/useIsMobile";

// API 응답 result 타입 정의
interface SupplementInfo {
  purposes: string[];
  supplements: [string, string][];
}

type ResultData = Record<string, SupplementInfo>;

const PurposeProductList = () => {
  const location = useLocation();
  const navigate = useNavigate(); // navigate 변수 선언
  const selected = location.state?.selectedDescriptions || [];
  const selectedCodes = location.state?.selectedCodes || [];
  const isMobile = useIsMobile();

  const [data, setData] = useState<ResultData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // 목적 코드와 한글 이름을 매핑하는 객체
  const purposeCodeMap: Record<string, string> = {
    'EYE': '눈건강',
    'BONE': '뼈건강',
    'SLEEP_STRESS': '수면/스트레스',
    'CHOLESTEROL': '혈중콜레스테롤',
    'FAT': '체지방',
    // 다른 모든 목적에 대한 매핑 추가
  };

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
      
      // --- 👇 API 호출 대신 이 부분을 사용합니다. 👇 ---
        try {
          const mockData = {
            '루테인': {
              purposes: ["눈건강"],
              supplements: [
                ["고려은단 비타민c 1000", "lutein.jpg"],
                ["루테인2", "lutein.jpg"],
                ["루테인3", "lutein.jpg"],
                ["루테인4", "lutein.jpg"],
                ["루테인5", "lutein.jpg"],
                ["루테인6", "lutein.jpg"],
                ["루테인7", "lutein.jpg"],
                ["루테인8", "lutein.jpg"],
                ["루테인9", "lutein.jpg"],
                ["루테인10", "lutein.jpg"],
                ["루테인11", "lutein.jpg"],
                ["루테인12", "lutein.jpg"],
                ["루테인13", "lutein.jpg"],
                ["루테인14", "lutein.jpg"],
                ["루테인15", "lutein.jpg"],
                ["루테인16", "lutein.jpg"],
                ["루테인17", "lutein.jpg"],
              ],
            },
            '칼슘2': {
              purposes: ["뼈건강"],
              supplements: [["제품이름2", "omega3.jpg"]],
            },
            '성분3_수면': {
              purposes: ["수면/스트레스"],
              supplements: [["제품이름3", "omega3.jpg"]],
            },
            '성분4_혈중콜레스테롤': {
              purposes: ["혈중콜레스테롤"],
              supplements: [["제품이름4", "omega3.jpg"]],
            },
            '성분5_체지방': {
              purposes: ["체지방"],
              supplements: [["제품이름5", "omega3.jpg"]],
            },
          };
          setData(mockData as unknown as ResultData);
          console.log("✅ Mock 데이터 로드 완료:", mockData);
        } catch (error) {
          console.error("❌ 목업 데이터 로드 중 오류 발생:", error);
          setData({});
        } finally {
          setIsLoading(false);
        }

        // --- 👆 API 호출 대신 이 부분을 사용합니다. 👆 ---

  //     try {
  //       const response = await axios.post("/api/v1/supplements/by-purposes", payload);
  //       console.log("✅ API 응답:", response.data);

  //       if (response.data?.isSuccess && response.data?.result) {
  //         setData(response.data.result);
  //       } else {
  //         console.warn("⚠️ 응답 성공했지만 result가 비어있거나 형식이 다름:", response.data);
  //         setData({});
  //       }
  //     } catch (error) {
  //       console.error("❌ 추천 성분 불러오기 실패:", error);
  //       setData({
  //         '루테인': {
  //           purposes: ["눈건강"],
  //           supplements: [["루테인1", "lutein.jpg"], ["루테인2", "lutein.jpg"], ["루테인3", "lutein.jpg"], ["루테인4", "lutein.jpg"],
  //           ["루테인5", "lutein.jpg"], ["루테인6", "lutein.jpg"], ["루테인7", "lutein.jpg"], ["루테인8", "lutein.jpg"],
  //           ["루테인9", "lutein.jpg"], ["루테인10", "lutein.jpg"], ["루테인11", "lutein.jpg"], ["루테인12", "lutein.jpg"],
  //           ["루테인13", "lutein.jpg"], ["루테인14", "lutein.jpg"], ["루테인15", "lutein.jpg"], ["루테인16", "lutein.jpg"],
  //           ["루테인17", "lutein.jpg"],],
  //         },
  //         '칼슘2': {
  //           purposes: ["뼈건강"],
  //           supplements: [["제품이름2", "omega3.jpg"]],
  //         },
  //         '성분3_수면': {
  //           purposes: ["수면/스트레스"],
  //           supplements: [["제품이름3", "omega3.jpg"]],
  //         },
  //         '성분4_혈중콜레스테롤': {
  //           purposes: ["혈중콜레스테롤"],
  //           supplements: [["제품이름4", "omega3.jpg"]],
  //         },
  //         '성분5_체지방': {
  //           purposes: ["체지방"],
  //           supplements: [["제품이름5", "omega3.jpg"]],
  //         },
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
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

  // 수정된 renderSections 함수
  const renderSections = () => {
    // `data` 객체를 순회하면서 `selectedCodes`에 해당하는 항목만 필터링합니다.
    const translatedCodes = selectedCodes.map((code: string) => purposeCodeMap[code]).filter(Boolean);
    const filteredData = Object.entries(data).filter(([_ingredientName, info]) => {
      return info.purposes.some(purpose => translatedCodes.includes(purpose));
    });

    // 필터링된 데이터만 렌더링
    return filteredData.map(([ingredientName, info]) => (
      <div key={ingredientName} className="flex flex-col">
        <RecommendedProductSection
          ingredientName={ingredientName}
          purposes={info.purposes}
          supplements={info.supplements}
          isLoading={isLoading}
          goToAllIngredientPage={() => {
            navigate(`/ingredientproducts?ingredient=${encodeURIComponent(ingredientName)}`, {
              state: { supplements: info.supplements },
            });
          }}
        />
      </div>
    ));
  };

  return (
    <>
      {/* 모바일 전용 */}
      <div className="md:hidden w-full mx-auto pb-[50px]">
        <div className="md:hidden flex items-center gap-[22px] mt-[50px]">
          <div className="ml-[38px]">
            <h1 className="text-[30px] tracking-[-0.6px] font-medium">
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
        {/* {isLoading && <p>데이터를 불러오는 중입니다...</p>} */}
        
        {/* 데이터가 있을 때만 섹션 렌더링 */}
        {!isLoading && Object.keys(data).length > 0 && (
          <div className="mt-[20px]">{renderSections()}</div>
        )}
      </div>
  

      {/* PC 전용 */}
      <div className="hidden md:block w-full bg-[#FAFAFA] px-[40px]">
        <div className="max-w-[845px] mx-auto pt-[70px] pb-[80px]">
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