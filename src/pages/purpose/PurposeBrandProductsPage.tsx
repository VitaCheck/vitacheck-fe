import { useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  imageUrl: string;
}

const PurposeBrandProducts = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const brand = searchParams.get("brand");
  const brandId = searchParams.get("id");
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const batchSize = window.innerWidth >= 768 ? 4 : 2; // PC:4개, 모바일:2개

  // 1️⃣ 초기 데이터 로드
  useEffect(() => {
    if (!brandId) {
      setIsLoading(false);
      console.error("브랜드 ID가 URL에 없습니다.");
      return;
    }

    const fetchBrandProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://vita-check.com/api/v1/supplements/brand`,
          {
            params: { id: brandId },
            headers: { accept: "*/*" },
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 표시용

        if (response.status === 200) {
          const mappedProducts: Product[] = response.data.supplements.map(
            (item: any) => ({
              id: item.id,
              title: item.name,
              imageUrl: item.imageUrl.startsWith("http")
                ? item.imageUrl
                : `/images/${item.imageUrl}`,
            })
          );
          setProducts(mappedProducts);
          setDisplayProducts(mappedProducts.slice(0, batchSize));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("브랜드 제품 목록을 불러오는데 실패했습니다:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandProducts();
    window.scrollTo(0, 0);
  }, [brandId]);

  // 2️⃣ 무한 스크롤
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          displayProducts.length < products.length
        ) {
          const nextBatch = products.slice(
            displayProducts.length,
            displayProducts.length + batchSize
          );
          setDisplayProducts((prev) => [...prev, ...nextBatch]);
        }
      },
      { threshold: 1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [isLoading, displayProducts, products]);

  // 3️⃣ 스켈레톤 카드
  const renderSkeletonCard = () => (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-full max-w-[166px] h-[150px] bg-gray-200 rounded-xl shadow-lg sm:hidden"></div>
      <div className="mt-[18px] h-[22px] w-3/4 bg-gray-200 rounded-full sm:hidden"></div>
      <div className="hidden sm:block w-full h-[160px] bg-gray-200 rounded-[16px] shadow-lg"></div>
      <div className="hidden sm:block mt-[16px] h-[22px] w-3/4 bg-gray-200 rounded-full"></div>
    </div>
  );

  const filteredProducts = displayProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCards = (isMobile: boolean) => {
    if (isLoading) {
      const count = isMobile ? 2 : 4;
      return Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-full">
          {renderSkeletonCard()}
        </div>
      ));
    }

    if (filteredProducts.length === 0 && searchQuery !== "") {
      return (
        <p className="w-full text-center text-gray-500 mt-5">
          검색 결과가 없습니다.
        </p>
      );
    }

    return filteredProducts.map((product) => (
      <div
        key={product.id}
        onClick={() => navigate(`/product/${product.id}`, { state: product })}
        className="flex-shrink-0 flex flex-col items-center cursor-pointer"
      >
        <div
          className={`${
            isMobile
              ? "w-full max-w-[166px] h-[150px] rounded-xl"
              : "w-full h-[160px] rounded-[16px]"
          } bg-white shadow-lg overflow-hidden`}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            className={`${
              isMobile
                ? "w-[122px] h-[122px] mt-[22px]"
                : "w-[135px] h-[135px] mt-[14px]"
            } mx-auto object-cover`}
          />
        </div>
        <p
          className={`${
            isMobile
              ? "mt-[18px] h-[22px] text-[18px]"
              : "mt-[16px] text-[22px]"
          } font-medium text-center`}
        >
          {product.title}
        </p>
      </div>
    ));
  };

  return (
    <>
      {/* 모바일 */}
      <div className="sm:hidden">
        <div className="max-w-[430px] mx-auto mt-[50px] pb-[100px]">
          <div className="flex flex-col ml-[38px]">
            <h1 className="text-[30px] tracking-[-0.6px] font-medium">
              {brand}
            </h1>
          </div>
          <div className="mx-[32px]">
            <div className="flex items-center w-full max-w-[366px] h-[52px] mt-[20px] mx-auto px-4 py-2 rounded-full border-[#C7C7C7] border-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="찾고 싶은 제품을 입력해주세요."
                className="flex-grow font-light text-[18px] text-[#AAAAAA] outline-none"
              />
              <AiOutlineSearch className="text-gray-500 text-[30px] ml-2" />
            </div>
          </div>
          <div
            className="mt-[33px] max-w-[430px] w-full justify-items-center
                          grid grid-cols-2 gap-x-[22px] gap-y-[40px] px-[37px]"
          >
            {renderCards(true)}
          </div>
          <div ref={loadMoreRef}></div>
        </div>
      </div>

      {/* PC */}
      <div className="hidden sm:block w-full px-[40px] bg-[#FAFAFA]">
        <div className="max-w-[845px] mx-auto pt-[70px] pb-[80px]">
          <div className="flex justify-between items-center">
            <h1 className="text-[30px] font-semibold">{brand}</h1>
          </div>
          <div className="flex items-center w-full h-[52px] mt-[26px] mx-auto px-[24px] rounded-full border-[#C7C7C7] border-[1px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="찾고 싶은 제품을 입력해주세요."
              className="flex-grow font-regular text-[#686666] text-[16px] outline-none"
            />
            <AiOutlineSearch className="text-[#686666] text-[37px] ml-1" />
          </div>
          <div className="mt-[55px] grid grid-cols-4 gap-x-[26px] gap-y-[40px]">
            {renderCards(false)}
          </div>
          <div ref={loadMoreRef}></div>
        </div>
      </div>
    </>
  );
};

export default PurposeBrandProducts;
