import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Search from "../assets/search.svg";
import X from "../assets/X.svg";
import SearchOptionsModal from "./SearchOptionsModal";

declare global {
  interface WindowEventMap {
    "focus-global-search": CustomEvent<void>;
  }
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (window.innerWidth < 640) {
      // 모바일이면 검색 페이지로
      navigate("/search");
    }
  };

  const handleClear = () => setQuery("");
  const toggleModal = () => setShowModal((prev) => !prev);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      const q = query.trim();
      navigate(`/searchresult?query=${encodeURIComponent(q)}`);
      if (window.matchMedia("(min-width: 640px)").matches) {
        setQuery("");
        setShowModal(false);
        inputRef.current?.blur();
      }
    }
  };

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 640px)").matches;
    if (isDesktop) {
      setQuery("");
      setShowModal(false);
      inputRef.current?.blur();
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const focusHandler = () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener("focus-global-search", focusHandler);
    return () =>
      window.removeEventListener("focus-global-search", focusHandler);
  }, []);

  return (
    <>
      <div className="flex items-center w-full p-2 rounded-[44px] bg-[#FFFFFF] border border-[#F8BD00]">
        <input
          ref={inputRef}
          type="text"
          placeholder="제품 또는 성분을 입력해주세요."
          className="w-full ml-4 bg-transparent outline-none text-sm text-[#797979] placeholder-gray-300"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
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

        <img
          src={Search}
          alt="검색"
          className="w-[24px] h-[27px] mr-2 cursor-pointer"
          onClick={toggleModal}
        />
      </div>

      {showModal && <SearchOptionsModal onClose={toggleModal} />}
    </>
  );
};

export default SearchBar;
