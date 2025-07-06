import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import Logo from "../assets/logo.svg";

const Navbar = () => {
  return (
    <header className="px-8 py-4 flex justify-between items-center bg-white">
      <Link to="/" className="text-2xl font-bold tracking-tight text-black">
        <img src={Logo} alt="VitaCheck로고" />
      </Link>

      <div className="relative w-1/3">
        <SearchBar />
      </div>

      <nav className="flex gap-6 text-m font-medium text-black">
        <Link to="/object">목적별</Link>
        <Link to="/ingredient">성분별</Link>
        <Link to="/combination">조합</Link>
        <Link to="/mypage">마이페이지</Link>
      </nav>
    </header>
  );
};

export default Navbar;
