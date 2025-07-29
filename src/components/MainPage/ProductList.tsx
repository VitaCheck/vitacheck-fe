import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard";
import Logo from "../../assets/logo.svg";

const ageOptions = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];

const ProductList = () => {
  const [selectedAge, setSelectedAge] = useState("20대");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="px-[9%] sm:px-[9%]">
      {/* 상단 영역 */}
      <div className="flex items-center justify-between mb-4">
        {/* 왼쪽: 타이틀 + 드롭다운 */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            <span className="text-2xl">🔥 인기 영양제</span>
          </h2>

          {/* 드롭다운 */}
          <div
            className="relative w-[85px] cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
            ref={dropdownRef}
          >
            <div className="flex items-center justify-between text-sm rounded-full px-3 py-[6px] bg-white border border-[#AAAAAA]">
              <span>{selectedAge}</span>
              <svg
                className={`w-4 h-4 ml-2 text-black transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {open && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow z-10">
                {ageOptions.map((option) => (
                  <div
                    key={option}
                    className={`px-3 py-2 hover:bg-gray-100 text-sm ${
                      selectedAge === option ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAge(option);
                      setOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate("/products")}
          className="text-sm text-[#797979] hover:underline"
        >
          더보기 &gt;
        </button>
      </div>

      {/* 제품 카드 */}
      <div className="flex overflow-x-auto gap-3">
        <ProductCard
          imageSrc={Logo}
          name="제품 1"
          widthClass="w-[110px] md:w-[150px]"
          heightClass="h-[100px] md:h-[130px]"
          fontSizeClass="text-[15px] md:text-[20px]"
        />
        <ProductCard
          imageSrc={Logo}
          name="제품 2"
          widthClass="w-[110px] md:w-[150px]"
          heightClass="h-[100px] md:h-[130px]"
          fontSizeClass="text-[15px] md:text-[20px]"
        />
        <ProductCard
          imageSrc={Logo}
          name="제품 3"
          widthClass="w-[110px] md:w-[150px]"
          heightClass="h-[100px] md:h-[130px]"
          fontSizeClass="text-[15px] md:text-[20px]"
        />
      </div>
    </section>
  );
};

export default ProductList;
