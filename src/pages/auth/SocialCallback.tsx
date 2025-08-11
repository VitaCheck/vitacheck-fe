import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SocialCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const isNew = params.get("isNew") === "true";
    const provider = params.get("provider") ?? "";
    const providerId = params.get("providerId") ?? "";
    const email = params.get("email") ?? "";

    const at = params.get("accessToken");
    const rt = params.get("refreshToken");

    // 1) 기존 유저: 토큰이 둘 다 온 경우에만 로그인 처리
    if (!isNew && at && rt) {
      localStorage.setItem("accessToken", at);
      localStorage.setItem("refreshToken", rt);

      // 주소창에서 쿼리 제거
      navigate("/", { replace: true });
      return;
    }

    // 2) 신규 유저: 필수 값 체크 후 소셜 회원가입 폼으로
    if (isNew && provider && providerId && email) {
      navigate("/social-signup", {
        replace: true,
        state: { email, provider, providerId },
      });
      return;
    }

    // 3) 어떤 경우에도 매칭 안 되면 안전하게 로그인 페이지로
    navigate("/login", { replace: true });
  }, [navigate, params]);

  return <div className="p-6">로그인 처리 중...</div>;
}
