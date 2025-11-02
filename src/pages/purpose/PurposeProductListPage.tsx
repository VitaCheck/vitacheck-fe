import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import RecommendedProductSection from "@/components/Purpose/P2Section";
import P2MDropdownPopup from "@/components/Purpose/P2MDropdownPopup";
import useIsMobile from "@/hooks/useIsMobile";
import axios from "@/lib/axios";
import React from "react";
import AI from "../../assets/aiicon.png";
import AI1 from "../../assets/ai1.png";
import AI2 from "../../assets/ai2.png";
import AI3 from "../../assets/ai3.png";

// API 응답 result 타입 정의
interface Supplement {
  id: number;
  name: string;
  imageUrl: string;
}

interface SupplementInfo {
  purposes: string[];
  supplements: Supplement[];
  ingredientId: number;
}

type ResultData = Record<string, SupplementInfo>;

const ITEMS_PER_PAGE = 10;

const PurposeProductList = () => {
  const location = useLocation() as {
    state: {
      selectedDescriptions?: string[];
      selectedCodes?: string[];
      activePurpose?: string;
      cachedData?: ResultData;
    };
  };
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const selectedCodes = location.state?.selectedCodes || [];

  const purposeCodeMap: Record<string, string> = {
    EYE: "눈건강",
    BONE: "뼈건강",
    SLEEP_STRESS: "수면/스트레스",
    CHOLESTEROL: "혈중 콜레스테롤",
    FAT: "체지방",
    SKIN: "피부 건강",
    TIRED: "피로감",
    IMMUNE: "면역력",
    DIGEST: "소화/위 건강",
    ATHELETIC: "운동 능력",
    CLIMACTERIC: "여성 갱년기",
    TEETH: "치아/잇몸",
    HAIR_NAIL: "탈모/손톱 건강",
    BLOOD_PRESS: "혈압",
    NEUTRAL_FAT: "혈중 중성지방",
    ANEMIA: "빈혈",
    ANTIAGING: "노화/항산화",
    BRAIN: "두뇌활동",
    LIVER: "간 건강",
    BLOOD_CIRCULATION: "혈관/혈액순환",
    GUT_HEALTH: "장 건강",
    RESPIRATORY_HEALTH: "호흡기 건강",
    JOINT_HEALTH: "관절 건강",
    PREGNANT_HEALTH: "임산부/태아 건강",
    BLOOD_SUGAR: "혈당",
    THYROID_HEALTH: "갑상선 건강",
    WOMAN_HEALTH: "여성 건강",
    MAN_HEALTH: "남성 건강",
  };

  const purposeOrder = Object.keys(purposeCodeMap);

  const codePurposeMap = Object.entries(purposeCodeMap).reduce(
    (acc, [key, value]) => {
      acc[value] = key;
      return acc;
    },
    {} as Record<string, string>
  );

  const selectedPurposes = selectedCodes
    .map((code) => purposeCodeMap[code])
    .filter(Boolean);

  const sortedSelectedPurposes = [...selectedPurposes].sort((a, b) => {
    const keyA = codePurposeMap[a];
    const keyB = codePurposeMap[b];
    return purposeOrder.indexOf(keyA) - purposeOrder.indexOf(keyB);
  });

  const [data, setData] = useState<ResultData>(
    location.state?.cachedData || {}
  );
  const [isLoading, setIsLoading] = useState(!location.state?.cachedData);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activePurpose, setActivePurpose] = useState<string>(
    location.state?.activePurpose || sortedSelectedPurposes[0] || ""
  );

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const mobileLoaderRef = useRef<HTMLDivElement | null>(null);
  const pcLoaderRef = useRef<HTMLDivElement | null>(null);

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);
  const handlePurposeSelect = (item: string) => {
    setActivePurpose(item);
    setVisibleCount(ITEMS_PER_PAGE);
    handleClosePopup();
  };

  // ---------------- API 호출 ----------------
  useEffect(() => {
    if (
      !selectedCodes ||
      selectedCodes.length === 0 ||
      Object.keys(data).length > 0
    ) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        selectedCodes.forEach((code) => params.append("goals", code));

        const response = await axios.get("/api/v1/purposes/filter", { params });

        const normalize = (s: string) => (s || "").replace(/\s/g, "");

        const codeToKo: Record<string, string> = purposeCodeMap;
        const koToCode: Record<string, string> = Object.fromEntries(
          Object.entries(codeToKo).map(([code, ko]) => [ko, code])
        );

        const mappedData: ResultData = {};

        (response.data.result || []).forEach((purposeItem: any) => {
          const serverKo = normalize(purposeItem.name);
          const code = koToCode[serverKo];

          purposeItem.ingredients.forEach((ing: any) => {
            const ingredientName: string = ing.ingredientName;

            const supplements = Array.isArray(ing.supplementInfos)
              ? ing.supplementInfos.map((s: any) => ({
                  id: s.id,
                  name: s.name,
                  imageUrl: s.imageUrl,
                  coupangUrl: s.coupangUrl,
                }))
              : [];

            if (mappedData[ingredientName]) {
              mappedData[ingredientName].purposes.push(serverKo);
              mappedData[ingredientName].purposes = [
                ...new Set(mappedData[ingredientName].purposes),
              ];
              // 새 제품도 합치고 싶다면 아래처럼 머지 (중복 제거 포함)
              mappedData[ingredientName].supplements = [
                ...mappedData[ingredientName].supplements,
                ...supplements,
              ].filter(
                (v, i, arr) => arr.findIndex((x) => x.id === v.id) === i
              );
            } else {
              mappedData[ingredientName] = {
                purposes: [serverKo],
                supplements,
                ingredientId: ing.ingredientId,
              };
            }
          });
        });

        setData(mappedData);
      } catch (error) {
        console.error("❌ API 호출 실패:", error);
        setData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCodes]);

  // ---------------- 데이터 정렬 ----------------
  const getSortedData = React.useCallback(() => {
    const translatedSelected = selectedCodes
      .map((code: string) => purposeCodeMap[code])
      .filter(Boolean);

    const dataArray = Object.entries(data).map(([ingredientName, info]) => ({
      ingredientName,
      info,
    }));

    const filteredData = dataArray.filter(({ info }) =>
      info.purposes?.some((purpose) => translatedSelected.includes(purpose))
    );

    const sortedData = [...filteredData].sort((a, b) => {
      const aHasActive = a.info.purposes.includes(activePurpose);
      const bHasActive = b.info.purposes.includes(activePurpose);
      if (aHasActive && !bHasActive) return -1;
      if (!aHasActive && bHasActive) return 1;
      return 0;
    });

    return sortedData;
  }, [data, selectedCodes, activePurpose]);

  // ---------------- 무한 스크롤 ----------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetchingMore) {
          const sortedLength = getSortedData().length;
          if (visibleCount < sortedLength) {
            setIsFetchingMore(true);
            setTimeout(() => {
              setVisibleCount((prev) =>
                Math.min(prev + ITEMS_PER_PAGE, sortedLength)
              );
              setIsFetchingMore(false);
            }, 500);
          }
        }
      },
      { threshold: 0.1 }
    );

    const mobileRef = mobileLoaderRef.current;
    if (mobileRef) observer.observe(mobileRef);

    const pcRef = pcLoaderRef.current;
    if (pcRef) observer.observe(pcRef);

    return () => {
      if (mobileRef) observer.unobserve(mobileRef);
      if (pcRef) observer.unobserve(pcRef);
    };
  }, [getSortedData, isFetchingMore, visibleCount]);

  // ---------------- 렌더링 ----------------
  const renderSections = () => {
    const sortedData = getSortedData();
    const visibleData = sortedData.slice(0, visibleCount);

    return visibleData.map(({ ingredientName, info }) => {
      const translatedSelected = selectedCodes.map(
        (code: string) => purposeCodeMap[code]
      );
      const uniquePurposes = Array.from(new Set(info.purposes)).filter((p) =>
        translatedSelected.includes(p)
      );

      uniquePurposes.sort((a, b) => {
        const keyA = codePurposeMap[a];
        const keyB = codePurposeMap[b];
        return purposeOrder.indexOf(keyA) - purposeOrder.indexOf(keyB);
      });

      return (
        <div key={ingredientName} className="flex flex-col">
          <RecommendedProductSection
            ingredientName={ingredientName}
            purposes={uniquePurposes}
            supplements={info.supplements}
            isLoading={false}
            goToAllIngredientPage={() =>
              navigate(
                `/ingredientproducts?ingredient=${encodeURIComponent(
                  ingredientName
                )}`,
                {
                  state: {
                    ingredientId: info.ingredientId,
                    ingredientName: ingredientName,
                    initialSupplements: info.supplements,
                  },
                }
              )
            }
          />
        </div>
      );
    });
  };

  const SkeletonSection = () => (
    <div className="animate-pulse mt-[20px] mx-6 sm:mx-0 bg-gray-100 rounded-[20px] mb-4 h-[150px]"></div>
  );

  let titleText: string | React.ReactNode = "";
  if (isMobile) {
    titleText =
      sortedSelectedPurposes.length === 1
        ? sortedSelectedPurposes[0]
        : `${sortedSelectedPurposes[0]} 외 ${sortedSelectedPurposes.length - 1}`;
  } else {
    if (sortedSelectedPurposes.length === 1)
      titleText = sortedSelectedPurposes[0];
    else if (sortedSelectedPurposes.length === 2)
      titleText = (
        <>
          {sortedSelectedPurposes[0]} <span className="font-light">&</span>{" "}
          {sortedSelectedPurposes[1]}
        </>
      );
    else if (sortedSelectedPurposes.length === 3)
      titleText = (
        <>
          {sortedSelectedPurposes[0]} <span className="font-light">&</span>{" "}
          {sortedSelectedPurposes[1]} <span className="font-light">&</span>{" "}
          {sortedSelectedPurposes[2]}
        </>
      );
  }

  let titleSizeClass = "text-[30px]";
  if (selectedPurposes.length === 2) {
    titleSizeClass = "text-[24px]";
  } else if (selectedPurposes.length >= 3) {
    titleSizeClass = "text-[24px]";
  }

  return (
    <>
      {/* 모바일 */}
      <div className="sm:hidden w-full mx-auto pb-[50px]">
        <div className="flex items-center gap-[22px] mt-[50px]">
          <div className="ml-[38px]">
            <h1 className={`${titleSizeClass} tracking-[-1px] font-semibold`}>
              {titleText}
            </h1>
          </div>
          <div
            className="relative min-w-[78px] h-[28px] cursor-pointer"
            onClick={handleOpenPopup}
          >
            <div className="w-full h-full pl-[15px] pr-[24px] text-[14px] font-medium rounded-[26px] border-[0.8px] border-[#AAA] text-black flex items-center justify-between">
              <span>{activePurpose}</span>
              <div className="pointer-events-none absolute top-1/2 right-[8px] transform -translate-y-1/2">
                <svg
                  className="w-[12px] h-[12px] text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* AI 추천 섹션 */}
        <div
          className="
    relative mt-[25px] mx-8
    flex flex-col items-start 
    p-[20px] sm:p-[24px] gap-[16px] sm:gap-[20px]
    cursor-pointer
    border-[2px] border-[#FFF9D4]
    shadow-[2px_2px_7.8px_rgba(163,148,182,0.25)]
    rounded-[22px]
    bg-[#FCFDE7]
    overflow-hidden
  "
          onClick={() =>
            navigate("/ai-recommend", {
              state: { selectedPurposes: sortedSelectedPurposes },
            })
          }
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[8px]">
              <img
                src={AI}
                alt="AI"
                className="w-[20px] sm:w-[24px] h-[20px] sm:h-[24px]"
              />
              <span className="text-[16px] sm:text-[18px] font-semibold text-[#222]">
                AI 추천 영양제 조합 살펴보기
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-[16px] sm:w-[18px] h-[16px] sm:h-[18px] text-[#222]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          <p className="text-[13px] sm:text-[14px] text-[#737373] leading-[1.4] bg-white rounded-[8px] px-[10px] sm:px-[12px] py-[6px] sm:py-[8px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
            비타체크 AI가 사용자 선택 목적을 종합하여 영양제를 추천해드립니다.
          </p>

          <div
            className="
      grid grid-cols-3 gap-[10px] sm:gap-[20px] 
      w-full mt-[8px]
    "
          >
            <div className="aspect-[1/1] w-full rounded-[12px] bg-white flex items-center justify-center shadow-[2px_2px_7.8px_rgba(163,148,182,0.25)]">
              <img
                src={AI1}
                alt="영양제1"
                className="max-w-[80%] max-h-[80%] object-contain"
              />
            </div>
            <div className="aspect-[1/1] w-full rounded-[12px] bg-white flex items-center justify-center shadow-[2px_2px_7.8px_rgba(163,148,182,0.25)]">
              <img
                src={AI2}
                alt="영양제2"
                className="max-w-[50%] max-h-[50%] object-contain"
              />
            </div>
            <div className="aspect-[1/1] w-full rounded-[12px] bg-white flex items-center justify-center shadow-[2px_2px_7.8px_rgba(163,148,182,0.25)]">
              <img
                src={AI3}
                alt="영양제3"
                className="max-w-[80%] max-h-[80%] object-contain"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <>
            <p className="mt-[20px] mb-[20px] text-center text-gray-500">
              목적별 영양제를 조회 중입니다...
            </p>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <SkeletonSection key={i} />
            ))}
          </>
        ) : getSortedData().length > 0 ? (
          <>
            <div className="mt-[20px]">{renderSections()}</div>
            {isFetchingMore &&
              Array.from({ length: 2 }).map((_, i) => (
                <SkeletonSection key={`more-${i}`} />
              ))}
            <div ref={mobileLoaderRef} className="h-[50px] w-full"></div>
          </>
        ) : (
          <p className="mt-[20px] text-center text-gray-500">
            연관 제품이 없습니다.
          </p>
        )}
      </div>

      {/* PC */}
      <div className="hidden sm:block w-full bg-[#FAFAFA] px-[40px]">
        <div className="max-w-[845px] mx-auto pt-[70px] pb-[80px]">
          <div className="flex justify-between items-center">
            <h1 className="text-[30px] tracking-[-1px] font-semibold">
              {titleText}
            </h1>
          </div>
          <div
            className="
    relative mt-[25px]
    flex flex-col items-start 
    p-[20px] sm:p-[24px] gap-[16px] sm:gap-[20px]
    cursor-pointer
    border-[2px] border-[#FFF9D4]
    shadow-[2px_2px_7.8px_rgba(163,148,182,0.25)]
    rounded-[22px]
    bg-[#FCFDE7]
    overflow-hidden
  "
            onClick={() =>
              navigate("/ai-recommend", {
                state: { selectedPurposes: sortedSelectedPurposes },
              })
            }
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-[8px]">
                <img
                  src={AI}
                  alt="AI"
                  className="w-[20px] sm:w-[24px] h-[20px] sm:h-[24px]"
                />
                <span className="text-[16px] sm:text-[18px] font-semibold text-[#222]">
                  AI 추천 영양제 조합 살펴보기
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-[16px] sm:w-[18px] h-[16px] sm:h-[18px] text-[#222]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            <p className="text-[13px] sm:text-[14px] text-[#737373] leading-[1.4] bg-white rounded-[8px] px-[10px] sm:px-[12px] py-[6px] sm:py-[8px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
              비타체크 AI가 사용자 선택 목적을 종합하여 영양제를 추천해드립니다.
            </p>

            <div
              className="
      grid grid-cols-3 gap-[10px] sm:gap-[100px] 
      w-full mt-[8px]
    "
            >
              <div className="aspect-[1/1] w-full rounded-[12px] bg-white flex items-center justify-center shadow-[2px_2px_7.8px_rgba(163,148,182,0.25)]">
                <img
                  src={AI1}
                  alt="영양제1"
                  className="max-w-[80%] max-h-[80%] object-contain"
                />
              </div>
              <div className="aspect-[1/1] w-full rounded-[12px] bg-white flex items-center justify-center shadow-[2px_2px_7.8px_rgba(163,148,182,0.25)]">
                <img
                  src={AI2}
                  alt="영양제2"
                  className="max-w-[50%] max-h-[50%] object-contain"
                />
              </div>
              <div className="aspect-[1/1] w-full rounded-[12px] bg-white flex items-center justify-center shadow-[2px_2px_7.8px_rgba(163,148,182,0.25)]">
                <img
                  src={AI3}
                  alt="영양제3"
                  className="max-w-[80%] max-h-[80%] object-contain"
                />
              </div>
            </div>
          </div>
          {isLoading ? (
            <>
              <p className="mt-[20px] mb-[20px] text-center text-gray-500">
                목적별 영양제를 조회 중입니다...
              </p>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <SkeletonSection key={i} />
              ))}
            </>
          ) : getSortedData().length > 0 ? (
            <>
              <div className="mt-[40px]">{renderSections()}</div>
              {isFetchingMore &&
                Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonSection key={`more-${i}`} />
                ))}
              <div ref={pcLoaderRef}></div>
            </>
          ) : (
            <p className="mt-[40px] text-center text-gray-500">
              연관 제품이 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* 팝업 */}
      {isPopupOpen && (
        <P2MDropdownPopup
          onClose={handleClosePopup}
          selectedItems={sortedSelectedPurposes}
          onSelect={handlePurposeSelect}
          activeItem={activePurpose}
        />
      )}
    </>
  );
};

export default PurposeProductList;
