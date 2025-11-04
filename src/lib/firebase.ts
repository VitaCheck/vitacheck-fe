import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  deleteToken,
  type Messaging,
  type Unsubscribe,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDhCaf3Ockukla3eR3lx4B3m9TsDhvscMY",
  authDomain: "vitacheck-1ee1d.firebaseapp.com",
  projectId: "vitacheck-1ee1d",
  storageBucket: "vitacheck-1ee1d.appspot.com",
  messagingSenderId: "802557675495",
  appId: "1:802557675495:web:7c6c855f4ca135ca049f42",
};

const app = initializeApp(firebaseConfig);

let _messagingReady: Promise<Messaging | null> | null = null;
function ensureMessaging(): Promise<Messaging | null> {
  if (!_messagingReady) {
    console.log("[FCM] ensureMessaging: init");
    _messagingReady = isSupported()
      .then((ok) => {
        console.log("[FCM] isSupported =", ok);
        return ok ? getMessaging(app) : null;
      })
      .catch((e) => {
        console.error("[FCM] isSupported error", e);
        return null;
      });
  }
  return _messagingReady;
}

/** 서비스워커 등록 (앱 시작 시 1회) */
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.warn("[FCM] no SW support");
    return null;
  }
  const reg = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );
  await navigator.serviceWorker.ready;
  console.log("[FCM] SW registered & ready");
  return reg;
}

/** 권한 요청 */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  console.log("[FCM] current permission:", Notification.permission);
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const res = await Notification.requestPermission();
  console.log("[FCM] requestPermission =>", res);
  return res;
}

/** 토큰 발급 */
export async function getFcmToken(): Promise<string | null> {
  const m = await ensureMessaging();
  if (!m) {
    console.warn("[FCM] messaging not available");
    return null;
  }
  const reg = await navigator.serviceWorker.ready;
  try {
    const token = await getToken(m, {
      vapidKey: import.meta.env.VITE_FB_VAPID_KEY,
      serviceWorkerRegistration: reg,
    });
    console.log("[FCM] getToken =>", token ? "OK" : "null");
    return token ?? null;
  } catch (e) {
    console.error("[FCM] getToken error:", e);
    return null;
  }
}

/** 포그라운드 수신 */
export function onForegroundMessage(cb: (p: any) => void) {
  // 🔽 이 함수가 Promise<Unsubscribe | void>를 반환합니다.
  return ensureMessaging().then((m) => {
    if (!m) return;

    // 🔽 onMessage가 반환하는 unsubscribe 함수를 return합니다.
    return onMessage(m, (payload) => {
      console.log("[FCM] onMessage payload", payload);
      cb(payload);
    });
  });
}

/** (옵션) 로컬 토큰 삭제 */
export async function removeFcmToken() {
  const m = await ensureMessaging();
  if (!m) return false;
  try {
    return await deleteToken(m);
  } catch (e) {
    console.error("[FCM] deleteToken error:", e);
    return false;
  }
}

// src/lib/firebase.ts에 추가

/** 디버깅: 현재 상태 확인 */
export async function debugFcmStatus() {
  console.log("=== FCM Debug Info ===");
  console.log("1. Notification permission:", Notification.permission);
  console.log("2. SW support:", "serviceWorker" in navigator);

  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    console.log("3. SW registration:", registration);
    console.log("4. SW active:", registration?.active?.state);
  }

  const m = await ensureMessaging();
  console.log("5. Messaging instance:", m ? "OK" : "null");

  const token = await getFcmToken();
  console.log("6. Current FCM token:", token);
  console.log("=====================");

  return { permission: Notification.permission, token };
}

// 전역에서 호출 가능하게
// @ts-ignore
window.__fcmDebug = debugFcmStatus;
// @ts-ignore
window.__fcm = { registerServiceWorker, getFcmToken };
