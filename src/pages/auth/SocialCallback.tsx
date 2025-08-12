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

    const at = params.get("accessToken");
    const rt = params.get("refreshToken");
    if (at && rt && !isNew) {
      localStorage.setItem("accessToken", at);
      localStorage.setItem("refreshToken", rt);
      navigate("/", { replace: true });
      return;
    }

    navigate("/social-signup", {
      replace: true,
      state: { email, provider, providerId },
    });
  }, [navigate, params]);

  return <div className="p-6">로그인 처리 중...</div>;
}
