import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BSMDropdownPopup from "@/components/BestSupplement/BSMDropdownPopup";

// ---------------------- 타입 정의 ----------------------
interface ApiProduct {
  supplementId: number;
  supplementName: string;
  brandName: string;
  imageUrl: string;
  searchCount: number;
}

interface ApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    content: ApiProduct[];
    totalPages: number;
    totalElements: number;
  };
}

interface Product {
  id: number;
  title: string;
  imageUrl: string;
  brand: string;
}

// ---------------------- 컴포넌트 ----------------------
export default function BestSupplement() {
  const navigate = useNavigate();

  // ---------------------- 상태 ----------------------
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const genders = ["전체 성별", "여성", "남성"];
  const [selectedGender, setSelectedGender] = useState(genders[0]);

  const ageGroups = [
    "전체 연령",
    "10대",
    "20대",
    "30대",
    "40대",
    "50대",
    "60대 이상",
  ];
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(ageGroups[0]);

  // 드롭다운 / 팝업
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ---------------------- 페이지 초기 설정 ----------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------------- API 호출 ----------------------
  useEffect(() => {
    const apiAgeGroup =
      selectedAgeGroup === "전체 연령" ? "전체" : selectedAgeGroup;
    const apiGender =
      selectedGender === "전체 성별"
        ? "전체"
        : selectedGender === "남성"
          ? "MALE"
          : "FEMALE";

    const fetchSupplements = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<ApiResponse>(
          "https://vita-check.com/api/v1/supplements/popular-supplements",
          {
            params: {
              ageGroup: apiAgeGroup,
              gender: apiGender,
              page: 0,
              size: 8,
            },
          }
        );

        if (response.data.isSuccess) {
          const newProducts = response.data.result.content.map(
            (apiProduct) => ({
              id: apiProduct.supplementId,
              title: apiProduct.supplementName,
              imageUrl: apiProduct.imageUrl,
              brand: apiProduct.brandName,
            })
          );
          setProducts(newProducts);
        } else {
          setError(response.data.message);
          setProducts([]);
        }
      } catch (err) {
        console.error("API 호출 중 에러 발생:", err);
        setError(
          "데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요."
        );
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplements();
  }, [selectedAgeGroup, selectedGender]);

  // ---------------------- 렌더링 헬퍼 ----------------------
  const renderSkeletonCard = (isMobile: boolean) => (
    <div className="flex flex-col items-center animate-pulse">
      <div
        className={`${isMobile ? "w-full h-[150px] rounded-xl" : "w-full h-[160px] rounded-[16px]"} bg-gray-200 shadow-lg`}
      />
      <div className="mt-[18px] h-[22px] w-3/4 bg-gray-200 rounded-full"></div>
    </div>
  );

  const renderEmptyOrError = () => (
    <div className="col-span-full h-[200px] flex items-center justify-center text-center text-gray-500">
      {error ? <p>{error}</p> : <p>해당 조건에 맞는 영양제가 없습니다.</p>}
    </div>
  );

  const renderCards = (isMobile: boolean) => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="w-full">
          {renderSkeletonCard(isMobile)}
        </div>
      ));
    }

    if (error || products.length === 0) return renderEmptyOrError();

    return products.map((product, index) => {
      const numberColor = index < 3 ? "bg-[#FFC200]" : "bg-[#AAAAAA]";
      return (
        <div
          key={product.id}
          onClick={() => navigate(`/product/${product.id}`, { state: product })}
          className="flex-shrink-0 flex flex-col items-center cursor-pointer relative"
        >
          <div
            className={`${isMobile ? "w-[28px] h-[28px] text-[16px] top-[11px] left-[13px]" : "w-[30px] h-[30px] text-[18px] top-[12px] left-[14px]"} 
                        absolute select-none text-white font-semibold rounded-full flex items-center justify-center ${numberColor}`}
            style={{ zIndex: 10 }}
          >
            {index + 1}
          </div>
          <div
            className={`${isMobile ? "w-[166px] h-[150px] rounded-xl" : "w-full h-[160px] rounded-[16px]"} bg-white shadow-lg overflow-hidden`}
          >
            <img
              src={product.imageUrl}
              alt={product.title}
              className={`${isMobile ? "w-[122px] h-[122px] mt-[22px]" : "w-[135px] h-[135px] mt-[14px]"} mx-auto object-cover`}
            />
          </div>
          <p
            className={`${isMobile ? "mt-[18px] h-[22px] text-[18px]" : "mt-[16px] text-[22px]"} font-medium text-center`}
          >
            {product.title}
          </p>
        </div>
      );
    });
  };

  // ---------------------- JSX ----------------------
  return (
    <>
      {/* 모바일 */}
      <div className="sm:hidden">
        <div className="mx-auto mt-[50px] w-full pb-[100px]">
          <div className="flex flex-col ml-[38px] items-start gap-[27px]">
            <h1 className="text-[30px] tracking-[-0.6px] font-medium">
              인기 영양제
            </h1>
            <div className="flex items-center h-[38px] gap-[8px] w-full">
              {/* 드롭다운 */}
              <div
                ref={dropdownRef}
                className="relative min-w-[91px] h-full cursor-pointer"
              >
                <div
                  onClick={() => setIsPopupOpen(true)}
                  className="w-full h-full max-w-[120px] truncate text-[16px] font-medium pl-[10px] pr-[15px] rounded-[26px] bg-[#FFEB9D] flex items-center justify-center gap-[5px]"
                >
                  <span className="pl-[10px] truncate">{selectedGender}</span>
                  <svg
                    className="w-[20px] h-[20px] text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {isPopupOpen && (
                <BSMDropdownPopup
                  onClose={() => setIsPopupOpen(false)}
                  selectedItems={genders}
                  onApply={(item: string) => setSelectedGender(item)}
                  activeItem={selectedGender}
                />
              )}

              {/* 연령대 버튼 */}
              <div className="flex gap-[8px] h-full overflow-x-auto whitespace-nowrap flex-1">
                {ageGroups.map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAgeGroup(age)}
                    className={`flex-shrink-0 h-full text-[16px] px-[20px] font-medium rounded-[26px] flex items-center justify-center cursor-pointer select-none
                      ${selectedAgeGroup === age ? "bg-[#FFEB9D] text-black" : "bg-white text-[#6B6B6B] border-[#C7C7C7] border-[0.6px]"}`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-[34px] max-w-[430px] w-full mx-auto grid grid-cols-2 gap-x-[22px] gap-y-[40px] px-[37px]">
            {renderCards(true)}
          </div>
        </div>
      </div>

      {/* PC */}
      <div className="hidden sm:block w-full px-[40px] bg-[#FAFAFA]">
        <div className="max-w-[845px] mx-auto pt-[70px] pb-[80px]">
          <div className="flex flex-col items-start gap-[26px]">
            <h1 className="text-[30px] font-semibold">인기 영양제</h1>
            <div className="flex items-center h-[34px] gap-[10px] w-full">
              {/* 드롭다운 */}
              <div
                ref={dropdownRef}
                className="relative min-w-[86px] h-full cursor-pointer"
              >
                <div
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="w-full h-full max-w-[120px] truncate text-[14px] font-bold pl-[10px] pr-[15px] rounded-[26px] bg-[#FFEB9D] flex items-center justify-center gap-[5px]"
                >
                  <span className="pl-[10px] truncate">{selectedGender}</span>
                  <svg
                    className="w-[20px] h-[20px] text-black transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {isDropdownOpen && (
                  <ul className="absolute top-full w-full min-w-[95px] rounded-[6px] mt-1 bg-white shadow-lg z-20">
                    {genders.map((gender) => (
                      <li
                        key={gender}
                        onClick={() => {
                          setSelectedGender(gender);
                          setIsDropdownOpen(false);
                        }}
                        className={`px-[20px] py-[8px] font-medium text-[12px] cursor-pointer ${
                          selectedGender === gender
                            ? "bg-[#EEEEEE] text-black"
                            : ""
                        }`}
                      >
                        {gender}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 연령대 버튼 */}
              <div className="flex gap-[8px] h-full overflow-x-auto whitespace-nowrap">
                {ageGroups.map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAgeGroup(age)}
                    className={`flex-shrink-0 h-full text-[14px] px-[20px] font-bold rounded-[26px] flex items-center justify-center cursor-pointer select-none
                      ${selectedAgeGroup === age ? "bg-[#FFEB9D] text-black" : "bg-white text-[#6B6B6B] border-[#C7C7C7] border-[0.6px]"}`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-[40px] grid grid-cols-4 gap-x-[26px] gap-y-[40px]">
            {renderCards(false)}
          </div>
        </div>
      </div>
    </>
  );
}
