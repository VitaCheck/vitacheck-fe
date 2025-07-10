import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";

const RootLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/mypage");
  return (
    <div className="font-[Pretendard] h-full flex flex-col">
      {!hideNavbar && (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
          <div className="w-[80%] md:w-[90%] lg:w-[80%] mx-auto">
            <Navbar />
          </div>
        </header>
      )}

      <main className={`${hideNavbar ? "" : "pt-48 md:pt-25"} flex-1`}>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
