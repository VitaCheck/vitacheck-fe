import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveTokens, clearTokens } from "@/lib/auth";
import axios from "@/lib/axios";
import { syncFcmTokenForce } from "@/lib/push";

export default function OauthRedirect() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = useMemo(() => {
    const at = params.get("accessToken") ?? "";
    const rt = params.get("refreshToken") ?? "";
    const next = params.get("next") ?? "/";
    // 👇 백엔드에서 추가한 파라미터를 읽는 로직 추가
    const fcmUpdateRequired = params.get("fcmUpdateRequired") === "true";
    return { at, rt, next, fcmUpdateRequired };
  }, [params]);

  useEffect(() => {
    (async () => {
      // 👇 구조 분해 할당에 fcmUpdateRequired 추가
      const { at, rt, next, fcmUpdateRequired } = query;
      console.debug("[OAuthRedirect] start", {
        hasAT: !!at,
        hasRT: !!rt,
        next,
        fcmUpdateRequired, // 로그 추가
      });

      // URL 민감 파라미터 제거 (기존과 동일)
      try {
        const u = new URL(window.location.href);
        ["accessToken", "refreshToken", "fcmUpdateRequired"].forEach(
          (
            k // 파라미터 정리 목록에 추가
          ) => u.searchParams.delete(k)
        );
        history.replaceState(
          null,
          "",
          u.pathname + (u.search ? `?${u.searchParams.toString()}` : "")
        );
      } catch {}

      if (!at || !rt) {
        console.warn("[OAuthRedirect] missing token -> /login");
        clearTokens?.();
        navigate("/login?error=missing_token", { replace: true });
        return;
      }

      // 1) 토큰 저장 + Authorization 헤더 즉시 반영 (기존과 동일)
      saveTokens(at, rt);
      axios.defaults.headers.common["Authorization"] = `Bearer ${at}`;
      console.debug(
        "[OAuthRedirect] tokens saved. Checking if FCM sync is required..."
      );

      try {
        // 👇 2) 백엔드가 요청했을 때만 FCM 토큰을 강제로 동기화하도록 수정
        if (fcmUpdateRequired) {
          console.debug(
            "[OAuthRedirect] fcmUpdateRequired is true. Syncing FCM..."
          );
          const ok = await syncFcmTokenForce();
          console.debug("[OAuthRedirect] FCM force result =", ok);
        } else {
          console.debug(
            "[OAuthRedirect] fcmUpdateRequired is false. Skipping FCM sync."
          );
        }
      } catch (e) {
        console.warn("[OAuthRedirect] FCM force error", e);
      } finally {
        // 3) 안전한 경로로 이동 (기존과 동일)
        const safeNext = next.startsWith("/") ? next : "/";
        console.debug("[OAuthRedirect] navigate ->", safeNext);
        navigate(safeNext, { replace: true });
      }
    })();
  }, [navigate, query]);

  return <div className="p-6 text-center text-gray-600">로그인 처리 중...</div>;
}
