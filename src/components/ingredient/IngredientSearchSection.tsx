import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import searchIcon from "../../assets/search.png";
import { fetchIngredientSearch } from "@/apis/ingredient";
import { AxiosError } from "axios";
import NoSearchResult from "./NoSearchResult";

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
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    try {
      setIsLoading(true);
      setHasSearched(true);
      setError(null);

      const params: {
        keyword?: string;
        ingredientName?: string;
        brand?: string;
      } = {};

      if (trimmed) params.ingredientName = trimmed;

      const res = await fetchIngredientSearch(params);

      // API 응답 구조에 맞춰 수정
      const matched = res?.result || [];
      console.log("API 응답:", res);
      console.log("매칭된 성분:", matched);

      if (!matched || matched.length === 0) {
        setResults([]);
      } else {
        // API 응답 구조에 맞춰 매핑
        const mappedResults = matched.map((item: any) => ({
          ingredientId: item.id, // "id" 필드 사용
          ingredientName: item.name, // "name" 필드 사용
        }));
        setResults(mappedResults);
        console.log("결과 저장됨:", mappedResults);
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      console.error("검색 실패:", axiosErr.response?.data || axiosErr.message);
      setError("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
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
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
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
          disabled={isLoading}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 disabled:opacity-50"
        >
          <img src={searchIcon} alt="검색" className="w-5 h-5" />
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* 검색 결과 또는 검색 결과 없음 메시지 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">검색 중...</p>
          </div>
        </div>
      ) : (
        hasSearched &&
        !isLoading && (
          <div className="space-y-4">
            {results.length > 0 ? (
              <>
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-lg">
                    <span className="font-semibold text-blue-600">
                      {results.length}
                    </span>
                    개의 성분을 찾았습니다
                  </p>
                </div>
                <div className="space-y-3">
                  {results.map((result) => (
                    <div
                      key={result.ingredientId}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                      onClick={() =>
                        navigate(`/ingredient/${result.ingredientName}`)
                      }
                    >
                      <span className="text-lg font-medium">
                        {result.ingredientName}
                      </span>
                      <img
                        src="/images/PNG/성분 1/arrow_forward_ios.png"
                        alt="화살표"
                        className="w-5 h-5"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <NoSearchResult />
            )}
          </div>
        )
      )}
    </div>
  );
};

export default IngredientSearchSection;
