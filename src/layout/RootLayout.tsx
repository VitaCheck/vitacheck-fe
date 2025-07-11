import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";

const RootLayout = () => {
  const location = useLocation();

  // NavBar를 숨길 경로 목록
  const hideNavbarRoutes = [
    "/mypage",
    "/NotificationCenter",
    "/NotificationSettings",
    "/Setting",
  ];

  // 현재 경로가 해당 경로들 중 하나로 시작하면 숨김
  const hideNavbar = hideNavbarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

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
