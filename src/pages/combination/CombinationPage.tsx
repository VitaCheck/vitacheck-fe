import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cat from "../../assets/CatWithPointer.png";
import Chick from "../../assets/chick.png";
import Search from "../../assets/search.png";
import axios from "@/lib/axios";
import Navbar from "@/components/NavBar";

// 분리된 모듈 Import
import type { Combination } from "@/types/combination";
import useIsMobile from "@/hooks/useIsMobile";
import CombinationCardList from "@/components/combination/CombinationCardList";

const CombinationPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [riskyCombinations, setRiskyCombinations] = useState<Combination[]>([]);
  const [goodCombinations, setGoodCombinations] = useState<Combination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const placeholder = "제품을 입력해주세요.";
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    const fetchCombinations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/v1/combinations/recommend");
        const result = response.data.result;
        if (result) {
          setGoodCombinations(result.goodCombinations || []);
          setRiskyCombinations(result.cautionCombinations || []);
        } else {
          setGoodCombinations([]);
          setRiskyCombinations([]);
        }
      } catch (e) {
        console.error("조합 추천 데이터를 불러오는 데 실패했습니다.", e);
        setGoodCombinations([]);
        setRiskyCombinations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCombinations();
  }, []);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setIsSearching(true);
    const updated = [
      trimmed,
      ...searchHistory.filter((v) => v !== trimmed),
    ].slice(0, 3);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));

    setTimeout(() => {
      navigate(`/add-combination?query=${encodeURIComponent(trimmed)}`);
    }, 500);
  };

  const handleDelete = (itemToDelete: string) => {
    const updated = searchHistory.filter((item) => item !== itemToDelete);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // 모바일에서는 전역 헤더 숨김(있으면)
  useEffect(() => {
    if (!isMobile) return;
    const headerEl = document.querySelector("header");
    if (headerEl instanceof HTMLElement) {
      // headerEl.style.display = "none"; // 원본 코드의 이 부분은 아래 Navbar 로직과 충돌할 수 있어 주석 처리
    }
    return () => {
      if (headerEl instanceof HTMLElement) {
        // headerEl.style.display = "";
      }
    };
  }, [isMobile]);

  return (
    <div className="mx-auto max-w-screen-xl px-4 pt-2 sm:px-36 sm:pt-10">
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="w-[90%] lg:w-[67%] mx-auto">
          <Navbar />
        </div>
      </header>

      {/* 조합추가 - 모바일 */}
      <h1 className="font-Pretendard mb-5 block pt-6 pl-2 text-[24px] leading-[100%] font-bold tracking-[-0.02em] md:hidden">
        조합 추가
      </h1>

      {/* 조합추가 - PC */}
      <h1 className="mb-6 hidden pl-2 text-2xl font-semibold sm:mb-8 sm:ml-8 sm:text-4xl md:block">
        조합 추가
      </h1>

      {/* 검색창 - 모바일 */}
      <div className="mb-4 flex justify-center md:hidden">
        <div className="flex w-full max-w-md items-center rounded-full border border-gray-300 bg-white px-4 py-3">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSearching) handleSearch();
            }}
            disabled={isSearching}
            className={`w-full bg-transparent text-lg placeholder-gray-300 ${
              isSearching ? "cursor-not-allowed text-gray-300" : "text-gray-400"
            }`}
          />
          {isSearching ? (
            <div className="ml-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          ) : (
            <img
              src={Search}
              alt="검색"
              onClick={handleSearch}
              className="ml-2 h-5 w-5 cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* 검색창 - PC */}
      <section className="mb-6 hidden justify-center md:flex">
        <div className="flex w-full max-w-3xl items-center rounded-full border border-gray-300 bg-white px-6 py-4 shadow-sm">
          <input
            type="text"
            placeholder="제품을 입력해주세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSearching) handleSearch();
            }}
            disabled={isSearching}
            className={`w-full text-base placeholder-gray-400 outline-none ${
              isSearching ? "cursor-not-allowed text-gray-300" : "text-gray-800"
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="ml-2 cursor-pointer"
            >
              <img
                src="/images/성분 검색결과/x.png"
                alt="지우기"
                className="h-6 w-6"
              />
            </button>
          )}
          {isSearching ? (
            <div className="ml-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          ) : (
            <img
              src={Search}
              alt="검색"
              onClick={handleSearch}
              className="ml-2 h-6 w-6 cursor-pointer"
            />
          )}
        </div>
      </section>

      {/* 검색 기록 - 모바일 */}
      {searchHistory.length > 0 && (
        <div className="block flex justify-center md:hidden">
          <div
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px]"
            style={{ width: "300px", height: "auto", opacity: 1 }}
          >
            {searchHistory.map((item, idx) => (
              <div key={idx} className="flex items-center gap-[4px]">
                <button
                  onClick={() => {
                    setSearchTerm(item);
                    setIsSearching(true);
                    setTimeout(() => {
                      navigate(
                        `/add-combination?query=${encodeURIComponent(item)}`
                      );
                    }, 500);
                  }}
                  className="text-[13px] font-medium text-gray-700"
                >
                  {item}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-[16px] text-[#8A8A8A]"
                  title="삭제"
                >
                  <img
                    src="/images/PNG/조합 2-1/delete.png"
                    alt="삭제 아이콘"
                    className="mt-[2px] h-[16px] w-[16px]"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 기록 - PC */}
      {searchHistory.length > 0 && (
        <div className="mb-5 hidden flex-wrap justify-center gap-[24px] px-[35.64px] md:flex">
          {searchHistory.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-[8px] rounded-[6px] px-[12px] py-[4px] transition hover:bg-gray-100"
            >
              <button
                onClick={() => {
                  setSearchTerm(item);
                  setIsSearching(true);
                  setTimeout(() => {
                    navigate(
                      `/add-combination?query=${encodeURIComponent(item)}`
                    );
                  }, 500);
                }}
                className="font-Pretendard text-[18px] leading-[120%] font-medium tracking-[-0.02em] text-[#6B6B6B] hover:text-black"
              >
                {item}
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="flex h-[20px] w-[20px] items-center justify-center"
                title="삭제"
              >
                <img
                  src="/images/PNG/조합 2-1/delete.png"
                  alt="삭제"
                  className="h-[16px] w-[16px]"
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 고양이 일러스트 + 설명 - 모바일 */}
      <div className="relative my-20 flex justify-center md:hidden">
        <div className="relative w-[200px]">
          <p className="font-Pretendard absolute top-[-30px] left-[-80px] w-[200px] text-start text-[18px] leading-[120%] font-medium tracking-[-0.02em] ml-[5%] text-black">
            성분 과잉 섭취 <br />
            걱정 마세요!
          </p>
          <img src={Cat} alt="고양이" className="w-full" />
          <img
            src={Chick}
            alt="병아리"
            className="absolute bottom-[18px] left-[22px] w-[45px]"
          />
          <p className="font-Pretendard absolute right-[-90px] bottom-[-30px] w-[200px] text-right text-[18px] leading-[90%] font-medium tracking-[-0.02em] mr-[10%] text-black">
            성분별 총량을 한눈에!
          </p>
        </div>
      </div>

      {/* 고양이 일러스트 + 설명 - PC */}
      <div className="relative my-10 flex hidden w-full justify-center md:flex">
        <div className="relative flex w-full max-w-screen-xl items-center justify-center gap-[40px]">
          <div className="flex h-full flex-col justify-start">
            <p className="font-Pretendard text-center text-[25px] leading-[120%] font-medium tracking-[-0.02em]">
              성분 과잉 섭취 걱정 마세요!
            </p>
          </div>
          <div className="relative w-[200px] shrink-0">
            <img src={Cat} alt="고양이" className="w-full" />
            <img
              src={Chick}
              alt="병아리"
              className="absolute bottom-[18px] left-[22px] w-[45px]"
            />
          </div>
          <div className="flex h-full flex-col justify-end">
            <p className="font-Pretendard text-center text-[25px] leading-[120%] font-medium tracking-[-0.02em]">
              성분별 총량을 한눈에!
            </p>
          </div>
        </div>
      </div>

      {/* 구분선 (모바일) */}
      <div>
        <div className="mx-auto block h-[0.5px] w-full bg-[#B2B2B2] md:hidden" />
      </div>

      <CombinationCardList
        goodCombinations={goodCombinations}
        riskyCombinations={riskyCombinations}
        isLoading={isLoading}
        isMobile={isMobile}
      />
    </div>
  );
};

export default CombinationPage;
