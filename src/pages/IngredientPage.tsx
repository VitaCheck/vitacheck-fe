import { FiChevronRight } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import catImage from "../assets/cat.png";
import searchIcon from "../assets/search.png";
import downIcon from "../assets/arrow_drop_down.png";
import Navbar from "@/components/NavBar";
import {
  fetchIngredientSearch,
  fetchPopularIngredients,
} from "@/apis/ingredient";
import type {
  IngredientSearchResult,
  PopularIngredient,
} from "@/types/ingredient";

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
  const [searchResults, setSearchResults] = useState<IngredientSearchResult[]>(
    []
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popularIngredients, setPopularIngredients] = useState<
    PopularIngredient[]
  >([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // 인기성분 데이터 로드
  const loadPopularIngredients = async (ageGroup: string) => {
    setIsLoadingPopular(true);
    try {
      const response = await fetchPopularIngredients(ageGroup);
      console.log("🔥 [UI] loadPopularIngredients 응답:", response);

      if (response && response.result) {
        console.log("🔥 [UI] 인기성분 데이터 설정:", response.result);
        setPopularIngredients(response.result);
      } else {
        console.log("🔥 [UI] 응답에 result가 없음");
        setPopularIngredients([]);
      }
    } catch (error) {
      console.error("🔥 [UI] 인기성분 로드 실패:", error);
      setPopularIngredients([]);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  useEffect(() => {
    document.title = "성분별";
    const saved = localStorage.getItem("ingredient_search_history");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }

    // 초기 인기성분 로드
    loadPopularIngredients(selected);
  }, []);

  // popularIngredients 상태 변화 추적
  useEffect(() => {
    console.log("🔥 [UI] popularIngredients 상태 변화:", popularIngredients);
  }, [popularIngredients]);

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
    // 연령대 변경 시 새로운 인기성분 로드
    loadPopularIngredients(age);
  };

  const toggleAgeModal = () => {
    setShowAgeModal(!showAgeModal);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const submitSearch = async () => {
    const trimmed = searchKeyword.trim();
    if (trimmed.length === 0) return;

    setHasSearched(true);
    setIsLoading(true);
    saveSearchHistory(trimmed);

    try {
      // 실제 API 호출로 성분 검색
      const response = await fetchIngredientSearch({ keyword: trimmed });

      if (response && response.result) {
        setSearchResults(response.result);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("성분 검색 실패:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
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

  // 모바일에서는 전역 헤더 숨김(있으면)
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
      {/* ✅ 모바일에서만 이 페이지의 Navbar 표시 (PC에서는 전역 Navbar만) */}
      <div className="md:hidden">
        <Navbar />
      </div>

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

      {/* 로딩 스피너 */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
        </div>
      )}

      {/* 검색 결과 또는 검색 결과 없음 메시지 */}
      {!isLoading && hasSearched && searchResults.length === 0 ? (
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
      ) : !isLoading && searchResults.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pl-2">검색 결과</h3>
          <div className="grid grid-cols-1 gap-3">
            {searchResults.map((item) => (
              <Link
                key={item.id}
                to={`/ingredient/${encodeURIComponent(item.name)}`}
                className="w-full flex justify-between items-center py-4 px-5 rounded-3xl hover:bg-gray-300 transition bg-[#f2f2f2]"
              >
                <span className="font-semibold text-base">{item.name}</span>
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
            효능, 섭취 시기, 권장 섭취량 등
            <br />
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
            <div className="relative">
              <button
                onClick={toggleAgeModal}
                className={`text-sm font-semibold rounded-full pl-3 pr-6 py-1 appearance-none flex items-center gap-2 whitespace-nowrap ${
                  isMobile
                    ? "bg-[#FFEB9D] min-w-[80px] justify-center"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                {selected}
                <img src={downIcon} alt="드롭다운" className="w-6 h-5" />
              </button>

              {/* 나이 선택 모달 */}
              {showAgeModal && (
                <>
                  {/* PC 버전: 드롭다운 형태 */}
                  {!isMobile && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[200px]">
                      <div className="p-3">
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
                            className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                              selected === age
                                ? "bg-[#FFEB9D] text-black"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {age}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 모바일 버전: 하단에서 올라오는 모달 */}
          {/* 모바일 버전: 하단에서 올라오는 모달 */}
          {showAgeModal && isMobile && (
            <div className="fixed inset-0 z-50">
              {/* 🔹 어두운 오버레이 */}
              <button
                aria-label="모달 닫기"
                className="absolute inset-0 bg-black/40"
                onClick={toggleAgeModal}
              />

              {/* 바텀시트 */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
                style={{
                  paddingBottom: "max(16px, env(safe-area-inset-bottom))",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-left mb-2">
                    연령 선택
                  </h3>
                  <div className="w-full h-px bg-gray-300"></div>
                </div>

                <div className="space-y-3">
                  {/* 위쪽 행: 10대, 20대, 30대, 40대 */}
                  <div className="grid grid-cols-4 gap-3">
                    {["10대", "20대", "30대", "40대"].map((age) => (
                      <button
                        key={age}
                        onClick={() => handleChange(age)}
                        className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                          selected === age
                            ? "bg-[#FFEB9D] text-black"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>

                  {/* 아래쪽 행: 50대, 60대 이상, 전체 연령 */}
                  <div className="flex gap-3 justify-center">
                    {["50대", "60대 이상", "전체 연령"].map((age) => (
                      <button
                        key={age}
                        onClick={() => handleChange(age)}
                        className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                          selected === age
                            ? "bg-[#FFEB9D] text-black"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 성분 리스트 */}
          {isLoadingPopular ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-500">
                인기성분을 불러오는 중...
              </span>
            </div>
          ) : popularIngredients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">
                해당 연령대의 인기성분이 없습니다.
              </p>
              <p className="text-sm text-gray-400">
                다른 연령대를 선택해보세요!
              </p>
            </div>
          ) : isMobile ? (
            <div className="grid grid-cols-1 gap-3 pb-10">
              {popularIngredients.map((item, index) => (
                <Link
                  key={item.id || `popular-${index}`}
                  to={`/ingredient/${encodeURIComponent(item.ingredientName)}`}
                  className="w-full flex justify-between items-center py-4 px-5 rounded-3xl hover:bg-gray-300 transition bg-[#f2f2f2]"
                >
                  <span className="font-semibold text-base">
                    {item.ingredientName}
                  </span>
                  <FiChevronRight size={20} className="text-gray-500" />
                </Link>
              ))}
            </div>
          ) : (
            <div
              className={`grid gap-4 pb-10 pt-3 justify-start ${
                popularIngredients.length === 1
                  ? "grid-cols-1"
                  : popularIngredients.length === 2
                    ? "grid-cols-2"
                    : popularIngredients.length === 3
                      ? "grid-cols-3"
                      : popularIngredients.length === 4
                        ? "grid-cols-4"
                        : "grid-cols-5"
              }`}
            >
              {popularIngredients.map((item, index) => (
                <Link
                  key={item.id || `popular-${index}`}
                  to={`/ingredient/${encodeURIComponent(item.ingredientName)}`}
                >
                  <div className="bg-white px-6 py-10 rounded-xl shadow text-center font-semibold text-lg shadow-md transition hover:shadow-lg w-full h-32 flex items-center justify-center">
                    {item.ingredientName}
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
