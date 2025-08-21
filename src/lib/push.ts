// src/lib/push.ts
import axios from "@/lib/axios";
import { registerServiceWorker, getFcmToken } from "@/lib/firebase";
import { isSupported } from "firebase/messaging";
import {
  onForegroundMessage,
  requestNotificationPermission,
} from "@/lib/firebase";

export async function syncFcmToken(options?: { forceRequest?: boolean }) {
  const force = options?.forceRequest ?? false;

  const supported = await isSupported().catch(() => false);
  if (!supported) return false;

  await registerServiceWorker();

  // 권한 보장
  if (typeof Notification !== "undefined") {
    if (Notification.permission !== "granted") {
      if (!force) return false; // 강제 요청 안 하면 중단
      const res = await Notification.requestPermission();
      if (res !== "granted") return false;
    }
  }

  const token = await getFcmToken();
  if (!token) return false;

  // 서버가 기대하는 필드명에 맞춰 보냄 (token 권장)
  await axios.put("/api/v1/users/me/fcm-token", {
    token, // ← 서버가 fcmToken을 받는다면 여기 키만 바꿔주세요
    platform: "web",
    origin: location.origin,
    userAgent: navigator.userAgent,
  });

  return true;
}

// --- 아래를 src/lib/push.ts 끝부분에 추가하세요 ---

/**
 * 사용자가 버튼을 눌렀을 때 쓸 "알림 켜기" 고수준 함수
 * - 권한 요청 → SW 등록 → 토큰 발급 → 서버 업서트
 * - 성공 시 token 반환, 실패 시 이유 제공
 */
export async function enableWebPush(opts?: {
  onMessage?: (p: any) => void; // 포그라운드 수신 콜백 (선택)
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
        | "unknown";
      error?: any;
    }
> {
  const supported = await isSupported().catch(() => false);
  if (!supported || typeof Notification === "undefined") {
    return { ok: false, reason: "not_supported" };
  }

  try {
    await registerServiceWorker();
  } catch (e) {
    return { ok: false, reason: "sw_error", error: e };
  }

  // iOS 포함: 사용자 제스처 안에서 권한 요청
  const perm = await requestNotificationPermission();
  if (perm === "denied") return { ok: false, reason: "permission_denied" };
  if (perm !== "granted") return { ok: false, reason: "permission_blocked" };

  const token = await getFcmToken().catch((e) => {
    console.warn("[PUSH] getFcmToken error", e);
    return null;
  });
  if (!token) return { ok: false, reason: "no_token" };

  await axios.put("/api/v1/users/me/fcm-token", {
    token,
    platform: "web",
    origin: location.origin,
    userAgent: navigator.userAgent,
  });

  if (opts?.onMessage) onForegroundMessage(opts.onMessage);

  return { ok: true, token };
}

/**
 * 로그인 직후 호출하면 좋은 헬퍼
 * - Authorization 헤더 세팅이 되어 있다는 가정하에
 * - 권한 팝업은 띄우지 않고, 허용된 경우에만 조용히 동기화
 */
export async function syncFcmTokenAfterLoginSilently() {
  return syncFcmToken({ forceRequest: false }).catch(() => false);
}

/**
 * 강제로 동기화 (권한 팝업 허용)
 * - 소셜 로그인 리다이렉트 직후/설정 페이지 등에서 사용
 */
export async function syncFcmTokenForce() {
  return syncFcmToken({ forceRequest: true }).catch(() => false);
}

/**
 * 현재 브라우저의 토큰을 읽어오기(없으면 null)
 * - 디버깅/상태 뱃지에 유용
 */
export async function getCurrentFcmToken(): Promise<string | null> {
  const ok = await isSupported().catch(() => false);
  if (!ok) return null;
  await registerServiceWorker();
  return getFcmToken().catch(() => null);
}

/**
 * 서버 컨벤션이 token이 아닌 fcmToken일 때를 위한 유틸
 * - 필요하면 이 함수만 호출(기존 syncFcmToken은 유지)
 */
export async function syncFcmTokenAsFcmTokenKey(options?: {
  forceRequest?: boolean;
}) {
  const force = options?.forceRequest ?? false;

  const supported = await isSupported().catch(() => false);
  if (!supported) return false;

  await registerServiceWorker();

  if (typeof Notification !== "undefined") {
    if (Notification.permission !== "granted") {
      if (!force) return false;
      const res = await Notification.requestPermission();
      if (res !== "granted") return false;
    }
  }

  const token = await getFcmToken();
  if (!token) return false;

  await axios.put("/api/v1/users/me/fcm-token", {
    fcmToken: token, // ← 서버가 fcmToken 키를 요구하는 경우
    platform: "web",
    origin: location.origin,
    userAgent: navigator.userAgent,
  });

  return true;
}
