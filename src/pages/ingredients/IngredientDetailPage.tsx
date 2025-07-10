import { useState } from "react";
import IngredientTabs from "../../components/ingredient/IngredientTabs";
import IngredientInfo from "../../components/ingredient/IngredientInfo";
import IngredientAlternatives from "../../components/ingredient/IngredientAlternatives";
import IngredientSupplements from "../../components/ingredient/IngredientSupplements";

const IngredientDetailPage = () => {
  const [activeTab, setActiveTab] = useState<"info" | "alternatives" | "supplements">("info");

  return (
    <div className="px-10 py-8 max-w-screen-xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">유산균 살펴보기</h1>

        <div className="flex justify-center mb-6">
      <IngredientTabs activeTab={activeTab} setActiveTab={setActiveTab} />
       </div>

      {activeTab === "info" && <IngredientInfo />}
      {activeTab === "alternatives" && <IngredientAlternatives />}
      {activeTab === "supplements" && <IngredientSupplements />}
    </div>
  );
};

export default IngredientDetailPage;
