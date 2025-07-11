import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import catImage from "../assets/cat.png"; 
import IngredientDetailHeaderMobile from "../components/ingredient/IngredientDetailHeaderMobile";

//모바일 여부 판단용 훅
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
  const isMobile = useIsMobile();

  // 모바일에서만 상단 nav, search바 숨기기
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

  return (
    <>
      {/* 모바일 전용 상단 헤더 표시 */}
      {isMobile && <IngredientDetailHeaderMobile title="성분별" />}

          <div className="px-4 md:px-36 pt-2 md:pt-10 max-w-screen-xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-semibold mb-6 md:mb-8 pl-2">성분별</h1>
        

        {/* 성분 검색 */}
        <section className="flex items-center justify-center mb-4">
          <div className="flex items-center w-full max-w-md px-4 py-3 rounded-[44px] bg-[#f2f2f2]">
            <input
              type="text"
              placeholder="성분을 입력해주세요."
              className="w-full text-lg bg-transparent outline-none text-gray-400 placeholder-gray-300"
            />
            <FiSearch className="text-gray-600 ml-2" size={20} />
          </div>
        </section>

        {/* 검색 기록 */}
        <section className="flex justify-center items-center font-medium space-x-4 text-xs text-gray-700 mb-8">
          <button className="hover:underline">검색 기록 1</button>
          <button className="hover:underline">검색 기록 2</button>
          <button className="hover:underline">검색 기록 3</button>
        </section>

        {/* 캐릭터 & 설명 */}
        <section className="flex items-center justify-center gap-4 mb-10">
          <img src={catImage} alt="캐릭터" className="w-30 h-30 sm:w-30 sm:h-30" />
          <p className="text-sm sm:text-base font-medium text-black leading-relaxed text-left">
            효능, 섭취 시기, 권장 섭취량 등<br />
            다양한 정보를 알 수 있어요!
          </p>
        </section>

{/* TOP 5 성분 */}
<section>
  <div className="flex items-center gap-x-3 mb-4">
    <h2 className="text-lg md:text-2xl font-semibold whitespace-nowrap pl-2">
      연령대별 자주 찾는 성분 TOP 5
    </h2>
    <select
      value={selected}
      onChange={handleChange}
      className="text-sm font-semibold px-3 py-1 bg-[#f2f2f2] rounded-md"
    >
      {["10대", "20대", "30대", "40대", "50대", "60대"].map((age) => (
        <option key={age} value={age}>{age}</option>
      ))}
    </select>
  </div>



<div className="grid grid-cols-1 md:grid-cols-5 gap-3 pb-10">
  {["유산균", "비타민 C", "글루타치온", "밀크씨슬", "오메가3"].map((item) => (
    <Link
      key={item}
      to={`/ingredients/${encodeURIComponent(item)}`}
      className="w-full flex justify-start items-center md:py-15 py-4 pl-5 rounded-4xl hover:bg-gray-300 transition bg-[#f2f2f2]"
    >
      <span className="font-semibold text-base md:text-lg">{item}</span>
    </Link>
  ))}
</div>

        </section>
      </div>
    </>
  );
};

export default IngredientPage;
