import { useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PurposeBrandProducts = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const brand = searchParams.get("brand");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const products = [
    { id: 1, title: "제품1", imageUrl: "/images/product1.png" },
    { id: 2, title: "제품2", imageUrl: "/images/product2.png" },
    { id: 3, title: "제품3", imageUrl: "/images/product3.png" },
    { id: 4, title: "제품4", imageUrl: "/images/product4.png" },
    { id: 5, title: "제품5", imageUrl: "/images/product5.png" },
  ];

  return (
    <>
      {/* 모바일 전용 */}
      <div className="md:hidden">
        <div className="w-[430px] mx-auto mt-[70px]">
          <div className="flex flex-col ml-[38px]">
            <h1 className="text-[30px] tracking-[-0.6px] font-medium">{brand}</h1>
          </div>

          {/* 검색창 */}
          <div className="flex items-center w-[366px] h-[52px] mt-[20px] mx-auto px-4 py-2 rounded-full bg-[#F2F2F2]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="찾고 싶은 제품을 입력해주세요."
              className="flex-grow font-light text-[18px] outline-none"
            />
            <AiOutlineSearch className="text-gray-500 text-[20px] ml-2" />
          </div>

          {/* 카드 리스트 */}
          <div className="mt-[33px] grid grid-cols-2 gap-x-[22px] gap-y-[40px] px-[37px]">
            {products.map((product) => (
            <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`, { state: product })} 
                className="w-[166px] h-[186px] flex-shrink-0 flex flex-col items-center"
              >
                <div className="w-[166px] h-[150px] bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-[122px] h-[122px] mx-auto mt-[22px] object-cover"
                  />
                </div>
                <p className="mt-[18px] h-[22px] text-[18px] font-medium text-center">
                  {product.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PC 전용 */}
      <div className="hidden md:block w-full bg-[#FAFAFA] pb-[187px]">
        <div className="max-w-[1280px] mx-auto pt-[100px] scale-[0.66] origin-top">
          {/* 상단 헤더 라인: 제목 */}
          <div className="flex justify-between items-center">
            <h1 className="text-[52px] tracking-[-1.04px] font-bold">{brand}</h1>
          </div>

          {/* 검색창 */}
          <div className="flex items-center w-[1280px] h-[98px] mt-[44px] mx-auto px-[35.6px] rounded-full border-[#C7C7C7] border-[1px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제품을 입력해주세요."
              className="flex-grow font-regular text-[#686666] text-[35.7px] outline-none"
            />
            <AiOutlineSearch className="text-[#686666] text-[57px] ml-2" />
          </div>

          {/* 카드 리스트 */}
          <div className="mt-[84px] grid grid-cols-4 gap-x-[40px] gap-y-[60px]">
            {products.map((product) => (
            <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`, { state: product })} 
                className="w-[290px] h-[306px] flex-shrink-0 flex flex-col items-center"
              >
                <div className="w-[290px] h-[240px] bg-white rounded-[24px] shadow-lg overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-[204px] h-[204px] mx-auto mt-[22px] object-cover"
                  />
                </div>
                <p className="mt-[24px] h-[42px] text-[34px] font-semibold text-center">
                  {product.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PurposeBrandProducts;