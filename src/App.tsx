// src/App.tsx
import "./index.css";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 온보딩 컴포넌트
import OnboardingScreen from "./components/OnBoarding";

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
import SocialSignupDetailPage from "@/pages/auth/SocialSignupDetailPage";
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
import SocialCallback from "./pages/auth/SocialCallback";
import AIPage from "./pages/AiRecommendPage";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import axios from "@/lib/axios";
import { registerServiceWorker, onForegroundMessage } from "@/lib/firebase";
import { getAccessToken } from "@/lib/auth";
import { syncFcmTokenAfterLoginSilently } from "@/lib/push";

import { fcmTokenStore } from "@/lib/fcmTokenStore";

import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();
const ONBOARDING_KEY = "hasSeenOnboarding";

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
      { path: "ai-recommend", element: <AIPage /> },

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
      { path: "/social-signup/details", element: <SocialSignupDetailPage /> },
      { path: "/oauth/callback", element: <SocialCallback /> },

      // ✅ Spring Boot OAuth2 기본 콜백 경로 추가
      { path: "/login/oauth2/code/:provider", element: <SocialCallback /> },

      // 기타
      {
        path: "/ingredients/:ingredientName",
        element: <IngredientDetailPage />,
      },
      { path: "/terms/:slug", element: <TermsViewPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);

function App() {
  // 온보딩 상태 관리
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  fcmTokenStore.migrateFromLocalStorage();

  // 온보딩 체크
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const hasSeenOnboarding = sessionStorage.getItem(ONBOARDING_KEY);

    if (isMobile && !hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    setIsCheckingOnboarding(false);
  }, []);

  // FCM 초기화
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await registerServiceWorker();

        if (mounted && getAccessToken()) {
          await syncFcmTokenAfterLoginSilently().catch(() => {});
        }

        onForegroundMessage((p) => {
          const title = p?.notification?.title ?? p?.data?.title ?? "VitaCheck";
          const body = p?.notification?.body ?? p?.data?.body ?? "";
          console.log("[FCM] foreground:", title, body);
        });
      } catch (e) {
        console.warn("[FCM] init error:", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // 온보딩 완료 핸들러
  const handleOnboardingComplete = () => {
    sessionStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  };

  // 온보딩 체크 중
  if (isCheckingOnboarding) {
    return null; // 또는 로딩 스피너
  }

  // 온보딩 표시
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // 메인 앱
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
