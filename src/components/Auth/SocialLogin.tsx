import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Provider = "naver" | "google";

const PROVIDERS: {
  key: Provider;
  label: string;
  bg: string;
  icon: string;
  text?: string;
}[] = [
  {
    key: "naver",
    label: "네이버로 시작하기",
    bg: "bg-[#03C75A] text-white",
    icon: "/images/PNG/소셜로그인/naver.png",
  },
  {
    key: "google",
    label: "Google로 시작하기",
    bg: "bg-white border border-gray-300",
    icon: "/images/PNG/소셜로그인/google.png",
    text: "text-black",
  },
];

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

        // 필요하면 다음 경로 전달
        // url.searchParams.set("next", window.location.origin + "/");

        // 뒤로가기 방지
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
      <section className="mx-auto px-6 sm:px-8 py-10 sm:py-14 flex justify-center">
        <div className="w-full max-w-[360px]">
          <h2 className="text-center font-semibold text-[18px] sm:text-[20px] leading-6 mt-10 mb-10 sm:mt-12 sm:mb-12">
            간편하게 로그인하고
            <br />
            비타체크와 영양제 관리해요!
          </h2>

          {PROVIDERS.map(({ key, label, bg, icon, text }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSocialLogin(key)}
              disabled={disabled}
              aria-busy={loading === key}
              aria-disabled={disabled}
              className={`w-full h-12 sm:h-[50px] rounded-full ${bg} hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mb-5 ${text ?? ""}`}
            >
              <img src={icon} alt={key} className="w-[18px] h-[18px]" />
              <span className="text-[13px] sm:text-[14px] font-semibold">
                {loading === key ? "이동 중..." : label}
              </span>
            </button>
          ))}

          <div className="text-center text-[12px] sm:text-[13px] text-gray-500 mt-5">
            <Link to="/login/email" className="underline underline-offset-2">
              이메일로 로그인
            </Link>
            <span className="mx-2 text-gray-300">|</span>
            <Link to="/signup/email" className="underline underline-offset-2">
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
