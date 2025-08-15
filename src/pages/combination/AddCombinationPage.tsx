import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import CombinationProductCard from "../../components/combination/CombinationProductCard";
import ExpandableProductGroup from "../../components/combination/ExpandableProductGroup";
import SadCat from "../../../public/images/rate1.png";
import { FiSearch, FiX } from "react-icons/fi";
import axios from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

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

  const query = searchParams.get("query") || "";
  const preSelectedItems = location.state?.selectedItems || [];

  const [searchTerm, setSearchTerm] = useState("");
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
    if (query) {
      fetchSupplements(query);
    }
  }, [query]);

  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSearchHistory(parsed);

      if (!searchTerm) {
        setSearchTerm(parsed[0] || "");
      }
    }
  }, []);

  useEffect(() => {
    if (preSelectedItems.length > 0) {
      setSelectedItems(preSelectedItems);
    }
  }, [preSelectedItems]);

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

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] md:bg-[#FAFAFA] px-0 md:px-4 py-0 font-pretendard flex flex-col pb-[80px]">
      {/* 조합추가 - 모바일 버전 */}
      <h1 className="block md:hidden font-Pretendard font-bold text-[32px] leading-[100%] tracking-[-0.02em] mb-5 px-10 pt-10">
        조합 추가
      </h1>

      {/* 조합추가 - PC 버전 */}
      <h1 className="hidden md:block font-pretendard font-bold text-[52px] leading-[120%] tracking-[-0.02em] mb-8 px-[230px] pt-[50px]">
        조합 추가
      </h1>

      {/* 검색창 - 모바일 */}
      <div className="flex justify-center mb-4 md:hidden">
        <div className="w-[366px] h-[52px] bg-white border border-[#C7C7C7] rounded-[44px] flex items-center px-[18px] gap-[84px]">
          <input
            type="text"
            className="flex-1 h-full bg-transparent outline-none
            placeholder:font-pretendard placeholder:text-[18px]
            placeholder:text-black placeholder:opacity-40
            placeholder:leading-[120%] placeholder:tracking-[-0.02em]
            text-[18px]"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="text-gray-400 text-xl ml-[-18px]"
          >
            <FiSearch />
          </button>
        </div>
      </div>

      {/* 검색창 - PC */}
      <div className="hidden md:flex justify-center mb-3">
        <div className="w-[1400px] h-[85px] bg-transparent border border-[#C7C7C7] rounded-[88px] flex items-center px-[35.64px] gap-[165px]">
          <input
            type="text"
            className="flex-1 h-full bg-transparent outline-none
        placeholder:font-Pretendard placeholder:font-medium
        placeholder:text-black placeholder:opacity-40
        placeholder:leading-[30px] placeholder:tracking-[-0.02em]
        placeholder:text-[30px] 
        text-[30px] leading-[30px]"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button onClick={handleSearch} className="text-gray-400 text-2xl">
            <FiSearch />
          </button>
        </div>
      </div>

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
                  onClick={() => {
                    setSearchTerm(item);
                    navigate(
                      `/add-combination?query=${encodeURIComponent(item)}`
                    );
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
            <div key={idx} className="flex items-center gap-2 px-8 py-2">
              <button
                onClick={() => {
                  setSearchTerm(item);
                  navigate(
                    `/add-combination?query=${encodeURIComponent(item)}`,
                    {
                      replace: false,
                      state: { selectedItems },
                    }
                  );
                }}
                className="text-[20px] font-medium leading-[120%] tracking-[-0.02em] text-[#000000] hover:underline"
              >
                {item}
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="text-[16px] text-[#8A8A8A]"
                title="삭제"
              >
                <img
                  src="/src/assets/delete.png"
                  alt="삭제 아이콘"
                  className="w-[28px] h-[28px] mt-[2.5px]"
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 본문 */}
      <div className="flex flex-col lg:flex-row gap-8 relative">
        <div className="flex-1">
          {query && (
            <>
              {/* 검색어 제목 - 모바일 */}
              <h2 className="block md:hidden font-pretendard font-bold text-[22px] leading-[120%] tracking-[-0.02em] px-[38px] mb-6">
                {query}
              </h2>

              {/* 검색어 제목 - PC */}
              <h2 className="hidden md:block font-pretendard font-bold text-[40px] leading-[120%] tracking-[-0.02em] mb-8 px-[230px] pt-[10px]">
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
              <div className="hidden md:flex px-[230px] mt-[50px] gap-[60px]">
                <div className="grid grid-cols-3 gap-[40px] w-[980px]">
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
            </>
          ) : (
            query && (
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
                    className="w-[200px] mt-5 mb-2"
                  />
                  <p className="font-pretendard font-medium text-[36px] leading-[120%] tracking-[-0.02em] text-[#808080]">
                    일치하는 검색 결과가 없습니다.
                  </p>
                </div>
              </>
            )
          )}
        </div>

        {/* 분석 목록 (검색 결과 있을 때만) */}
        {results.length > 0 && (
          <>
            {/* PC 분석 목록 */}
            <div
              className="hidden lg:block sticky top-[30px]"
              style={{
                width: "314px",
                height: "fit-content",
                right: "250px",
                gap: "22px",
                opacity: 1,
                marginTop: "50px",
              }}
            >
              {/* 분석 시작 버튼 */}
              <div className="w-[314px] flex-shrink-0">
                <button
                  onClick={handleAnalyze}
                  className="w-full h-[80px] bg-[#FFEB9D] rounded-[59px] text-[30px] font-semibold font-pretendard leading-[120%] tracking-[-0.02em] text-center mt-[10px] mb-[30px]"
                >
                  분석 시작
                </button>

                {selectedItems.length > 0 && (
                  <div className="bg-[#F2F2F2] border border-[#9C9A9A] rounded-[36px] px-[34px] py-[33px] flex flex-col gap-10 flex:1">
                    {selectedItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative w-full h-[250px] bg-white border border-gray-200 rounded-[30px] flex flex-col items-center justify-center px-4 py-6 shadow"
                      >
                        <button
                          onClick={() => handleRemove(item.supplementName)}
                          className="absolute top-3 right-4"
                        >
                          <img
                            src="/src/assets/delete.png"
                            alt="삭제"
                            className="w-[40px] h-[40px]"
                          />
                        </button>

                        <img
                          src={item.imageUrl}
                          className="w-[120px] h-[120px] object-contain mb-4"
                        />
                        <p className="text-sm text-center font-medium leading-tight">
                          {item.supplementName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
                    src="/src/assets/시작.png"
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
                        className="w-[80px] h-[80px] mt-2 object-contain mb-3"
                      />
                      <p className="text-[13px] -mt-1 font-medium leading-[100%] tracking-[-0.02em] text-center font-pretendard text-black px-3">
                        {item.supplementName}
                      </p>
                      <button
                        onClick={() => handleRemove(item.supplementName)}
                        className="absolute bottom-23 right-1"
                      >
                        <img
                          src="/src/assets/delete.png"
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
