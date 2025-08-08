import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import searchIcon from "../../assets/search.png";
import { fetchIngredientSearch } from "@/apis/ingredient"; // 경로는 프로젝트 구조에 맞게 조정
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

  const handleSearch = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    try {
      setIsLoading(true);

      const params: {
        keyword?: string;
        ingredientName?: string;
        brand?: string;
      } = {};

      if (trimmed) params.ingredientName = trimmed;

      const res = await fetchIngredientSearch(params);

      //const matched = res?.result?.matchedIngredients;

      const matched = [
        {
          ingredientId: 1,
          ingredientName: "비타민a",
          amount: 0,
          unit: "string",
        },
        {
          ingredientId: 2,
          ingredientName: "비타민c",
          amount: 0,
          unit: "string",
        },
      ];
      console.log(matched);

      if (!matched || matched.length === 0) {
        navigate("/ingredient/no-result");
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
      navigate("/ingredient/no-result");
    } finally {
      setIsLoading(false);
    }
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
          className="w-full border border-gray-300 rounded-full py-4 px-5 pr-10 text-md outline-none"
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <img src={searchIcon} alt="검색" className="w-5 h-5" />
        </button>
      </div>

      {/* 결과 리스트 */}
      {isLoading ? (
        <p className="text-center text-gray-500">검색 중...</p>
      ) : (
        <ul className="space-y-5">
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
      )}
    </div>
  );
};

export default IngredientSearchSection;
