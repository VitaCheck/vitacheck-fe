// import { useCallback, useState } from "react";

// type Provider = "kakao" | "naver" | "google";

// export default function SocialLogin() {
//   const base = import.meta.env.VITE_SERVER_API_URL ?? "";
//   const [loading, setLoading] = useState<Provider | null>(null);

//   // 뒤쪽 슬래시 제거 + 경로 합치기
//   const join = (a: string, b: string) =>
//     `${a.replace(/\/+$/, "")}/${b.replace(/^\/+/, "")}`;

//   const handleSocialLogin = useCallback(
//     (provider: Provider) => {
//       if (!base) {
//         console.error("VITE_SERVER_API_URL is missing");
//         return;
//       }
//       if (loading) return; // 중복 클릭 방지

//       setLoading(provider);
//       const url = join(base, `oauth2/authorization/${provider}`); // SecurityConfig 기본 경로
//       console.log("redirect to:", url);
//       window.location.assign(url);
//     },
//     [base, loading]
//   );

//   const disabled = !base || !!loading;

//   return (
//     <div className="w-full">
//       <section className="mx-auto px-6 sm:px-8 py-10 sm:py-14 flex justify-center">
//         <div className="w-full max-w-[360px]">
//           <h2 className="text-center font-semibold text-[18px] sm:text-[20px] leading-6 mt-10 mb-10 sm:mt-12 sm:mb-12">
//             간편하게 로그인하고
//             <br />
//             비타체크와 영양제 관리해요!
//           </h2>

//           {/* 카카오 */}
//           <button
//             type="button"
//             onClick={() => handleSocialLogin("kakao")}
//             disabled={disabled}
//             className="w-full h-12 sm:h-[50px] rounded-full bg-[#FEE500] hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mb-5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
//           >
//             <img
//               src="/images/PNG/소셜로그인/kakao.png"
//               alt="카카오"
//               className="w-[18px] h-[18px]"
//             />
//             <span className="text-[13px] sm:text-[14px] font-semibold text-black">
//               {loading === "kakao" ? "이동 중..." : "카카오로 시작하기"}
//             </span>
//           </button>

//           {/* 네이버 */}
//           <button
//             type="button"
//             onClick={() => handleSocialLogin("naver")}
//             disabled={disabled}
//             className="w-full h-12 sm:h-[50px] rounded-full bg-[#03C75A] hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mb-5 text-white"
//           >
//             <img
//               src="/images/PNG/소셜로그인/naver.png"
//               alt="네이버"
//               className="w-[18px] h-[18px]"
//             />
//             <span className="text-[13px] sm:text-[14px] font-semibold">
//               {loading === "naver" ? "이동 중..." : "네이버로 시작하기"}
//             </span>
//           </button>

//           {/* 구글 */}
//           <button
//             type="button"
//             onClick={() => handleSocialLogin("google")}
//             disabled={disabled}
//             className="w-full h-12 sm:h-[50px] rounded-full bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 border border-gray-300"
//           >
//             <img
//               src="/images/PNG/소셜로그인/google.png"
//               alt="Google"
//               className="w-[18px] h-[18px]"
//             />
//             <span className="text-[13px] sm:text-[14px] font-semibold text-black">
//               {loading === "google" ? "이동 중..." : "Google로 시작하기"}
//             </span>
//           </button>

//           {/* 하단 링크 */}
//           <div className="text-center text-[12px] sm:text-[13px] text-gray-500 mt-5">
//             <a href="/login/email" className="underline underline-offset-2">
//               이메일로 로그인
//             </a>
//             <span className="mx-2 text-gray-300">|</span>
//             <a href="/signup/email" className="underline underline-offset-2">
//               이메일로 회원가입
//             </a>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

import { useCallback, useState } from "react";

type Provider = "kakao" | "naver" | "google";

export default function SocialLogin() {
  const base =
    (import.meta.env.VITE_SERVER_API_URL as string | undefined) ?? "";
  const [loading, setLoading] = useState<Provider | null>(null);

  // 경로 안전 합치기
  const join = (a: string, b: string) =>
    `${a.replace(/\/+$/, "")}/${b.replace(/^\/+/, "")}`;

  const handleSocialLogin = useCallback(
    (provider: Provider) => {
      if (!base) {
        console.error("VITE_SERVER_API_URL is missing");
        return;
      }
      if (loading) return; // 중복 클릭 방지

      setLoading(provider);
      const url = join(base, `oauth2/authorization/${provider}`); // SecurityConfig 기본 경로
      console.log("redirect to:", url);

      // 필요시 뒤로가기 방지하려면 replace 사용: window.location.replace(url)
      window.location.assign(url);
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

          {/* 카카오 */}
          <button
            type="button"
            onClick={() => handleSocialLogin("kakao")}
            disabled={disabled}
            className="w-full h-12 sm:h-[50px] rounded-full bg-[#FEE500] hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mb-5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
          >
            <img
              src="/images/PNG/소셜로그인/kakao.png"
              alt="카카오"
              className="w-[18px] h-[18px]"
            />
            <span className="text-[13px] sm:text-[14px] font-semibold text-black">
              {loading === "kakao" ? "이동 중..." : "카카오로 시작하기"}
            </span>
          </button>

          {/* 네이버 */}
          <button
            type="button"
            onClick={() => handleSocialLogin("naver")}
            disabled={disabled}
            className="w-full h-12 sm:h-[50px] rounded-full bg-[#03C75A] hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mb-5 text-white"
          >
            <img
              src="/images/PNG/소셜로그인/naver.png"
              alt="네이버"
              className="w-[18px] h-[18px]"
            />
            <span className="text-[13px] sm:text-[14px] font-semibold">
              {loading === "naver" ? "이동 중..." : "네이버로 시작하기"}
            </span>
          </button>

          {/* 구글 */}
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={disabled}
            className="w-full h-12 sm:h-[50px] rounded-full bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 border border-gray-300"
          >
            <img
              src="/images/PNG/소셜로그인/google.png"
              alt="Google"
              className="w-[18px] h-[18px]"
            />
            <span className="text-[13px] sm:text-[14px] font-semibold text-black">
              {loading === "google" ? "이동 중..." : "Google로 시작하기"}
            </span>
          </button>

          {/* 하단 링크 */}
          <div className="text-center text-[12px] sm:text-[13px] text-gray-500 mt-5">
            <a href="/login/email" className="underline underline-offset-2">
              이메일로 로그인
            </a>
            <span className="mx-2 text-gray-300">|</span>
            <a href="/signup/email" className="underline underline-offset-2">
              이메일로 회원가입
            </a>
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
