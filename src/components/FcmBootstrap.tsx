// src/components/FcmBootstrap.tsx
import { useEffect } from "react";
import { registerServiceWorker, getFcmToken } from "@/lib/firebase";
import { onForegroundMessage } from "@/lib/firebase";
import { updateFcmTokenWithLocalStorageFetch } from "@/apis/user";

/**
 * 역할:
 *  1) 앱 부팅 시 서비스워커 등록
 *  2) 권한이 이미 'granted'면 현재 토큰을 디버그로만 노출
 *     (서버 동기화는 App.tsx의 syncFcmToken, 또는 설정 페이지의 enableWebPush에서 처리)
 */
export default function FcmBootstrap() {
  useEffect(() => {
    (async () => {
      try {
        await registerServiceWorker();

        if (
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
          const token = await getFcmToken();
          // @ts-ignore
          window.__fcmDebug = { token, permission: Notification.permission };
        } else {
          // @ts-ignore
          window.__fcmDebug = {
            token: null,
            permission: Notification.permission,
          };
        }
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    onForegroundMessage(async (payload) => {
      console.log("[PUSH][FG] payload", payload);
      const title = payload?.notification?.title || "알림";
      const body = payload?.notification?.body || "메시지가 도착했어요.";
      // 포그라운드에서도 OS 알림 강제로 띄우기
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification(title, { body, data: { link: "/alarm" } });
    });
  }, []);

  return null;
}
