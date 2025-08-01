import MainTop from "../components/MainPage/MainTop";
import ProductList from "../components/MainPage/ProductList";
import NavSection from "../components/MainPage/NavSection";

const MainPage = () => {
  return (
    <div className="bg-white">
      <MainTop />
      <NavSection />
      <ProductList />
    </div>
  );
};

export default MainPage;
