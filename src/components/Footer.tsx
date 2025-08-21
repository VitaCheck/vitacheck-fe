import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";

const Footer = () => {
  return (
    <footer className="w-full h-[100px] bg-white border-t border-gray-200 py-6 px-4 text-sm text-black hidden sm:block">
      <div className="flex flex-col items-center">
        {/* 로고 */}
        <Link to="/" className="mb-4">
          <img
            src={Logo}
            alt="VitaCheck로고"
            className="w-[120px] h-auto mx-auto"
          />
        </Link>

        {/* 링크 목록 */}
        <div className="relative w-full flex justify-center">
          {/* 가운데 개인정보처리방침 */}
          <a
            href="https://vitachecking.com/terms/privacy"
            className="mx-4 hover:underline"
          >
            개인정보처리방침
          </a>

          {/* 좌측 */}
          <a
            href="https://vitachecking.com/terms/service"
            className="absolute left-1/2 -translate-x-[160px] hover:underline"
          >
            이용약관
          </a>

          {/* 우측 */}
          <a
            href="https://www.instagram.com/vitacheck.official/"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute left-1/2 translate-x-[110px] hover:underline"
          >
            공식인스타그램
          </a>

          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
