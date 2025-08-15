import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";

interface Product {
  id: number;
  title: string;
  imageUrl: string;
}

const PurposeIngredientProducts = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ingredient = searchParams.get("ingredient");
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const batchSize = window.innerWidth >= 768 ? 4 : 2;

  // 초기 데이터 로드
  useEffect(() => {
    setIsLoading(true);
    const supplementsFromState = location.state?.supplements || [];

    const initialLoadTimer = setTimeout(() => {
      if (supplementsFromState.length > 0) {
        const mappedProducts: Product[] = supplementsFromState.map(
          (item: [string, string], index: number) => ({
            id: index + 1,
            title: item[0],
            imageUrl: item[1].startsWith("http")
              ? item[1]
              : `/images/${item[1]}`,
          })
        );
        setProducts(mappedProducts);
        setDisplayProducts(mappedProducts.slice(0, batchSize));
      } else {
        setProducts([]);
      }
      setIsLoading(false);
    }, 1000);

    window.scrollTo(0, 0);
    return () => clearTimeout(initialLoadTimer);
  }, [location.state?.supplements]);

  // 무한 스크롤
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

  const filteredProducts = displayProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSkeletonCard = () => (
    <div className="flex flex-col items-center animate-pulse">
      {/* 모바일 */}
      <div className="w-[166px] h-[150px] bg-gray-200 rounded-xl shadow-lg sm:hidden"></div>
      <div className="mt-[18px] h-[22px] w-3/4 bg-gray-200 rounded-full sm:hidden"></div>
      {/* PC */}
      <div className="hidden sm:block w-full h-[160px] bg-gray-200 rounded-[16px] shadow-lg"></div>
      <div className="hidden sm:block mt-[16px] h-[22px] w-3/4 bg-gray-200 rounded-full"></div>
    </div>
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
        <div className="w-[430px] mx-auto mt-[50px] pb-[100px]">
          <div className="flex flex-col ml-[38px]">
            <h1 className="text-[30px] tracking-[-0.6px] font-medium">
              {ingredient}
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
          <div className="mt-[33px] max-w-[430px] w-full mx-auto justify-items-center grid grid-cols-2 gap-x-[22px] gap-y-[40px] px-[37px]">
            {renderCards(true)}
          </div>
          <div ref={loadMoreRef}></div>
        </div>
      </div>

      {/* PC */}
      <div className="hidden sm:block w-full px-[40px] bg-[#FAFAFA]">
        <div className="max-w-[845px] mx-auto pt-[70px] pb-[80px]">
          <h1 className="text-[30px] font-semibold">{ingredient}</h1>
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

export default PurposeIngredientProducts;
