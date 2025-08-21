import { useState } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { saveTokens } from "@/lib/auth";
import { syncFcmTokenAfterLoginSilently } from "@/lib/push"; // ✅ 추가

type Props = { onLoginSuccess?: () => Promise<void> | void };

const DesktopEmailLoginPage = ({ onLoginSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const mask = (t?: string) =>
    t ? `${t.slice(0, 4)}...${t.slice(-6)}` : "none";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErrorMessage("");

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/v1/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("로그인 응답 데이터:", response.data);

      // ✅ 백엔드 스펙: result 안에 accessToken/refreshToken이 있는 형태 우선 사용
      const { accessToken: at, refreshToken: rt } = response.data?.result ?? {};

      console.debug("[LOGIN] parsed AT:", mask(at), "RT:", mask(rt));

      if (!at && !rt) {
        // 구형/임시 스펙(바디 루트에 토큰 존재) 대응
        const fallbackAT = response.data?.accessToken;
        const fallbackRT = response.data?.refreshToken;
        if (fallbackAT) {
          console.warn("[LOGIN] using fallback token fields");
          saveTokens(fallbackAT, fallbackRT);
          await syncFcmTokenAfterLoginSilently();
        } else {
          setErrorMessage("로그인에 실패했습니다. 다시 시도해주세요.");
          return;
        }
      } else {
        // 정상 스펙
        saveTokens(at!, rt);
      }

      console.debug("[LOGIN] saved tokens");

      // ✅ 푸시 연동: 권한 요청 + FCM 토큰 발급 + 서버 등록
      if (onLoginSuccess) {
        try {
          await onLoginSuccess();
          console.debug("[web-push] onLoginSuccess completed");
        } catch (e) {
          // 실패해도 로그인 흐름은 진행
          console.warn("[web-push] onLoginSuccess failed:", e);
        }
      }

      // ✅ 마지막에 라우팅
      navigate("/mypage", { replace: true });
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          "이메일 또는 비밀번호가 잘못되었습니다."
      );
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <main className="min-h-[calc(100vh-100px-100px)] flex flex-1 justify-center items-center bg-[#FAFAFA]">
        <form onSubmit={handleLogin} className="w-full max-w-md px-6 py-10">
          <h1 className="text-center text-[34px] font-medium mb-10">로그인</h1>

          <div className="mb-6">
            <label className="block mb-2 text-[22px] font-semibold">
              이메일
            </label>
            <input
              type="email"
              placeholder="이메일 주소를 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 text-[18px] text-[#6B6B6B] placeholder-[#AAAAAA] focus:outline-none"
              required
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-[22px] font-semibold">
              비밀번호
            </label>
            <div className="w-full flex items-center border-b border-gray-300">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-4 py-3 text-[18px] text-[#6B6B6B] placeholder-[#AAAAAA] bg-transparent focus:outline-none"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="px-2"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                <img
                  src={
                    showPassword
                      ? "/images/ion_eye-1.png"
                      : "/images/ion_eye.png"
                  }
                  alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  className="w-[18px]"
                />
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full h-[83px] bg-[#FFE88D] text-black text-[22px] font-bold py-3 rounded-lg transition-colors"
          >
            로그인
          </button>
        </form>
      </main>
    </div>
  );
};

export default DesktopEmailLoginPage;
