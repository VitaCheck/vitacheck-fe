import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
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
