import ProductCard from "../ProductCard";
import Logo from "../../assets/logo.svg";

const ProductList = () => {
  return (
    <section className="mt-8 px-[9%] sm:px-[15%]">
      <h2 className="text-xl font-semibold mb-4">🔥인기 영양제</h2>
      <div className="flex overflow-x-auto">
        <ProductCard imageSrc={Logo} name="제품 1" />
        <ProductCard imageSrc={Logo} name="제품 2" />
        <ProductCard imageSrc={Logo} name="제품 3" />
        <ProductCard imageSrc={Logo} name="제품 4" />
      </div>
    </section>
  );
};

export default ProductList;
