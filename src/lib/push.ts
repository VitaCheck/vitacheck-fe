// src/lib/push.ts
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
} catch {
  // safari 프라이버시 모드 대비
  console.debug("[FCM] localStorage read fail (private mode?)");
}

/** ✅ 서버에 정확히 { fcmToken, deviceType: "WEB" } 형태로 업서트 */
async function upsertFcmToken(token: string) {
  console.debug("[FCM] upsertFcmToken START", token?.slice(0, 8), "...");
  try {
    const res = await axios.put("/api/v1/users/me/fcm-token", {
      fcmToken: token,
      deviceType: "WEB",
    });
    console.debug("[FCM] upsertFcmToken END status=", res.status);
  } catch (e: any) {
    console.error(
      "[FCM] upsertFcmToken FAIL",
      e?.response?.status,
      e?.response?.data || e?.message
    );
    throw e;
  }
}

/** 공통 가드: 비로그인/미지원/권한 미허용 등 빠른 리턴 */
async function preconditions(forceRequest: boolean) {
  const at = getAccessToken();
  if (!at) {
    console.debug("[FCM] pre: no_access_token");
    return { ok: false as const, reason: "no_access_token" };
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    console.debug("[FCM] pre: not_supported (messaging not supported)");
    return { ok: false as const, reason: "not_supported" };
  }

  try {
    await registerServiceWorker();
    console.debug("[FCM] pre: service worker registered");
  } catch (e) {
    console.error("[FCM] pre: service worker register fail", e);
    // SW 등록 실패는 명시적인 reason이 없으므로 force 호출 쪽에서 잡힘
  }

  if (
    typeof Notification !== "undefined" &&
    Notification.permission !== "granted"
  ) {
    if (!forceRequest) {
      console.debug("[FCM] pre: permission_blocked (silent mode)");
      return { ok: false as const, reason: "permission_blocked" };
    }
    const res = await Notification.requestPermission();
    console.debug("[FCM] pre: permission request result =", res);
    if (res !== "granted") {
      console.debug("[FCM] pre: permission_denied");
      return { ok: false as const, reason: "permission_denied" };
    }
  }

  return { ok: true as const };
}

console.debug("[FCM] push module loaded");
// axios 인스턴스 확인(도메인 혼선 디버그용)
try {
  // @ts-ignore
  console.debug("[FCM] axios baseURL =", axios?.defaults?.baseURL || "(none)");
} catch {}

/** 내부 공통 동기화 */
export async function syncFcmToken(options?: { forceRequest?: boolean }) {
  const force = options?.forceRequest ?? false;

  if (fcmSyncInFlight) {
    console.debug("[FCM] sync: skip (in flight)");
    return false;
  }
  fcmSyncInFlight = true;

  try {
    console.debug("[FCM] sync: start, force =", force);

    const pre = await preconditions(force);
    console.debug("[FCM] sync: preconditions =", pre);
    if (!pre.ok) return false;

    const token = await getFcmToken().catch((e) => {
      console.error("[FCM] getFcmToken error", e);
      return null;
    });
    console.debug("[FCM] sync: getFcmToken =>", token ? "OK" : "NULL");
    if (!token) return false;

    if (lastSyncedToken === token) {
      console.debug("[FCM] sync: skip upsert (same token as last)");
      return true;
    }

    await upsertFcmToken(token);

    lastSyncedToken = token;
    try {
      localStorage.setItem(LS_KEY, token);
    } catch {
      console.debug("[FCM] localStorage write fail (private mode?)");
    }

    console.debug("[FCM] sync: done");
    return true;
  } finally {
    fcmSyncInFlight = false;
    console.debug("[FCM] sync: end");
  }
}

// --- 고수준 함수 (버튼/수동) ---
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
  console.debug("[FCM] enableWebPush: start");

  if (!getAccessToken()) {
    console.debug("[FCM] enableWebPush: no_access_token");
    return { ok: false, reason: "no_access_token" };
  }

  const supported = await isSupported().catch(() => false);
  if (!supported || typeof Notification === "undefined") {
    console.debug("[FCM] enableWebPush: not_supported");
    return { ok: false, reason: "not_supported" };
  }

  try {
    await registerServiceWorker();
    console.debug("[FCM] enableWebPush: service worker registered");
  } catch (e) {
    console.error("[FCM] enableWebPush: sw_error", e);
    return { ok: false, reason: "sw_error", error: e };
  }

  const perm = await requestNotificationPermission();
  console.debug("[FCM] enableWebPush: permission =", perm);
  if (perm === "denied") return { ok: false, reason: "permission_denied" };
  if (perm !== "granted") return { ok: false, reason: "permission_blocked" };

  const token = await getFcmToken().catch((e) => {
    console.error("[FCM] enableWebPush: getFcmToken error", e);
    return null;
  });
  console.debug("[FCM] enableWebPush: token =", token ? "OK" : "NULL");
  if (!token) return { ok: false, reason: "no_token" };

  try {
    await upsertFcmToken(token);
  } catch (e) {
    // upsert 내부에서 이미 로깅함
    throw e;
  }

  lastSyncedToken = token;
  try {
    localStorage.setItem(LS_KEY, token);
  } catch {
    console.debug("[FCM] enableWebPush: localStorage write fail");
  }

  if (opts?.onMessage) onForegroundMessage(opts.onMessage);

  console.debug("[FCM] enableWebPush: done");
  return { ok: true, token };
}

/** 로그인 직후(AT 저장 후) 조용히 동기화 */
export async function syncFcmTokenAfterLoginSilently() {
  console.debug("[FCM] silent sync after login");
  return syncFcmToken({ forceRequest: false }).catch((e) => {
    console.error("[FCM] silent sync error", e);
    return false;
  });
}

/** 강제 동기화(권한 팝업 허용) */
export async function syncFcmTokenForce() {
  console.debug("[FCM] force sync (may request permission)");
  return syncFcmToken({ forceRequest: true }).catch((e) => {
    console.error("[FCM] force sync error", e);
    return false;
  });
}

/** 현재 브라우저의 FCM 토큰 읽기(없으면 null) */
export async function getCurrentFcmToken(): Promise<string | null> {
  console.debug("[FCM] getCurrentFcmToken: start");
  const ok = await isSupported().catch(() => false);
  if (!ok) {
    console.debug("[FCM] getCurrentFcmToken: not supported");
    return null;
  }
  await registerServiceWorker();
  const t = await getFcmToken().catch((e) => {
    console.error("[FCM] getCurrentFcmToken: error", e);
    return null;
  });
  console.debug("[FCM] getCurrentFcmToken: result =", t ? "OK" : "NULL");
  return t;
}

/** (호환용) fcmToken 키를 쓰던 기존 호출부도 동일 포맷으로 전송 */
export async function syncFcmTokenAsFcmTokenKey(options?: {
  forceRequest?: boolean;
}) {
  const force = options?.forceRequest ?? false;
  if (fcmSyncInFlight) {
    console.debug("[FCM] compat sync: skip (in flight)");
    return false;
  }
  fcmSyncInFlight = true;

  try {
    console.debug("[FCM] compat sync: start, force =", force);

    const pre = await preconditions(force);
    console.debug("[FCM] compat sync: preconditions =", pre);
    if (!pre.ok) return false;

    const token = await getFcmToken().catch((e) => {
      console.error("[FCM] compat sync: getFcmToken error", e);
      return null;
    });
    console.debug("[FCM] compat sync: getFcmToken =>", token ? "OK" : "NULL");
    if (!token) return false;

    if (lastSyncedToken === token) {
      console.debug("[FCM] compat sync: skip upsert (same token)");
      return true;
    }

    await upsertFcmToken(token);

    lastSyncedToken = token;
    try {
      localStorage.setItem(LS_KEY, token);
    } catch {
      console.debug("[FCM] compat sync: localStorage write fail");
    }

    console.debug("[FCM] compat sync: done");
    return true;
  } finally {
    fcmSyncInFlight = false;
    console.debug("[FCM] compat sync: end");
  }
}
