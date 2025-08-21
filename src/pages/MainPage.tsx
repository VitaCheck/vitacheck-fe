import MainTop from "../components/MainPage/MainTop";
import ProductList from "../components/MainPage/ProductList";
import NavSection from "../components/MainPage/NavSection";
import { useEffect } from "react";
import { updateFcmTokenWithLocalStorageFetch } from "@/apis/user";

const MainPage = () => {
  useEffect(() => {
    updateFcmTokenWithLocalStorageFetch().catch(() => {});
  }, []);

  return (
    <div className="bg-white">
      <MainTop />
        <NavSection />
      <ProductList />
    </div>
  );
};

export default MainPage;
