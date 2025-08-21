// src/components/Purpose/P3DMainDetailPageMobile.tsx
import React, { useState, useRef } from "react";
import ShareLinkPopup from "./P3MShareLinkPopup";
import { useNavigate } from "react-router-dom";
import { GoShareAndroid, GoHeart, GoHeartFill } from "react-icons/go";
import MainDetailPageBrandSection from "./P3BrandSection";
import IngredientTab from "./P3IngredientTab";
import TimingTab from "./P3TimingTab";
import AlarmAddToSearchModal from "@/pages/alarm/AlarmAddToSearchModal";

interface MobileProps {
  product: any;
  liked: boolean;
  toggleLike: () => void;
  activeTab: "ingredient" | "timing";
  setActiveTab: (tab: "ingredient" | "timing") => void;
  showButton: boolean;
  brandProducts: any[];
  brandId: number;
  intakeTime: string;
}

const MainDetailPageMobile: React.FC<MobileProps> = ({
  product,
  liked,
  toggleLike,
  activeTab,
  setActiveTab,
  showButton,
  brandProducts,
}) => {
  const navigate = useNavigate();

  // 공유 팝업 상태
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const handleSharePopupOpen = () => setIsSharePopupOpen(true);
  const handleSharePopupClose = () => setIsSharePopupOpen(false);
  const currentUrl = window.location.href;

  // IngredientTab 스크롤용 ref
  const ingredientTabRef = useRef<HTMLDivElement>(null);
  const scrollToIngredientTab = () => {
    ingredientTabRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTab("ingredient"); // 클릭 시 탭도 활성화
  };

  // 알람 모달 상태
  const [openAlarmModal, setOpenAlarmModal] = useState(false);

  // API에서 받아온 첫 번째 성분 이름
  const [firstNutrientName, setFirstNutrientName] = useState("");

  return (
    <div className="sm:hidden flex flex-col">
      <div className="mx-auto mt-[70px] mb-[24px] flex flex-col items-center">
        {/* 제품 이미지, 브랜드명, 제품명 */}
        <div className="flex flex-col w-full max-w-[338px] mx-[46px]">
          <div className="relative w-full max-w-[338px] h-[338px]">
            <img
              src={product.supplementImageUrl}
              alt={product.supplementName}
              className="w-full h-full rounded-[28px] shadow-lg object-cover"
            />
            <div className="absolute bottom-[19px] right-[23px] flex gap-[7px]">
              <button
                onClick={handleSharePopupOpen}
                className="w-[32px] h-[32px] flex items-center justify-center border-[#AAAAAA] border-1 bg-white rounded-full"
              >
                <GoShareAndroid className="w-[20px] h-[20px] cursor-pointer text-black" />
              </button>
              <button
                onClick={toggleLike}
                className="w-[32px] h-[32px] flex items-center justify-center border-[#AAAAAA] border-1 bg-white rounded-full cursor-pointer"
              >
                {liked ? (
                  <GoHeartFill className="w-[20px] h-[20px] text-[#FD657E]" />
                ) : (
                  <GoHeart className="w-[20px] h-[20px] text-[#FD657E]" />
                )}
              </button>
            </div>
          </div>
          <div className="mt-[21px] px-[5px] py-[10px]">
            <h2 className="text-[20px] tracking-[-0.4px] text-[#757575] font-medium">
              {product.brandName || "브랜드"}
            </h2>
            <h1 className="text-[24px] tracking-[-0.48px] mt-[4px] font-bold">
              {product.supplementName}
            </h1>
          </div>
        </div>

        {/* 섭취알림 버튼 */}
        <div
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[103px] bg-white z-10
            transition-all duration-300 ease-in-out
            ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
        />
        <button
          onClick={() => setOpenAlarmModal(true)}
          className={`fixed bottom-[31px] left-1/2 -translate-x-1/2 w-full max-w-[366px] h-[58px] rounded-[71px] z-50
                      transition-all duration-300 ease-in-out flex justify-center items-center
                      bg-[#FFEB9D] text-black text-[20px] font-medium
                      ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
        >
          섭취 알림 등록하기
        </button>
        <AlarmAddToSearchModal
          open={openAlarmModal}
          onClose={() => setOpenAlarmModal(false)}
          supplementId={product.supplementId ?? product.id}
          supplementName={product.supplementName}
          supplementImageUrl={product.supplementImageUrl}
        />

        {/* 상세정보 / 쿠팡 바로가기 */}
        <div className="flex justify-center mx-auto w-full max-w-[320px] h-[46px] mt-[12px] gap-x-[12px]">
          <div
            onClick={scrollToIngredientTab}
            className="w-full max-w-[154px] h-[46px] rounded-[30px] bg-[#F2F2F2] flex items-center justify-center font-medium text-[15px] tracking-[-0.3px] cursor-pointer"
          >
            상세정보
          </div>
          {product.coupangLink && (
            <a
              href={product.coupangLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[154px]"
            >
              <div className="h-[46px] rounded-[30px] bg-[#FFEB9D] flex items-center justify-center font-medium text-[15px] tracking-[-0.3px] cursor-pointer">
                쿠팡 바로가기
              </div>
            </a>
          )}
        </div>
      </div>

      {/* 회색 선 */}
      <div className="mt-[24px] bg-[#F3F3F3] w-full h-[4px]" />

      {/* 브랜드 제품 리스트 */}
      <div className="w-full mx-auto mt-[28px]">
        <div className="flex flex-col items-center">
          <MainDetailPageBrandSection
            brandName={product.brandName}
            brandImageUrl={product.brandImageUrl}
            brandProducts={brandProducts}
            brandId={product.brandId ?? product.supplementId}
          />
        </div>
      </div>

      {/* 탭 UI */}
      <div className="flex flex-col items-center w-full border-b-[#F3F3F3] border-b-[4px] gap-[6px]">
        <div className="flex justify-between w-full max-w-[265px] relative">
          {[
            { key: "ingredient", label: "성분 함량" },
            { key: "timing", label: "섭취 방법" },
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
      <div className="mt-[24px] px-[24px] text-[16px] leading-relaxed mb-[120px]">
        {activeTab === "ingredient" ? (
          <div ref={ingredientTabRef}>
            <IngredientTab
              supplementId={product.id}
              onFirstNutrientChange={setFirstNutrientName}
            />
          </div>
        ) : (
          <TimingTab
            intakeTime={product.intakeTime}
            ingredientName={firstNutrientName}
          />
        )}
      </div>

      {/* 공유 팝업 */}
      {isSharePopupOpen && (
        <ShareLinkPopup onClose={handleSharePopupClose} supplementUrl={currentUrl} />
      )}
    </div>
  );
};

export default MainDetailPageMobile;
