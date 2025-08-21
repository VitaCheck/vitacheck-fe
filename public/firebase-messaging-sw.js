// public/firebase-messaging-sw.js
// v2025-08-21 (unified FCM + WebPush)

let hasFirebase = false;
let messaging = null;

// --- FCM 초기화 (Chrome/Android/Windows, macOS 등에서만 성공) ---
try {
  importScripts("https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js");
  importScripts("https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js");

  firebase.initializeApp({
    apiKey: "AIzaSyDhCaf3Ockukla3eR3lx4B3m9TsDhvscMY",
    authDomain: "vitacheck-1ee1d.firebaseapp.com",
    projectId: "vitacheck-1ee1d",
    storageBucket: "vitacheck-1ee1d.appspot.com",
    messagingSenderId: "802557675495",
    appId: "1:802557675495:web:7c6c855f4ca135ca049f42",
  });

  messaging = firebase.messaging();
  hasFirebase = true;

  // FCM 백그라운드 수신
  messaging.onBackgroundMessage(async (payload) => {
    const n = payload.notification || {};
    const d = payload.data || {};
    const title = n.title || d.title || "VitaCheck";
    const body  = n.body  || d.body  || "알림이 도착했어요.";
    const link  =
      (payload.fcmOptions && payload.fcmOptions.link) ||
      d.link || d.clickUrl ||
      "https://vita-check.com/alarm";

    await self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-72.png",
      data: { url: link },
    });
  });
} catch (e) {
  // iOS PWA 등: FCM 미지원 → 표준 Web Push만 사용
}

// 설치/활성화
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// --- 표준 Web Push(iOS PWA 포함) 수신 ---
// (payload는 서버에서 JSON 문자열로 보냄)
self.addEventListener("push", (event) => {
  // FCM이 있어도 push 이벤트는 올 수 있으니, 공통 처리 안전하게 둠
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {}

  const title = data.title || "VitaCheck";
  const body  = data.body  || "";
  const icon  = data.icon  || "/icons/icon-192.png";
  const badge = data.badge || "/icons/badge-72.png";
  const url   = data.clickUrl || data.url || data.link || "/alarm";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      data: { url },
    })
  );
});

// --- 클릭시 라우팅 ---
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const raw = event.notification?.data?.url || "/alarm";
  const target = /^https?:\/\//i.test(raw) ? raw : self.location.origin + raw;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        try {
          const u = new URL(c.url);
          if (u.origin === self.location.origin) {
            c.focus();
            c.navigate(target);
            return;
          }
        } catch {}
      }
      return clients.openWindow(target);
    })
  );
});
