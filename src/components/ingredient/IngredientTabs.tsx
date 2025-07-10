interface Props {
  activeTab: "info" | "alternatives" | "supplements";
  setActiveTab: (tab: "info" | "alternatives" | "supplements") => void;
}

const IngredientTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="flex mb-6 border-gray-200">
      {["info", "alternatives", "supplements"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as any)}
          className={`px-40 py-2 font-medium rounded-t-xl font-semibold border-b-[1.5px] ${
            activeTab === tab
              ? "bg-[#FFE17E] text-black"
              : "bg-white text-black border-b border-black"
          }`}
        >
          {tab === "info" && "정보"}
          {tab === "alternatives" && "대체 식품"}
          {tab === "supplements" && "영양제"}
        </button>
      ))}
    </div>
  );
};

export default IngredientTabs;
