import { useState, useEffect } from "react";

interface Props {
  activeTab: "info" | "alternatives" | "supplements";
  setActiveTab: (tab: "info" | "alternatives" | "supplements") => void;
}

const IngredientTabs = ({ activeTab, setActiveTab }: Props) => {
  const tabList: {
    key: "info" | "alternatives" | "supplements";
    label: string;
  }[] = [
    { key: "info", label: "정보" },
    { key: "alternatives", label: "대체 식품" },
    { key: "supplements", label: "영양제" },
  ];

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    //모바일 버전
    <div className="flex justify-around w-full text-center border-b border-gray-200">
      {tabList.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`pb-2 font-semibold text-lg transition-all duration-200 relative`}
        >
          <span
            className={`inline-block ${
              activeTab === tab.key ? "text-black" : "text-gray-400"
            }`}
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
    //pc 버전
    <div className="inline-flex gap-15 border-b border-black px-6 mb-8">
      {tabList.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`min-w-[96px] px-25 py-3 font-semibold text-sm rounded-t-xl shadow-md boder-gray-200 ${
            activeTab === tab.key
              ? "bg-[#FFE17E] border-t-transparent border-l-transparent border-r-transparent"
              : "bg-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default IngredientTabs;
