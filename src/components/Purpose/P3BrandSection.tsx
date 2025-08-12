import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { MdOutlineArrowBackIos } from "react-icons/md";

// 이 컴포넌트가 부모 컴포넌트로부터 받는 props의 타입을 정의합니다.
interface MainDetailPageBrandSectionProps {
  brandName: string;
  brandImageUrl: string | null;
  brandProducts: {
    id: number;
    name: string;
    imageUrl: string;
  }[];
  brandId: number;
}

const MainDetailPageBrandSection = ({ brandName, brandImageUrl, brandProducts, brandId }: MainDetailPageBrandSectionProps) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const productsToDisplay = brandProducts || [];
  
  const totalPages = Math.ceil(productsToDisplay.length / itemsPerPage);
  const paginatedProducts = productsToDisplay.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };
  
  return (
    <>
      {/* 모바일 전용 */}
      <div className="md:hidden">
        {/* 브랜드 이미지와 브랜드명 */}
        <div className="flex items-center justify-between w-[338px] gap-[18px]">
          <div className="flex items-center justify-center gap-[10px]">
            {/* brandImageUrl이 null일 경우 <img>를 렌더링하지 않습니다. */}
            <div className="w-[40px] h-[40px] rounded-[36px] border-[0.5px] border-gray-300 flex items-center justify-center overflow-hidden">
              {brandImageUrl && (
                <img 
                  src={brandImageUrl}
                  alt={brandName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <span className="text-[20px] tracking-[-0.4px] font-medium">{brandName}</span>
          </div>
          <button
            onClick={() => navigate(`/brandproducts?brand=${brandName}&id=${brandId}`)}
            className="w-[80px] h-[30px] bg-[#EEEEEE] rounded-[20px]
                       flex justify-center items-center cursor-pointer"
          >
            <span className="text-[12px] font-medium">더보기</span>
            <MdOutlineArrowForwardIos className="h-[12px] ml-[4px]"/>
          </button>
        </div>

        {/* 카드 리스트 */}
        <div className="w-[388px] overflow-x-auto hide-scrollbar">
          <div className="flex gap-[24px] mt-[24px] mb-[22px]">
            {productsToDisplay.length === 0 ? (
              <p className="text-center w-full">제품이 없습니다.</p>
            ) : (
              productsToDisplay.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`, { state: product })}
                  className="w-[154px] flex-shrink-0 flex flex-col items-center cursor-pointer"
                >
                  <div className="w-[154px] h-[140px] bg-white rounded-xl shadow-lg overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-[109px] h-[109px] mx-auto px-[22px] py-[15px] object-cover"
                    />
                  </div>
                  <p className="mt-[17px] text-[17px] font-medium text-center">
                    {product.name}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* PC 전용 */}
      <div className="hidden md:block">
        {/* 브랜드 이미지와 브랜드명 */}
        <div className="flex items-center justify-between gap-[12px]">
          <div className="flex items-center justify-center gap-[14px]">
            {/* brandImageUrl이 null일 경우 <img>를 렌더링하지 않습니다. */}
            <div className="w-[32px] h-[32px] rounded-full border-[0.7px] flex items-center justify-center overflow-hidden">
              {brandImageUrl && (
                <img 
                  src={brandImageUrl}
                  alt={brandName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <span className="text-[22px] tracking-[-0.5px] font-medium">{brandName}</span>
          </div>
          <button
            onClick={() => navigate(`/brandproducts?brand=${brandName}&id=${brandId}`)}
              className="w-[74px] h-[20px] flex items-center justify-between cursor-pointer"
            >
              <span className="text-[16px] text-[#6B6B6B] font-medium">전체보기</span>
              <img
                src="/images/PNG/Purpose2/allarrow.png"
                alt="화살표"
                className="w-[8px] text-[#6B6B6B] object-contain"
              />
            </button>
        </div>

        {/* 카드 리스트 */}
        <div className="w-full h-[204px] mb-[70px] hide-scrollbar relative">
          <div className="grid grid-cols-4 gap-x-5 mt-[30px] transition-all duration-300">
            {productsToDisplay.length === 0 ? (
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
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <p className="mt-[16px] h-[28px] text-[22px] font-medium text-center">
                    {product.name}
                  </p>
                </div>
              ))
            )}
          </div>
          
          {/* ➤ 오른쪽 화살표 버튼 */}
          {currentPage < totalPages - 1 && (
            <button
              onClick={handleNextPage}
              className="absolute right-[-25px] top-[55px] z-10 w-[49px] h-[49px] bg-white rounded-full shadow flex items-center justify-center"
            >
              <MdOutlineArrowForwardIos className="text-[22px]" />
            </button>
          )}

          {/* ⬅ 왼쪽 화살표 버튼 */}
          {currentPage > 0 && (
            <button
              onClick={handlePrevPage}
              className="absolute left-[-25px] top-[55px] z-10 w-[49px] h-[49px] bg-white rounded-full shadow flex items-center justify-center"
            >
              <MdOutlineArrowBackIos className="text-[22px]" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MainDetailPageBrandSection;