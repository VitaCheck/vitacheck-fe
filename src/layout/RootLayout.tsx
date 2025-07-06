import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

const RootLayout = () => {
  return (
    <div className="font-[Pretendard]">
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="w-[80%] mx-auto">
          <Navbar />
        </div>
      </header>

      <main className="pt-25">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
