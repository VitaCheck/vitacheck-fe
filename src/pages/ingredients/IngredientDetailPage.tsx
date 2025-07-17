import { useState, useEffect } from "react";
import IngredientTabs from "../../components/ingredient/IngredientTabs";
import IngredientInfo from "../../components/ingredient/IngredientInfo";
import IngredientAlternatives from "../../components/ingredient/IngredientAlternatives";
import IngredientSupplements from "../../components/ingredient/IngredientSupplements";
import IngredientDetailHeaderMobile from "../../components/ingredient/IngredientDetailHeaderMobile";

// 모바일 여부 판단용 훅
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
  const [activeTab, setActiveTab] = useState<"info" | "alternatives" | "supplements">("info");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    const headerEl = document.querySelector("header");
    if (headerEl instanceof HTMLElement) {
      headerEl.style.display = "none";
      headerEl.style.height = "0";
      headerEl.style.padding = "0";
      headerEl.style.margin = "0";
    }

    return () => {
      if (headerEl instanceof HTMLElement) {
        headerEl.style.display = "";
        headerEl.style.height = "";
        headerEl.style.padding = "";
        headerEl.style.margin = "";
      }

      document.body.style.marginTop = "";
      document.body.style.paddingTop = "";
      document.documentElement.style.scrollPaddingTop = "";
    };
  }, [isMobile]);

  return (
    <>
      {/* 모바일 전용 헤더 */}
      {isMobile && <IngredientDetailHeaderMobile title="유산균 살펴보기" />}

      <div
        className={`px-8 md:px-10 ${
          isMobile ? "pt-0 pb-5" : "py-10"
        } max-w-screen-xl mx-auto`}
        style={isMobile ? { marginTop: 5, paddingTop: 5 } : {}}
      >
<h1
  className={`text-2xl md:text-4xl font-bold mb-10 ${
    isMobile ? "pl-0 text-left" : "pl-20"
  }`}
>
  <span className="underline">유산균</span> 살펴보기
</h1>


        <div className="flex justify-center mb-6">
          <IngredientTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {activeTab === "info" && <IngredientInfo />}
        {activeTab === "alternatives" && <IngredientAlternatives />}
        {activeTab === "supplements" && <IngredientSupplements />}
      </div>
    </>
  );
};

export default IngredientDetailPage;
