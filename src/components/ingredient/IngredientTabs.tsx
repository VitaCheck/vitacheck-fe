import { useState, useEffect } from "react";

interface Props {
  activeTab: "info" | "alternatives" | "supplements";
  setActiveTab: (tab: "info" | "alternatives" | "supplements") => void;
}

const MOBILE_BP = 640;

const IngredientTabs = ({ activeTab, setActiveTab }: Props) => {
  const tabList: {
    key: "info" | "alternatives" | "supplements";
    label: string;
  }[] = [
    { key: "info", label: "정보" },
    { key: "alternatives", label: "대체 식품" },
    { key: "supplements", label: "영양제" },
  ];

  const [isMobile, setIsMobile] = useState<boolean>(
    window.innerWidth <= MOBILE_BP
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BP);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile ? (
    // 모바일 버전 (그대로)
    <div className="flex justify-around w-full text-center border-b border-gray-200">
      {tabList.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className="pb-2 font-semibold text-lg transition-all duration-200 relative"
        >
          <span
            className={activeTab === tab.key ? "text-black" : "text-gray-400"}
          >
            {tab.label}
          </span>
          {activeTab === tab.key && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-15 h-[2px] bg-black rounded-full" />
          )}
        </button>
      ))}
    </div>
  ) : (
    // PC 버전: 3개 탭이 화면 축소(간격/패딩/폰트만 점진 축소)
    <div
      className="
        inline-flex w-full flex-nowrap
        gap-[clamp(8px,1.6vw,15px)]
        border-b border-gray-300
        px-[clamp(8px,2vw,24px)]
        mb-8
      "
    >
      {tabList.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`
            flex-1 min-w-0               /* 세 탭을 균등 분배, 화면 줄면 함께 축소 */
            px-[clamp(12px,1.8vw,25px)]  /* 최대에선 기존 px-25, 축소 시 부드럽게 감소 */
            py-[clamp(8px,1.2vw,12px)]   /* 기존 py-3 상한 유지 */
            font-semibold text-[clamp(12px,0.95vw,14px)] /* 폰트도 살짝만 축소 */
            rounded-t-xl shadow-md border-gray-200
            ${
              activeTab === tab.key
                ? "bg-[#FFE17E] border-t-transparent border-l-transparent border-r-transparent"
                : "bg-white"
            }
          `}
        >
          <span className="block text-center whitespace-nowrap break-keep leading-tight">
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default IngredientTabs;
