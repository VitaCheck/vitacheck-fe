import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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

    // 임시 토큰은 쿼리 우선, 없으면 fragment에서 조회
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
    const next = params.get("next") ?? "";
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
<<<<<<< HEAD
    const isNew = params.get("isNew") === "true";
    const provider = params.get("provider") || "";
    const providerId = params.get("providerId") || "";
    const email = params.get("email") || "";

    // 서버가 쿼리로 토큰을 바로 주는 경우(기존 유저)
    const at = params.get("accessToken");
    const rt = params.get("refreshToken");
    if (at && rt && !isNew) {
      localStorage.setItem("accessToken", at);
      localStorage.setItem("refreshToken", rt);
      navigate("/", { replace: true });
      return;
    }

    // 신규 유저면 소셜 회원가입 폼으로 이동
    navigate("/social-signup", {
      replace: true,
      state: { email, provider, providerId },
    });
  }, [navigate, params]);
=======
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

    // URL에서 토큰 흔적 제거
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
        u.pathname + (u.search ? "?" + u.searchParams.toString() : "")
      );
    }

    // 기존 유저: access/refresh 둘 다 있으면 바로 로그인
    if (!isNew && at && rt) {
      saveTokens(at, rt);
      const safeNext = next?.startsWith("/") ? next : "/";
      navigate(safeNext, { replace: true });
      return;
    }

    // 신규 유저: isNew가 없어도 임시 토큰이 있으면 신규 플로우로 보냄
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

    // 값 전달 방식(임시 토큰 없이 기본값만 온 경우)
    if (isNew && provider && providerId && email) {
      navigate("/social-signup", {
        replace: true,
        state: { provider, providerId, email, fullName, next },
      });
      return;
    }

    // 실패 시 로그인으로 회수
    clearTokens?.();
    navigate("/login?error=callback_mismatch", { replace: true });
  }, [navigate, query, params]);
>>>>>>> ecbdb229be4411bbd946253f5c7ed762752f57f9

  return <div className="p-6 text-center text-gray-600">로그인 처리 중...</div>;
}
