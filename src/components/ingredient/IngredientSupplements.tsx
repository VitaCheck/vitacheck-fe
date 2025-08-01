import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import searchIcon from "../../assets/search.png";
import { fetchIngredientSearch } from "@/apis/ingredient";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

interface Props {
  data: {
    name: string;
  };
}

interface Supplement {
  supplementId: number;
  supplementName: string;
  imageUrl: string;
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const IngredientSupplements = ({ data }: Props) => {
  const isMobile = useIsMobile();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [products, setProducts] = useState<Supplement[]>([]);
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: {
          keyword?: string;
          ingredientName?: string;
          brand?: string;
        } = {};

        console.log(data.name);

        if (data.name) params.ingredientName = data.name;
        const res = await fetchIngredientSearch(params);

        console.log(res);

        const content = res.result.supplements.content;
        if (!content || content.length === 0) {
          navigate("/ingredient/NoSearchResult");
          return;
        }

        setProducts(content);
      } catch (err: unknown) {
        const axiosErr = err as AxiosError;
        console.error(
          "검색 실패:",
          axiosErr.response?.data || axiosErr.message
        );
        navigate("/ingredient/NoSearchResult");
      }
    };

    fetchData();
  }, [name, navigate]);

  const filteredProducts = products.filter((product) =>
    product.supplementName.includes(searchKeyword)
  );

  return (
    <div className="px-4 md:px-30 max-w-screen-xl mx-auto">
      <section className="flex justify-center mb-6">
        <div
          className={`flex items-center w-full ${
            isMobile
              ? "max-w-md px-4 py-3 rounded-[44px] bg-white border border-gray-300"
              : "max-w-4xl rounded-full border border-gray-300 px-5 py-4 bg-white shadow-sm"
          }`}
        >
          <input
            type="text"
            placeholder="찾고 싶은 제품을 입력해주세요."
            value={searchKeyword}
            onChange={handleSearch}
            className={`w-full outline-none ${
              isMobile
                ? "text-sm bg-transparent text-gray-400 placeholder-gray-300"
                : "text-gray-800 placeholder-gray-400"
            }`}
          />
          <img
            src={searchIcon}
            alt="검색"
            className={`ml-2 ${isMobile ? "w-5 h-5" : "w-6 h-6"}`}
          />
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-20 gap-y-6 md:gap-x-2">
        {filteredProducts.map((product, i) => (
          <div key={i} className="flex justify-center">
            <ProductCard
              name={product.supplementName}
              imageSrc={product.imageUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientSupplements;
