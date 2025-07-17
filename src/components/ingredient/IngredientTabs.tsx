import { useState, useEffect } from "react";

interface Props {
  activeTab: "info" | "alternatives" | "supplements";
  setActiveTab: (tab: "info" | "alternatives" | "supplements") => void;
}

const IngredientTabs = ({ activeTab, setActiveTab }: Props) => {
  const tabList: { key: "info" | "alternatives" | "supplements"; label: string }[] = [
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
    //모바일 버전 스타일
    <div className="grid grid-cols-3 w-full text-center border-b border-gray-300">
      {tabList.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`py-3 font-semibold transition-colors duration-200 ${
            activeTab === tab.key
              ? "text-black border-b-2 border-gray-800"
              : "text-gray-400 border-b-2 border-transparent"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ) : (
    //PC 버전
<div className="inline-flex gap-15 border-b border-black px-6 mb-8">
  {tabList.map((tab) => (
    <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key)}
      className={`min-w-[96px] px-25 py-3 font-semibold text-sm rounded-t-xl shadow-md boder-gray-200 ${
        activeTab === tab.key ? "bg-[#FFE17E] border-t-transparent border-l-transparent border-r-transparent" : "bg-white"
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>


  );
};

export default IngredientTabs;
