// src/components/RecommendedProductSectionMobile.tsx
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";

interface Product {
  id: number;
  title: string;
  imageUrl: string;
}

interface RecommendedProductSectionMobileProps {
  ingredientName: string;
  purposes: string[];
  paginatedProducts: Product[];
  isLoading: boolean;
  goToIngredientPage: () => void;
  goToAllIngredientPage: () => void;
  navigate: ReturnType<typeof useNavigate>;
}

const RecommendedProductSectionMobile = ({
  ingredientName,
  purposes,
  paginatedProducts,
  isLoading,
  goToIngredientPage,
  goToAllIngredientPage,
  navigate,
}: RecommendedProductSectionMobileProps) => {

  // 스켈레톤 카드 렌더링 함수
  const renderSkeletonCard = () => (
    <div className="flex-shrink-0 flex flex-col items-center animate-pulse w-[154px] h-[178px]">
      <div className="bg-gray-200 rounded-xl shadow-lg w-[154px] h-[140px]"></div>
      <div className="bg-gray-200 rounded-full mt-[16px] w-2/3 h-[20px]"></div>
    </div>
  );

  // 로딩 상태에 따른 스켈레톤 렌더링 함수
  const renderSkeletons = (count: number) => (
    [...Array(count)].map((_, index) => (
      <div key={index}>
        {renderSkeletonCard()}
      </div>
    ))
  );
  
  return (
    <>
      {/* 성분/태그 */}
      <div className="flex items-center gap-[18px] ml-[38px]">
        {isLoading ? (
          <div className="w-[120px] h-[34px] bg-gray-200 rounded-[10px] animate-pulse"></div>
        ) : (
          <button
            onClick={goToIngredientPage}
            className="px-[13px] py-[5px] bg-[#FFEB9D] rounded-[10px] text-[18px] font-medium flex justify-center items-center cursor-pointer"
          >
            {ingredientName || "성분 없음"}
            <MdOutlineArrowForwardIos className="h-[12px] ml-[12px]" />
          </button>
        )}
        {isLoading ? (
          <div className="w-[100px] h-[18px] bg-gray-200 rounded-full animate-pulse"></div>
        ) : (
          <span className="text-[15px] flex items-center font-medium h-[18px]">#{purposes.join(", #")}</span>
        )}
      </div>

      {/* 카드 리스트 */}
      <div className="w-full h-[224px] overflow-x-scroll hide-scrollbar mx-auto ml-[6px]">
        <div className="flex gap-[24px] px-[38px] mt-[24px] mb-[22px]">
          {isLoading ? (
            renderSkeletons(4)
          ) : paginatedProducts.length === 0 ? (
            <p className="text-center w-full mt-[80px]">제품이 없습니다.</p>
          ) : (
            paginatedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`, { state: product })}
                className="w-[154px] h-[178px] flex-shrink-0 flex flex-col items-center cursor-pointer"
              >
                <div className="w-[154px] h-[140px] bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-[110px] h-[110px] mx-auto mt-[15px] object-cover"
                  />
                </div>
                <p className="mt-[18px] h-[20px] text-[17px] font-medium text-center">
                  {product.title}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 전체보기 버튼 */}
      <div className="flex items-center justify-center mb-[18px] w-full">
        {isLoading ? (
          <div className="w-[370px] h-[25px] bg-gray-200 rounded-full animate-pulse"></div>
        ) : (
          <button
            onClick={goToAllIngredientPage}
            className="w-full mx-[30px] h-[25px] border-b border-[#B2B2B2] flex items-center justify-center cursor-pointer"
          >
            <span className="text-[13px] font-medium leading-none">전체보기</span>
            <MdOutlineArrowForwardIos className="w-[11px] ml-[10px]" />
          </button>
        )}
      </div>
    </>
  );
};

export default RecommendedProductSectionMobile;