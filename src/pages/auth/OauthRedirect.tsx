// // src/pages/auth/OauthRedirect.tsx
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveTokens, clearTokens } from "@/lib/auth";
import axios from "@/lib/axios";
import { syncFcmToken } from "@/lib/push";
import { isSupported } from "firebase/messaging";

export default function OauthRedirect() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = useMemo(() => {
    const at = params.get("accessToken") ?? "";
    const rt = params.get("refreshToken") ?? "";
    const next = params.get("next") ?? "/";
    return { at, rt, next };
  }, [params]);

  useEffect(() => {
    (async () => {
      const { at, rt, next } = query;

      if (!at || !rt) {
        clearTokens?.();
        navigate("/login?error=missing_token", { replace: true });
        return;
      }

      // 1) 세션 저장 + Authorization 헤더 즉시 적용
      saveTokens(at, rt);
      axios.defaults.headers.common["Authorization"] = `Bearer ${at}`;

      // 2) 지원 환경이면 토큰 동기화 (권한창 띄워서라도 저장)
      const ok = await isSupported().catch(() => false);
      if (ok) {
        try {
          await syncFcmToken({ forceRequest: true });
        } catch (e) {
          console.warn("[FCM] sync after OAuth failed:", e);
        }
      }

      // 3) 안전한 경로로 이동
      const safeNext = next.startsWith("/") ? next : "/";
      navigate(safeNext, { replace: true });
    })();
  }, [navigate, query]);

  return <div className="p-6 text-center text-gray-600">로그인 처리 중...</div>;
}
