import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 원본 axios 모듈 사용
import myAxiosInstance from "@/lib/axios"; // axios 인스턴스 이름 변경

// 목적 카드 데이터 타입 정의
type Purpose = {
  code: string;
  description: string;
  imageUrl?: string;
};

const PurposeCardList = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Purpose[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);

  // 페이지 새로고침 시 스크롤 위치를 상단으로 고정
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 이미지 맵: 실제 API 응답에 이미지가 없는 경우를 대비
  const imageMap: Record<string, string> = {
    EYE: "/images/VitaCheckPurpose/purpose1.png",
    BONE: "/images/VitaCheckPurpose/purpose2.png",
    SLEEP_STRESS: "/images/VitaCheckPurpose/purpose3.png",
    CHOLESTEROL: "/images/VitaCheckPurpose/purpose4.png",
    FAT: "/images/VitaCheckPurpose/purpose5.png",
    SKIN: "/images/VitaCheckPurpose/purpose6.png",
    TIRED: "/images/VitaCheckPurpose/purpose7.png",
    IMMUNE: "/images/VitaCheckPurpose/purpose8.png",
    DIGEST: "/images/VitaCheckPurpose/purpose9.png",
    ATHELETIC: "/images/VitaCheckPurpose/purpose10.png",
    CLIMACTERIC: "/images/VitaCheckPurpose/purpose11.png",
    TEETH: "/images/VitaCheckPurpose/purpose12.png",
    HAIR_NAIL: "/images/VitaCheckPurpose/purpose13.png",
    BLOOD_PRESS: "/images/VitaCheckPurpose/purpose14.png",
    NEUTRAL_FAT: "/images/VitaCheckPurpose/purpose15.png",
    ANEMIA: "/images/VitaCheckPurpose/purpose16.png",
    ANTIAGING: "/images/VitaCheckPurpose/purpose17.png",
    BRAIN: "/images/VitaCheckPurpose/purpose18.png",
    LIVER: "/images/VitaCheckPurpose/purpose19.png",
    BLOOD_CIRCULATION: "/images/VitaCheckPurpose/purpose20.png",
    GUT_HEALTH: "/images/VitaCheckPurpose/purpose21.png",
    RESPIRATORY_HEALTH: "/images/VitaCheckPurpose/purpose22.png",
    JOINT_HEALTH: "/images/VitaCheckPurpose/purpose23.png",
    PREGNANT_HEALTH: "/images/VitaCheckPurpose/purpose24.png",
    BLOOD_SUGAR: "/images/VitaCheckPurpose/purpose25.png",
    THYROID_HEALTH: "/images/VitaCheckPurpose/purpose26.png",
    WOMAN_HEALTH: "/images/VitaCheckPurpose/purpose27.png",
    MAN_HEALTH: "/images/VitaCheckPurpose/purpose28.png",
  };

  // API 호출 및 데이터 로딩 로직
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setIsLoading(true);

    myAxiosInstance // axios 인스턴스 사용
      .get("/api/v1/purposes", { signal })
      .then((res) => {
        const list = res.data.result;
        
        if (Array.isArray(list)) {
          const updatedList = list.map((item: Purpose) => ({
            ...item,
            imageUrl: item.imageUrl || imageMap[item.code],
          }));
          setCards(updatedList);
        } else {
          console.error("목적 리스트가 배열이 아닙니다:", list);
          setCards([]);
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) { // 원본 axios.isCancel 사용
          console.log('useEffect의 정리(cleanup) 함수가 실행되어 진행 중인 API 요청을 취소.');
        } else {
          console.error("목적 리스트 로드 실패:", err);
          setCards([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    
    return () => {
      controller.abort();
    };
  }, []);

  // 스크롤에 따라 카드 순차적으로 로딩하는 로직
  useEffect(() => {
    if (isLoading || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") as string);
            
            // 현재 보여줘야 하는 카드의 인덱스가 아니면 건너뜁니다.
            if (index !== loadingCount) return;

            // 100ms 지연 후 다음 카드를 보여줍니다.
            setTimeout(() => {
              // 모바일(3개씩)과 데스크톱(4개씩)의 로딩 단위를 통합
              const columnCount = window.innerWidth >= 768 ? 4 : 3;
              setLoadingCount(prev => prev + columnCount);
            }, 100);
          }
        });
      },
      {
        root: null, // viewport를 기준으로 관찰
        rootMargin: "0px",
        threshold: 0.1, // 10% 정도 보이면 관찰 시작
      }
    );

    const cardElements = document.querySelectorAll(".card-container");
    cardElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [isLoading, cards, loadingCount]);

  const toggleCard = (code: string) => {
    setSelectedIds((prev) =>
      prev.includes(code)
        ? prev.filter((v) => v !== code)
        : prev.length < 3
        ? [...prev, code]
        : prev
    );
  };

  const goToProductList = () => {
    navigate("/products", {
      state: {
        selectedDescriptions: cards
          .filter((card) => selectedIds.includes(card.code))
          .map((card) => card.description),
        selectedCodes: selectedIds,
      },
    });
  };

  // 실제 카드 UI 렌더링 함수
  const renderCard = (card: Purpose, isSelected: boolean) => (
    <div
      onClick={() => toggleCard(card.code)}
      className="w-full flex flex-col items-center cursor-pointer"
    >
      <div
        className={`w-full aspect-[110/118] sm:w-full sm:aspect-[172/160] flex justify-center items-center
          rounded-xl shadow-sm relative sm:rounded-[14px] sm:shadow-[1px_2px_8.2px_0px_rgba(0,0,0,0.16)]
          ${isSelected ? "bg-[#FFF8DC] border-1 border-[#FFEB9D]" : "bg-white border-1 border-transparent"}`}
      >
        <div
          className={`w-3/5 h-4/5 relative`}
        >
          <img
            src={card.imageUrl || imageMap[card.code] || "/images/default.png"}
            alt={card.description}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <p className="mt-[18px] h-[22px] text-sm md:text-[20px] text-center font-semibold">
        {card.description}
      </p>
    </div>  
  );

  // 스켈레톤 UI 렌더링 함수 (깜빡이는 효과 포함)
  const renderSkeletonCard = () => (
    <div className="w-full sm:w-full flex flex-col items-center animate-pulse">
      <div className="w-full aspect-[110/118] sm:aspect-[172/160] rounded-xl shadow-md relative sm:rounded-[14px] bg-gray-200"></div>
      <div className="mt-[18px] h-[22px] w-2/3 bg-gray-200 rounded-full sm:mt-[22px] sm:h-[28px]"></div>
    </div>
  );

  // 모바일과 데스크톱 뷰를 위한 공통 렌더링 로직
  const renderCardList = () => {

    return (
      (isLoading || loadingCount < cards.length)
        ? Array.from({ length: cards.length }).map((_, index) => (
            <div key={index} data-index={index} className="card-container">
              {index < loadingCount
                ? renderCard(cards[index], selectedIds.includes(cards[index].code))
                : renderSkeletonCard()}
            </div>
          ))
        : cards.map((card) => (
            <div key={card.code}>
              {renderCard(card, selectedIds.includes(card.code))}
            </div>
          ))
    );
  };

  return (
    <>
      {/* 모바일 */}
      <div className="sm:hidden w-full px-[20px] mx-auto mt-[50px] mb-[124px]">
        <div className="flex flex-col ml-[20px]">
          <h1 className="text-[35px] tracking-[-0.72px] font-medium">목적별</h1>
          <h2 className="text-sm text-[#808080] mt-[1px] font-medium">최대 3개 선택</h2>
        </div>
        <div className="mt-[33px] px-[15px] grid grid-cols-3 gap-x-[20px] gap-y-[46px]">
          {renderCardList()}
        </div>
        <div className="fixed bottom-0 left-0 right-0 h-[76px] bg-white z-10" />
        <button
          onClick={goToProductList}
          disabled={selectedIds.length === 0}
          className={`fixed bottom-[42px] left-[20px] right-[20px] h-[68px] rounded-4xl z-50 transition-all duration-200
            flex justify-center items-center ${
              selectedIds.length === 0 ? "bg-[#EEEEEE] cursor-not-allowed" : "bg-[#FFEB9D]"
            }`}
        >
          <span className="text-black text-xl font-semibold">
            영양제 확인하기
          </span>
          <img
            src="/images/PNG/PurposeObject/arrowforward.png"
            alt="화살표"
            className="h-[22px] object-contain absolute right-[20px]"
          />
        </button>
      </div>

      {/* 데스크탑 */}
      <div className="hidden sm:block w-full bg-[#FAFAFA] px-[20px]">
        <div className="w-full pt-[70px] pb-[100px]">
          <div className="max-w-[766px] mx-auto mb-[3px]">
            <div className="flex justify-between items-center">
              <h1 className="text-[30px] tracking-[-1px] font-semibold">목적별</h1>
              <button
                onClick={goToProductList}
                disabled={selectedIds.length === 0}
                className={`w-[142px] h-[46px] rounded-full text-[18px] tracking-[0.8px] font-semibold flex justify-center items-center transition ${
                  selectedIds.length === 0 ? "bg-[#EEEEEE] cursor-not-allowed" : "bg-[#FFEB9D]"
                }`}
              >
                영양제 확인
              </button>
            </div>
            <h2 className="text-[16px] font-medium text-[#808080]">최대 3개 선택</h2>
          </div>

          <div className="grid grid-cols-4 items-center gap-x-[26px] gap-y-[46px] mt-[40px] max-w-[766px] mx-auto">
            {renderCardList()}
          </div>
        </div>
      </div>
    </>
  );
};

export default PurposeCardList;