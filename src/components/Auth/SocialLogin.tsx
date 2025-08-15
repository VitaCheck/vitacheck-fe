export default function SocialLogin() {
  const base = import.meta.env.VITE_SERVER_API_URL;
  if (!base) console.error("VITE_SERVER_API_URL is missing");

  const handleSocialLogin = (provider: "kakao" | "naver" | "google") => {
    const url = `${base}/api/v1/auth/${provider}`;
    console.log("redirect to:", url);
    window.location.assign(url);
  };

  return (
    <div className="w-full">
      <section className="mx-auto px-6 sm:px-8 py-10 sm:py-14 flex justify-center">
        <div className="w-full max-w-[360px]">
          <h2 className="text-center font-semibold text-[18px] sm:text-[20px] leading-6 mt-10 mb-10 sm:mt-12 sm:mb-12">
            간편하게 로그인하고
            <br />
            비타체크와 영양제 관리해요!
          </h2>

          {/* 카카오 */}
          <button
            type="button"
            onClick={() => handleSocialLogin("kakao")}
            className="w-full h-12 sm:h-[50px] rounded-full bg-[#FEE500] hover:brightness-95 transition
                       flex items-center justify-center gap-2 mb-3 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] mb-5"
          >
            <img
              src="/images/PNG/소셜로그인/kakao.png"
              alt="카카오"
              className="w-[18px] h-[18px]"
            />
            <span className="text-[13px] sm:text-[14px] font-semibold text-black">
              카카오로 시작하기
            </span>
          </button>

          {/* 네이버 */}
          <button
            type="button"
            onClick={() => handleSocialLogin("naver")}
            className="w-full h-12 sm:h-[50px] rounded-full bg-[#03C75A] hover:brightness-95 transition
                       flex items-center justify-center gap-2 mb-3 text-white mb-5"
          >
            <img
              src="/images/PNG/소셜로그인/naver.png"
              alt="네이버"
              className="w-[18px] h-[18px]"
            />
            <span className="text-[13px] sm:text-[14px] font-semibold">
              네이버로 시작하기
            </span>
          </button>

          {/* 구글 */}
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="w-full h-12 sm:h-[50px] rounded-full bg-white hover:bg-gray-50 transition
                       flex items-center justify-center gap-2 border border-gray-300"
          >
            <img
              src="/images/PNG/소셜로그인/google.png"
              alt="Google"
              className="w-[18px] h-[18px]"
            />
            <span className="text-[13px] sm:text-[14px] font-semibold text-black">
              Google로 시작하기
            </span>
          </button>

          {/* 하단 링크 */}
          <div className="text-center text-[12px] sm:text-[13px] text-gray-500 mt-5">
            <a href="/login" className="underline underline-offset-2">
              이메일로 로그인
            </Link>
            <span className="mx-2 text-gray-300">|</span>
            <a href="/signup" className="underline underline-offset-2">
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
