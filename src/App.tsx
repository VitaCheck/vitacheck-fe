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

    // ⭐ OAuth 콜백 경로인 경우 튜토리얼 건너뛰기
    const isOAuthCallback =
      window.location.pathname === "/oauth-redirect" ||
      window.location.pathname.includes("/oauth/callback") ||
      window.location.pathname.includes("/login/oauth2/code");

    console.log("=== Onboarding Check ===");
    console.log("isMobile:", isMobile);
    console.log("hasSeenTutorial:", hasSeenTutorial);
    console.log("isOAuthCallback:", isOAuthCallback);
    console.log("current path:", window.location.pathname);

    // 모바일이고, 튜토리얼을 본 적이 없고, OAuth 콜백이 아닌 경우에만 튜토리얼 표시
    if (isMobile && !hasSeenTutorial && !isOAuthCallback) {
      setShowTutorial(true);
    }

    // 튜토리얼 확인 완료
    setIsCheckingTutorial(false);
  }, []);

  // --- FCM 초기화 (기존 코드 유지) ---
  useEffect(() => {
    let mounted = true;
    const unsubscribePromise = onForegroundMessage((p) => {
      // ... (기존 FCM 로직) ...
    });

    (async () => {
      try {
        await registerServiceWorker();
        if (mounted && getAccessToken()) {
          await syncFcmTokenAfterLoginSilently().catch(() => {});
        }
      } catch (e) {
        console.warn("[FCM] init error:", e);
      }
    })();

    return () => {
      mounted = false;
      unsubscribePromise.then((unsub) => {
        if (unsub) {
          console.log("[FCM] Unsubscribing from foreground messages.");
          unsub();
        }
      });
    };
  }, []);

  // --- 완료 핸들러 ---

  // 1. 스플래시 스크린(로고)이 완료됐을 때
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // 2. 튜토리얼(Swiper)이 완료됐을 때
  const handleTutorialComplete = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    setShowTutorial(false);
  };

  // --- 렌더링 로직 (순서가 중요!) ---

  // 1. 가장 먼저, 스플래시 스크린(로고 애니메이션)을 보여줍니다.
  if (showSplash) {
    // SplashScreen.tsx는 내부에 1.8초 타이머가 있어, 완료되면 onComplete를 호출합니다.
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // 2. 스플래시가 끝나면, 튜토리얼 상태 확인이 끝났는지 체크합니다.
  if (isCheckingTutorial) {
    return null; // (또는 로딩 스피너)
  }

  // 3. 튜토리얼을 보여줘야 한다면, 튜토리얼을 렌더링합니다.
  if (showTutorial) {
    // OnBoarding.tsx(Swiper)는 마지막에 '로그인 없이 이용하기' 등을 누르면
    // onFinishOnboarding(prop)을 호출합니다.
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
