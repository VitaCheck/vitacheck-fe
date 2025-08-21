// EmailLoginPage.tsx
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "@/lib/axios";
import MobileLoginPage from "./MobileEmailLoginPage";
import DesktopLoginPage from "./DesktopEmailLoginPage";
import { syncFcmTokenAfterLoginSilently } from "@/lib/push"; // ✅ 공용 유틸만 사용


// 🔔 firebase 헬퍼
import {
  registerServiceWorker,
  requestNotificationPermission,
  getFcmToken,
} from "@/lib/firebase";

const EmailLoginPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });

  // 1) 페이지 진입 시 서비스워커 등록 (앱에서 1회만 실행되면 OK)
  useEffect(() => {
    registerServiceWorker().catch(console.error);
  }, []);

  // ✅ 로그인 성공 직후: 무음 동기화만 (권한 없으면 조용히 패스)
  // const onLoginSuccess = async () => {
  //   await syncFcmTokenAfterLoginSilently();
  // };

  // 2) 로그인 성공 시 호출할 콜백
  const onLoginSuccess = async () => {
    console.log("[web-push] login success → get permission & token");
    const perm = await requestNotificationPermission();
    if (perm !== "granted") {
      console.warn("[web-push] permission:", perm);
      return;
    }
    const token = await getFcmToken();
    if (!token) {
      console.warn("[web-push] no token");
      return;
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await axios.put("/api/v1/users/me/fcm-token", {
      fcmToken: token,
      platform: "web",
      timezone: tz,
    });
    console.log("[web-push] token registered to server");
  };

  // 3) 모바일/데스크탑 로그인 컴포넌트에 콜백 전달
  return isMobile ? (
    <MobileLoginPage onLoginSuccess={onLoginSuccess} />
  ) : (
    <DesktopLoginPage onLoginSuccess={onLoginSuccess} />
  );
};

export default EmailLoginPage;
