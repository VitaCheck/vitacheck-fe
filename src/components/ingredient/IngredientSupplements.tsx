import ProductCard from "../../components/ProductCard";

const products = Array.from({ length: 8 }, (_, i) => ({
  name: `제품 ${i + 1}`,
  imageSrc: "/assets/placeholder.png", // 적절한 이미지 경로로 교체
}));

const IngredientSupplements = () => {
  return (
    <div className="grid grid-cols-4 gap-x-6 gap-y-8 max-w-6xl mx-auto">
      {products.map((product, i) => (
        <ProductCard
          key={i}
          name={product.name}
          imageSrc={product.imageSrc}
        />
      ))}
    </div>
  );
};

export default IngredientSupplements;
