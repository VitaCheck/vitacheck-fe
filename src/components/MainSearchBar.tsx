import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../assets/search.svg";
import X from "../assets/X.svg";
import SearchOptionsModal from "./SearchOptionsModal";

// 전역 커스텀 이벤트 타입 선언 (타입스크립트 경고 방지)
declare global {
  interface WindowEventMap {
    "focus-global-search": CustomEvent<void>;
  }
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // ✨ 포커스용 ref
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    // 모바일은 검색 페이지로 라우팅
    if (window.innerWidth < 640) {
      navigate("/search");
    }
  };

  const handleClear = () => setQuery("");
  const toggleModal = () => setShowModal((prev) => !prev);

  // ✨ 외부에서 포커스 트리거하는 커스텀 이벤트 리스너
  useEffect(() => {
    const focusHandler = () => {
      // 헤더가 이미 렌더된 상태에서 안전하게 포커스
      inputRef.current?.focus();
      inputRef.current?.select();
      // 필요하면 스크롤 가운데로
      // inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
