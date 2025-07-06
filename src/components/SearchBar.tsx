import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center w-full p-3 rounded-lg bg-gray-100">
        <input
          type="text"
          placeholder="제품 또는 성분을 입력해주세요."
          className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300 font-pretendard"
        />
        <FiSearch className="text-gray-300 mr-2" size={18} />
      </div>
    </div>
  );
};

export default SearchBar;
