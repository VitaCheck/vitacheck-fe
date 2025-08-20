import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveTokens, clearTokens } from "@/lib/auth";
import { syncFcmToken } from "@/lib/push"; // ✅ 추가

export default function OauthRedirect() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = useMemo(() => {
    const at = params.get("accessToken") ?? "";
    const rt = params.get("refreshToken") ?? "";
    const next = params.get("next") ?? "";
    return { at, rt, next };
  }, [params]);

  useEffect(() => {
    const { at, rt, next } = query;

    if (at && rt) {
      // 1) 액세스/리프레시 토큰 저장
      saveTokens(at, rt);

      // 2) ✅ 로그인 직후 FCM 토큰 강제 동기화(권한이 허용된 경우에만 서버로 PUT)
      //    - await로 네비게이션을 막고 싶지 않다면 fire-and-forget로 호출
      //    - 내부에서 permission !== 'granted'면 바로 return함
      syncFcmToken(true).catch(() => {
        /* noop: 실패해도 네비게이션 진행 */
      });

      // 3) 안전한 내부 경로만 허용 (open redirect 방지)
      const safeNext = next?.startsWith("/") ? next : "/";
      navigate(safeNext, { replace: true });
    } else {
      clearTokens?.();
      navigate("/login?error=missing_token", { replace: true });
    }
  }, [navigate, query]);

  return <div className="p-6 text-center text-gray-600">로그인 처리 중...</div>;
}
