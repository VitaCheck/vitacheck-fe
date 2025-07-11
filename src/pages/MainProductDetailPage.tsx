import { useLocation } from "react-router-dom";
import { useState } from "react";
import MainDetailPageBrandSection from "../components/MainDetailPageBrandSection";
import IngredientTab from "../components/IngredientTab";
import TimingTab from "../components/TimingTab";

const ProductDetailPage = () => {
  const { state } = useLocation();
  const product = state;
  const [activeTab, setActiveTab] = useState<"ingredient" | "timing">("ingredient");

  if (!product) {
    return (
      <p className="mt-[122px] text-center text-red-500">
        ❗제품 정보를 불러올 수 없습니다.
      </p>
    );
  }

  return (
    <div className="w-[430px] mx-auto mt-[122px] mb-[150px]">
      {/* 제품 이미지, 브랜드명, 제품명 */}
      <div className="flex flex-col w-[338px] h-[427px] mx-[46px]">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-[338px] h-[338px] rounded-[28px] shadow-lg object-cover"
        />
        <div className="mt-[21px] px-[5px] py-[10px]">
          <h2 className="text-[20px] tracking-[-0.4px] text-[#757575] font-medium">
            {product.brand || "브랜드"}
          </h2>
          <h1 className="text-[24px] tracking-[-0.48px] mt-[4px] font-bold">
            {product.title}
          </h1>
        </div>
      </div>

      {/* 상세정보 / 쿠팡 바로가기 */}
      <div className="flex justify-center mx-auto w-[320px] h-[46px] mt-[12px] gap-x-[12px]">
        <div className="w-[154px] h-[46px] rounded-[30px] bg-[#F2F2F2] flex items-center justify-center font-medium text-[15px] tracking-[-0.3px]">
          상세정보
        </div>
        <div className="w-[154px] h-[46px] rounded-[30px] bg-[#FFEB9D] flex items-center justify-center font-medium text-[15px] tracking-[-0.3px]">
          쿠팡 바로가기
        </div>
      </div>

      <div className="mt-[24px] bg-[#F3F3F3] w-[430px] h-[4px]" />

      {/* 브랜드 제품 리스트 */}
      <div className="w-[430px] mx-auto mt-[28px]">
        <div className="flex flex-col ml-[46px]">
          <MainDetailPageBrandSection />
        </div>
      </div>

      {/* 탭 UI */}
      <div className="flex flex-col items-center w-full border-b-[#F3F3F3] border-b-[4px] mt-[47px] gap-[6px]">
        <div className="flex justify-between w-[265px] relative">
          {[
            { key: "ingredient", label: "성분 함량" },
            { key: "timing", label: "섭취 시기" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "ingredient" | "timing")}
              className={`relative text-[19px] tracking-[-0.38px] font-medium transition-colors duration-300 ${
                activeTab === tab.key ? "text-black" : "text-[#9C9A9A]"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute -bottom-[6px] left-0 w-full mb-[2px] h-[4px] rounded-xl bg-black transition-all duration-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 내용 */}
      <div className="mt-[24px] px-[24px] text-[16px] leading-relaxed">
        {activeTab === "ingredient" ? <IngredientTab /> : <TimingTab />}
      </div>
    </div>
  );
};

export default ProductDetailPage;