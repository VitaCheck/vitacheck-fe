import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import X from "../assets/X.svg";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/searchresult?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div>
      <div className="flex items-center w-full p-3 rounded-[44px] bg-[#FFFFFF] border border-[#C7C7C7]">
        <input
          type="text"
          placeholder="제품 또는 성분을 입력해주세요."
          className="w-full ml-4 bg-transparent outline-none text-sm text-[#797979] placeholder-gray-300"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {query && (
          <img
            src={X}
            alt="Clear"
            className="w-[16px] h-[16px] mr-2 cursor-pointer"
            onClick={handleClear}
          />
        )}

        <FiSearch
          className="text-[#686666] mr-1 cursor-pointer"
          size={18}
          onClick={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
