import axios from "axios";

// 공개 엔드포인트: 인증 헤더를 추가하지 않음 (CORS preflight 회피)
const PUBLIC_PATH_PREFIXES: string[] = [
  "/api/v1/combinations/recommend",
  "/api/v1/supplements/search",
];

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  // 교차 출처 쿠키 사용이 필요하지 않은 API는 credentials를 비활성화
  withCredentials: false,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // 요청 경로 파싱 (상대/절대 URL 모두 대응)
  let pathname = "";
  try {
    pathname = new URL(config.url ?? "", config.baseURL).pathname;
  } catch {
    pathname = config.url ?? "";
  }

  const isPublic = PUBLIC_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isPublic && token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.request.use((config) => {
  if (config.url?.includes("/api/v1/auth/signup")) {
    console.debug(
      "[request → /auth/signup] headers.Authorization:",
      config.headers?.Authorization
    );
  }
  return config;
});

export default instance;
