// src/lib/push.ts
import axios from "@/lib/axios";
import { registerServiceWorker, getFcmToken } from "@/lib/firebase";
import { isSupported } from "firebase/messaging";
import {
  onForegroundMessage,
  requestNotificationPermission,
} from "@/lib/firebase";

// ★ 추가: AT 확인, 중복호출/중복업로드 방지
import { getAccessToken } from "@/lib/auth";

let fcmSyncInFlight = false;           // 동시 호출 락
let lastSyncedToken: string | null = null; // 같은 토큰 재업서트 방지(메모리)
const LS_KEY = "vc_last_fcm_token";    // 새로고침 후에도 캐시 유지하려면 로컬스토리지 사용

try {
  const cached = localStorage.getItem(LS_KEY);
  if (cached) lastSyncedToken = cached;
} catch { /* safari 프라이버시 모드 대비 */ }

// 내부 공통 업서트 함수
async function upsertToServer(payload: Record<string, any>) {
  await axios.put("/api/v1/users/me/fcm-token", {
    ...payload,
    platform: payload.platform ?? "web",
    origin: location.origin,
    userAgent: navigator.userAgent,
  });
}

/** 공통 가드: 비로그인/미지원/권한 미허용 등 빠른 리턴 */
async function preconditions(forceRequest: boolean) {
  // ★ AT 없으면 즉시 중단 → 로그인 페이지에서 401 폭주 방지
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

export async function syncFcmToken(options?: { forceRequest?: boolean }) {
  const force = options?.forceRequest ?? false;

  // ★ 중복 호출 방지
  if (fcmSyncInFlight) return false;
  fcmSyncInFlight = true;

  try {
    const pre = await preconditions(force);
    if (!pre.ok) return false;

    const token = await getFcmToken().catch(() => null);
    if (!token) return false;

    // ★ 동일 토큰이면 서버 호출 생략
    if (lastSyncedToken === token) return true;

    await upsertToServer({ token });

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
        | "no_access_token"; // ★ 추가
      error?: any;
    }
> {
  // ★ 로그인 여부 확인
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

  await upsertToServer({ token });

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

/** 서버 컨벤션이 fcmToken 키일 때 */
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

    await upsertToServer({ fcmToken: token });

    lastSyncedToken = token;
    try { localStorage.setItem(LS_KEY, token); } catch {}

    return true;
  } finally {
    fcmSyncInFlight = false;
  }
}
