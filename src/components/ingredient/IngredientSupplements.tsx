import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const products = Array.from({ length: 8 }, (_, i) => ({
  name: `제품 ${i + 1}`,
  imageSrc: `/assets/sample${i + 1}.png`,
}));

const IngredientSupplements = () => {
  const isMobile = useIsMobile();

  return (
    <div className="px-4 md:px-16 max-w-screen-xl mx-auto">
      {isMobile && (
        <section className="flex items-center justify-center mb-4">
          <div className="flex items-center w-full px-4 py-3 rounded-[44px] bg-[#f2f2f2]">
            <input
              type="text"
              placeholder="찾고싶은 제품을 입력해주세요."
              className="w-full text-base bg-transparent outline-none text-gray-400 placeholder-gray-300"
            />
            <FiSearch className="text-gray-600 ml-2" size={18} />
          </div>
        </section>
      )}

      {/* 제품 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-15 gap-y-6 md:gap-x-2">
        {products.map((product, i) => (
          <div key={i} className="flex justify-center">
            <ProductCard
              name={product.name}
              imageSrc={product.imageSrc}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientSupplements;
