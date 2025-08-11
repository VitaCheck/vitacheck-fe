import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveTokens } from "@/lib/auth";

export default function OauthRedirect() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const at = params.get("accessToken");
    const rt = params.get("refreshToken");

    if (at && rt) {
      saveTokens(at, rt);
      navigate("/", { replace: true });
    } else {
      // 토큰이 없으면 로그인으로 회수
      navigate("/login?error=missing_token", { replace: true });
    }
  }, [navigate, params]);

  return <div className="p-6 text-center text-gray-600">로그인 처리 중...</div>;
}
