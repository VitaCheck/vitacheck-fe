"use client";

import { useState, useRef, useEffect } from "react";
import ProductCard from "../ProductCard";
import Logo from "../../assets/logo.svg";

const ageOptions = ["10대", "20대", "30대", "40대"];

const ProductList = () => {
  const [selectedAge, setSelectedAge] = useState("20대");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 드롭다운 닫기
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
      <div className="flex items-center justify-start mb-4 relative">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="text-2xl mr-8">🔥 인기 영양제</span>
        </h2>

        {/* 드롭다운 */}
        <div
          className="relative w-[85px] cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
          ref={dropdownRef}
        >
          <div className="flex items-center justify-between text-sm rounded px-3 py-[6px] bg-[#EBEBEB]">
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
      {/* <div className="w-full border-t border-gray-200 mb-4" /> */}

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
