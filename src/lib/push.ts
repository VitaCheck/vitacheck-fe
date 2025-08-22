import axios from "@/lib/axios";
import { registerServiceWorker, getFcmToken } from "@/lib/firebase";
import { isSupported } from "firebase/messaging";
import {
  onForegroundMessage,
  requestNotificationPermission,
} from "@/lib/firebase";
import { getAccessToken } from "@/lib/auth";

let fcmSyncInFlight = false;
let lastSyncedToken: string | null = null;
const LS_KEY = "vc_last_fcm_token";

try {
  const cached = localStorage.getItem(LS_KEY);
  if (cached) lastSyncedToken = cached;
} catch { /* safari 프라이버시 모드 대비 */ }

/** ✅ 서버에 정확히 { fcmToken, deviceType: "WEB" } 형태로 업서트 */
async function upsertFcmToken(token: string) {
  await axios.put("/api/v1/users/me/fcm-token", {
    fcmToken: token,
    deviceType: "WEB",
  });
}

/** 공통 가드: 비로그인/미지원/권한 미허용 등 빠른 리턴 */
async function preconditions(forceRequest: boolean) {
  const at = getAccessToken();
  if (!at) return { ok: false as const, reason: "no_access_token" };

  const supported = await isSupported().catch(() => false);
  if (!supported) return { ok: false as const, reason: "not_supported" };

  await registerServiceWorker();

  if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
    if (!forceRequest) return { ok: false as const, reason: "permission_blocked" };
    const res = await Notification.requestPermission();
    if (res !== "granted") return { ok: false as const, reason: "permission_denied" };
  }

  return { ok: true as const };
}

console.debug("[FCM] push module loaded"); // 파일 최상단

export async function syncFcmToken(options?: { forceRequest?: boolean }) {
  const force = options?.forceRequest ?? false;
  if (fcmSyncInFlight) return false;
  fcmSyncInFlight = true;

  try {
    const pre = await preconditions(force);
    if (!pre.ok) return false;

    const token = await getFcmToken().catch(() => null);
    if (!token) return false;

    if (lastSyncedToken === token) return true;

    await upsertFcmToken(token);

    lastSyncedToken = token;
    try { localStorage.setItem(LS_KEY, token); } catch {}

    return true;
  } finally {
    fcmSyncInFlight = false;
  }
}

// --- 고수준 함수 (버튼용) ---
export async function enableWebPush(opts?: {
  onMessage?: (p: any) => void;
}): Promise<
  | { ok: true; token: string }
  | {
      ok: false;
      reason:
        | "not_supported"
        | "permission_denied"
        | "permission_blocked"
        | "no_token"
        | "sw_error"
        | "no_access_token";
      error?: any;
    }
> {
  if (!getAccessToken()) {
    return { ok: false, reason: "no_access_token" };
  }

  const supported = await isSupported().catch(() => false);
  if (!supported || typeof Notification === "undefined") {
    return { ok: false, reason: "not_supported" };
  }

  try {
    await registerServiceWorker();
  } catch (e) {
    return { ok: false, reason: "sw_error", error: e };
  }

  const perm = await requestNotificationPermission();
  if (perm === "denied") return { ok: false, reason: "permission_denied" };
  if (perm !== "granted") return { ok: false, reason: "permission_blocked" };

  const token = await getFcmToken().catch(() => null);
  if (!token) return { ok: false, reason: "no_token" };

  await upsertFcmToken(token);

  lastSyncedToken = token;
  try { localStorage.setItem(LS_KEY, token); } catch {}

  if (opts?.onMessage) onForegroundMessage(opts.onMessage);

  return { ok: true, token };
}

/** 로그인 직후(AT 저장 후) 조용히 동기화 */
export async function syncFcmTokenAfterLoginSilently() {
  return syncFcmToken({ forceRequest: false }).catch(() => false);
}

/** 강제 동기화(권한 팝업 허용) */
export async function syncFcmTokenForce() {
  return syncFcmToken({ forceRequest: true }).catch(() => false);
}

/** 현재 브라우저의 FCM 토큰 읽기(없으면 null) */
export async function getCurrentFcmToken(): Promise<string | null> {
  const ok = await isSupported().catch(() => false);
  if (!ok) return null;
  await registerServiceWorker();
  return getFcmToken().catch(() => null);
}

/** (호환용) fcmToken 키를 쓰던 기존 호출부도 동일 포맷으로 전송 */
export async function syncFcmTokenAsFcmTokenKey(options?: {
  forceRequest?: boolean;
}) {
  const force = options?.forceRequest ?? false;
  if (fcmSyncInFlight) return false;
  fcmSyncInFlight = true;

  try {
    const pre = await preconditions(force);
    if (!pre.ok) return false;

    const token = await getFcmToken().catch(() => null);
    if (!token) return false;

    if (lastSyncedToken === token) return true;

    await upsertFcmToken(token);

    lastSyncedToken = token;
    try { localStorage.setItem(LS_KEY, token); } catch {}

    return true;
  } finally {
    fcmSyncInFlight = false;
  }
}
