// src/components/RecommendedProductSectionDesktop.tsx
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";

interface Product {
  id: number;
  title: string;
  imageUrl: string;
}

interface RecommendedProductSectionDesktopProps {
  ingredientName: string;
  purposes: string[];
  paginatedProducts: Product[];
  isLoading: boolean;
  goToIngredientPage: () => void;
  goToAllIngredientPage: () => void;
  currentPage: number;
  totalPages: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  navigate: ReturnType<typeof useNavigate>;
}

const RecommendedProductSectionDesktop = ({
  ingredientName,
  purposes,
  paginatedProducts,
  isLoading,
  goToIngredientPage,
  goToAllIngredientPage,
  currentPage,
  totalPages,
  handleNextPage,
  handlePrevPage,
  navigate,
}: RecommendedProductSectionDesktopProps) => {

  // 스켈레톤 카드 렌더링 함수
  const renderSkeletonCard = () => (
    <div className="flex flex-col items-center animate-pulse">
      <div className="bg-gray-200 rounded-xl shadow-lg w-full aspect-[192/160]"></div>
      <div className="bg-gray-200 rounded-full mt-[16px] w-3/4 h-[28px]"></div>
    </div>
  );

  // 로딩 상태에 따른 스켈레톤 렌더링 함수
  const renderSkeletons = (count: number) => (
    [...Array(count)].map((_, index) => (
      <div key={index} className="w-full">
        {renderSkeletonCard()}
      </div>
    ))
  );

  return (
    <>
      {/* 성분/태그 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[26px]">
          {isLoading ? (
            <div className="w-[200px] h-[46px] bg-gray-200 rounded-[13px] animate-pulse"></div>
          ) : (
            <button
              onClick={goToIngredientPage}
              className="px-[16px] py-[13px] bg-[#FFEB9D] rounded-[13px] text-[22px] h-[47px] font-semibold flex justify-center items-center cursor-pointer"
            >
              {ingredientName || "성분 없음"}
              <MdOutlineArrowForwardIos className="h-[24px] ml-[16px]" />
            </button>
          )}
          {isLoading ? (
            <div className="w-[250px] h-[42px] bg-gray-200 rounded-full animate-pulse"></div>
          ) : (
            <span className="text-[20px] flex items-center font-medium h-[42px]">#{purposes.join(", #")}</span>
          )}
        </div>

        {/* 전체보기 버튼 */}
        {isLoading ? (
          <div className="w-[74px] h-[20px] bg-gray-200 rounded-full animate-pulse"></div>
        ) : (
          <button
            onClick={goToAllIngredientPage}
            className="w-[74px] h-[20px] flex items-center justify-between cursor-pointer"
          >
            <span className="text-[16px] text-[#6B6B6B] font-medium">전체보기</span>
            <img
              src="/images/PNG/Purpose2/allarrow.png"
              alt="화살표"
              className="w-[8px] text-[#6B6B6B] object-contain"
            />
          </button>
        )}
      </div>

      {/* 카드 리스트 */}
      <div className="w-full mb-[70px] hide-scrollbar relative">
        <div className="grid grid-cols-4 gap-x-5 mt-[30px] transition-all duration-300">
          {isLoading ? (
            renderSkeletons(4)
          ) : paginatedProducts.length === 0 ? (
            <p className="text-center w-full mt-[80px]">제품이 없습니다.</p>
          ) : (
            paginatedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`, { state: product })}
                className="flex-shrink-0 flex flex-col items-center cursor-pointer"
              >
                <div className="w-full h-[160px] min-w-[100px] bg-white rounded-[16px] shadow-xl overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <p className="mt-[16px] h-[28px] text-[22px] font-medium text-center">
                  {product.title}
                </p>
              </div>
            ))
          )}
        </div>
        {/* ➤ 오른쪽 화살표 버튼 */}
        {currentPage < totalPages - 1 && (
          <button
            onClick={handleNextPage}
            className="absolute right-[-25px] top-[90px] z-10 w-[49px] h-[49px] bg-white rounded-full shadow flex items-center justify-center"
          >
            <MdOutlineArrowForwardIos className="text-[22px]" />
          </button>
        )}
        {/* ⬅ 왼쪽 화살표 버튼 */}
        {currentPage > 0 && (
          <button
            onClick={handlePrevPage}
            className="absolute left-[-25px] top-[90px] z-10 w-[49px] h-[49px] bg-white rounded-full shadow flex items-center justify-center"
          >
            <MdOutlineArrowBackIos className="text-[22px]" />
          </button>
        )}
      </div>
    </>
  );
};

export default RecommendedProductSectionDesktop;