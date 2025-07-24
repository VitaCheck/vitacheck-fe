import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { MdOutlineArrowBackIos } from "react-icons/md";

interface MainDetailPageBrandSectionProps {
  ingredientName?: string;
}

const MainDetailPageBrandSection = ({ ingredientName }: MainDetailPageBrandSectionProps) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const products = [
    { id: 1, title: "아이클리어 루테인", imageUrl: "/images/product1.png" },
    { id: 2, title: "여에스더 오메가3", imageUrl: "/images/product2.png" },
    { id: 3, title: "제품3", imageUrl: "/images/product3.png" },
    { id: 4, title: "제품4", imageUrl: "/images/product4.png" },
    { id: 5, title: "제품5", imageUrl: "/images/product5.png" },
    { id: 6, title: "제품6", imageUrl: "/images/product6.png" },
    { id: 7, title: "제품7", imageUrl: "/images/product7.png" },
    { id: 8, title: "제품8", imageUrl: "/images/product8.png" },
    { id: 9, title: "제품9", imageUrl: "/images/product9.png" },
    { id: 10, title: "제품10", imageUrl: "/images/product10.png" },
    { id: 11, title: "제품11", imageUrl: "/images/product11.png" },
   ];

   const brands = [
    { id: 111, title: "정관장", imageUrl: "/images/product111.png" },
   ];

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginatedProducts = products.slice(
      currentPage * itemsPerPage,
      currentPage * itemsPerPage + itemsPerPage
    );

  return (
    <>
      {/* 모바일 전용 */}
      <div className="md:hidden">
        {/* 브랜드 이미지와 브랜드명 */}
        <div className="flex items-center justify-between w-[338px] gap-[18px]">
          {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-center gap-[10px]"
              >
                <img 
                src={brand.imageUrl}
                alt={brand.title}
                className="w-[40px] h-[40px] mx-auto border-[0.5px] rounded-[36px] object-cover"
                />
                <span className="text-[20px] tracking-[-0.4px] font-medium">{brand.title}</span>
              </div>
          ))}
          <button
            onClick={() => navigate(`/brandproducts?brand=${brands[0].title}`)}
            className="w-[80px] h-[30px] bg-[#EEEEEE] rounded-[20px]
                      flex justify-center items-center cursor-pointer"
          >
            <span className="text-[12px] font-medium">더보기</span>
            <MdOutlineArrowForwardIos className="h-[12px] ml-[4px]"/>
          </button>
        </div>

        {/* 카드 리스트 */}
        <div className="w-[388px] h-[224px] overflow-x-auto hide-scrollbar">
          <div className="flex gap-[24px] mt-[24px] mb-[22px]">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`, { state: product })}  // 여기 추가
                className="w-[154px] h-[178px] flex-shrink-0 flex flex-col items-center cursor-pointer"
              >
                <div className="w-[154px] h-[140px] bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-[109px] h-[109px] mx-auto px-[22px] py-[15px] object-cover"
                  />
                </div>
                <p className="mt-[17px] h-[20px] text-[17px] font-medium text-center">
                  {product.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PC 전용 */}
      <div className="hidden md:block">
        {/* 브랜드 이미지와 브랜드명 */}
        <div className="flex items-center justify-between gap-[18px]">
          {brands.map((brand) => (
              <div 
                key={brand.id}
                className="flex items-center justify-center gap-[20.5px]"
              >
                <img 
                  src={brand.imageUrl}
                  alt={brand.title}
                  className="w-[82px] h-[82px] mx-auto border-[1.025px] rounded-full object-cover"
                />
                <span className="text-[41px] tracking-[-0.82px] font-medium">{brand.title}</span>
              </div>
          ))}
          <button
            onClick={() => navigate(`/brandproducts?brand=${brands[0].title}`)}
            className="w-[164px] py-[12.3px] bg-[#EEEEEE] rounded-[41px]
                      flex justify-center items-center gap-[15px] cursor-pointer"
          >
            <span className="text-[24.6px] font-medium">더보기</span>
            <MdOutlineArrowForwardIos className="text-[#757575] text-[24px]"/>
          </button>
        </div>

        {/* 카드 리스트 */}
        <div className="w-1280px h-[306px] hide-scrollbar relative">
          <div className="flex gap-[40px] mt-[44px] transition-all duration-300">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`, { state: product })}
                className="w-[290px] h-[306px] flex-shrink-0 flex flex-col items-center cursor-pointer"
              >
                <div className="w-[290px] h-[240px] bg-white rounded-[24px] shadow-lg overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-[204px] h-[204px] mx-auto mt-[22px] object-cover"
                  />
                </div>
                <p className="mt-[24px] h-[42px] text-[34px] font-medium text-center">
                  {product.title}
                </p>
              </div>
            ))}
            
            {/* ➤ 오른쪽 화살표 버튼 */}
            {currentPage < totalPages - 1 && (
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="absolute right-[-38px] top-[83px] z-10 w-[74px] h-[74px] bg-white rounded-full shadow-md flex items-center justify-center"
              >
                <MdOutlineArrowForwardIos className="text-[34px]" />
              </button>
            )}

            {/* ⬅ 왼쪽 화살표 버튼 */}
            {currentPage > 0 && (
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="absolute left-[-38px] top-[83px] z-10 w-[74px] h-[74px] bg-white rounded-full shadow-md flex items-center justify-center"
              >
                <MdOutlineArrowBackIos className="text-[34px]" />
              </button>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDetailPageBrandSection;