import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../assets/search.svg";
import X from "../assets/X.svg";
import SearchOptionsModal from "./SearchOptionsModal";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleFocus = () => {
    if (window.innerWidth < 640) {
      navigate("/search");
    }
  };

  const handleClear = () => setQuery("");
  const toggleModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <div className="flex items-center w-full p-2 rounded-[44px] bg-[#FFFFFF] border border-[#F8BD00]">
        <input
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
