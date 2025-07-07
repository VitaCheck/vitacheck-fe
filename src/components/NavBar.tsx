import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import Logo from "../assets/logo.svg";
import Bell from "../assets/Bell.svg";
import User from "../assets/User.svg";

const Navbar = () => {
  return (
    <header className=" bg-white w-full">
      {/* 데스크탑 레이아웃 */}
      <div className="hidden md:flex justify-between items-center w-full h-[100px]">
        {/* 로고 */}
        <Link
          to="/"
          className="w-[170px] lg:w-[215px] shrink-0 transition-all duration-300"
        >
          <img src={Logo} alt="VitaCheck로고" className="w-full h-auto" />
        </Link>

        {/* 검색창 */}
        <div className="w-[270px] lg:w-2/5 transition-all duration-300">
          <SearchBar />
        </div>

        {/* 메뉴 */}
        <nav className="flex gap-6 font-medium text-black items-center text-[14px] lg:text-[16px] transition-all duration-300">
          <Link to="/object">목적별</Link>
          <Link to="/ingredient">성분별</Link>
          <Link to="/combination">조합</Link>
          <Link to="/mypage">마이페이지</Link>
        </nav>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="md:hidden">
        {/* 상단 알림/유저 아이콘 */}
        <div className="flex justify-between items-center mb-5 mt-5">
          <img src={Bell} alt="알림" className="w-[24px] h-[27px]" />
          <img src={User} alt="사용자" className="w-[36px] h-[36px]" />
        </div>

        {/* 로고 */}
        <div className="flex justify-center mb-6">
          <Link to="/" className="w-[170px]">
            <img src={Logo} alt="VitaCheck로고" className="w-full h-auto" />
          </Link>
        </div>

        {/* 검색창 */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
