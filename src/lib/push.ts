import api from "@/lib/axios";
import {
  registerServiceWorker,
  requestNotificationPermission,
  getFcmToken,
  onForegroundMessage,
  removeFcmToken,
} from "@/lib/firebase";
import { fcmTokenStore } from "@/lib/fcmTokenStore";

type EnableResult =
  | { ok: true; token: string }
  | {
      ok: false;
      reason:
        | "unsupported"
        | "sw_register_failed"
        | "denied"
        | "no_token"
        | "server_error";
      error?: unknown;
    };

/**
 * 서버에 FCM 토큰 동기화
 * - 백엔드 스펙: PUT /api/v1/users/me/fcm-token  { fcmToken: string }
 */
async function sendTokenToServer(token: string) {
  await api.put("/api/v1/users/me/fcm-token", { fcmToken: token });
}

/**
 * 앱 시작 시 한 번 호출하거나, "알림 켜기" 버튼에서 호출
 * - SW 등록 → 권한 요청 → 토큰 발급 → 서버 전송(변경 시)
 */
export async function enableWebPush(opts?: {
  onMessage?: (payload: any) => void;
  forceResend?: boolean;
}): Promise<EnableResult> {
  // 1) SW 지원/권한 API 지원 체크
  if (!("serviceWorker" in navigator) || !("Notification" in window)) {
    console.warn("[PUSH] unsupported environment");
    return { ok: false, reason: "unsupported" };
  }

  // 2) SW 등록
  try {
    await registerServiceWorker();
  } catch (e) {
    console.error("[PUSH] service worker register failed", e);
    return { ok: false, reason: "sw_register_failed", error: e };
  }

  // 3) 권한 요청
  const perm = await requestNotificationPermission();
  if (perm !== "granted") {
    console.warn("[PUSH] notification permission:", perm);
    return { ok: false, reason: "denied" };
  }

  // 4) 토큰 발급
  const token = await getFcmToken();
  if (!token) {
    console.error("[PUSH] getFcmToken() returned null");
    return { ok: false, reason: "no_token" };
  }

  // 5) 서버 동기화 (변경되었거나 forceResend인 경우에만)
  const lastSent = fcmTokenStore.getTokenSent();
  const shouldSend = opts?.forceResend || token !== lastSent;

  try {
    if (shouldSend) {
      await sendTokenToServer(token);
      fcmTokenStore.setTokenSent(token);
    }
    fcmTokenStore.setToken(token);
  } catch (e) {
    console.error("[PUSH] send token to server failed", e);
    return { ok: false, reason: "server_error", error: e };
  }

  // 6) 포그라운드 수신 콜백(옵션)
  if (opts?.onMessage) {
    onForegroundMessage(opts.onMessage);
  }

  console.log("[PUSH] enabled with token:", token.slice(0, 12) + "…");
  return { ok: true, token };
}

/**
 * 앱 시작 시 주기적으로 호출해서 토큰 변경을 서버와 재동기화
 * (VAPID 키 변경, 브라우저 갱신, SW 재설치 등으로 토큰이 바뀔 수 있음)
 */
export async function syncFcmToken(forceResend = false) {
  if (!("serviceWorker" in navigator) || !("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  const token = await getFcmToken();
  if (!token) return;

  const lastSent = fcmTokenStore.getTokenSent();
  if (forceResend || token !== lastSent) {
    try {
      await sendTokenToServer(token);
      fcmTokenStore.setTokenSent(token);
    } catch (e) {
      console.error("[PUSH] sync send failed", e);
    }
  }
  fcmTokenStore.setToken(token);
}

/**
 * 로그아웃/알림 해제 시 호출
 * - 현재 백엔드 스펙상 DELETE가 없으므로 빈 문자열을 PUT해서 비활성화 신호로 사용
 *   (가능하면 서버에 DELETE /fcm-token 추가 권장)
 */
export async function disableWebPush() {
  try {
    // 서버 비활성화
    await sendTokenToServer("");
  } catch (e) {
    console.warn("[PUSH] server disable failed (continuing)", e);
  }

  // 클라이언트 토큰 제거
  const ok = await removeFcmToken().catch(() => false);

  // 로컬 상태 정리 (세션/메모리)
  fcmTokenStore.clear();

  console.log("[PUSH] disabled", { removedLocal: ok });
}

/**
 * 디버그 도우미: 현재 상태 로그
 */
export function debugPushStatus() {
  const token = fcmTokenStore.getToken();
  const tokenSent = fcmTokenStore.getTokenSent();
  const state = {
    permission:
      typeof Notification !== "undefined" ? Notification.permission : "n/a",
    swSupported: "serviceWorker" in navigator,
    token: token ? token.slice(0, 20) : null,
    tokenSent: tokenSent ? tokenSent.slice(0, 20) : null,
  };
  console.table(state);
  return state;
}
