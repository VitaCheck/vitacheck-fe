import { FiChevronRight } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import catImage from "../assets/cat.png";
import searchIcon from "../assets/search.png";
import downIcon from "../assets/arrow_drop_down.png";

// 모바일 여부 판단용 훅
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return isMobile;
};

const IngredientPage = () => {
  const [selected, setSelected] = useState("20대");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "성분별";
    const saved = localStorage.getItem("ingredient_search_history");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const saveSearchHistory = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    const newHistory = [
      trimmed,
      ...searchHistory.filter((k) => k !== trimmed),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem(
      "ingredient_search_history",
      JSON.stringify(newHistory)
    );
  };

  const deleteHistoryItem = (keyword: string) => {
    const newHistory = searchHistory.filter((k) => k !== keyword);
    setSearchHistory(newHistory);
    localStorage.setItem(
      "ingredient_search_history",
      JSON.stringify(newHistory)
    );
  };

  const handleHistoryClick = (keyword: string) => {
    setSearchKeyword(keyword);
    saveSearchHistory(keyword);
    navigate(`/ingredient/search?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleChange = (age: string) => {
    setSelected(age);
    setShowAgeModal(false);
  };

  const toggleAgeModal = () => {
    setShowAgeModal(!showAgeModal);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const submitSearch = () => {
    const trimmed = searchKeyword.trim();
    if (trimmed.length === 0) return;

    setHasSearched(true);
    saveSearchHistory(trimmed);

    // 비타민 계열인지 확인
    const isVitamin = /^비타민[A-Z]?$/.test(trimmed);

    if (isVitamin) {
      // 비타민 계열: 리스트 표시
      const mockResults = [
        "비타민A",
        "비타민B",
        "비타민C",
        "비타민D",
        "비타민E",
        "비타민K",
      ].filter((item) => item.toLowerCase().includes(trimmed.toLowerCase()));

      if (mockResults.length === 0) {
        setSearchResults([]);
      } else {
        setSearchResults(mockResults);
      }
    } else {
      // 다른 성분: 바로 상세 페이지로 이동
      navigate(`/ingredient/${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const ingredientList = [
    "유산균",
    "비타민C",
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

  return (
    <div className="px-4 sm:px-36 pt-2 sm:pt-10 max-w-screen-xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-semibold mb-6 sm:mb-8 pl-2 sm:ml-8">
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
                : "text-base text-gray-800 placeholder-gray-400"
            }`}
          />

          {searchKeyword && (
            <button onClick={handleClearSearch} className="ml-2 cursor-pointer">
              <img
                src="/images/성분 검색결과/x.png"
                alt="지우기"
                className={isMobile ? "w-5 h-5" : "w-6 h-6"}
              />
            </button>
          )}

          <img
            src={searchIcon}
            alt="검색"
            onClick={submitSearch}
            className={`ml-2 ${isMobile ? "w-5 h-5" : "w-6 h-6"}`}
          />
        </div>
      </section>

      {/* 검색 결과 또는 검색 결과 없음 메시지 */}
      {hasSearched && searchResults.length === 0 ? (
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/images/PNG/검색결과 없음 페이지/비타체크 캐릭터_0%_채도 낮춤.png"
              alt="검색 결과 없음"
              className="w-32 h-32 object-contain"
            />
          </div>
          <p className="text-gray-500 text-lg">
            일치하는 검색 결과가 없습니다.
          </p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pl-2">검색 결과</h3>
          <div className="grid grid-cols-1 gap-3">
            {searchResults.map((item) => (
              <Link
                key={item}
                to={
                  item.startsWith("비타민")
                    ? `/ingredient/${encodeURIComponent(item)}`
                    : `/ingredient/${encodeURIComponent(item)}`
                }
                className="w-full flex justify-between items-center py-4 px-5 rounded-3xl hover:bg-gray-300 transition bg-[#f2f2f2]"
              >
                <span className="font-semibold text-base">{item}</span>
                <FiChevronRight size={20} className="text-gray-500" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* 검색 기록 */}
      {!hasSearched && searchHistory.length > 0 && (
        <section className="flex flex-wrap justify-center items-center font-medium gap-3 text-xs text-gray-700 mb-8">
          {searchHistory.map((item) => (
            <div
              key={item}
              className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full shadow-sm"
            >
              <button
                onClick={() => handleHistoryClick(item)}
                className="mr-2 hover:underline"
              >
                {item}
              </button>
              <button
                onClick={() => deleteHistoryItem(item)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </section>
      )}

      {/* 캐릭터 & 설명 */}
      {!hasSearched && (
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
      )}

      {/* TOP 5 성분 */}
      {!hasSearched && (
        <section>
          <div className="flex items-center gap-x-3 mb-5">
            <h2 className="text-lg md:text-2xl font-semibold whitespace-nowrap pl-2">
              연령대별 자주 찾는 성분 TOP 5
            </h2>
            <button
              onClick={toggleAgeModal}
              className="text-sm font-semibold rounded-full pl-3 pr-6 py-1 bg-[#FFEB9D] appearance-none flex items-center gap-2"
            >
              {selected}
              <img src={downIcon} alt="드롭다운" className="w-5 h-5" />
            </button>
          </div>

          {/* 나이 선택 모달 */}
          {showAgeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold text-center mb-4">
                  연령 선택
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "10대",
                    "20대",
                    "30대",
                    "40대",
                    "50대",
                    "60대 이상",
                    "전체 연령",
                  ].map((age) => (
                    <button
                      key={age}
                      onClick={() => handleChange(age)}
                      className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                        selected === age
                          ? "bg-[#FFEB9D] text-black"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 성분 리스트 */}
          {isMobile ? (
            <div className="grid grid-cols-1 gap-3 pb-10">
              {filteredList.map((item) => (
                <Link
                  key={item}
                  to={
                    item.startsWith("비타민")
                      ? `/ingredient/${encodeURIComponent(item)}`
                      : `/ingredient/${encodeURIComponent(item)}`
                  }
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
                <Link
                  key={item}
                  to={
                    item.startsWith("비타민")
                      ? `/ingredient/${encodeURIComponent(item)}`
                      : `/ingredient/${encodeURIComponent(item)}`
                  }
                >
                  <div className="bg-white px-6 py-10 rounded-xl shadow text-center font-semibold text-lg shadow-md transition">
                    {item}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default IngredientPage;
