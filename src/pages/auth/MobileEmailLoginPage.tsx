// src/pages/auth/MobileEmailLoginPage.tsx
import { useState } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { saveTokens } from "@/lib/auth";
import { syncFcmTokenAfterLoginSilently } from "@/lib/push"; // ✅ 추가

type Props = { onLoginSuccess?: () => Promise<void> }; // 비동기 반환 가정

const MobileEmailLoginPage = ({ onLoginSuccess }: Props) => {
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

      // ✅ 우선: result 내부 토큰
      const { accessToken: at, refreshToken: rt } = response.data?.result ?? {};

      if (at) {
        console.debug("[LOGIN][M] parsed AT:", mask(at), "RT:", mask(rt));
        saveTokens(at, rt);
        await syncFcmTokenAfterLoginSilently(); // ✅ 권한이 granted면 PUT 업서트 발생
      } else {
        // ✅ 구형/임시 스펙 대비 (바디 루트 토큰)
        const fallbackAT = response.data?.accessToken;
        const fallbackRT = response.data?.refreshToken;

        if (!fallbackAT) {
          setErrorMessage("로그인에 실패했습니다. 다시 시도해주세요.");
          return;
        }

        console.warn("[LOGIN][M] using fallback token fields");
        saveTokens(fallbackAT, fallbackRT);
        await syncFcmTokenAfterLoginSilently(); // ✅ 동일 처리
      }

      // 추가 UX(알림 켜기 버튼 흐름 등)
      if (onLoginSuccess) {
        try {
          await onLoginSuccess();
        } catch (e) {
          console.warn("[web-push] onLoginSuccess failed:", e);
        }
      }

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
    <div className="relative mx-auto min-h-dvh bg-white">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-[20px] py-[20px]">
        <button onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img
            src="/images/PNG/네비게이션 바/Go back.png"
            alt="뒤로가기"
            className="w-[26.15px] object-contain"
          />
        </button>
        <h1 className="text-[24px] font-semibold">로그인</h1>
      </header>

      <main className="px-5 pb-40 pt-[20px]">
        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-[20px] font-semibold text-black">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소를 입력해주세요."
              inputMode="email"
              autoCapitalize="none"
              autoComplete="email"
              required
              className="ml-[12px] mt-[16.5px] w-full border-0 border-b border-[#D9D9D9] bg-transparent px-0 py-3 text-base text-[#6B6B6B] placeholder-[#AAAAAA] outline-none focus:border-[#202020]"
            />
          </div>

          <div>
            <label className="block text-[20px] text-black font-semibold">
              비밀번호
            </label>
            <div className="ml-[12px] mt-[16.5px] flex items-center gap-2 border-b border-[#D9D9D9]">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요."
                autoComplete="current-password"
                required
                className="w-full bg-transparent py-3 text-base text-[#6B6B6B] placeholder-[#AAAAAA] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="shrink-0 px-2 py-2 active:scale-95"
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
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="mt-6 inline-flex h-[68px] w-full items-center justify-center rounded-2xl bg-[#FFEB9D] text-[20px] font-semibold text-black active:scale-[0.99] transition"
          >
            로그인
          </button>
        </form>
      </main>
    </div>
  );
};

export default MobileEmailLoginPage;
