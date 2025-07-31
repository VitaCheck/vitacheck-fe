import { useLocation, useNavigate, Link } from "react-router-dom";
import SearchBar from "./MainSearchBar";
import Logo from "../assets/logo.svg";
import Bell from "../assets/Bell.svg";
import Navfavorite from "../assets/navfavorite.svg";
import User from "../assets/User.svg";
import BackIcon from "../assets/back.svg";
import HomeIcon from "../assets/Vector.svg";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMainPage = location.pathname === "/";

  return (
    <header className="bg-white w-full">
      {/* 데스크탑 레이아웃 */}
      <div className="hidden sm:flex justify-between items-center w-full h-[100px]">
        {/* 왼쪽 로고 */}
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

        <div className="flex gap-6 items-center">
          <Link to="/notificationCenter">
            <img src={Bell} alt="알림" className="w-[24px] h-[24px]" />
          </Link>
          <Link to="/wishlist">
            <img src={Navfavorite} alt="알림" className="w-[24px] h-[24px]" />
          </Link>
          <Link to="/mypage">
            <img
              src={User}
              alt="사용자"
              className="w-[36px] h-[36px] rounded-full"
            />
          </Link>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="sm:hidden">
        {!isMainPage ? (
          // / 경로가 아닌 경우
          <div className="flex justify-between items-center pt-5 pb-3">
            <button onClick={() => navigate(-1)}>
              <img
                src={BackIcon}
                alt="뒤로가기"
                className="w-[24px] h-[24px] cursor-pointer"
              />
            </button>
            <div className="flex gap-3 items-center">
              <Link to="/">
                <img src={HomeIcon} alt="홈" className="w-[24px] h-[24px]" />
              </Link>
              <Link to="/mypage">
                <img
                  src={User}
                  alt="사용자"
                  className="w-[30px] h-[30px] rounded-full"
                />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-5 mt-5 px-4">
              <Link to="/notificationCenter">
                <img src={Bell} alt="알림" className="w-[24px] h-[27px]" />
              </Link>
              <Link to="/mypage">
                <img src={User} alt="사용자" className="w-[36px] h-[36px]" />
              </Link>
            </div>

            <div className="flex justify-center mb-6">
              <Link to="/" className="w-[170px]">
                <img src={Logo} alt="VitaCheck로고" className="w-full h-auto" />
              </Link>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-full max-w-md px-4">
                <SearchBar />
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
