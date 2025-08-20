// src/pages/auth/OauthRedirect.tsx
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveTokens, clearTokens } from "@/lib/auth";
import { syncFcmToken } from "@/lib/push";
import { registerServiceWorker } from "@/lib/firebase";
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

      // 1) 로그인 세션 저장
      saveTokens(at, rt);

      // 2) SW 등록 보장 (대기 필요 없음)
      registerServiceWorker().catch(() => {});

      // 3) 지원 환경에서만 강제 동기화
      try {
        const ok = await isSupported(); // ← 여기서 안전 체크
        if (
          ok &&
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
          await syncFcmToken(true); // PUT /api/v1/users/me/fcm-token
        }
      } catch {
        // 조용히 무시 (메인 앱에서 재동기화됨)
      }

      // 4) 이동 (open redirect 방지)
      const safeNext = next.startsWith("/") ? next : "/";
      navigate(safeNext, { replace: true });
    })();
  }, [navigate, query]);

  return <div className="p-6 text-center text-gray-600">로그인 처리 중...</div>;
}
