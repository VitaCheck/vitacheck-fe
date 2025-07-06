import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <main className="font-[Pretendard]">
      <Outlet />
    </main>
  );
};

export default RootLayout;
