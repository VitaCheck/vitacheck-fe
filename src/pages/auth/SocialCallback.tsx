// src/pages/auth/SocialCallback.tsx
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveTokens } from "@/lib/auth";
import { syncFcmTokenForce /* or: syncFcmTokenAfterLoginSilently */ } from "@/lib/push";

function parseHashParams(hash: string) {
  const h = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(h);
}

export default function SocialCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = useMemo(() => {
    const isNew = (params.get("isNew") ?? "").toLowerCase() === "true";
    const provider = params.get("provider") ?? "";
    const providerId = params.get("providerId") ?? "";
    const email = params.get("email") ?? "";
    const fullName = params.get("fullName") ?? "";

    // 임시 토큰: 쿼리 > 해시(fragment) 우선순위
    const hashParams = parseHashParams(window.location.hash);
    const signupToken =
      params.get("signupToken") ??
      params.get("socialTempToken") ??
      params.get("tempToken") ??
      hashParams.get("signupToken") ??
      hashParams.get("socialTempToken") ??
      hashParams.get("tempToken") ??
      "";

    const at = params.get("accessToken") ?? "";
    const rt = params.get("refreshToken") ?? "";
    const next = params.get("next") ?? "/";

    return { isNew, provider, providerId, email, fullName, signupToken, at, rt, next };
  }, [params]);

  useEffect(() => {
    const { isNew, provider, providerId, email, fullName, signupToken, at, rt, next } = query;

    // URL에서 토큰 흔적 제거 (hash / query)
    let cleaned = false;
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      cleaned = true;
    }
    if (
      !cleaned &&
      (params.get("signupToken") ||
        params.get("socialTempToken") ||
        params.get("tempToken"))
    ) {
      const u = new URL(window.location.href);
      u.searchParams.delete("signupToken");
      u.searchParams.delete("socialTempToken");
      u.searchParams.delete("tempToken");
      history.replaceState(
        null,
        "",
        u.pathname + (u.search ? `?${u.searchParams.toString()}` : "")
      );
    }

    // 1) 기존 유저: access/refresh 둘 다 있으면 바로 로그인 처리
    if (!isNew && at && rt) {
      saveTokens(at, rt);

      // 디버깅/초기안정화: 강제 동기화 (권한 팝업 가능)
      // 운영 안정화 후에는 syncFcmTokenAfterLoginSilently()로 교체 권장
      (async () => {
        try {
          await syncFcmTokenForce();
          // await syncFcmTokenAfterLoginSilently();
        } catch {
          // FCM 실패는 로그인 흐름을 막지 않음
        } finally {
          const safeNext = next?.startsWith("/") ? next : "/";
          navigate(safeNext, { replace: true });
        }
      })();

      return;
    }

    // 2) 신규 유저: 임시 토큰으로 가입 폼 이동
    if ((isNew || !at) && signupToken) {
      navigate("/social-signup", {
        replace: true,
        state: { socialTempToken: signupToken, provider, providerId, email, fullName, next },
      });
      return;
    }

    // 3) 백업 경로: isNew + 핵심 식별자만 존재
    if (isNew && provider && providerId && email) {
      navigate("/social-signup", {
        replace: true,
        state: { provider, providerId, email, fullName, next },
      });
      return;
    }

    // 실패 시 로그인으로 회수
    navigate("/login?error=callback_mismatch", { replace: true });
  }, [navigate, query, params]);

  return <div className="p-6 text-center text-gray-600">로그인 처리 중...</div>;
}
