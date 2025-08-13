import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  imageUrl: string;
}

const BestSupplement = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 드롭다운 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 목 데이터 예시
  const mockData: Product[] = [
    { id: 1, title: "고려은단 비타민C 1000", imageUrl: "/images/vitamin-c.jpg" },
    { id: 2, title: "솔가 비타민D3 5000IU", imageUrl: "/images/vitamin-d3.jpg" },
    { id: 3, title: "종근당 프로메가 오메가3", imageUrl: "/images/omega3.jpg" },
    { id: 4, title: "루테인 눈 건강", imageUrl: "/images/lutein.jpg" },
    { id: 5, title: "칼슘 뼈 건강", imageUrl: "/images/calcium.jpg" },
    { id: 6, title: "마그네슘 근육 이완", imageUrl: "/images/magnesium.jpg" },
    { id: 7, title: "비타민B 컴플렉스", imageUrl: "/images/vitamin-b.jpg" },
    { id: 8, title: "프로바이오틱스 장 건강", imageUrl: "/images/probiotic.jpg" },
  ];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProducts(mockData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const genders = ["전체 성별", "여성", "남성"];
  const [selectedGender, setSelectedGender] = useState(genders[0]);

  const ageGroups = ["전체 연령", "10대", "20대", "30대", "40대", "50대", "60대 이상"];
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(ageGroups[0]);

  const renderSkeletonCard = (isMobile: boolean) => (
    <div className="flex flex-col items-center animate-pulse">
      {isMobile ? (
        <>
          <div className="mt-[18px] h-[22px] w-3/4 bg-gray-200 rounded-full"></div>
        </>
      ) : (
        <>
          <div className="w-full h-[160px] bg-gray-200 rounded-[16px] shadow-lg relative"></div>
          <div className="mt-[16px] h-[22px] w-3/4 bg-gray-200 rounded-full"></div>
        </>
      )}
    </div>
  );

  const renderCards = (isMobile: boolean) => {
    if (isLoading) {
      const skeletonCount = isMobile ? 2 : 4;
      return Array.from({ length: skeletonCount }).map((_, index) => (
        <div key={index} className="w-full">
          {renderSkeletonCard(isMobile)}
        </div>
      ));
    }

    return products.map((product, index) => {
      // 번호 색상 지정
      let numberColor = "bg-[#AAAAAA]";
      if (index === 0 || index === 1 || index === 2) numberColor = "bg-[#FFC200]";

      return (
        <div
          key={product.id}
          onClick={() => navigate(`/product/${product.id}`, { state: product })}
          className="flex-shrink-0 flex flex-col items-center cursor-pointer relative"
        >
          <div
            className={`${
              isMobile
                ? "w-[28px] h-[28px] text-[16px] top-[11px] left-[13px]"
                : "w-[30px] h-[30px] text-[18px] top-[12px] left-[14px]"
            } absolute select-none text-white font-semibold rounded-full flex items-center justify-center ${numberColor}`}
            style={{ zIndex: 10 }}
          >
            {index + 1}
          </div>

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
      );
    });
  };

  return (
    <>
      {/* 모바일 버전 */}
      <div className="sm:hidden">
        <div className="w-[430px] mx-auto mt-[50px] pb-[100px]">
          <div className="flex flex-col ml-[38px]">
            <h1 className="text-[30px] tracking-[-0.6px] font-medium">인기 영양제</h1>
          </div>
          <div className="mt-[33px] grid grid-cols-2 gap-x-[22px] gap-y-[40px] px-[37px]">
            {renderCards(true)}
          </div>
        </div>
      </div>

      {/* PC 버전 */}
      <div className="hidden sm:block w-full px-[40px] bg-[#FAFAFA]">
        <div className="max-w-[845px] mx-auto pt-[70px] pb-[80px]">
          <div className="flex flex-col items-start gap-[26px]">
            <h1 className="text-[30px] font-semibold">인기 영양제</h1>

            <div className="flex items-center h-[34px] gap-[10px]">
               {/* 드롭다운 */}
               <div ref={dropdownRef} className="relative min-w-[86px] h-full cursor-pointer">
                  <div
                     onClick={() => setIsDropdownOpen((prev) => !prev)}
                     className="w-full h-full max-w-[120px] truncate text-[14px] font-bold pl-[10px] pr-[15px]
                                 rounded-[26px] bg-[#FFEB9D] text-black border-none 
                                 flex items-center justify-center gap-[5px] select-none"
                  >
                     <span className="pl-[10px] truncate">{selectedGender}</span>
                     <svg
                        className={`w-[20px] h-[20px] text-black transition-transform duration-200`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                              selectedGender === gender ? "bg-[#EEEEEE] text-black" : ""
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
                        className={`flex-shrink-0 h-full text-[14px] px-[20px] 
                           font-bold rounded-[26px] flex items-center justify-center cursor-pointer select-none
                           ${
                              selectedAgeGroup === age
                              ? "bg-[#FFEB9D] text-black"
                              : "bg-white text-[#6B6B6B] border-[#C7C7C7] border-[0.6px]"
                           }
                        `}
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
};

export default BestSupplement;
