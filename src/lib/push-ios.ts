// src/lib/push-ios.ts
import axios from "@/lib/axios";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_FB_VAPID_KEY as string;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export function isStandalonePWA(): boolean {
  // iOS: navigator.standalone, 크로스 브라우저: display-mode
  // @ts-ignore
  return !!(window.navigator.standalone || window.matchMedia?.("(display-mode: standalone)")?.matches);
}

export async function ensureIOSWebPushSubscription() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;
  if (!isStandalonePWA()) return null;

  if (Notification.permission !== "granted") {
    const p = await Notification.requestPermission();
    if (p !== "granted") return null;
  }

  const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
  const existing = await reg.pushManager.getSubscription();
  if (existing) return existing;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  await axios.post("/api/v1/push/subscribe", {
    endpoint: sub.endpoint,
    keys: sub.toJSON().keys,
    platform: "ios-pwa",
    origin: location.origin,
    userAgent: navigator.userAgent,
  });

  return sub;
}
