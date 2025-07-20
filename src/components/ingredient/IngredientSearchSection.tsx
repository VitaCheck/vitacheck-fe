import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import searchIcon from "../../assets/search.png";

const IngredientSearchSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialKeyword = queryParams.get("query") || "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = () => {
    const allItems = ["비타민 A", "비타민 B1", "비타민 C"];
    const filtered = allItems.filter((item) => item.includes(keyword));

    if (filtered.length === 0) {
      navigate("/no-result");
    } else {
      setResults(filtered);
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // 쿼리 변경 시 자동 검색 실행
  useEffect(() => {
    if (initialKeyword) {
      handleSearch();
    }
  }, [initialKeyword]);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-10">성분별</h1>

      {/* 검색창 */}
      <div className="relative mb-15">
        <input
          type="text"
          placeholder="비타민"
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
      <ul className="space-y-5">
        {results.map((item, index) => (
          <li key={index}>
            <button
              className="w-full flex justify-between items-center px-4 py-5 rounded-xl shadow-sm bg-white border border-gray-200"
              onClick={() => console.log(`${item} 클릭됨`)}
            >
              <span>{item}</span>
              <span className="text-gray-400">{">"}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientSearchSection;
