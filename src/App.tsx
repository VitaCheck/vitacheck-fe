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
import CombinationResultPage from "./pages/CombinationResultPage";
import AlarmPage from "./pages/alarm/AlarmPage";
import MyPage from "./pages/MyPage";
import AlarmSettingsPage from "./pages/alarm/AlarmSettingsPage";
import NotificationCenterPage from "./pages/NotificationCenterPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import EditProfilePage from "./pages/EditProfilePage";

// 레이아웃
import RootLayout from "./layout/RootLayout";
import ScrapPage from "./pages/ScarpPage";

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
        path: "object", //목적 페이지
        element: <ObjectPage />,
      },

      {
        path: "ingredient", //성분 페이지
        element: <IngredientPage />,
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
        path: "mypage", //마이 페이지
        element: <MyPage />,
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
        path: "/combination-result", // 분석 결과 페이지
        element: <CombinationResultPage />,
      },
      {
        path: "/scrap", // 마이페이지-스크랩
        element: <ScrapPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
