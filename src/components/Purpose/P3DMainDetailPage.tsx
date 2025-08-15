// product/:id
import React from "react";
import { useNavigate } from "react-router-dom";
import { GoShareAndroid, GoHeart, GoHeartFill } from "react-icons/go";
import MainDetailPageBrandSection from "./P3BrandSection";
import IngredientTab from "./P3IngredientTab";
import TimingTab from "./P3TimingTab";

interface DesktopProps {
  product: any;
  liked: boolean;
  toggleLike: () => void;
  activeTab: "ingredient" | "timing";
  setActiveTab: (tab: "ingredient" | "timing") => void;
  brandProducts: any[];
  brandId: number;
  intakeTime: string;
  onCopyUrl: () => void;
}

const MainDetailPageDesktop: React.FC<DesktopProps> = ({
  product,
  liked,
  toggleLike,
  activeTab,
  setActiveTab,
  brandProducts,
  onCopyUrl, // ✨ prop으로 받아서 사용
}) => {
  const navigate = useNavigate();

  // 알람 등록 버튼 클릭 핸들러
  const handleRegisterAlarm = () => {
    const id = product?.supplementId ?? product?.id;
    if (!id) {
      console.error("supplementId 없음");
      return;
    }
    const q = new URLSearchParams({ supplementId: String(id) });
    navigate(`/alarm/settings/add/search?${q.toString()}`);
  };

  return (
    <div className="hidden sm:block w-full bg-[#FAFAFA] px-[50px]">
      <div className="max-w-[766px] mx-auto mb-[3px] pt-[70px] pb-[100px]">
        {/* 제품 이미지 + 브랜드명/제품명 */}
        <div className="flex justify-between gap-6">
          {/* 제품 이미지 */}
          <div className="w-full max-w-[344px] aspect-square rounded-[25px] shadow-lg overflow-hidden">
            <img
              src={product.supplementImageUrl}
              alt={product.supplementName}
              className="w-full h-full object-contain"
            />
          </div>

          {/* 브랜드명, 제품명 */}
          <div className="flex flex-col w-full max-w-[367px] pt-[80px] justify-between">
            <div>
              <div className="flex items-end">
                <div className="flex flex-col">
                  <h2 className="text-[21px] tracking-[-0.4px] text-[#757575] font-medium">
                    {product.brandName || "브랜드"}
                  </h2>
                  <h1 className="text-[25px] tracking-[-0.5px] mt-[2px] mr-[10px] font-bold">
                    {product.supplementName}
                  </h1>
                </div>

                {/* 공유 & 찜 버튼 */}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={onCopyUrl}
                    className="rounded-full flex justify-center items-center w-[48px] h-[48px] bg-white border-[#AAA] border-[0.3px]"
                  >
                    <GoShareAndroid className="w-[28px] h-[28px]" />
                  </button>
                  <button
                    onClick={toggleLike}
                    className="rounded-full flex justify-center items-center w-[48px] h-[48px] border-[#AAA] border-[0.3px]"
                  >
                    {liked ? (
                      <GoHeartFill className="w-[30px] h-[30px] text-[#FD657E]" />
                    ) : (
                      <GoHeart className="w-[30px] h-[30px] text-[#FD657E]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-[14px] mb-[26px]">
                <button className="border-[#9C9A9A] border-[0.6px] flex-1 min-w-[140px] h-[62px] rounded-[14px] text-[20px] font-medium">
                  쿠팡 바로가기
                </button>
                <button
                  onClick={handleRegisterAlarm}
                  className="bg-[#FFEB9D] flex-1 min-w-[140px] h-[62px] rounded-[14px] text-[20px] font-medium"
                >
                  섭취알림 등록
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[84px] bg-[#F3F3F3] w-full h-[4px]" />

        {/* 브랜드 제품 리스트 */}
        <div className="w-full mx-auto mt-[27px]">
          <div className="flex flex-col">
            <MainDetailPageBrandSection
              brandName={product.brandName}
              brandImageUrl={product.brandImageUrl}
              brandProducts={brandProducts}
              brandId={product.brandId ?? product.supplementId}
            />
          </div>
        </div>

        {/* 탭 UI */}
        <div
          className="flex flex-col justify-end items-center
                                     w-full h-[80px] border-b-[#F3F3F3] border-b-[4px]"
        >
          <div className="flex justify-between w-[502.7px] relative">
            {[
              { key: "ingredient", label: "성분 함량" },
              { key: "timing", label: "섭취 방법" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "ingredient" | "timing")}
                className={`relative text-[22px] tracking-[-0.42px] font-medium transition-colors pb-[10px] duration-300 ${
                  activeTab === tab.key ? "text-black" : "text-[#9C9A9A]"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute -bottom-[5px] left-[-13px] w-[105px] h-[6.5px] rounded-xl bg-black transition-all duration-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 탭 내용 */}
        <div className="flex flex-col items-center mx-auto mt-[16px] text-[10px] leading-relaxed">
          {activeTab === "ingredient" ? <IngredientTab /> : <TimingTab intakeTime={product.intakeTime} />}
        </div>
      </div>
    </div>
  );
};

export default MainDetailPageDesktop;
