import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function parseHashParams(hash: string) {
  const h = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(h);
}

export default function SocialCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // 쿼리/해시 파싱은 한 번만
  const query = useMemo(() => {
    const isNew = (params.get("isNew") ?? "").toLowerCase() === "true";
    const provider = params.get("provider") ?? "";
    const providerId = params.get("providerId") ?? "";
    const email = params.get("email") ?? "";
    const fullName = params.get("fullName") ?? "";

    // 임시/가입 토큰: 쿼리 우선, 없으면 해시(fragment)에서
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
    // 1) 기존 유저: access/refresh 토큰이 둘 다 오면 로그인 처리
    if (!query.isNew && query.at && query.rt) {
      localStorage.setItem("accessToken", query.at);
      localStorage.setItem("refreshToken", query.rt);
      navigate(query.next || "/", { replace: true });
      return;
    }

    // 2) 신규 유저 또는 임시/가입 토큰 보유: 회원가입 폼으로 이동
    if (
      query.isNew ||
      (!!query.signupToken &&
        (query.provider || query.email || query.providerId))
    ) {
      navigate("/social-signup", {
        replace: true,
        state: {
          email: query.email,
          provider: query.provider,
          providerId: query.providerId,
          ...(query.fullName ? { fullName: query.fullName } : {}),
          ...(query.signupToken ? { signupToken: query.signupToken } : {}),
        },
      });
      return;
    }

    // 3) 어떤 조건도 만족하지 않으면 로그인 페이지로
    navigate("/login", { replace: true });
  }, [navigate, query]);

  return <div className="p-6 text-center text-gray-600">로그인 처리 중...</div>;
}
