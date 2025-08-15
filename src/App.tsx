import "./index.css"; // 전역 스타일

// 라우터 관련
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 페이지 컴포넌트
import NotFoundPage from "./pages/NotFoundPage"; // 404 페이지
import MainPage from "./pages/MainPage"; // 메인 페이지
import ObjectPage from "./pages/purpose/ObjectPage"; // 목적별 페이지
import IngredientPage from "./pages/IngredientPage"; // 원료 목록 페이지
import CombinationPage from "./pages/combination/CombinationPage"; // 조합 페이지
import AddCombinationPage from "./pages/combination/AddCombinationPage"; // 조합 추가 페이지
import CombinationResultPage from "./pages/combination/CombinationResultPage"; // 조합 결과 페이지
import MyPage from "./pages/MyPage"; // 마이 페이지

// 알람 관련 페이지
import AlarmPage from "./pages/alarm/AlarmPage"; // 알람 메인 페이지
import AlarmSettingsPage from "./pages/alarm/AlarmSettingsPage"; // 알람 설정 페이지
import DesktopAlarmAddPage from "./pages/alarm/DesktopAlarmAddPage"; // 알람 추가 페이지(PC)
import DesktopAlarmAddToSearchPage from "./pages/alarm/DesktopAlarmAddToSearchPage"; // 알람 추가 → 검색 페이지(PC)
import DesktopAlarmEditPage from "./pages/alarm/DesktopAlarmEditPage"; // 알람 수정 페이지(PC)

// 알림/마이페이지 관련
import NotificationCenterPage from "./pages/NotificationCenterPage"; // 알림센터
import NotificationSettingsPage from "./pages/NotificationSettingsPage"; // 알림 설정
import EditProfilePage from "./pages/EditProfilePage"; // 프로필 수정 페이지

// 원료 관련
import IngredientDetailPage from "./pages/ingredients/IngredientDetailPage"; // 원료 상세 페이지
import NoSearchResult from "./components/ingredient/NoSearchResult"; // 원료 검색 결과 없음
import IngredientSearchSection from "./components/ingredient/IngredientSearchSection"; // 원료 검색 UI

// 소셜 로그인 관련
import SocialLogin from "./components/Auth/SocialLogin"; // 소셜 로그인 UI
import SocialSignupForm from "./pages/auth/SocialSignupForm"; // 소셜 회원가입 폼

// 이메일 로그인/회원가입 관련
import EmailLoginPage from "./pages/auth/EmailLoginPage"; // 자체 로그인 페이지
import EmailSignupPage from "./pages/auth/EmailSignupPage"; // 자체 회원가입 페이지
import EmailSignupDetailPage from "./pages/auth/EmailSignupDetailPage"; // 자체 회원가입 상세 페이지

import PurposeProductList from "./pages/purpose/PurposeProductListPage";
import PurposeIngredientProducts from "./pages/purpose/PurposeIngredientProductsPage";
import ProductDetailPage from "./pages/MainProductDetailPage";
import PurposeBrandProducts from "./pages/purpose/PurposeBrandProductsPage";

// 레이아웃 & 기타 페이지
import RootLayout from "./layout/RootLayout"; // 전체 레이아웃
import ScrapPage from "./pages/ScarpPage"; // 스크랩 페이지
import SearchPage from "./pages/SearchPage"; // 검색 페이지
import SearchResultPage from "./pages/SearchResultPage"; // 검색 결과 페이지

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OauthRedirect from "./pages/auth/OauthRedirect";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <MainPage /> },

      // 자체 로그인/회원가입
      { path: "login/email", element: <EmailLoginPage /> },
      { path: "signup/email", element: <EmailSignupPage /> },
      { path: "signup/email/detail", element: <EmailSignupDetailPage /> },

      // 목적/원료
      { path: "object", element: <ObjectPage /> },
      {
        path: "ingredient",
        children: [
          { index: true, element: <IngredientPage /> },
          { path: ":ingredientName", element: <IngredientDetailPage /> }, // 최신 기준(:ingredientName)
          { path: "search", element: <IngredientSearchSection /> },
          { path: "no-result", element: <NoSearchResult /> },
        ],
      },

      // 조합
      { path: "combination", element: <CombinationPage /> },
      { path: "add-combination", element: <AddCombinationPage /> },
      { path: "combination-result", element: <CombinationResultPage /> },

      // 알람
      { path: "alarm", element: <AlarmPage /> },
      { path: "alarm/settings", element: <AlarmSettingsPage /> },
      { path: "alarm/settings/add", element: <DesktopAlarmAddPage /> },
      {
        path: "alarm/settings/add/search",
        element: <DesktopAlarmAddToSearchPage />,
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
        path: "login",
        element: <SocialLogin />,
      },
      {
        path: "/oauth-redirect",
        element: <OauthRedirect />,
      },
      // {
      //   path: "/auth/:provider/callback", // google|kakao|naver
      //   element: <SocialCallback />,
      // },
      {
        path: "/social-signup",
        element: <SocialSignupForm />,
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
