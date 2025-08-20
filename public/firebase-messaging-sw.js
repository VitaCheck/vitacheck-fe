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

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url =
    (e.notification.data && e.notification.data.link) ||
    "https://vitachecking.com/alarm";
  e.waitUntil(clients.openWindow(url));
});
