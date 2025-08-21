// 세션 스토리지를 안전하게 쓰기 위한 래퍼
const hasSessionStorage = (() => {
  try {
    const k = "__test__";
    sessionStorage.setItem(k, "1");
    sessionStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
})();

export const safeSession = {
  get(key: string): string | null {
    if (!hasSessionStorage) return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    if (!hasSessionStorage) return;
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
  remove(key: string) {
    if (!hasSessionStorage) return;
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  hasSessionStorage,
};
