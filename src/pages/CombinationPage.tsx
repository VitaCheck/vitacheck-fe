import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cat from "../assets/CatWithPointer.png";
import Chick from "../assets/chick.png";
import NavBar from "../components/NavBar";

const CombinationPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 페이지 진입 시 localStorage에서 검색 기록 불러오기
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    // 중복 제거 + 앞에 추가 + 최대 3개 유지
    const updated = [
      trimmed,
      ...searchHistory.filter((item) => item !== trimmed),
    ].slice(0, 3);

    // 상태와 localStorage 모두 업데이트
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));

    navigate(`/add-combination?query=${encodeURIComponent(trimmed)}`);
  };

  // 검색 기록 삭제
  const handleDelete = (itemToDelete: string) => {
    const updated = searchHistory.filter((item) => item !== itemToDelete);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto p-4 font-pretendard">
      <h1 className="text-3xl font-extrabold mb-10">조합 추가</h1>

      {/* 검색창 */}
      <div className="flex items-center w-full bg-[#f2f2f2] rounded-full px-4 py-3 mb-8 shadow-inner">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-400"
          placeholder="성분을 입력해주세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button onClick={handleSearch} className="text-xl">
          🔍
        </button>
      </div>

      {/* 검색 기록 */}
      <div className="flex justify-center gap-4 text-sm text-gray-700 mb-12 flex-wrap">
        {searchHistory.length > 0
          ? searchHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
              >
                <button
                  onClick={() => {
                    setSearchTerm(item);
                    navigate(
                      `/add-combination?query=${encodeURIComponent(item)}`
                    );
                  }}
                  className="hover:underline"
                >
                  {item}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-gray-400 hover:text-red-500"
                  title="삭제"
                >
                  ❌
                </button>
              </div>
            ))
          : ["검색 기록 1", "검색 기록 2", "검색 기록 3"].map((item, idx) => (
              <span key={idx} className="text-gray-300">
                {item}
              </span>
            ))}
      </div>

      {/* 고양이 일러스트 + 설명 */}
      <div className="relative flex justify-center my-16">
        <div className="relative w-[200px]">
          <p className="absolute -left-20 text-base font-semibold whitespace-nowrap">
            성분 과잉 섭취
            <br />
            걱정 마세요!
          </p>
          <img src={Cat} alt="고양이" className="w-full" />
          <img
            src={Chick}
            alt="병아리"
            className="absolute bottom-[18px] left-[22px] w-[45px]"
          />
          <p className="absolute -right-20 text-base font-semibold whitespace-nowrap">
            성분별 총량을 한눈에!
          </p>
        </div>
      </div>

      {/* 주의 조합 */}
      <div className="mt-10 mb-10 max-w-[1248px] mx-auto">
        <h2 className="text-lg font-bold mb-4">주의가 필요한 조합 TOP 5</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 w-[1248px] px-1">
            {[
              "철분 + 칼슘",
              "아연 + 철분",
              "아연 + 구리",
              "비타민C + 철분",
              "칼슘 + 마그네슘",
            ].map((combo, i) => (
              <div
                key={i}
                className="w-[224px] h-[170px] bg-white shadow-md rounded-[14px] px-[6px] py-[10px] text-center text-[25px] font-normal flex items-center justify-center relative"
              >
                {combo}
                <span className="absolute top-[10px] right-[10px] text-xs text-gray-400">
                  ⟳
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 좋은 조합 */}
      <div className="mb-10 max-w-[1248px] mx-auto">
        <h2 className="text-lg font-bold mb-4">궁합이 좋은 조합 TOP 5</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 w-[1248px] px-1">
            {[
              "비타민D + 칼슘",
              "철분 + 비타민C",
              "마그네슘 + 비타민B6",
              "유산균 + 아연",
              "오메가3 + 비타민E",
            ].map((combo, i) => (
              <div
                key={i}
                className="w-[224px] h-[170px] bg-white shadow-md rounded-[14px] px-[6px] py-[10px] text-center text-[25px] font-normal flex items-center justify-center relative"
              >
                {combo}
                <span className="absolute top-[10px] right-[10px] text-xs text-gray-400">
                  ⟳
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinationPage;
