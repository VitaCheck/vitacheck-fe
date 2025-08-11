import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RecommendedProductSection from "@/components/Purpose/P2Section";
import P2MDropdownPopup from "@/components/Purpose/P2MDropdownPopup";
import useIsMobile from "@/hooks/useIsMobile";

// API 응답 result 타입 정의
interface SupplementInfo {
  purposes: string[];
  supplements: [string, string][];
}

type ResultData = Record<string, SupplementInfo>;

const PurposeProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selected = location.state?.selectedDescriptions || [];
  const selectedCodes = location.state?.selectedCodes || [];
  const isMobile = useIsMobile();

  const [data, setData] = useState<ResultData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // ✅ 1. 선택된 목적 이름을 관리하는 상태 추가 (초기값은 첫 번째 선택 항목)
  const [activePurpose, setActivePurpose] = useState<string>(selected[0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // ✅ 팝업에서 항목 선택 시 호출될 함수
  const handlePurposeSelect = (item: string) => {
    setActivePurpose(item); // 선택된 목적을 상태에 저장
    handleClosePopup(); // 팝업 닫기
  };

  // 목적 코드와 한글 이름을 매핑하는 객체
  const purposeCodeMap: Record<string, string> = {
    'EYE': '눈건강',
    'BONE': '뼈건강',
    'SLEEP_STRESS': '수면/스트레스',
    'CHOLESTEROL': '혈중 콜레스테롤',
    'FAT': '체지방',
    'SKIN': '피부 건강',
    'TIRED': '피로감',
    'IMMUNE': '면역력',
    'DIGEST': '소화/위 건강',
    'ATHELETIC': '운동 능력',
    'CLIMACTERIC': '여성 갱년기',
    'TEETH': '치아/잇몸',
    'HAIR_NAIL': '탈모/손톱 건강',
    'BLOOD_PRESS': '혈압',
    'NEUTRAL_FAT': '혈중 중성지방',
    'ANEMIA': '빈혈',
    'ANTIAGING': '노화/항산화',
    'BRAIN': '두뇌활동',
    'LIVER': '간 건강',
    'BLOOD_CIRCULATION': '혈관/혈액순환',
    'GUT_HEALTH': '장 건강',
    'RESPIRATORY_HEALTH': '호흡기 건강',
    'JOINT_HEALTH': '관절 건강',
    'PREGNANT_HEALTH': '임산부/태아 건강',
    'BLOOD_SUGAR': '혈당',
    'THYROID_HEALTH': '갑상선 건강',
    'WOMAN_HEALTH': '여성 건강',
    'MAN_HEALTH': '남성 건강',
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
              ["솔가 비타민D3 5000IU", "lutein.jpg"],
              ["종근당건강 프로메가 오메가3", "lutein.jpg"],
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
    };

    fetchData();
  }, [selectedCodes, activePurpose]); // ✅ activePurpose를 의존성 배열에 추가

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

  // ✅ 3. renderSections 함수 수정: activePurpose에 따라 정렬
  const renderSections = () => {
    const translatedCodes = selectedCodes.map((code: string) => purposeCodeMap[code]).filter(Boolean);
    const filteredData = Object.entries(data).filter(([_ingredientName, info]) => {
      return info.purposes.some(purpose => translatedCodes.includes(purpose));
    });

    // 선택된 목적에 해당하는 데이터를 최상단으로 옮기는 로직
    const sortedData = [...filteredData].sort(([_, aInfo], [__, bInfo]) => {
      const aHasActive = aInfo.purposes.includes(activePurpose);
      const bHasActive = bInfo.purposes.includes(activePurpose);
      if (aHasActive && !bHasActive) return -1;
      if (!aHasActive && bHasActive) return 1;
      return 0;
    });

    return sortedData.map(([ingredientName, info]) => (
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
            <h1 className="text-[30px] tracking-[-0.6px] font-semibold">
              {titleText}
            </h1>
          </div>

          {/* 드롭다운 버튼. */}
          <div
            className="relative min-w-[78px] h-[28px] cursor-pointer"
            onClick={handleOpenPopup}
          >
            <div
              className="w-full h-full pl-[15px] pr-[24px] text-[14px] font-medium
              rounded-[26px] border-[0.8px] border-[#AAA] text-black
              flex items-center justify-between"
            >
              <span>{activePurpose}</span>
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
        </div>

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
      
      {/* 팝업 렌더링. onSelect prop을 추가했습니다. */}
      {isPopupOpen && (
        <P2MDropdownPopup
          onClose={handleClosePopup}
          selectedItems={selected}
          onSelect={handlePurposeSelect}
          activeItem={activePurpose}
        />
      )}
    </>
  );
};

export default PurposeProductList;