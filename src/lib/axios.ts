import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "@/lib/auth";

// === 필요 시 여기에 퍼블릭 엔드포인트만 최소한 유지 ===
const PUBLIC_PATH_PREFIXES: string[] = [
  "/api/v1/combinations/recommend",
  "/api/v1/supplements/search",
];

const BASE_URL = import.meta.env.VITE_SERVER_API_URL;

// ⚠️ RT를 쿠키로 운용한다면 true로 바꾸세요.
const USE_COOKIE_REFRESH = false;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: USE_COOKIE_REFRESH, // ← RT 쿠키 방식일 때만 true
});

// 경로 파싱 헬퍼
const pathOf = (url?: string, base?: string) => {
  try {
    return new URL(url ?? "", base ?? BASE_URL).pathname;
  } catch {
    return url ?? "";
  }
};

// 요청 인터셉터: 보호 API에만 AT 부착
api.interceptors.request.use((config) => {
  const pathname = pathOf(config.url, config.baseURL);
  const isPublic = PUBLIC_PATH_PREFIXES.some((p) => pathname.startsWith(p));
  const isRefresh = pathname.includes("/api/v1/auth/refresh");

  // refresh 호출에는 Authorization 제거
  if (isRefresh) {
    if (config.headers) delete (config.headers as any).Authorization;
    return config;
  }

  const at = (getAccessToken() || "").trim();
  if (!isPublic && at && config.headers) {
    (config.headers as any).Authorization = `Bearer ${at}`;
  }
  return config;
});

let isRefreshing = false;
let queue: Array<(t: string | null) => void> = [];

// 내부: 리프레시 호출
const doRefresh = async (): Promise<string | null> => {
  if (isRefreshing) {
    return new Promise((resolve) => queue.push(resolve));
  }
  isRefreshing = true;
  try {
    // 쿠키 기반 ↔ 바디 기반 분기
    const res = await axios.post(
      `${BASE_URL}/api/v1/auth/refresh`,
      USE_COOKIE_REFRESH
        ? {} // 쿠키 방식이면 바디 불필요
        : { refreshToken: (getRefreshToken() || "").trim() },
      { withCredentials: USE_COOKIE_REFRESH, timeout: 15000 }
    );

    const data: any = res.data ?? {};
    const newAT = data?.result?.accessToken ?? data?.accessToken ?? data?.token ?? null;
    const newRT = data?.result?.refreshToken ?? data?.refreshToken ?? null;

    if (!newAT) throw new Error("No access token in refresh response");

    // saveTokens 시그니처에 맞춰서 저장 (newRT 없으면 기존 RT 유지)
    saveTokens(newAT, newRT ?? (getRefreshToken() || ""));

    queue.forEach((fn) => fn(newAT));
    queue = [];
    return newAT;
  } catch (e) {
    queue.forEach((fn) => fn(null));
    queue = [];
    clearTokens();
    return null;
  } finally {
    isRefreshing = false;
  }
};

// 응답 인터셉터: 401 처리
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const { config, response } = error;
    const original = config as AxiosRequestConfig & { __isRetryRequest?: boolean };
    const status = response?.status ?? 0;

    if (status !== 401 || original?.__isRetryRequest) {
      return Promise.reject(error);
    }

    const path = pathOf(original?.url, original?.baseURL);
    const isPublic = PUBLIC_PATH_PREFIXES.some((p) => path.startsWith(p));

    // ⛔ 퍼블릭 API는 리프레시 시도 안 함
    if (isPublic) {
      return Promise.reject(error);
    }

    // ⛔ refresh 자체 401이면 로그아웃
    if (path.includes("/api/v1/auth/refresh")) {
      clearTokens();
      window.location.replace("/login");
      return Promise.reject(error);
    }

    // 💡 기존 코드와 달리, hadAuthHeader 여부와 무관하게
    //    "보호 API + RT 보유"면 리프레시를 시도한다.
    const rt = (getRefreshToken() || "").trim();
    if (!rt && !USE_COOKIE_REFRESH) {
      // 바디 기반인데 RT가 없다 → 로그아웃
      clearTokens();
      window.location.replace("/login");
      return Promise.reject(error);
    }

    const newAT = await doRefresh();
    if (!newAT) {
      // 리프레시 실패 → 로그아웃
      window.location.replace("/login");
      return Promise.reject(error);
    }

    // 원요청 재시도
    original.__isRetryRequest = true;
    original.headers = {
      ...(original.headers || {}),
      Authorization: `Bearer ${newAT}`,
    };
    return api(original);
  }
);

export default api;
