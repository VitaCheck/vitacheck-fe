// import { useState, useEffect } from "react";
// import ProductCard from "../../components/ProductCard";
// import searchIcon from "../../assets/search.png";
// import { fetchIngredientSupplements } from "@/apis/ingredient";
// import { useNavigate } from "react-router-dom";
// import type { AxiosError } from "axios";
// import type { Supplement } from "@/types/ingredient";

// interface Props {
//   data: {
//     name: string;
//     supplements?: Supplement[];
//   };
// }

// const useIsMobile = () => {
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return isMobile;
// };

// const IngredientSupplements = ({ data }: Props) => {
//   const isMobile = useIsMobile();
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [products, setProducts] = useState<Supplement[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchKeyword(e.target.value);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);

//         // 먼저 상세 정보에서 supplements 데이터 확인
//         if (data.supplements && data.supplements.length > 0) {
//           const formattedProducts = data.supplements.map((item) => ({
//             id: item.id,
//             name: item.name,
//             imageUrl: item.imageUrl,
//           }));
//           setProducts(formattedProducts);
//           setIsLoading(false);
//           return;
//         }

//         // supplements 데이터가 없으면 API 호출
//         const supplements = await fetchIngredientSupplements(data.name);

//         if (!supplements || supplements.length === 0) {
//           setProducts([]);
//         } else {
//           const formattedProducts = supplements.map((item: any) => ({
//             id: item.id || item.supplementId,
//             name: item.name || item.supplementName,
//             imageUrl: item.imageUrl,
//           }));
//           setProducts(formattedProducts);
//         }
//       } catch (err: unknown) {
//         const axiosErr = err as AxiosError;
//         console.error(
//           "영양제 정보 불러오기 실패:",
//           axiosErr.response?.data || axiosErr.message
//         );
//         setProducts([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (data.name) {
//       fetchData();
//     }
//   }, [data.name]);

//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(searchKeyword.toLowerCase())
//   );

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-8">
//         <div className="text-gray-500">영양제 정보를 불러오는 중...</div>
//       </div>
//     );
//   }

//   if (products.length === 0) {
//     return (
//       <div className="flex justify-center items-center py-8">
//         <div className="text-gray-500">관련 영양제가 없습니다.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="px-4 md:px-30 max-w-screen-xl mx-auto">
//       <section className="flex justify-center mb-6">
//         <div
//           className={`flex items-center w-full ${
//             isMobile
//               ? "max-w-md px-4 py-3 rounded-[44px] bg-white border border-gray-300"
//               : "max-w-4xl rounded-full border border-gray-300 px-5 py-4 bg-white shadow-sm"
//           }`}
//         >
//           <input
//             type="text"
//             placeholder="찾고 싶은 제품을 입력해주세요."
//             value={searchKeyword}
//             onChange={handleSearch}
//             className={`w-full outline-none ${
//               isMobile
//                 ? "text-sm bg-transparent text-gray-400 placeholder-gray-300"
//                 : "text-gray-800 placeholder-gray-400"
//             }`}
//           />
//           <img
//             src={searchIcon}
//             alt="검색"
//             className={`ml-2 ${isMobile ? "w-5 h-5" : "w-6 h-6"}`}
//           />
//         </div>
//       </section>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-x-20 gap-y-6 md:gap-x-2">
//         {filteredProducts.map((product, i) => (
//           <div key={i} className="flex justify-center">
//             <ProductCard
//               id={product.id}
//               name={product.name}
//               imageSrc={product.imageUrl}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default IngredientSupplements;
import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import searchIcon from "../../assets/search.png";
import { fetchIngredientSupplements } from "@/apis/ingredient";
import type { AxiosError } from "axios";
import type {
  IngredientDetail,
  IngredientSupplement,
} from "@/types/ingredient";

interface Props {
  data: IngredientDetail;
}

// 카드 렌더용 슬림 타입(필요한 필드만)
type CardSupplement = {
  id: number;
  name: string;
  imageUrl: string; // 반드시 string
};

const FALLBACK_IMG = "/images/PNG/성분 2-2/cat_character.png";

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
  const [products, setProducts] = useState<CardSupplement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1) 상세 데이터에 supplements가 있을 때: 필요한 필드만 추출 + 기본 이미지 보정
        if (data.supplements && data.supplements.length > 0) {
          const formatted: CardSupplement[] = data.supplements.map(
            (item: IngredientSupplement) => ({
              id: item.id,
              name: item.name,
              imageUrl: item.imageUrl ?? FALLBACK_IMG,
            })
          );
          setProducts(formatted);
          setIsLoading(false);
          return;
        }

        // 2) 없으면 API 호출
        const supplements = await fetchIngredientSupplements(data.name);

        if (!supplements || supplements.length === 0) {
          setProducts([]);
        } else {
          const formatted: CardSupplement[] = supplements.map((item: any) => ({
            id: item.id ?? item.supplementId,
            name: item.name ?? item.supplementName,
            imageUrl: item.imageUrl ?? FALLBACK_IMG,
          }));
          setProducts(formatted);
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchKeyword.toLowerCase())
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
      <div className="flex flex-col items-center justify-center py-8">
        <img
          src={FALLBACK_IMG}
          alt="영양제 없음"
          className="w-32 h-32 object-cover rounded-md mb-4"
        />
        <div className="text-gray-500 text-center">
          <p className="text-lg font-medium mb-2">관련 영양제가 없습니다</p>
          <p className="text-sm">
            이 성분과 관련된 영양제가 아직 등록되지 않았습니다.
          </p>
        </div>
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
            className={`ml-2 ${isMobile ? "W-5 h-5" : "w-6 h-6"}`}
          />
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-20 gap-y-6 md:gap-x-2">
        {filteredProducts.map((product) => (
          <div key={product.id} className="flex justify-center">
            <ProductCard
              name={product.name}
              imageSrc={product.imageUrl} // string 보장
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientSupplements;
