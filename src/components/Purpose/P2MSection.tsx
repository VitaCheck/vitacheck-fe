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
  
  // ⭐️ 단어 경계까지 고려하도록 함수를 업데이트했습니다.
  const formatIngredientName = (name: string, maxLength: number = 12): string => {
    // 1. 이름이 이미 짧다면 그대로 반환
    if (name.length <= maxLength) {
      return name;
    }
    
    // 2. (1순위) 이름에 괄호 '(' 가 있는지 확인
    const parenIndex = name.indexOf('(');
    if (parenIndex > 0) { // 0보다 큰 경우에만 (괄호가 맨 앞에 오는 경우 제외)
      return name.substring(0, parenIndex) + "...";
    }
    
    // 3. (2순위) 괄호가 없을 경우, 단어 경계(띄어쓰기)를 찾음
    // maxLength까지의 문자열에서 마지막 띄어쓰기 위치를 찾음
    const lastSpaceIndex = name.substring(0, maxLength).lastIndexOf(' ');
    if (lastSpaceIndex > 0) {
      return name.substring(0, lastSpaceIndex) + "...";
    }
    
    // 4. (3순위) 괄호도, 띄어쓰기도 없으면 글자 수로 자름
    return name.substring(0, maxLength) + "...";
  };


  // 스켈레톤 카드 렌더링 함수
  const renderSkeletonCard = () => (
    <div className="flex-shrink-0 flex-col items-center animate-pulse w-[154px] h-[178px]">
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
            {/* 함수 사용법은 동일합니다 */}
            {formatIngredientName(ingredientName) || "성분 없음"}
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
      <div className="w-full overflow-x-auto hide-scrollbar">
        <div className="inline-flex gap-[24px] px-6 ml-4 mt-6 mb-5">
          {isLoading ? (
            renderSkeletons(4)
          ) : paginatedProducts.length === 0 ? (
            <p className="text-center w-full mt-[80px]">제품이 없습니다.</p>
          ) : (
            paginatedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`, { state: product })}
                className="w-[154px] flex-shrink-0 flex flex-col items-center cursor-pointer"
              >
                <div className="w-[154px] h-[140px] bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-[110px] h-[110px] mx-auto mt-[15px] object-cover"
                  />
                </div>
                <p className="mt-[12px] text-[17px] font-medium text-center">
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