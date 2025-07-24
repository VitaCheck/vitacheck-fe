import SearchBar from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";
import BackIcon from "../assets/back.svg";
import Logo from "../assets/logo.svg";

const recentSearches = ["오메가3", "종합비타민", "루테인"];
const popularSearches = [
  "오메가3",
  "종합비타민",
  "유산균",
  "알파프로젝트 오메가3",
  "아이클리어 루테인",
];

const recentProducts = [
  { id: 1, img: Logo, alt: "하이리뷰 오메가3" },
  { id: 2, img: Logo, alt: "비타민 병" },
  { id: 3, img: Logo, alt: "루테인 제품" },
];

export default function SearchPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      {/* 검색창 */}
      <div className="relative flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <img
            src={BackIcon}
            alt="뒤로가기"
            className="w-[24px] h-[24px] cursor-pointer"
          />
        </button>
        <div className="flex-1">
          <SearchBar />
        </div>
      </div>

      {/* 최근 검색어 */}
      <div className="px-3">
        <h3 className="text-[20px] font-bold mb-2">최근 검색어</h3>
        <div className="flex gap-2 flex-wrap">
          {recentSearches.map((word, index) => (
            <span
              key={index}
              className="px-[20px] py-[5.94px] border border-[#000000] rounded-full text-[16px]"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* 최근 본 상품 */}
      <div className="px-3">
        <h3 className="text-[20px] font-bold mb-2">최근 본 상품</h3>
        <div className="flex gap-3 overflow-x-auto">
          {recentProducts.map((product) => (
            <img
              key={product.id}
              src={product.img}
              alt={product.alt}
              className="w-[128px] h-[128px] object-contain rounded-[7px] border border-[#6B6B6B]"
            />
          ))}
        </div>
      </div>

      {/* 인기 검색어 */}
      <div className="px-3">
        <h3 className="text-[20px] font-bold mb-2">인기 검색어</h3>
        <div className="flex gap-3 flex-wrap">
          {popularSearches.map((word, index) => (
            <span
              key={index}
              className="bg-[#FFEB9D] px-[20px] py-[5.94px] rounded-full text-[16px]"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
