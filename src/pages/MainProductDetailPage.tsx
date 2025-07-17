import { useLocation } from "react-router-dom";
import { useState } from "react";
import MainDetailPageBrandSection from "../components/Purpose/MainDetailPageBrandSection";
import IngredientTab from "../components/Purpose/IngredientTab";
import TimingTab from "../components/Purpose/TimingTab";
import { GoShareAndroid } from "react-icons/go";
import { GoHeart, GoHeartFill } from "react-icons/go";

const ProductDetailPage = () => {
  const { state } = useLocation();
  const product = state;
  const [activeTab, setActiveTab] = useState<"ingredient" | "timing">("ingredient");
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => !prev);
  };

  if (!product) {
    return (
      <p className="mt-[122px] text-center text-red-500">
        ❗제품 정보를 불러올 수 없습니다.❗
      </p>
    );
  }

  return (
    <>
      {/* 모바일 전용 */}
      <div className="md:hidden">
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
      </div>



      {/* PC 전용 */}
      <div className="hidden md:block w-full bg-[#FAFAFA] pb-[187px]">
        <div className="max-w-[1280px] mx-auto pt-[168px]">
          {/* 제품 이미지, 브랜드명, 제품명 */}
          <div className="flex justify-start gap-[100px] items-end">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-[521px] h-[521px] rounded-[36.4px] shadow-lg object-cover"
            />
            <div className="flex flex-col gap-[216px]">
              <div className="flex justify-between items-end w-[556px]">
                <div className="flex flex-col gap-[6px]">
                  <h2 className="text-[30.4px] tracking-[-0.608px] text-[#757575] font-medium">
                    {product.brand || "브랜드"}
                  </h2>
                  <h1 className="text-[36.5px] tracking-[-0.73px] mt-[4px] font-bold">
                    {product.title}
                  </h1>
                </div>
                <button className="rounded-full flex justify-center items-center w-[72px] h-[72px]
                                  bg-white border-[#AAA] border-[0.5px]">
                  <GoShareAndroid className="w-[42px] h-[42px]" />
                </button>
              </div>
              <div className="flex items-center w-[556px] gap-[22px] mb-[6px]">
                <button
                  onClick={toggleLike}
                  className="w-[94px] h-[94px] bg-white flex justify-center items-center border-[#9C9A9A] border-[0.8px] rounded-[18px] cursor-pointer">
                    {liked ? (
                      <GoHeartFill className="w-[60px] h-[60px] text-[#FD657E]" />
                    ) : (
                      <GoHeart className="w-[60px] h-[60px] text-[#FD657E]" />
                    )}
                </button>
                <button className="bg-[#FFEB9D] w-[440px] h-[94px] rounded-[22px] text-[30px]">쿠팡 바로가기</button>
              </div>
            </div>
          </div>

          <div className="mt-[128px] bg-[#F3F3F3] w-[1280px] h-[6px]" />

          {/* 브랜드 제품 리스트 */}
          <div className="w-[1280px] mx-auto mt-[70px]">
            <div className="flex flex-col">
              <MainDetailPageBrandSection />
            </div>
          </div>

          {/* 탭 UI */}
          <div className="flex flex-col justify-end items-center w-full h-[120px] border-b-[#F3F3F3] border-b-[8px] mt-[160px]">
            <div className="flex justify-between w-[789px] relative">
              {[
                { key: "ingredient", label: "성분 함량" },
                { key: "timing", label: "섭취 시기" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "ingredient" | "timing")}
                  className={`relative text-[48px] tracking-[-0.96px] font-medium transition-colors pb-[22px] duration-300 ${
                    activeTab === tab.key ? "text-black" : "text-[#9C9A9A]"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute -bottom-[10px] left-[-20px] w-[214px] h-[10px] rounded-xl bg-black transition-all duration-300" />
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
      </div>
    </>
  );
};

export default ProductDetailPage;