import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";

// 부모로부터 받는 props 타입 정의
interface RecommendedProductSectionProps {
  ingredientName: string;
  purposes: string[];
  supplements: [string, string][];
  isLoading: boolean;
}

interface Product {
  id: number;
  title: string;
  imageUrl: string;
}

const RecommendedProductSection = ({
  ingredientName,
  purposes,
  supplements,
  isLoading,
}: RecommendedProductSectionProps) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const maxItems = 16;

  // props로 받은 supplements 데이터가 변경될 때만 products 상태를 업데이트합니다.
  useEffect(() => {
    if (supplements) {
      const mappedProducts: Product[] = supplements.map(
        (item: [string, string], idx: number) => ({
          id: idx + 1,
          title: item[0],
          imageUrl: `/images/${item[1]}`,
        })
      );
      setProducts(mappedProducts.slice(0, maxItems));
      setCurrentPage(0);
    }
  }, [supplements]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const goToIngredientPage = () => {
    if (!ingredientName) return;
    navigate(`/ingredients/${encodeURIComponent(ingredientName)}`);
  };

  const goToAllIngredientPage = () => {
    if (!ingredientName) return;
    navigate(`/ingredientproducts?ingredient=${encodeURIComponent(ingredientName)}`);
  };

  // 스켈레톤 카드
  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="w-[154px] h-[178px] bg-gray-200 rounded-xl animate-pulse"
      />
    ));

  return (
    <>
      {/* 모바일 전용 */}
      <div className="md:hidden">
        {/* 성분/태그 */}
        <div className="flex items-center gap-[18px] ml-[38px]">
          <button
            onClick={goToIngredientPage}
            className="px-[13px] py-[5px] bg-[#FFEB9D] rounded-[10px] text-[18px] font-medium flex justify-center items-center cursor-pointer"
          >
            {ingredientName || "성분 없음"}
            <MdOutlineArrowForwardIos className="h-[12px] ml-[12px]" />
          </button>
          {/* props로 받은 purposes 사용 */}
          <span className="text-[15px] flex items-center font-medium h-[18px]">#{purposes.join(", #")}</span>
        </div>

        {/* 카드 리스트 */}
        <div className="w-[430px] h-[224px] overflow-x-scroll hide-scrollbar mx-auto ml-[6px]">
          <div className="flex gap-[24px] px-[38px] mt-[24px] mb-[22px]">
            {isLoading
              ? renderSkeletons(4)
              : paginatedProducts.length === 0
              ? (
                  <p className="text-center w-full mt-[80px]">제품이 없습니다.</p>
                )
              : paginatedProducts.map((product) => (
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
                ))}
          </div>
        </div>

        {/* 전체보기 버튼 */}
        <div className="flex items-center justify-center mb-[18px] mx-auto w-[430px]">
          <button
            onClick={goToAllIngredientPage}
            className="w-[370px] h-[25px] border-b border-[#B2B2B2] flex items-center justify-center cursor-pointer"
          >
            <span className="text-[13px] font-medium leading-none">전체보기</span>
            <MdOutlineArrowForwardIos className="w-[11px] ml-[10px]" />
          </button>
        </div>
      </div>

      {/* PC 전용 */}
      <div className="hidden md:block">
        {/* 성분/태그 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[26px]">
            <button
              onClick={goToIngredientPage}
              className="px-[16px] py-[13px] bg-[#FFEB9D] rounded-[13px] text-[22px] h-[46px] font-semibold flex justify-center items-center cursor-pointer"
            >
              {ingredientName || "성분 없음"}
              <MdOutlineArrowForwardIos className="h-[24px] ml-[16px]" />
            </button>
            <span className="text-[20px] flex items-center font-medium h-[42px]">#{purposes.join(", #")}</span>
          </div>

          {/* 전체보기 버튼 */}
          <button
            onClick={goToAllIngredientPage}
            className="w-[72px] h-[20px] flex items-center justify-between cursor-pointer"
          >
            <span className="text-[16px] text-[#6B6B6B] font-medium">전체보기</span>
            <img
              src="/images/PNG/Purpose2/allarrow.png"
              alt="화살표"
              className="w-[6px] text-[#6B6B6B] object-contain"
            />
          </button>
        </div>

        {/* 카드 리스트 */}
        <div className="w-full h-[204px] mb-[60px] hide-scrollbar relative">
          <div className="flex gap-[26px] mt-[30px] transition-all duration-300">
            {isLoading
              ? renderSkeletons(itemsPerPage)
              : paginatedProducts.length === 0
              ? (
                  <p className="text-center w-full mt-[80px]">제품이 없습니다.</p>
                )
              : paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`, { state: product })}
                    className="w-[192px] h-[204px] flex-shrink-0 flex flex-col items-center cursor-pointer"
                  >
                    <div className="w-[192px] h-[160px] bg-white rounded-[16px] shadow-lg overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-[135px] h-[135px] mx-auto mt-[14px] object-cover"
                      />
                    </div>
                    <p className="mt-[16px] h-[28px] text-[20px] font-medium text-center">
                      {product.title}
                    </p>
                  </div>
                ))}

            {/* ➤ 오른쪽 화살표 버튼 */}
            {currentPage < totalPages - 1 && (
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="absolute right-[-25px] top-[56px] z-10 w-[49px] h-[49px] bg-white rounded-full shadow-md flex items-center justify-center"
              >
                <MdOutlineArrowForwardIos className="text-[22px]" />
              </button>
            )}

            {/* ⬅ 왼쪽 화살표 버튼 */}
            {currentPage > 0 && (
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="absolute left-[-25px] top-[56px] z-10 w-[49px] h-[49px] bg-white rounded-full shadow-md flex items-center justify-center"
              >
                <MdOutlineArrowBackIos className="text-[22px]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecommendedProductSection;