import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import searchIcon from "../../assets/search.png";
import { fetchIngredientSearch } from "@/apis/ingredient";
import { AxiosError } from "axios";

const IngredientSearchSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialKeyword = queryParams.get("keyword") || "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [results, setResults] = useState<
    { ingredientId: number; ingredientName: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    try {
      setIsLoading(true);
      setHasSearched(true);

      const params: {
        keyword?: string;
        ingredientName?: string;
        brand?: string;
      } = {};

      if (trimmed) params.ingredientName = trimmed;

      const res = await fetchIngredientSearch(params);

      const matched = res?.result?.matchedIngredients || res?.results || [];
      console.log("API 응답:", res);
      console.log("매칭된 성분:", matched);

      if (!matched || matched.length === 0) {
        setResults([]);
      } else {
        const names = matched.map(
          (item: { ingredientName: string }) => item.ingredientName
        );
        setResults(matched);
        console.log("결과 저장됨:", names);
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      console.error("검색 실패:", axiosErr.response?.data || axiosErr.message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setKeyword("");
    setResults([]);
    setHasSearched(false);
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    setKeyword(initialKeyword);
    if (initialKeyword) {
      handleSearch();
    }
  }, [initialKeyword]);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-10">성분별</h1>

      {/* 검색창 */}
      <div className="relative mb-10">
        <input
          type="text"
          placeholder="성분을 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleEnterKey}
          className="w-full border border-gray-300 rounded-full py-4 px-5 pr-20 text-md outline-none"
        />

        {keyword && (
          <button
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <img
              src="/images/성분 검색결과/x.png"
              alt="지우기"
              className="w-5 h-5"
            />
          </button>
        )}

        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <img src={searchIcon} alt="검색" className="w-5 h-5" />
        </button>
      </div>

      {/* 검색 결과 또는 검색 결과 없음 메시지 */}
      {isLoading ? (
        <p className="text-center text-gray-500">검색 중...</p>
      ) : hasSearched && results.length === 0 ? (
        // ✅ 패딩 제거, 세로 정렬 + 촘촘한 간격
        <div className="text-center flex flex-col items-center gap-1">
          <img
            src="/images/PNG/성분 2-2/cat_character.png"
            alt="검색 결과 없음"
            className="w-36 h-36 object-contain mb-1" // ← 아주 작은 간격
          />
          <p className="text-gray-500 text-base leading-tight">
            일치하는 검색 결과가 없습니다.
          </p>
        </div>
      ) : results.length > 0 ? (
        <ul className="space-y-2">
          {results.map((item) => (
            <li key={item.ingredientId}>
              <button
                onClick={() =>
                  navigate(
                    `/ingredient/${encodeURIComponent(item.ingredientName)}`,
                    {
                      state: { id: item.ingredientId },
                    }
                  )
                }
                className="w-full flex justify-between items-center px-4 py-5 rounded-xl shadow-sm bg-white border border-gray-200"
              >
                <span>{item.ingredientName}</span>
                <span className="text-gray-400">{">"}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default IngredientSearchSection;
