// import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  // const navigate = useNavigate();

  // const handleFocus = () => {
  //   navigate("/search");
  // };

  return (
    <div>
      <div className="flex items-center w-full p-2 rounded-[44px] bg-[#FFFFFF] border border-[#C7C7C7]">
        <input
          type="text"
          placeholder="제품 또는 성분을 입력해주세요."
          className="w-full ml-4 bg-transparent outline-none text-sm text-[#797979] placeholder-gray-300"
          // onFocus={handleFocus}
        />
        <FiSearch className="text-[#686666] mr-2" size={18} />
      </div>
    </div>
  );
};

export default SearchBar;
