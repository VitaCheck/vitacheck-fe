// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// export default function SocialCallback() {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const isNew = params.get("isNew") === "true";
//     const provider = params.get("provider") ?? "";
//     const providerId = params.get("providerId") ?? "";
//     const email = params.get("email") ?? "";

//     const at = params.get("accessToken");
//     const rt = params.get("refreshToken");

//     // 1) 기존 유저: 토큰이 둘 다 온 경우에만 로그인 처리
//     if (!isNew && at && rt) {
//       localStorage.setItem("accessToken", at);
//       localStorage.setItem("refreshToken", rt);

//       // 주소창에서 쿼리 제거
//       navigate("/", { replace: true });
//       return;
//     }

//     // 2) 신규 유저: 필수 값 체크 후 소셜 회원가입 폼으로
//     if (isNew && provider && providerId && email) {
//       navigate("/social-signup", {
//         replace: true,
//         state: { email, provider, providerId },
//       });
//       return;
//     }

//     // 3) 어떤 경우에도 매칭 안 되면 안전하게 로그인 페이지로
//     navigate("/login", { replace: true });
//   }, [navigate, params]);

//   return <div className="p-6">로그인 처리 중...</div>;
// }

import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveTokens, clearTokens } from "@/lib/auth";

export default function SocialCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = useMemo(() => {
    const isNew = (params.get("isNew") ?? "").toLowerCase() === "true";
    const provider = params.get("provider") ?? "";
    const providerId = params.get("providerId") ?? "";
    const email = params.get("email") ?? "";
    const fullName = params.get("fullName") ?? ""; // 있으면 폼에 넘기자
    const socialTempToken = params.get("socialTempToken") ?? ""; // 임시 토큰 플로우 대비

    const at = params.get("accessToken") ?? "";
    const rt = params.get("refreshToken") ?? "";
    const next = params.get("next") ?? ""; // 로그인 후 이동
    return {
      isNew,
      provider,
      providerId,
      email,
      fullName,
      socialTempToken,
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
      socialTempToken,
      at,
      rt,
      next,
    } = query;

    // 1) 기존 유저: 토큰이 둘 다 있어야 바로 로그인
    if (!isNew && at && rt) {
      saveTokens(at, rt);
      const safeNext = next?.startsWith("/") ? next : "/";
      navigate(safeNext, { replace: true });
      return;
    }

    // 2) 신규 유저: 추가 정보 입력으로 라우팅
    // 2-1) 임시 토큰 방식
    if (isNew && socialTempToken) {
      navigate("/social-signup", {
        replace: true,
        state: { socialTempToken, next },
      });
      return;
    }

    // 2-2) 값 직접 전달 방식
    if (isNew && provider && providerId && email) {
      navigate("/social-signup", {
        replace: true,
        state: { provider, providerId, email, fullName, next },
      });
      return;
    }

    // 3) 매칭 실패 → 로그인 화면
    clearTokens?.();
    navigate("/login?error=callback_mismatch", { replace: true });
  }, [navigate, query]);

  return <div className="p-6 text-center text-gray-600">로그인 처리 중...</div>;
