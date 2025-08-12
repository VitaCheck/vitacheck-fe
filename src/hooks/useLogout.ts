import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return async function logout(redirect = "/login") {
    try {
      // 1) 토큰/유저 캐시 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // 필요 시: localStorage.removeItem("userInfo");
      await queryClient.clear();

      // 2) axios 헤더 초기화
      delete axios.defaults.headers.common["Authorization"];

      // 3) 멀티탭 동기화 (선택)
      localStorage.setItem("vc:logout-broadcast", Date.now().toString());
    } finally {
      // 4) 리다이렉트
      navigate(redirect, { replace: true });
    }
  };
}
