import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";

const IngredientPage = () => {
  const [selected, setSelected] = useState("20대");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  return (
    <div className="px-35 py-10 max-w-screen-xl mx-auto">
      {/* 제목 */}
      <h1 className="text-4xl font-semibold mb-6">성분별</h1>

      {/* 성분 검색 */}
    <section className="flex items-center justify-center">
      <div className="flex items-center w-full max-w-md px-4 py-5 rounded-[44px] bg-[#f2f2f2]">
        <input
          type="text"
          placeholder="성분을 입력해주세요."
          className="w-full text-lg bg-transparent outline-none text-gray-400 placeholder-gray-300"
          aria-label="성분 검색"
        />
        <FiSearch className="text-gray-600 ml-2" size={20} />
      </div>
    </section>
      <section className="flex font-medium space-x-6 text-xs text-gray-700 mb-8 justify-center leading-[40px]">
        <button className="hover:underline">검색 기록 1</button>
        <button className="hover:underline">검색 기록 2</button>
        <button className="hover:underline">검색 기록 3</button>
      </section>

      {/* 캐릭터 & 설명 */}
      <section className="flex items-center justify-center gap-6 mb-10">
        <img src="/assets/cat.png" alt="캐릭터" className="w-28 h-28" />
        <p className="text-base font-medium text-black leading-relaxed text-left">
          효능, 섭취 시기, 권장 섭취량 등<br />
          다양한 정보를 볼 수 있어요!
        </p>
      </section>

      {/* TOP 5 버튼 */}
      <section>
<div className="flex items-center gap-5 mb-5">
          <h2 className="text-2xl font-semibold">연령대별 자주 찾는 성분 TOP 5</h2>

          {/* 드롭다운 */}
          <select
            value={selected}
            onChange={handleChange}
            className="text-sm font-semibold px-8 py-1 rounded-1xl bg-gray-200"
          >
            <option value="10대">10대</option>
            <option value="20대">20대</option>
            <option value="30대">30대</option>
            <option value="40대">40대</option>
            <option value="50대">50대</option>
            <option value="60대">60대</option>
          </select>
        </div>
        <div className="flex gap-6">
          {["유산균", "비타민 C", "글루타치온", "밀크씨슬", "오메가3"].map((item) => (
            <Link
              key={item}
              to={`/ingredients/${encodeURIComponent(item)}`}
              className="w-full flex justify-center gap-2 items-center py-10 rounded-2xl text-center hover:bg-gray-300 transition bg-gray-200"
            >
              <span className="font-semibold text-lg">{item}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default IngredientPage;