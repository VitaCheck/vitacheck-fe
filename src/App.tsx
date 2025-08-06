import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 페이지
import NotFoundPage from "./pages/NotFoundPage";
import MainPage from "./pages/MainPage";
import SignInPage from "./pages/SignInPage";
import ObjectPage from "./pages/purpose/ObjectPage";
import IngredientPage from "./pages/IngredientPage";
import CombinationPage from "./pages/combination/CombinationPage";
import AddCombinationPage from "./pages/combination/AddCombinationPage";
import CombinationResultPage from "./pages/combination/CombinationResultPage";
import AlarmPage from "./pages/alarm/AlarmPage";
import MyPage from "./pages/MyPage";
import AlarmSettingsPage from "./pages/alarm/AlarmSettingsPage";
import DesktopAlarmAddPage from "./pages/alarm/DesktopAlarmAddPage";
import DesktopAlarmEditPage from "./pages/alarm/DesktopAlarmEditPage";
import NotificationCenterPage from "./pages/NotificationCenterPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import EditProfilePage from "./pages/EditProfilePage";
import IngredientDetailPage from "./pages/ingredients/IngredientDetailPage";
import NoSearchResult from "./components/ingredient/NoSearchResult";
import IngredientSearchSection from "./components/ingredient/IngredientSearchSection";
import SocialLogin from "./components/Auth/SocialLogin";
import EmailLoginPage from "./pages/auth/EmailLoginPage"; //자체 로그인 페이지
import EmailSignupPage from "./pages/auth/EmailSignupPage"; //자체 회원가입 페이지

import PurposeProductList from "./pages/purpose/PurposeProductListPage";
import PurposeIngredientProducts from "./pages/purpose/PurposeIngredientProductsPage";
import ProductDetailPage from "./pages/MainProductDetailPage";
import PurposeBrandProducts from "./pages/purpose/PurposeBrandProductsPage";

// 레이아웃
import RootLayout from "./layout/RootLayout";
import ScrapPage from "./pages/ScarpPage";
import SearchPage from "./pages/SearchPage";
import SearchResultPage from "./pages/SearchResultPage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient(); // ✅ queryClient 생성

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "login", //로그인 페이지
        element: <SignInPage />,
      },
      {
        path: "login/email", //로그인 페이지
        element: <EmailLoginPage />,
      },
      {
        path: "signup/email", //로그인 페이지
        element: <EmailSignupPage />,
      },
      {
        path: "object", //목적 페이지
        element: <ObjectPage />,
      },
      {
        path: "ingredient",
        children: [
          {
            index: true,
            element: <IngredientPage />,
          },
          {
            path: ":name",
            element: <IngredientDetailPage />,
          },
          {
            path: "search",
            element: <IngredientSearchSection />,
          },
          {
            path: "no-result",
            element: <NoSearchResult />,
          },
        ],
      },

      {
        path: "combination", //조합 페이지
        element: <CombinationPage />,
      },
      {
        path: "alarm", //알림 페이지
        element: <AlarmPage />,
      },
      {
        path: "alarm/settings", // 알림 설정/관리 페이지
        element: <AlarmSettingsPage />,
      },
      {
        path: "alarm/settings/add",
        element: <DesktopAlarmAddPage />,
      },
      {
        path: "alarm/settings/edit/:id",
        element: <DesktopAlarmEditPage />,
      },
      {
        path: "mypage", //마이 페이지
        element: <MyPage />,
      },
      {
        path: "/scrap", // 마이페이지-스크랩
        element: <ScrapPage />,
      },
      {
        path: "/search", // 검색창
        element: <SearchPage />,
      },
      {
        path: "/searchresult", // 검색 결과
        element: <SearchResultPage />,
      },
      {
        path: "notificationCenter",
        element: <NotificationCenterPage />,
      },
      {
        path: "setting",
        element: <NotificationSettingsPage />,
      },
      {
        path: "mypage/edit", // 마이페이지 수정
        element: <EditProfilePage />,
      },
      {
        path: "add-combination",
        element: <AddCombinationPage />,
      },
      {
        path: "combination-result", // 분석 결과 페이지
        element: <CombinationResultPage />,
      },

      {
        path: "products",
        element: <PurposeProductList />,
      },
      {
        path: "ingredientproducts",
        element: <PurposeIngredientProducts />,
      },
      {
        path: "brandproducts",
        element: <PurposeBrandProducts />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "social-login",
        element: <SocialLogin />,
      },
      {
        path: "/ingredients/:ingredientName",
        element: <IngredientDetailPage />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
