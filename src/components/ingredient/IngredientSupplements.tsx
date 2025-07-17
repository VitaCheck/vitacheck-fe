import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import NoSearchResult from "./NoSearchResult"; // 검색결과 없을 때 표시용 컴포넌트

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

// 샘플 제품 목록
const products = Array.from({ length: 8 }, (_, i) => ({
  name: `제품 ${i + 1}`,
  imageSrc: `/assets/sample${i + 1}.png`,
}));

const IngredientSupplements = () => {
  const isMobile = useIsMobile();
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // 검색 키워드 필터링
  const filteredProducts = products.filter((product) =>
    product.name.includes(searchKeyword)
  );

  return (
    <div className="px-4 md:px-30 max-w-screen-xl mx-auto">
      {/* 검색창 */}
      <section className="flex justify-center mb-6">
        <div
          className={`flex items-center w-full ${
            isMobile
              ? "max-w-md px-4 py-3 rounded-[44px] bg-[#f2f2f2]"
              : "max-w-4xl rounded-full border border-gray-300 px-5 py-4 bg-white shadow-sm"
          }`}
        >
          <input
            type="text"
            placeholder="제품을 입력해주세요."
            value={searchKeyword}
            onChange={handleSearch}
            className={`w-full outline-none ${
              isMobile
                ? "text-lg bg-transparent text-gray-400 placeholder-gray-300"
                : "text-gray-800 placeholder-gray-400"
            }`}
          />
          <FiSearch
            className="text-gray-600 ml-2"
            size={isMobile ? 20 : 22}
          />
        </div>
      </section>

      {/* 검색 결과 */}
      {filteredProducts.length === 0 ? (
        <NoSearchResult />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-20 gap-y-6 md:gap-x-2">
          {filteredProducts.map((product, i) => (
            <div key={i} className="flex justify-center">
              <ProductCard
                name={product.name}
                imageSrc={product.imageSrc}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientSupplements;
