// publics/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyD3_7NpZi9Haw_IR4qzwpX-KQDzMIwlam8",
  authDomain: "vitacheck-93554.firebaseapp.com",
  projectId: "vitacheck-93554",
  storageBucket: "vitacheck-93554.appspot.com",
  messagingSenderId: "498954682157",
  appId: "1:498954682157:web:7ca8b0a8ff2a736e785da4",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (payload) => {
  const n = payload.notification || {};
  const d = payload.data || {};
  const title = n.title || d.title || "VitaCheck";
  const body = n.body || d.body || "알림이 도착했어요.";
  const link =
    (payload.fcmOptions && payload.fcmOptions.link) ||
    d.link ||
    "https://vitachecking.com/alarm";
  await self.registration.showNotification(title, { body, data: { link } });
});

// public/firebase-messaging-sw.js (click 핸들러만 교체/추가)
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
