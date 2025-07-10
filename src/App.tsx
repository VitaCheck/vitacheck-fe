import './App.css'
import Navbar from './components/Navbar';
import PurposeCardList from './pages/PurposeCardListPage';
import PurposeProductList from './pages/PurposeProductListPage';
import PurposeIngredientProducts from './pages/PurposeIngredientProductsPage';
import ProductDetailPage from './pages/MainProductDetailPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PurposeCardList />} />
          <Route path="/products" element={<PurposeProductList />} />
          <Route path="/ingredientproducts" element={<PurposeIngredientProducts />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
