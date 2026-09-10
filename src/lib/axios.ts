import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { mockAdapter } from "@/lib/mockApi";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "@/lib/auth";

const PUBLIC_PATH_PREFIXES: string[] = [
  "/api/v1/combinations/recommend",
  "/api/v1/supplements/search",
  "/api/v1/combinations/analyze",
];

const BASE_URL = import.meta.env.VITE_SERVER_API_URL;

const USE_COOKIE_REFRESH = false;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: USE_COOKIE_REFRESH,
});

if (import.meta.env.VITE_USE_MOCK_API !== "false") {
  api.defaults.adapter = mockAdapter;
}

const pathOf = (url?: string, base?: string) => {
  try {
    return new URL(url ?? "", base ?? BASE_URL).pathname;
  } catch {
    return url ?? "";
  }
};

api.interceptors.request.use((config) => {
  const pathname = pathOf(config.url, config.baseURL);
  const isPublic = PUBLIC_PATH_PREFIXES.some((p) => pathname.startsWith(p));
  const isRefresh = pathname.includes("/api/v1/auth/refresh");

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

const doRefresh = async (): Promise<string | null> => {
  if (isRefreshing) {
    return new Promise((resolve) => queue.push(resolve));
  }
  isRefreshing = true;
  try {
    const res = await axios.post(
      `${BASE_URL}/api/v1/auth/refresh`,
      USE_COOKIE_REFRESH
        ? {}
        : { refreshToken: (getRefreshToken() || "").trim() },
      { withCredentials: USE_COOKIE_REFRESH, timeout: 15000 }
    );

    const data: any = res.data ?? {};
    const newAT = data?.result?.accessToken ?? data?.accessToken ?? data?.token ?? null;
    const newRT = data?.result?.refreshToken ?? data?.refreshToken ?? null;

    if (!newAT) throw new Error("No access token in refresh response");

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

    if (isPublic) {
      return Promise.reject(error);
    }

    if (path.includes("/api/v1/auth/refresh")) {
      clearTokens();
      return Promise.reject(error);
    }

    const rt = (getRefreshToken() || "").trim();
    if (!rt && !USE_COOKIE_REFRESH) {
      clearTokens();
      return Promise.reject(error);
    }

    const newAT = await doRefresh();
    if (!newAT) {
      clearTokens();
      return Promise.reject(error);
    }

    original.__isRetryRequest = true;
    original.headers = {
      ...(original.headers || {}),
      Authorization: `Bearer ${newAT}`,
    };
    return api(original);
  }
);


export default api;
