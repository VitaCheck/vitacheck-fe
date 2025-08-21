// public/firebase-messaging-sw.js
// v2025-08-21

// 최신 compat 로더
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js"
);

//  vitacheck-1ee1d 로 통일
firebase.initializeApp({
  apiKey: "AIzaSyDhCaf3Ockukla3eR3lx4B3m9TsDhvscMY",
  authDomain: "vitacheck-1ee1d.firebaseapp.com",
  projectId: "vitacheck-1ee1d",
  storageBucket: "vitacheck-1ee1d.appspot.com",
  messagingSenderId: "802557675495",
  appId: "1:802557675495:web:7c6c855f4ca135ca049f42",
});

const messaging = firebase.messaging();

// 설치 즉시 활성화(배포 후 SW 교체 확실히 반영)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

messaging.onBackgroundMessage(async (payload) => {
  const n = payload.notification || {};
  const d = payload.data || {};
  const title = n.title || d.title || "VitaCheck";
  const body = n.body || d.body || "알림이 도착했어요.";

  // ✅ 서비스 도메인에 맞춘 기본 링크
  const link =
    (payload.fcmOptions && payload.fcmOptions.link) ||
    d.link ||
    "https://vita-check.com/alarm";

  await self.registration.showNotification(title, {
    body,
    icon: "/icons/icon-192.png",
    data: { link },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const raw =
    event.notification.data?.url || event.notification.data?.link || "/alarm";
  const target = /^https?:\/\//i.test(raw) ? raw : self.location.origin + raw;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
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
