import { useNavigate } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";

interface MainDetailPageBrandSectionProps {
  ingredientName?: string;
}

const MainDetailPageBrandSection = ({ ingredientName }: MainDetailPageBrandSectionProps) => {
  const navigate = useNavigate();

  const products = [
    { id: 11, title: "아이클리어 루테인", imageUrl: "/images/product1.png" },
    { id: 22, title: "여에스더 오메가3", imageUrl: "/images/product2.png" },
    { id: 33, title: "제품3", imageUrl: "/images/product3.png" },
    { id: 44, title: "제품4", imageUrl: "/images/product4.png" },
    { id: 55, title: "제품5", imageUrl: "/images/product5.png" },
   ];

   const brands = [
    { id: 111, title: "정관장", imageUrl: "/images/product111.png" },
   ];

  return (
    <>
      {/* 브랜드 이미지와 브랜드명 */}
      <div className="flex items-center justify-between w-[338px] gap-[18px]">
         {brands.map((brand) => (
            <div className="flex items-center justify-center gap-[10px]">
               <img 
               src={brand.imageUrl}
               alt={brand.title}
               className="w-[40px] h-[40px] mx-auto border-[0.5px] rounded-[36px] object-cover"
               />
               <span className="text-[20px] tracking-[-0.4px] font-medium">{brand.title}</span>
            </div>
         ))}
        <button
          className="w-[80px] h-[30px] bg-[#EEEEEE] rounded-[20px]
                    flex justify-center items-center"
        >
          <span className="text-[12px] font-medium">더보기</span>
          <MdOutlineArrowForwardIos className="h-[12px] ml-[4px]"/>
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className="w-[388px] h-[224px] overflow-x-auto scrollbar-hide">
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
    </>
  );
};

export default MainDetailPageBrandSection;