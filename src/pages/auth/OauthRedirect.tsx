// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { saveTokens } from "@/lib/auth";

// export default function OauthRedirect() {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const at = params.get("accessToken");
//     const rt = params.get("refreshToken");

//     if (at && rt) {
//       saveTokens(at, rt);
//       navigate("/", { replace: true });
//     } else {
//       // 토큰이 없으면 로그인으로 회수
//       navigate("/login?error=missing_token", { replace: true });
//     }
//   }, [navigate, params]);

//   return <div className="p-6 text-center text-gray-600">로그인 처리 중...</div>;
// }

import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveTokens, clearTokens } from "@/lib/auth";

export default function OauthRedirect() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // 쿼리를 스냅샷으로 고정 (의존성 안정)
  const query = useMemo(() => {
    const at = params.get("accessToken") ?? "";
    const rt = params.get("refreshToken") ?? "";
    const next = params.get("next") ?? ""; // 선택: 백엔드가 붙여줄 수 있음
    return { at, rt, next };
  }, [params]);

  useEffect(() => {
    const { at, rt, next } = query;

    if (at && rt) {
      saveTokens(at, rt);
      // 안전한 내부 경로만 허용 (open redirect 방지)
      const safeNext = next?.startsWith("/") ? next : "/";
      navigate(safeNext, { replace: true });
    } else {
      clearTokens?.();
      navigate("/login?error=missing_token", { replace: true });
    }
  }, [navigate, query]);

  return <div className="p-6 text-center text-gray-600">로그인 처리 중...</div>;
}
