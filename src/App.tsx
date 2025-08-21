// src/App.tsx
import "./index.css"; // 전역 스타일
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 페이지 컴포넌트들 ...
import NotFoundPage from "./pages/NotFoundPage";
import MainPage from "./pages/MainPage";
import ObjectPage from "./pages/purpose/ObjectPage";
import IngredientPage from "./pages/IngredientPage";
import CombinationPage from "./pages/combination/CombinationPage";
import AddCombinationPage from "./pages/combination/AddCombinationPage";
import CombinationResultPage from "./pages/combination/CombinationResultPage";
import MyPage from "./pages/MyPage";
import AlarmPage from "./pages/alarm/AlarmPage";
import AlarmSettingsPage from "./pages/alarm/AlarmSettingsPage";
import DesktopAlarmAddPage from "./pages/alarm/DesktopAlarmAddPage";
import DesktopAlarmAddToSearchPage from "./pages/alarm/DesktopAlarmAddToSearchPage";
import DesktopAlarmEditPage from "./pages/alarm/DesktopAlarmEditPage";
import NotificationCenterPage from "./pages/NotificationCenterPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import EditProfilePage from "./pages/EditProfilePage";
import IngredientDetailPage from "./pages/ingredients/IngredientDetailPage";
import NoSearchResult from "./components/ingredient/NoSearchResult";
import IngredientSearchSection from "./components/ingredient/IngredientSearchSection";
import SocialLogin from "./components/Auth/SocialLogin";
import SocialSignupForm from "./pages/auth/SocialSignupForm";
import EmailLoginPage from "./pages/auth/EmailLoginPage";
import EmailSignupPage from "./pages/auth/EmailSignupPage";
import EmailSignupDetailPage from "./pages/auth/EmailSignupDetailPage";
import BestSupplement from "./pages/BestSupplement";
import PurposeProductList from "./pages/purpose/PurposeProductListPage";
import PurposeIngredientProducts from "./pages/purpose/PurposeIngredientProductsPage";
import ProductDetailPage from "./pages/MainProductDetailPage";
import PurposeBrandProducts from "./pages/purpose/PurposeBrandProductsPage";
import RootLayout from "./layout/RootLayout";
import ScrapPage from "./pages/ScarpPage";
import SearchPage from "./pages/SearchPage";
import SearchResultPage from "./pages/SearchResultPage";
import OauthRedirect from "./pages/auth/OauthRedirect";
import TermsViewPage from "./pages/terms/TermsViewPage";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



import axios from "@/lib/axios";
import { registerServiceWorker, onForegroundMessage } from "@/lib/firebase";
import { getAccessToken } from "@/lib/auth";
import { syncFcmTokenAfterLoginSilently } from "@/lib/push"; // 앞서 준 가드 포함 버전

import { fcmTokenStore } from "@/lib/fcmTokenStore";

import SettingsPage from "./pages/SettingsPage";

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
          { path: ":ingredientName", element: <IngredientDetailPage /> },
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
      { path: "alarm/settings/edit/:id", element: <DesktopAlarmEditPage /> },

      // 마이/스크랩/검색/설정
      { path: "mypage", element: <MyPage /> },
      { path: "/scrap", element: <ScrapPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/searchresult", element: <SearchResultPage /> },
      { path: "notificationCenter", element: <NotificationCenterPage /> },
      { path: "setting", element: <NotificationSettingsPage /> },
      { path: "mypage/edit", element: <EditProfilePage /> },

      // 상품/리스트
      { path: "bestsupplement", element: <BestSupplement /> },
      { path: "products", element: <PurposeProductList /> },
      { path: "ingredientproducts", element: <PurposeIngredientProducts /> },
      { path: "brandproducts", element: <PurposeBrandProducts /> },
      { path: "product/:id", element: <ProductDetailPage /> },

      // 소셜 로그인
      { path: "login", element: <SocialLogin /> },
      { path: "/oauth-redirect", element: <OauthRedirect /> },
      { path: "/social-signup", element: <SocialSignupForm /> },

      // 기타
      {
        path: "/ingredients/:ingredientName",
        element: <IngredientDetailPage />,
      },
      { path: "/terms/:slug", element: <TermsViewPage /> }, // privacy | service | marketing
      { path: "/settings", element: <SettingsPage /> }, 
    ],

  },
]);

function App() {
  // (선택) 기존 마이그레이션 유지
  fcmTokenStore.migrateFromLocalStorage();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // ① SW만 등록 (권한 요청/토큰 발급 X)
        await registerServiceWorker();

        // ② 로그인 상태에서만 조용히 동기화(권한 팝업 없이)
        if (mounted && getAccessToken()) {
          await syncFcmTokenAfterLoginSilently().catch(() => {});
        }

        // ③ 포그라운드 수신 핸들러(선택)
        onForegroundMessage((p) => {
          const title = p?.notification?.title ?? p?.data?.title ?? "VitaCheck";
          const body = p?.notification?.body ?? p?.data?.body ?? "";
          console.log("[FCM] foreground:", title, body);
          // TODO: 토스트/배지 UI 연결
        });
      } catch (e) {
        console.warn("[FCM] init error:", e);
      }
    })();

    return () => { mounted = false; };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;