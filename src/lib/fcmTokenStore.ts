import { safeSession } from "@/lib/safeSession";

const KEY_TOKEN = "fcmToken";
const KEY_SENT = "fcmTokenSent";

// 메모리 보관소 (탭 내 생존)
let memToken: string | null = null;
let memSent: string | null = null;

export const fcmTokenStore = {
  /** (선택) 기존 localStorage 잔재가 있으면 세션으로 이관 */
  migrateFromLocalStorage() {
    try {
      const lsToken = localStorage.getItem(KEY_TOKEN);
      const lsSent = localStorage.getItem(KEY_SENT);
      if (lsToken) {
        memToken = lsToken;
        safeSession.set(KEY_TOKEN, lsToken);
        localStorage.removeItem(KEY_TOKEN);
      }
      if (lsSent) {
        memSent = lsSent;
        safeSession.set(KEY_SENT, lsSent);
        localStorage.removeItem(KEY_SENT);
      }
    } catch {
      /* ignore */
    }
  },

  // 저장
  setToken(token: string) {
    memToken = token;
    safeSession.set(KEY_TOKEN, token);
  },
  setTokenSent(sent: string) {
    memSent = sent;
    safeSession.set(KEY_SENT, sent);
  },

  // 조회 (메모리 → 세션 순)
  getToken(): string | null {
    if (memToken) return memToken;
    const v = safeSession.get(KEY_TOKEN);
    if (v) memToken = v;
    return v;
  },
  getTokenSent(): string | null {
    if (memSent) return memSent;
    const v = safeSession.get(KEY_SENT);
    if (v) memSent = v;
    return v;
  },

  // 삭제
  clear() {
    memToken = null;
    memSent = null;
    safeSession.remove(KEY_TOKEN);
    safeSession.remove(KEY_SENT);
  },
};
