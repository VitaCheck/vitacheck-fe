// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  deleteToken,
  type Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: "vitacheck-93554.firebaseapp.com",
  projectId: "vitacheck-93554",
  storageBucket: "vitacheck-93554.appspot.com",
  messagingSenderId: "498954682157",
  appId: "1:498954682157:web:7ca8b0a8ff2a736e785da4",
};

const app = initializeApp(firebaseConfig);

// ✅ 지연 초기화(한 번만 생성)
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
  ensureMessaging().then((m) => {
    if (!m) return;
    onMessage(m, (payload) => {
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
// @ts-ignore
window.__fcm = { registerServiceWorker, getFcmToken };
