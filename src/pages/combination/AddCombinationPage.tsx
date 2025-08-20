import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import CombinationProductCard from "../../components/combination/CombinationProductCard";
import ExpandableProductGroup from "../../components/combination/ExpandableProductGroup";
import SadCat from "../../../public/images/rate1.png";
import searchIcon from "../../assets/search.png";
import axios from "@/lib/axios";
import Navbar from "@/components/NavBar";

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

interface Product {
  supplementId: number;
  supplementName: string;
  imageUrl: string;
  price: number;
  description: string;
  method: string;
  caution: string;
  brandName: string;
  ingredients: {
    ingredientName: string;
    amount: number;
    unit: string;
  }[];
}

const AddCombinationPage = () => {


  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isMobile = useIsMobile();

  const query = searchParams.get("query") || "";
  const preSelectedItems = location.state?.selectedItems || [];

  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);

  const placeholder = "제품을 입력해주세요.";

  const fetchSupplements = async (search: string) => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/v1/supplements/search", {
        params: { keyword: search, page: 0, size: 20 },
      });
      setResults(res.data.result?.supplements?.content || []);
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSearchTerm(query);
  }, [query])

  useEffect(() => {
    if (query) {
      fetchSupplements(query);
    }
  }, [query]);

  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSearchHistory(parsed);
    }
  }, []);

  useEffect(() => {
    if (preSelectedItems.length > 0) {
      setSelectedItems(preSelectedItems);
    }
  }, [preSelectedItems]);

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

  const handleToggleCheckbox = (idx: number) => {
    setCheckedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...searchHistory.filter((item) => item !== trimmed),
    ].slice(0, 3);

    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setSearchHistory(updated);

    navigate(`/add-combination?query=${encodeURIComponent(trimmed)}`, {
      replace: false,
      state: { selectedItems },
    });
  };

  const handleAnalyze = () => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    navigate("/combination-result", {
      state: { selectedItems: selectedItems },
    });
  };

  const handleToggle = (item: any) => {
    const exists = selectedItems.find(
      (i) => i.supplementId === item.supplementId
    );
    if (exists) {
      setSelectedItems(
        selectedItems.filter((i) => i.supplementId !== item.supplementId)
      );
    } else {
      if (selectedItems.length >= 10) {
        alert("최대 10개까지 선택할 수 있습니다.");
        return;
      }
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemove = (name: string) => {
    setSelectedItems(selectedItems.filter((i) => i.supplementName !== name));
  };

  const handleDelete = (itemToDelete: string) => {
    const updated = searchHistory.filter((item) => item !== itemToDelete);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const hasAside = results.length > 0;

  return (
<div className="px-4 sm:px-36 pt-2 sm:pt-10 pb-24 lg:pb-16 max-w-screen-xl mx-auto"> {/* ← 하단 패딩 추가 */}
{/* ✅ 모바일에서만 이 페이지의 Navbar 표시 (PC에서는 전역 Navbar만) */}
      <div className="md:hidden">
        <Navbar />
      </div>
      
      {/* 조합추가 - 모바일 */}
      <h1 className="block md:hidden font-Pretendard font-bold text-[24px] leading-[100%] tracking-[-0.02em] mb-5 pl-2 pt-6">
        조합 추가
      </h1>

      {/* 조합추가 - PC */}
      <h1 className="hidden md:block text-2xl sm:text-4xl font-semibold mb-6 sm:mb-8 pl-2 sm:ml-8">조합 추가</h1>

      {/* 검색창 - 모바일 */}
      <div className="flex justify-center mb-4 md:hidden">
        <div className="flex items-center w-full max-w-md px-4 py-3 bg-white border border-gray-300 rounded-full">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="w-full bg-transparent text-lg bg-transparent text-gray-400 placeholder-gray-300"
          />
          <img
            src="/src/assets/search.png"
            alt="검색"
            onClick={handleSearch}
            className="ml-2 w-5 h-5 cursor-pointer"
          />
        </div>
      </div>

            {/* 검색창 - PC */}
      <section className="hidden md:flex justify-center mb-6">
        <div className="flex items-center w-full max-w-3xl rounded-full border border-gray-300 px-6 py-4 bg-white shadow-sm">
          <input
            type="text"
            placeholder="제품을 입력해주세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="w-full outline-none text-base text-gray-800 placeholder-gray-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="ml-2 cursor-pointer">
              <img src="/images/성분 검색결과/x.png" alt="지우기" className="w-6 h-6" />
            </button>
          )}
          <img src="/src/assets/search.png" alt="검색" onClick={handleSearch} className="ml-2 w-6 h-6" />
        </div>
      </section>

      {/* 검색 기록 - 모바일 */}
      {searchHistory.length > 0 && (
        <div className="block md:hidden mb-12 flex justify-center">
          <div
            className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[14px]"
            style={{ width: "300px", height: "auto", opacity: 1 }}
          >
            {searchHistory.map((item, idx) => (
              <div key={idx} className="flex items-center gap-[4px]">
                <button
                  // 검색 기록 버튼 onClick 내부
onClick={() => {
  // 입력창 반영
  setSearchTerm(item);

  // 선택한 항목을 히스토리 맨 앞으로(옵션)
  const updated = [item, ...searchHistory.filter(v => v !== item)].slice(0, 3);
  setSearchHistory(updated);
  localStorage.setItem("searchHistory", JSON.stringify(updated));

  // 페이지 이동
  navigate(`/add-combination?query=${encodeURIComponent(item)}`);
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
                    alt="삭제" 
                    className="w-4 h-4 mt-0.5"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 기록 - PC */}
      {searchHistory.length > 0 && (
        <div className="hidden md:flex justify-center gap-[24px] flex-wrap px-[35.64px] mb-5">
          {searchHistory.map((item, idx) => (
            <div key={idx} className="flex items-center gap-[8px] px-[12px] py-[4px] rounded-[6px] hover:bg-gray-100 transition">
              <button
                onClick={() => {
                  setSearchTerm(item);
                  navigate(`/add-combination?query=${encodeURIComponent(item)}`);
                }}
                className="text-[18px] font-Pretendard font-medium leading-[120%] tracking-[-0.02em] text-[#6B6B6B] hover:text-black"
              >
                {item}
              </button>
              <button onClick={() => handleDelete(item)} className="flex items-center justify-center w-[20px] h-[20px]" title="삭제">
                <img src="/images/PNG/조합 2-1/delete.png" alt="삭제" className="w-[16px] h-[16px]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 본문 */}
<div
  className={`relative ${
    hasAside
      ? "lg:grid lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-5 lg:items-start"  // ← aside 폭 250px + 교차축 정렬
      : "lg:max-w-5xl lg:mx-auto"
  }`}
>
  <div className={hasAside ? "flex-1 min-w-0" : "w-full min-w-0"}> {/* ← min-w-0 추가로 가로 튐 방지 */}

          {query && (
            <>
              {/* 검색어 제목 - 모바일 */}
              <h2 className="block md:hidden font-pretendard font-bold text-[20px] leading-[120%] tracking-[-0.02em] pl-2 mb-6">
                {query}
              </h2>

              {/* 검색어 제목 - PC */}
              <h2 className="hidden md:block font-pretendard font-bold text-[25px] leading-[120%] tracking-[-0.02em] mb-8 pl-2 sm:ml-8">
                {query}
              </h2>
            </>
          )}

          {results.length > 0 ? (
            <>
              {/* 모바일 카드: 펼쳐보기 적용 */}
              <div className="block md:hidden px-4">
                <ExpandableProductGroup
                  title={query}
                  selectedItems={selectedItems}
                  onToggle={handleToggle}
                  hideTitle={true}
                />
              </div>

              {/* PC 카드 */}
              <div className="hidden md:block mt-12">
  <div className="mx-auto max-w-5xl px-[35.64px] pb-10"> {/* ← 바닥 여백 추가 */}
    <div
      className="grid w-full gap-x-8 gap-y-8 place-items-center
                 grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3"
      style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
    >


                  {results.map((item: Product) => (
                    <CombinationProductCard
                      key={item.supplementId}
                      item={item}
                      isSelected={selectedItems.some(
                        (i) => i.supplementId === item.supplementId
                      )}
                      onToggle={() => handleToggle(item)}
                    />
                  ))}
                </div>
              </div>
              </div>
            </>
          ) : (
            query && (
              <>
                {isLoading ? (
                  // 로딩 중 표시
                  <>
                    <div className="block md:hidden flex flex-col items-center justify-center mt-20">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FFEB9D]"></div>
                      <p className="font-pretendard font-medium text-[24px] leading-[120%] tracking-[-0.02em] text-[#808080] text-center mt-4">
                        검색 중...
                      </p>
                    </div>

                    {/* PC 전용: 로딩 중 */}
                    <div className="hidden md:flex flex-col items-center justify-center mt-20 mb-50">
                      <div className="animate-spin rounded-full h-20 w-20 border-b-10 border-[#FFEB9D]"></div>
                      <p className="font-pretendard font-medium text-[36px] leading-[120%] tracking-[-0.02em] text-[#808080] mt-4">
                        검색 중...
                      </p>
                    </div>
                  </>
                ) : (
                  // 검색 결과 없음 표시
                  <>
                    <div className="block md:hidden flex flex-col items-center justify-center mt-20">
                      <img
                        src={SadCat}
                        alt="검색 결과 없음"
                        className="w-[160px] mt-5 mb-2"
                      />
                      <p className="font-pretendard font-medium text-[24px] leading-[120%] tracking-[-0.02em] text-[#808080] text-center">
                        일치하는 검색 결과가 없습니다.
                      </p>
                    </div>

                    {/* PC 전용: 검색 결과 없음 */}
                    <div className="hidden md:flex flex-col items-center justify-center mt-20">
                      <img
                        src={SadCat}
                        alt="검색 결과 없음"
                        className="w-[150px] mt-5 mb-2"
                      />
                      <p className="font-pretendard font-medium text-[30px] leading-[120%] tracking-[-0.02em] text-[#808080] mb-[120px]">
                        일치하는 검색 결과가 없습니다.
                      </p>
                    </div>
                  </>
                )}
              </>
            )
          )}
        </div>

        {/* 분석 목록 (검색 결과 있을 때만) */}
        {results.length > 0 && (
          <>
            {/* PC 분석 목록 */}
             <aside className="hidden lg:block sticky top-8 self-start w-full max-w-[250px]"> {/* ← 핵심 수정 */}
  <div className="w-full">

    <button
      onClick={handleAnalyze}
      className="w-full h-[55px] bg-[#FFEB9D] rounded-[59px] text-[18px] font-semibold font-pretendard leading-[120%] tracking-[-0.02em] text-center"
    >
      분석 시작
    </button>

    {selectedItems.length > 0 && (
      <div className="mt-6 bg-[#F2F2F2] border border-[#9C9A9A] rounded-[24px] px-5 py-5 flex flex-col gap-6">
        {selectedItems.map((item, idx) => (
          <div
            key={idx}
            className="relative w-full h-[180px] bg-white border border-gray-200 rounded-[24px] flex flex-col items-center justify-center px-4 py-6 shadow"
          >
            <button
              onClick={() => handleRemove(item.supplementName)}
              className="absolute top-3 right-4"
            >
              <img
                src="/images/PNG/조합 2-1/delete.png"
                alt="삭제"
                className="w-[30px] h-[35px]"
              />
            </button>

            <img
              src={item.imageUrl}
              className="w-[100px] h-[75px] object-contain mt-4"
            />
            <p className="text-[15px] text-center font-medium leading-tight mt-3">
              {item.supplementName}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
</aside>


            {/* 모바일 분석 목록 */}
            <div
              className="lg:hidden fixed bottom-0 left-0 w-full bg-white z-50"
              style={{
                boxShadow: "0px -22px 40px 0px #C1C1C140",
                paddingTop: "18px",
                paddingRight: "10px",
                paddingBottom: "max(20px, env(safe-area-inset-bottom))",
                paddingLeft: "10px",
                maxHeight: "280px",
                boxSizing: "border-box",
              }}
            >
              {/* 상단: 제목 & 시작 버튼 */}
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-pretendard font-bold text-[22px] leading-[120%] tracking-[-0.02em] px-3">
                  분석 목록
                </h3>
                <button
                  onClick={handleAnalyze}
                  className="bg-transparent p-0 border-none" // 버튼 배경 제거 및 여백 제거
                >
                  <img
                    src="/images/PNG/조합 2-1/시작.png"
                    alt="분석 시작"
                    className="w-[80px] h-[40px] mr-1.5 object-contain"
                  />
                </button>
              </div>

              {/* 설명 텍스트 */}
              <p className="text-[14px] font-medium leading-[120%] tracking-[-0.02em] text-[#808080] mb-5 font-pretendard px-3">
                최대 10개 선택
              </p>

              {/* 전체 감싸는 외곽 카드 */}
              <div
                className="w-full max-w-[600px] mx-auto rounded-[25px] border border-[#B2B2B2] bg-white overflow-x-auto hide-scrollbar"
                style={{ height: "160px" }}
              >
                <div className="flex gap-[10px] w-max">
                  {selectedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative w-[130px] h-[130px] bg-white rounded-[10px] flex-shrink-0 flex flex-col items-center"
                      style={{
                        paddingTop: "22px",
                        paddingBottom: "12px",
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        className="w-[75px] h-[70px] mt-3 object-contain mb-2"
                      />
                      {/* 제목 래퍼: 고정 높이 + 중앙 정렬 */}
<div className="mt-[-4px] h-[34px] flex items-center justify-center px-4">
  <p
    title={item.supplementName} // 전체명 툴팁
    className={[
      "text-center font-pretendard font-medium tracking-[-0.02em] text-black",
      "leading-[120%]",
      // 긴 제목 대응: 2줄 말줄임 + 한글 어절 유지 + 영어 단어는 break 허용
      "line-clamp-2 break-keep break-words overflow-hidden",
      // 기본 13px, 너무 길면 줄바꿈되며 시각적으로 깔끔
      "text-[13px]",
    ].join(" ")}
  >
    {item.supplementName}
  </p>
</div>

                      <button
                        onClick={() => handleRemove(item.supplementName)}
                        className="absolute bottom-23 right-1"
                      >
                        <img
                            src="/images/PNG/조합 2-1/delete.png"
                            alt="삭제"
                          className="w-[27px] h-[27px]"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default AddCombinationPage;
