import React, { useState } from 'react';
import ShareLinkPopup from './3MShareLinkPopup';
import { useNavigate } from "react-router-dom";
import { GoShareAndroid, GoHeart, GoHeartFill } from "react-icons/go";
import MainDetailPageBrandSection from "./3MainDetailPageBrandSection"; // 경로는 실제 파일 위치에 맞게 조정하세요.
import IngredientTab from "./3IngredientTab"; // 경로는 실제 파일 위치에 맞게 조정하세요.
import TimingTab from "./3TimingTab"; // 경로는 실제 파일 위치에 맞게 조정하세요.
interface MobileProps {
  product: any; // 실제 product 타입으로 변경하는 것이 좋습니다.
  liked: boolean;
  toggleLike: () => void;
  activeTab: "ingredient" | "timing";
  setActiveTab: (tab: "ingredient" | "timing") => void;
  showButton: boolean;
  brandProducts: any[];
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

    // 공유 팝업의 열림/닫힘 상태를 관리하는 state
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);

  // 공유 팝업을 열기 위한 함수
  const handleSharePopupOpen = () => {
    setIsSharePopupOpen(true);
  };

  // 공유 팝업을 닫기 위한 함수
  const handleSharePopupClose = () => {
    setIsSharePopupOpen(false);
  };

  // 현재 페이지의 URL을 공유 링크로 사용
  const currentUrl = window.location.href;


  return (
    <div className="md:hidden flex flex-col">
      <div className="mx-auto mt-[70px] mb-[24px] flex flex-col items-center">
        {/* 제품 이미지, 브랜드명, 제품명 */}
        <div className="flex flex-col w-[338px] mx-[46px]">
          <div className="relative w-[338px] h-[338px]">
            <img
              src={product.supplementImageUrl}
              alt={product.supplementName}
              className="w-full h-full rounded-[28px] shadow-lg object-cover"
            />
            <div className="absolute bottom-[19px] right-[23px] flex gap-[7px]">
              <button
                onClick={handleSharePopupOpen}
                className="w-[32px] h-[32px] flex items-center justify-center">
                <GoShareAndroid className="w-[26px] h-[26px] cursor-pointer text-black" />
              </button>
              <button
                onClick={toggleLike}
                className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer"
              >
                {liked ? (
                  <GoHeartFill className="w-[26px] h-[26px] text-[#FD657E]" />
                ) : (
                  <GoHeart className="w-[26px] h-[26px] text-[#FD657E]" />
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

        <div
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-[430px] h-[103px] bg-white z-10
            transition-all duration-300 ease-in-out
            ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
          `}
        />
        <button
          onClick={() => navigate("/alarm")}
          className={`fixed bottom-[31px] left-1/2 -translate-x-1/2 w-[366px] h-[58px] rounded-[71px] z-50
            transition-all duration-300 ease-in-out flex justify-center items-center
            bg-[#FFEB9D] text-black text-[20px] font-medium
            ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
          `}
        >
          섭취알림 등록하기
        </button>

        {/* 상세정보 / 쿠팡 바로가기 */}
        <div className="flex justify-center mx-auto w-[320px] h-[46px] mt-[12px] gap-x-[12px]">
          <div className="w-[154px] h-[46px] rounded-[30px] bg-[#F2F2F2] flex items-center justify-center font-medium text-[15px] tracking-[-0.3px]">
            상세정보
          </div>
          <div className="w-[154px] h-[46px] rounded-[30px] bg-[#FFEB9D] flex items-center justify-center font-medium text-[15px] tracking-[-0.3px]">
            쿠팡 바로가기
          </div>
        </div>
      </div>
      
      {/* 회색 선 (수정된 부분) */}
      <div className="mt-[24px] bg-[#F3F3F3] w-full h-[4px]" />

      {/* 브랜드 제품 리스트 */}
      <div className="w-full mx-auto mt-[28px]">
        <div className="flex flex-col items-center ml-[46px]">
          <MainDetailPageBrandSection
            brandName={product.brandName}
            brandImageUrl={product.brandImageUrl}
            brandProducts={brandProducts}
          />
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
      <div className="mt-[24px] px-[24px] text-[16px] leading-relaxed mb-[120px]">
        {activeTab === "ingredient" ? <IngredientTab /> : <TimingTab />}
      </div>

      {isSharePopupOpen && (
        <ShareLinkPopup
          onClose={handleSharePopupClose}
          supplementUrl={currentUrl}
        />
      )}
    </div>
  );
};

export default MainDetailPageMobile;