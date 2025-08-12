import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import searchIcon from "../../assets/search.png";
import { fetchIngredientSupplements } from "@/apis/ingredient";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { Supplement } from "@/types/ingredient";

interface Props {
  data: {
    name: string;
    supplements?: Supplement[];
  };
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 먼저 상세 정보에서 supplements 데이터 확인
        if (data.supplements && data.supplements.length > 0) {
          const formattedProducts = data.supplements.map((item) => ({
            id: item.id,
            name: item.name,
            imageUrl: item.imageUrl,
          }));
          setProducts(formattedProducts);
          setIsLoading(false);
          return;
        }

        // supplements 데이터가 없으면 API 호출
        const supplements = await fetchIngredientSupplements(data.name);

        if (!supplements || supplements.length === 0) {
          setProducts([]);
        } else {
          const formattedProducts = supplements.map((item: any) => ({
            id: item.id || item.supplementId,
            name: item.name || item.supplementName,
            imageUrl: item.imageUrl,
          }));
          setProducts(formattedProducts);
        }
      } catch (err: unknown) {
        const axiosErr = err as AxiosError;
        console.error(
          "영양제 정보 불러오기 실패:",
          axiosErr.response?.data || axiosErr.message
        );
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (data.name) {
      fetchData();
    }
  }, [data.name]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">영양제 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">관련 영양제가 없습니다.</div>
      </div>
    );
  }

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
            <ProductCard name={product.name} imageSrc={product.imageUrl} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientSupplements;
