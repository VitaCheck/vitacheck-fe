// import { Outlet, useLocation } from "react-router-dom";
// import Navbar from "../components/NavBar";

// const RootLayout = () => {
//   const location = useLocation();

//   // NavBar를 숨길 경로 목록
//   const hideNavbarRoutes = [
//     "/mypage",
//     "/notificationCenter",
//     "/setting",
//     "/scrap",
//     "/search",
//   ];

//   const isMain = location.pathname === "/";

//   // 현재 경로가 해당 경로들 중 하나로 시작하면 숨김
//   const hideNavbar = hideNavbarRoutes.includes(location.pathname);

//   const paddingTopClass = hideNavbar
//     ? ""
//     : isMain
//       ? "pt-48 sm:pt-25"
//       : "pt-15 sm:pt-25";
//   return (
//     <div className="font-[Pretendard] h-full flex flex-col">
//       {!hideNavbar && (
//         <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
//           <div className="w-[90%] lg:w-[80%] mx-auto">
//             <Navbar />
//           </div>
//         </header>
//       )}
//       <main className={`${paddingTopClass} flex-1`}>
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default RootLayout;

import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "@/components/Footer";

const RootLayout = () => {
  const location = useLocation();

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
  ];

  const isMain = location.pathname === "/";

  // 모바일이고, 특정 경로에 해당할 때만 숨김
  const hideNavbar = isMobile && hideNavbarRoutes.includes(location.pathname);

  const paddingTopClass = hideNavbar
    ? ""
    : isMain
      ? "pt-48 sm:pt-20"
      : "pt-17 sm:pt-20";


  return (
    <div className="font-[Pretendard] h-full flex flex-col">
      {!hideNavbar && (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
          <div className="w-[90%] lg:w-[80%] mx-auto">
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
