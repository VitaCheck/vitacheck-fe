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
    /* 모바일 */
    <div className="w-full border-b border-gray-200 flex mb-10">
      {tabList.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className="relative pb-4 font-semibold text-base transition-all duration-200 flex-1"
        >
          <span
            className={activeTab === tab.key ? "text-black" : "text-gray-400"}
          >
            {tab.label}
          </span>
          {activeTab === tab.key && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[60px] h-[3px] bg-black rounded-full" />
          )}
        </button>
      ))}
    </div>
  ) : (
    /* PC */
    <div className="mb-8">
      {/* ▼ 보더를 내부 컨테이너로 이동, 좌우 패딩 제거 → 보더 길이 = 버튼 그룹 폭 */}
      <div className="w-full">
        <div className="flex h-13 gap-8 pb-0 border-b border-gray-300">
          {tabList.map((tab, index) => (
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
    </div>
  );
};

export default IngredientTabs;
