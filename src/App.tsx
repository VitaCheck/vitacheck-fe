import "./index.css";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 온보딩 컴포넌트
import SplashScreen from "./components/onboarding/SplashScreen";
import OnBoarding from "./components/onboarding/OnBoarding";

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

import { registerServiceWorker, onForegroundMessage } from "@/lib/firebase";
import { getAccessToken } from "@/lib/auth";
import { syncFcmTokenAfterLoginSilently } from "@/lib/push";

import { fcmTokenStore } from "@/lib/fcmTokenStore";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();
const TUTORIAL_STORAGE_KEY = "hasCompletedOnboardingTutorial";

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

      // Spring Boot OAuth2 기본 콜백 경로 추가
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
  // 1. 스플래시 스크린 (로고 애니메이션) 표시 여부
  const [showSplash, setShowSplash] = useState(true);
  // 2. 온보딩 튜토리얼 (Swiper) 표시 여부
  const [showTutorial, setShowTutorial] = useState(false);
  // 3. 튜토리얼을 확인할 때까지 대기 (깜빡임 방지)
  const [isCheckingTutorial, setIsCheckingTutorial] = useState(true);

  fcmTokenStore.migrateFromLocalStorage();

  // --- 튜토리얼 완료 여부 체크 (최초 1회) ---
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const hasSeenTutorial = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    const isLoggedIn = !!getAccessToken();
    const currentPath = window.location.pathname; // 현재 경로

    // ★★★ 수정된 부분 ★★★
    // 1. 튜토리얼을 건너뛰어야 하는 모든 공용 페이지 목록
    const publicAuthPaths = [
      "/login",
      "/login/email",
      "/signup/email",
      "/signup/email/detail",
      "/oauth-redirect",
      "/social-signup",
      "/social-signup/details",
    ];

    // 2. OAuth 콜백 경로인지 확인 (기존 로직)
    const isOAuthCallback =
      currentPath.includes("/oauth/callback") ||
      currentPath.includes("/login/oauth2/code");

    // 3. 공용 인증 페이지 목록에 포함되는지 확인
    const isPublicAuthPage = publicAuthPaths.includes(currentPath);
    // ★★★ 여기까지 수정 ★★★

    console.log("=== Onboarding Check ===");
    console.log("isMobile:", isMobile);
    console.log("isLoggedIn:", isLoggedIn);
    console.log("hasSeenTutorial:", hasSeenTutorial);
    console.log("isOAuthCallback:", isOAuthCallback);
    console.log("isPublicAuthPage:", isPublicAuthPage); // 확인용 로그 추가
    console.log("current path:", currentPath);

    // 모바일 && "로그인 안 했고" && 튜토리얼 본 적 없고
    // && OAuth 콜백 아님 && "공용 인증 페이지도 아님"
    if (
      isMobile &&
      !isLoggedIn &&
      !hasSeenTutorial &&
      !isOAuthCallback &&
      !isPublicAuthPage // ★★★ 이 조건이 추가되었습니다 ★★★
    ) {
      console.log(">>> Showing Onboarding Tutorial");
      setShowTutorial(true);
    } else {
      console.log(
        ">>> Skipping Onboarding Tutorial (Already seen, logged in, or on public/auth page)"
      );
    }
    // 튜토리얼 확인 완료
    setIsCheckingTutorial(false);
  }, []);

  // --- FCM 초기화 (기존 코드 유지) ---
  useEffect(() => {
    // ... (기존 FCM 로직 동일) ...
  }, []);

  // --- 완료 핸들러 (동일) ---
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleTutorialComplete = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    setShowTutorial(false);
  };

  // --- 렌더링 로직 (동일) ---
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (isCheckingTutorial) {
    return null;
  }

  if (showTutorial) {
    return <OnBoarding onFinishOnboarding={handleTutorialComplete} />;
  }

  // 4. 모든 온보딩이 끝났다면, 메인 앱(라우터)을 렌더링합니다.
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
