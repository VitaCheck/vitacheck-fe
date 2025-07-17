import Search from "../assets/search.svg";

const SearchBar = () => {
  return (
    <div>
      <div className="flex items-center w-full p-2 rounded-[44px] bg-[#FFFFFF] border border-[#F8BD00]">
        <input
          type="text"
          placeholder="제품 또는 성분을 입력해주세요."
          className="w-full ml-4 bg-transparent outline-none text-sm text-[#797979] placeholder-gray-300"
        />
        <img src={Search} alt="검색" className="w-[24px] h-[27px] mr-2" />
        {/* <FiSearch className="text-gray-300 mr-2" size={18} /> */}
      </div>
    </div>
  );
};

export default SearchBar;
