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
          className="pb-2 font-semibold text-mb transition-all duration-200 relative"
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
    <div className="border-b border-gray-300 mb-8">
      {/* 탭 컨테이너: 최대 720px, 화면이 작아지면 60vw, 더 작으면 340px */}
      <div className="mx-auto h-13 w-[clamp(400px,90vw,800px)] flex gap-5 px-2">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
          flex-1 min-w-0
          px-[clamp(10px,1.2vw,20px)]
          py-[clamp(8px,1.0vw,12px)]
          font-semibold text-[clamp(13px,0.95vw,15px)]
          rounded-t-xl shadow-md border border-gray-200
          ${
            activeTab === tab.key
              ? "bg-[#FFE17E] border-b-transparent"
              : "bg-white"
          }
        `}
          >
            <span className="block text-center whitespace-nowrap leading-tight">
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IngredientTabs;
