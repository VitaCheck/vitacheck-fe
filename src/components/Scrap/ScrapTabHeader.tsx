interface ScrapTabHeaderProps {
  activeTab: "product" | "ingredient";
  onChange: (tab: "product" | "ingredient") => void;
}

const ScrapTabHeader = ({ activeTab, onChange }: ScrapTabHeaderProps) => {
  return (
    <div className="flex justify-around mt-4 mb-6 border-b border-gray-200">
      {["product", "ingredient"].map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab as "product" | "ingredient")}
          className={`pb-2 text-sm font-semibold text-[19px] cursor-pointer ${
            activeTab === tab
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
          }`}
        >
          {tab === "product" ? "찜한 제품" : "찜한 성분"}
        </button>
      ))}
    </div>
  );
};

export default ScrapTabHeader;
