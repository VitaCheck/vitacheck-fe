import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  return (
    <div>
      <div className="flex items-center w-full p-3 rounded-[44px] bg-[#f2f2f2]">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          className="w-full ml-2 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300"
        />
        <FiSearch className="text-gray-300 mr-2" size={18} />
      </div>
    </div>
  );
};

export default SearchBar;
