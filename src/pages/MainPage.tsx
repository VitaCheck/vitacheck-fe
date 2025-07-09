import MainTop from "../components/MainPage/MainTop";
import ProductList from "../components/MainPage/ProductList";
import SearchSection from "../components/MainPage/SearchSection";

const MainPage = () => {
  return (
    <div>
      <MainTop />
      <SearchSection />
      <ProductList />
    </div>
  );
};

export default MainPage;
