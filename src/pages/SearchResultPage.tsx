import ProductCard from "@/components/ProductCard";
import Logo from "../assets/logo.svg";
import SearchBar from "@/components/SearchBar";

const mockProducts = [
  { id: 1, imageSrc: Logo, name: "제품 1" },
  { id: 2, imageSrc: Logo, name: "제품 1" },
  { id: 3, imageSrc: Logo, name: "제품 1" },
  { id: 4, imageSrc: Logo, name: "제품 1" },
  { id: 5, imageSrc: Logo, name: "제품 1" },
  { id: 6, imageSrc: Logo, name: "제품 1" },
];

export default function SearchResultPage() {
  return (
    <div className="p-4">
      {/* 검색창 */}
      <SearchBar />

      {/* 제품 카드 2열 그리드 */}
      <div className="grid grid-cols-2 gap-y-6 justify-items-center mt-5">
        {mockProducts.map((product) => (
          <ProductCard
            key={product.id}
            imageSrc={product.imageSrc}
            name={product.name}
          />
        ))}
      </div>
    </div>
  );
}
