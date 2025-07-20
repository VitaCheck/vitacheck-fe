import { FiChevronRight } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import catImage from "../assets/cat.png";
import searchIcon from "../assets/search.png";

// 모바일 여부 판단용 훅
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const IngredientPage = () => {
  const [selected, setSelected] = useState("20대");
  const [searchKeyword, setSearchKeyword] = useState("");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "성분별";
  }, []);

  const ingredientList = [
    "유산균",
    "비타민 C",
    "글루타치온",
    "밀크씨슬",
    "오메가3",
  ];

  const filteredList = ingredientList.filter((item) =>
    item.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  useEffect(() => {
    if (!isMobile) return;
    const headerEl = document.querySelector("header");
    if (headerEl instanceof HTMLElement) {
      headerEl.style.display = "none";
    }
    return () => {
      if (headerEl instanceof HTMLElement) {
        headerEl.style.display = "";
      }
    };
  }, [isMobile]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmed = searchKeyword.trim();
      if (trimmed.length === 0) return;
      navigate(`/ingredient/search?query=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="px-4 md:px-36 pt-2 md:pt-10 max-w-screen-xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-semibold mb-6 md:mb-8 pl-2 md:ml-12">
        성분별
      </h1>

      {/* 검색창 */}
      <section className="flex justify-center mb-6">
        <div
          className={`flex items-center w-full ${
            isMobile
              ? "max-w-md px-4 py-3 rounded-full border border-gray-300"
              : "max-w-3xl rounded-full border border-gray-300 px-6 py-4 bg-white shadow-sm"
          }`}
        >
          <input
            type="text"
            placeholder="성분을 입력해주세요."
            value={searchKeyword}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            className={`w-full outline-none ${
              isMobile
                ? "text-lg bg-transparent text-gray-400 placeholder-gray-300"
                : "text-gray-800 placeholder-gray-400"
            }`}
          />
          <img
            src={searchIcon}
            alt="검색"
            className={`ml-2 ${isMobile ? "w-5 h-5" : "w-6 h-6"}`}
          />{" "}
        </div>
      </section>

      {/* 검색 기록 */}
      <section className="flex justify-center items-center font-medium space-x-4 text-xs text-gray-700 mb-8">
        <button className="hover:underline">검색 기록 1</button>
        <button className="hover:underline">검색 기록 2</button>
        <button className="hover:underline">검색 기록 3</button>
      </section>

      {/* 캐릭터 & 설명 */}
      <section
        className={`flex ${
          isMobile ? "justify-center gap-4" : "justify-center gap-6"
        } items-center mb-10`}
      >
        <div className="h-[95px] overflow-hidden rounded-full mb-5">
          <img
            src={catImage}
            alt="캐릭터"
            className={
              isMobile
                ? "w-30 h-30 object-cover object-top"
                : "w-30 h-30 object-contain"
            }
          />
        </div>
        <p
          className={`${
            isMobile ? "text-sm text-left" : "text-base"
          } font-medium text-black leading-relaxed`}
        >
          효능, 섭취 시기, 권장 섭취량 등<br />
          다양한 정보를 알 수 있어요!
        </p>
      </section>

      {/* TOP 5 성분 */}
      <section>
        <div className="flex items-center gap-x-3 mb-5">
          <h2 className="text-lg md:text-2xl font-semibold whitespace-nowrap pl-2">
            연령대별 자주 찾는 성분 TOP 5
          </h2>
          <select
            value={selected}
            onChange={handleChange}
            className="text-sm font-semibold px-2 py-1 bg-[#D9D9D9]"
          >
            {["10대", "20대", "30대", "40대", "50대", "60대 이상"].map(
              (age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              )
            )}
          </select>
        </div>

        {/* 성분 리스트 */}
        {isMobile ? (
          <div className="grid grid-cols-1 gap-3 pb-10">
            {filteredList.map((item) => (
              <Link
                key={item}
                to={`/ingredient/${encodeURIComponent(item)}`}
                className="w-full flex justify-between items-center py-4 px-5 rounded-3xl hover:bg-gray-300 transition bg-[#f2f2f2]"
              >
                <span className="font-semibold text-base">{item}</span>
                <FiChevronRight size={20} className="text-gray-500" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4 pb-10 pt-3">
            {filteredList.map((item) => (
              <Link key={item} to={`/ingredient/${encodeURIComponent(item)}`}>
                <div className="bg-white px-6 py-10 rounded-xl shadow text-center font-semibold text-lg shadow-md transition">
                  {item}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default IngredientPage;
