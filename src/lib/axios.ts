import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "@/lib/auth";

const PUBLIC_PATH_PREFIXES: string[] = [
  "/api/v1/combinations/recommend",
  "/api/v1/supplements/search",
  // 메인에서 쓰는 다른 퍼블릭 API도 여기에 추가
];

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: false,
});

// ✅ 보호 API에만 AT 부착 (복구)
api.interceptors.request.use((config) => {
  let pathname = "";
  try {
    pathname = new URL(config.url ?? "", config.baseURL).pathname;
  } catch {
    pathname = config.url ?? "";
  }

  const isPublic = PUBLIC_PATH_PREFIXES.some((p) => pathname.startsWith(p));
  const isRefresh = pathname.includes("/api/v1/auth/refresh");

  if (isRefresh && config.headers) {
    delete (config.headers as any).Authorization;
    return config;
  }

  const at = (getAccessToken() || "").trim();
  if (!isPublic && at && config.headers) {
    (config.headers as any).Authorization = `Bearer ${at}`;
  }
  return config;
});

let isRefreshing = false;
let queue: Array<(t: string) => void> = [];

// ✅ 단일 response 인터셉터만 유지
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const { config, response } = error;
    const original = config as AxiosRequestConfig & {
      __isRetryRequest?: boolean;
    };

    if (response?.status !== 401 || original?.__isRetryRequest) {
      return Promise.reject(error);
    }

    // 요청 path 파싱
    const path = (() => {
      try {
        return new URL(original?.url ?? "", original?.baseURL ?? "").pathname;
      } catch {
        return original?.url ?? "";
      }
    })();

    // 퍼블릭 여부 + 원래 Authorization 있었는지
    const isPublic = PUBLIC_PATH_PREFIXES.some((p) => path.startsWith(p));
    const hadAuthHeader = !!(
      original?.headers && (original.headers as any).Authorization
    );

    // ⛔ 게스트/퍼블릭 요청: refresh/리다이렉트 금지
    if (isPublic || !hadAuthHeader) {
      return Promise.reject(error);
    }

    // refresh 자체가 401이면 즉시 로그아웃
    if (path?.includes("/api/v1/auth/refresh")) {
      clearTokens();
      window.location.replace("/login");
      return Promise.reject(error);
    }

    const rt = (getRefreshToken() || "").trim();
    if (!rt) {
      clearTokens();
      window.location.replace("/login");
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER_API_URL}/api/v1/auth/refresh`,
          { refreshToken: rt },
          { timeout: 15000 }
        );

        const newAT =
          (data as any)?.result?.accessToken ?? (data as any)?.accessToken;
        const newRT =
          (data as any)?.result?.refreshToken ?? (data as any)?.refreshToken;

        if (!newAT) throw new Error("No access token in refresh response");

        saveTokens(newAT, newRT || rt);

        queue.forEach((cb) => cb(newAT));
        queue = [];
      } catch (e) {
        queue = [];
        clearTokens();
        window.location.replace("/login");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise((resolve) => {
      queue.push((newToken) => {
        original.__isRetryRequest = true;
        original.headers = {
          ...(original.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };
        resolve(api(original));
      });
    });
  }
);

export default api;
