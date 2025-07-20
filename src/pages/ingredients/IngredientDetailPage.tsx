import { useState, useEffect } from "react";
import IngredientTabs from "../../components/ingredient/IngredientTabs";
import IngredientInfo from "../../components/ingredient/IngredientInfo";
import IngredientAlternatives from "../../components/ingredient/IngredientAlternatives";
import IngredientSupplements from "../../components/ingredient/IngredientSupplements";
import { FiShare2, FiHeart } from "react-icons/fi";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const IngredientDetailPage = () => {
  const [activeTab, setActiveTab] = useState<
    "info" | "alternatives" | "supplements"
  >("info");
  const isMobile = useIsMobile();
  const [liked, setLiked] = useState(false);

  return (
    <div
      className={`px-5 md:px-10 ${isMobile ? "pt-3 pb-5" : "py-10"} max-w-screen-xl mx-auto`}
    >
      <div className="flex justify-between items-center mb-6 ml-5 md:ml-30">
        <h1 className="text-2xl font-bold">
          <span>유산균</span>
        </h1>
        <div className="flex space-x-3">
          <button
            className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center"
            aria-label="공유"
          >
            <FiShare2 className="text-gray-700" size={18} />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center"
            aria-label="좋아요"
          >
            <FiHeart
              className={liked ? "text-red-500 fill-red-500" : "text-pink-500"}
              size={18}
            />
          </button>
        </div>
      </div>

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
