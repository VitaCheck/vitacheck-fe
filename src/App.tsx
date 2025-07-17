import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 페이지
import NotFoundPage from "./pages/NotFoundPage";
import MainPage from "./pages/MainPage";
import SignInPage from "./pages/SignInPage";
import ObjectPage from "./pages/ObjectPage";
import IngredientPage from "./pages/IngredientPage";
import CombinationPage from "./pages/CombinationPage";
import AddCombinationPage from "./pages/AddCombinationPage";
import CombinationResultPage from "./pages/CombinationResultPage"; // ✅ 추가
import AlarmPage from "./pages/AlarmPage";
import MyPage from "./pages/MyPage";

// 레이아웃
import RootLayout from "./layout/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <SignInPage /> },
      { path: "object", element: <ObjectPage /> },
      { path: "ingredient", element: <IngredientPage /> },
      { path: "combination", element: <CombinationPage /> },
      { path: "add-combination", element: <AddCombinationPage /> },
      { path: "alarm", element: <AlarmPage /> },
      { path: "mypage", element: <MyPage /> },
    ],
  },
  {
    path: "/combination-result", // ✅ 분석 결과 페이지 추가
    element: <CombinationResultPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
