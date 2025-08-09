import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SocialCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
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

  return <div className="p-6">로그인 처리 중...</div>;
}
