import { useNavigate } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";

interface RecommendedProductSectionProps {
  ingredientName?: string;
}

const RecommendedProductSection = ({ ingredientName }: RecommendedProductSectionProps) => {
  const navigate = useNavigate();

  // 실제 API 연결되면 이 데이터를 props나 context, fetch 등으로 받아오게 변경
  const ingredient = ingredientName || "오메가3"; // 임시 기본값

  const products = [
    { id: 1, title: "알파프로젝트 오메가3", imageUrl: "/images/product1.png" },
    { id: 2, title: "여에스더 오메가3", imageUrl: "/images/product2.png" },
    { id: 3, title: "제품3", imageUrl: "/images/product3.png" },
    { id: 4, title: "제품4", imageUrl: "/images/product4.png" },
    { id: 5, title: "제품5", imageUrl: "/images/product5.png" },
  ];

  const goToIngredientPage = () => {
    navigate(`/ingredientproducts?ingredient=${encodeURIComponent(ingredient)}`);
  };

  return (
    <>
      {/* 성분/태그 */}
      <div className="flex items-center gap-[18px]">
        <button
          className="px-[13px] py-[5px] bg-[#FFEB9D] rounded-lg text-[18px] font-medium
                    flex justify-center items-center"
        >
          {ingredient}
          <MdOutlineArrowForwardIos className="h-[12px] ml-[12px]"/>
        </button>
        <span className="text-[15px] flex items-center font-medium h-[18px]">#목적 제목</span>
      </div>

      {/* 카드 리스트 */}
      <div className="w-[388px] h-[224px] overflow-x-auto scrollbar-hide">
        <div className="flex gap-[24px] px-[6px] mt-[24px] mb-[22px]">
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


      {/* 더보기 버튼 */}
      <div className="flex items-center justify-center mb-[18px] ml-[-38px]">
        <button
          onClick={goToIngredientPage}
          className="w-[370px] h-[25px] border-b border-[#B2B2B2] flex items-center justify-center cursor-pointer">
          <span className="text-[13px] font-medium leading-none">더보기</span>
          <MdOutlineArrowForwardIos className="w-[11px] ml-[10px]"/>
        </button>
      </div>
    </>
  );
};

export default RecommendedProductSection;