import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Provider = "naver";

export default function SocialLogin() {
  const rawBase = import.meta.env.VITE_SERVER_API_URL as string | undefined;
  const base = useMemo(() => (rawBase ?? "").trim(), [rawBase]);
  const [loading, setLoading] = useState<Provider | null>(null);

  const handleSocialLogin = useCallback(
    (provider: Provider) => {
      if (!base) {
        console.error("VITE_SERVER_API_URL is missing");
        alert("서버 주소가 설정되지 않았습니다. .env를 확인해주세요.");
        return;
      }
      if (loading) return; // 중복 클릭 방지

      setLoading(provider);

      try {
        const url = new URL(base);
        const pathname = `/oauth2/authorization/${provider}`.replace(
          /\/{2,}/g,
          "/"
        );
        url.pathname = `${url.pathname.replace(/\/+$/, "")}${pathname}`;

        window.location.replace(url.toString());
      } catch (e) {
        console.error(e);
        alert("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setLoading(null);
      }
    },
    [base, loading]
  );

  const disabled = !base || !!loading;

  return (
    <div className="w-full">
      <section className="mx-auto px-6 sm:px-8 flex justify-center items-center w-full min-h-[calc(100vh-372px)]">
        <div className="w-full max-w-[360px]">
          <h2 className="text-center font-semibold text-[18px] sm:text-[20px] leading-6 mt-10 mb-10 sm:mt-12 sm:mb-12">
            간편하게 로그인하고
            <br />
            비타체크와 영양제 관리해요!
          </h2>

          {/* 네이버 로그인 */}
          <button
            type="button"
            onClick={() => handleSocialLogin("naver")}
            disabled={disabled}
            aria-busy={loading === "naver"}
            aria-disabled={disabled}
            className="w-full h-[52px] sm:h-[60px] rounded-full bg-[#03C75A] text-white hover:brightness-95 disabled:opacity-60 transition flex items-center justify-center gap-2 mb-5"
          >
            <img
              src="/images/PNG/소셜로그인/naver.png"
              alt="naver"
              className="w-[18px] h-[18px]"
            />
            <span className="text-[14px] sm:text-[15px] font-semibold">
              {loading === "naver" ? "이동 중..." : "네이버로 시작하기"}
            </span>
          </button>

          {/* 이메일 로그인 버튼 */}
          <Link
            to="/login/email"
            className="block w-full h-[52px] sm:h-[60px] rounded-full bg-[#FFE88D] text-black text-[14px] sm:text-[15px] font-semibold flex items-center justify-center mb-6 hover:brightness-95 transition"
          >
            이메일로 로그인하기
          </Link>

          {/* 이메일 회원가입 링크 */}
          <div className="text-center">
            <Link
              to="/signup/email"
              className="underline underline-offset-2 text-[13px] text-gray-700 hover:opacity-80"
            >
              이메일로 회원가입
            </Link>
          </div>

          {!base && (
            <p className="mt-4 text-center text-xs text-red-500">
              환경변수 <code>VITE_SERVER_API_URL</code>이 설정되지 않았습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
