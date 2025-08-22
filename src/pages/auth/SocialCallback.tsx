// src/pages/auth/SocialCallback.tsx
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveTokens } from "@/lib/auth";
import * as Push from "@/lib/push"; // ★ 정적 import로 번들 포함

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

    return {
      isNew,
      provider,
      providerId,
      email,
      fullName,
      signupToken,
      at,
      rt,
      next,
    };
  }, [params]);

  useEffect(() => {
    const {
      isNew,
      provider,
      providerId,
      email,
      fullName,
      signupToken,
      at,
      rt,
      next,
    } = query;
    console.debug("[CB] SocialCallback useEffect", {
      isNew,
      hasAT: !!at,
      hasRT: !!rt,
    });

    // URL 정리(토큰 흔적 제거)
    let cleaned = false;
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
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

    // 1) 기존 유저: AT/RT 있으면 로그인 완료 + FCM 업서트 + 리다이렉트
    if (!isNew && at && rt) {
      saveTokens(at, rt);
      console.debug("[CB] saved tokens, calling Push.syncFcmTokenForce...");
      Push.syncFcmTokenForce()
        .then((ok) => console.debug("[CB] force result =", ok))
        .finally(() => {
          const safeNext = next?.startsWith("/") ? next : "/";
          navigate(safeNext, { replace: true });
        });
      return;
    }

    // 2) 신규 유저: 임시 토큰으로 가입 폼 이동
    if ((isNew || !at) && signupToken) {
      navigate("/social-signup", {
        replace: true,
        state: {
          socialTempToken: signupToken,
          provider,
          providerId,
          email,
          fullName,
          next,
        },
      });
      return;
    }

    // 3) 백업: isNew + 기본 식별자만 있을 때
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
