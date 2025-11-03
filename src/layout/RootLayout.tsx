import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "@/components/Footer";
import ReactGA from "react-ga4";

const RootLayout = () => {
  const location = useLocation();

  useEffect(() => {
    // 운영 환경에서만 실행하도록 분기 처리하는 것을 권장
    if (process.env.NODE_ENV === "production") {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
      });
    }
  }, [location]); // location이 바뀔 때마다 실행

  // 현재 화면 너비 상태
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // NavBar를 모바일에서만 숨길 경로 목록
  const hideNavbarRoutes = [
    "/mypage",
    "/notificationCenter",
    "/setting",
    "/scrap",
    "/search",
    "/mypage/edit",
    "/login/email",
    "/signup/email",
    "/signup/email/detail",
    "/social-signup/details",
  ];

  const isMain = location.pathname === "/";
  const isOnlyIngredient = location.pathname === "/ingredient";

  // 모바일이고, 특정 경로에 해당할 때만 숨김
  const hideNavbar = isMobile && hideNavbarRoutes.includes(location.pathname);

  const paddingTopClass = hideNavbar
    ? ""
    : isMain
      ? "pt-46 sm:pt-20"
      : isOnlyIngredient
        ? "sm:pt-20" // pt-17 제거
        : "pt-17 sm:pt-20";

  return (
    <div className="font-[Pretendard] h-full flex flex-col">
      {!hideNavbar && (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
          <div className="w-[90%] lg:w-[67%] mx-auto">
            <Navbar />
          </div>
        </header>
      )}

      <main className={`${paddingTopClass} sm:bg-[#F3F3F3] h-auto`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
