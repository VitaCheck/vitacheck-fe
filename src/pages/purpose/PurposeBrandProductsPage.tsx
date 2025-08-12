import { useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  useEffect(() => {
    if (!brandId) {
      setIsLoading(false);
      console.error("브랜드 ID가 URL에 없습니다.");
      return;
    }

    const fetchBrandProducts = async () => {
      setIsLoading(true);
      try {
        const brandResponse = await axios.get(`http://3.35.50.61:8080/api/v1/supplements/brand`, {
          params: { id: brandId },
          headers: {
            'accept': '*/*',
          },
        });

        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (brandResponse.status === 200) {
          const fetchedProducts = brandResponse.data.supplements.map((item: any) => ({
            id: item.id,
            title: item.name,
            imageUrl: item.imageUrl,
          }));
          setProducts(fetchedProducts);
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
  }, [brandId]); // brandId가 변경될 때마다 재실행


  // 스켈레톤 카드 렌더링 함수
  const renderSkeletonCard = (isMobile: boolean) => (
    <div className="flex flex-col items-center animate-pulse">
      {/* 모바일 스켈레톤 */}
      {isMobile && (
        <>
          <div className="w-[166px] h-[150px] bg-gray-200 rounded-xl shadow-lg"></div>
          <div className="mt-[18px] h-[22px] w-3/4 bg-gray-200 rounded-full"></div>
        </>
      )}
      {/* PC 스켈레톤 */}
      {!isMobile && (
        <>
          <div className="w-full h-[160px] bg-gray-200 rounded-[16px] shadow-lg"></div>
          <div className="mt-[16px] h-[22px] w-3/4 bg-gray-200 rounded-full"></div>
        </>
      )}
    </div>
  );

  // 조건부로 카드 또는 스켈레톤을 렌더링하는 함수
  const renderCards = (isMobile: boolean) => {
    // 로딩 중일 때 스켈레톤을 렌더링
    if (isLoading) {
      const skeletonCount = isMobile ? 2 : 4;
      return Array.from({ length: skeletonCount }).map((_, index) => (
        <div key={index} className="w-full">
          {renderSkeletonCard(isMobile)}
        </div>
      ));
    }

    // 로딩 완료 후 검색 필터링
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 검색 결과가 없을 때
    if (filteredProducts.length === 0 && searchQuery !== "") {
      return (
        <p className="w-full text-center text-gray-500 mt-5 col-span-2 md:col-span-4">검색 결과가 없습니다.</p>
      );
    }

    // 실제 제품 카드 렌더링
    return filteredProducts.map((product) => (
      <div
        key={product.id}
        onClick={() => navigate(`/product/${product.id}`, { state: product })}
        className="flex-shrink-0 flex flex-col items-center cursor-pointer"
      >
        <div
          className={`${
            isMobile ? "w-[166px] h-[150px] rounded-xl" : "w-full h-[160px] rounded-[16px]"
          } bg-white shadow-lg overflow-hidden`}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            className={`${
              isMobile ? "w-[122px] h-[122px] mt-[22px]" : "w-[135px] h-[135px] mt-[14px]"
            } mx-auto object-cover`}
          />
        </div>
        <p
          className={`${
            isMobile ? "mt-[18px] h-[22px] text-[18px]" : "mt-[16px] text-[22px]"
          } font-medium text-center`}
        >
          {product.title}
        </p>
      </div>
    ));
  };

  return (
    <>
      {/* 모바일 버전 */}
      <div className="md:hidden">
        <div className="w-[430px] mx-auto mt-[50px] pb-[100px]">
          <div className="flex flex-col ml-[38px]">
            <h1 className="text-[30px] tracking-[-0.6px] font-medium">{brand}</h1>
          </div>
          <div className="flex items-center w-[366px] h-[52px] mt-[20px] mx-auto px-4 py-2 rounded-full border-[#C7C7C7] border-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="찾고 싶은 제품을 입력해주세요."
              className="flex-grow font-light text-[18px] text-[#AAAAAA] outline-none"
            />
            <AiOutlineSearch className="text-gray-500 text-[30px] ml-2" />
          </div>
          <div className="mt-[33px] grid grid-cols-2 gap-x-[22px] gap-y-[40px] px-[37px]">
            {renderCards(true)}
          </div>
        </div>
      </div>

      {/* PC 버전 */}
      <div className="hidden md:block w-full px-[40px] bg-[#FAFAFA]">
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
        </div>
      </div>
    </>
  );
};

export default PurposeBrandProducts;