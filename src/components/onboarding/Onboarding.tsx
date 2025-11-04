// import React, { useState,  } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules";
// import type { Swiper as SwiperCore } from "swiper";
// import { handleSocialLogin } from "../../utils/socialLogin";

// // Swiper CSS 파일 임포트
// import "swiper/css";
// import "swiper/css/pagination";

// // Swiper 인스턴스를 저장하기 위한 state
// interface OnboardingProps {
//   onFinishOnboarding: () => void;
// }

// const Onboarding: React.FC<OnboardingProps> = ({ onFinishOnboarding }) => {
//   const [swiper, setSwiper] = useState<SwiperCore | null>(null);
//   // 현재 활성화된 슬라이드 인덱스를 저장
//   const [activeIndex, setActiveIndex] = useState(0);

//   // '다음' 버튼 클릭 핸들러
//   const handleNext = () => {
//     swiper?.slideNext();
//   };

//   // '이전' 버튼 클릭 핸들러
//   const handlePrev = () => {
//     swiper?.slidePrev();
//   };

//   // 체크 아이콘 SVG (3페이지용)
//   const CheckIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={3}
//       stroke="white"
//       className="w-4 h-4"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="m4.5 12.75 6 6 9-13.5"
//       />
//     </svg>
//   );

//   const totalSlides = 5;

//   return (
//     // 전체 화면 컨테이너 (vh-100 대신 h-screen 사용)
//     <div className="relative w-full h-screen bg-white">
//       <Swiper
//         modules={[Pagination]}
//         // pagination={true} // 기본 pagination 대신 커스텀 pagination 사용
//         onSwiper={setSwiper}
//         onSlideChange={(s) => setActiveIndex(s.activeIndex)}
//         className="w-full h-full"
//       >
//         {/* === 슬라이드 1 === */}
//         <SwiperSlide className="flex flex-col h-full px-6 pt-24 pb-40">
//           <div className="flex-grow flex flex-col justify-end items-center text-center">
//             <h2 className="text-[24px] font-bold leading-relaxed">
//               영양제 분석부터 섭취까지
//               <br />
//               비타체크와 함께
//             </h2>
//           </div>
//           <div className="flex-grow-[1.5] flex justify-center items-center pt-18">
//             <img
//               src="/images/onboarding1.png"
//               alt="마법사 고양이"
//               className="w-70"
//             />
//           </div>
//         </SwiperSlide>

//         {/* === 슬라이드 2 === */}
//         <SwiperSlide className="flex flex-col h-full px-6 pt-24 pb-40">
//           <div className="flex-grow flex flex-col justify-end items-center text-center">
//             <h2 className="text-2xl font-semibold leading-relaxed">
//               건강고민을 선택하고
//               <br />
//               영양제 추천 받아보세요!
//             </h2>
//           </div>
//           <div className="flex-grow-[1.5] relative flex justify-center items-start pt-10 w-full">
//             <img
//               src="/images/onboarding2.png"
//               alt="목적 고양이"
//               className="w-70"
//             />
//           </div>
//         </SwiperSlide>

//         {/* === 슬라이드 3 === */}
//         <SwiperSlide className="flex flex-col h-full px-6 pt-24 pb-40">
//           <div className="flex-grow flex flex-col justify-end items-center text-center">
//             <h2 className="text-2xl font-semibold leading-relaxed">
//               영양제 조합 분석으로
//               <br />
//               중복 섭취를 피하세요!
//             </h2>
//           </div>
//           <div className="flex-grow-[1.5] relative flex justify-center items-start pt-10 w-full">
//             <img
//               src="/images/onboarding3.png"
//               alt="조합 고양이"
//               className="w-70"
//             />
//           </div>
//         </SwiperSlide>

//         {/* === 슬라이드 4 === */}
//         <SwiperSlide className="flex flex-col h-full px-6 pt-24 pb-40">
//           <div className="flex-grow flex flex-col justify-end items-center text-center">
//             <h2 className="text-2xl font-semibold leading-relaxed">
//               매일 먹는 영양제
//               <br />
//               알림으로 챙겨보세요!
//             </h2>
//           </div>
//           <div className="flex-grow-[1.5] relative flex justify-center items-start pt-[115px] w-full">
//             <img
//               src="/images/onboarding4.png"
//               alt="알림 온보딩"
//               className="w-70"
//             />
//           </div>
//         </SwiperSlide>

//         {/* === 슬라이드 5 (로그인) === */}
//         <SwiperSlide className="flex flex-col h-full px-6 pt-16 pb-10">
//           {/* 뒤로가기 버튼 (필요하다면) */}
//           <button onClick={handlePrev} className="absolute top-10 left-4 p-2">
//             <svg
//               width="15"
//               height="27"
//               viewBox="0 0 15 27"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M13.0774 -5.54812e-05L15 1.92253L3.84516 13.0774L15 24.2322L13.0774 26.1548L-1.71776e-06 13.0774L13.0774 -5.54812e-05Z"
//                 fill="#1C1B1F"
//               />
//             </svg>
//           </button>

//           <div className="flex-grow flex flex-col justify-center items-center space-y-4 pb-40 pt-30">
//             <img
//               src="/images/onboarding-logo.png"
//               alt="VitaCheck 로고"
//               className="w-50"
//             />
//           </div>
//           <div className="space-y-3">
//             <button className="w-full h-14 bg-[#03CF5D] text-white rounded-xl flex items-center justify-center font-semibold text-lg">
//               <span className="mr-2">
//                 <img src="/images/PNG/소셜로그인/naver.png"></img>
//               </span>
//               네이버로 시작하기
//             </button>
//             <button className="w-full h-14 bg-white border border-[#9C9A9A] text-black rounded-xl flex items-center justify-center font-semibold text-lg">
//               <span className="mr-2">
//                 <img src="/images/PNG/소셜로그인/google.png"></img>
//               </span>
//               Google로 시작하기
//             </button>
//             <button className="w-full h-14 bg-[linear-gradient(254.31deg,_#FCFFEA_-34.59%,_#FFEA8C_71.94%,_#FFE88D_98.09%)] text-black rounded-xl flex items-center justify-center font-semibold text-lg">
//               <span className="mr-2 w-[16px]">
//                 <img src="/images/onboarding-email.png"></img>
//               </span>
//               이메일로 시작하기
//             </button>
//             <button
//               onClick={onFinishOnboarding}
//               className="w-full h-14 text-[#202020] underline text-sm mt-4"
//             >
//               로그인 없이 이용하기
//             </button>
//           </div>
//         </SwiperSlide>
//       </Swiper>

//       {/* === 커스텀 Pagination Dots === */}
//       {/* (로그인 페이지가 아닐 때만 Dot을 보여줌) */}
//       {activeIndex < totalSlides - 1 && (
//         <div className="absolute z-10 bottom-32 left-0 w-full flex justify-center items-center space-x-2">
//           {Array.from({ length: totalSlides - 1 }).map((_, index) => (
//             <span
//               key={index}
//               className={`block h-2 rounded-full transition-all duration-300 ${
//                 activeIndex === index ? "w-5 bg-[#FFDB67]" : "w-2 bg-gray-300"
//               }`}
//             ></span>
//           ))}
//         </div>
//       )}

//       {/* === 하단 네비게이션 버튼 === */}
//       {/* (로그인 페이지가 아닐 때만 버튼을 보여줌) */}
//       {activeIndex < totalSlides - 1 && (
//         <div
//           className="absolute bottom-0 left-0 w-full bg-white p-6 pt-5 z-10"
//           // iOS 하단 바(safe area)를 고려한 패딩
//           style={{
//             paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
//           }}
//         >
//           {/* 첫 번째 페이지 */}
//           {activeIndex === 0 && (
//             <button
//               onClick={handleNext}
//               className="w-full h-14 bg-[linear-gradient(254.31deg,_#FCFFEA_-34.59%,_#FFEA8C_71.94%,_#FFE88D_98.09%)] rounded-xl font-semibold text-[16px] text-black"
//             >
//               다음
//             </button>
//           )}
//           {/* 두 번째 페이지 */}
//           {activeIndex === 1 && (
//             <div className="flex space-x-2">
//               <button
//                 onClick={handlePrev}
//                 className="w-1/3 h-14 bg-gray-100 text-gray-500 rounded-xl font-semibold text-lg"
//               >
//                 이전
//               </button>
//               <button
//                 onClick={handleNext}
//                 className="w-2/3 h-14 bg-[linear-gradient(254.31deg,_#FCFFEA_-34.59%,_#FFEA8C_71.94%,_#FFE88D_98.09%)] rounded-xl font-semibold text-lg text-gray-800"
//               >
//                 다음
//               </button>
//             </div>
//           )}
//           {/* 세 번째 페이지 */}
//           {activeIndex === 2 && (
//             <div className="flex space-x-2">
//               <button
//                 onClick={handlePrev}
//                 className="w-1/3 h-14 bg-gray-100 text-gray-500 rounded-xl font-semibold text-lg"
//               >
//                 이전
//               </button>
//               <button
//                 onClick={handleNext}
//                 className="w-2/3 h-14 bg-[linear-gradient(254.31deg,_#FCFFEA_-34.59%,_#FFEA8C_71.94%,_#FFE88D_98.09%)] rounded-xl font-semibold text-lg text-gray-800"
//               >
//                 다음
//               </button>
//             </div>
//           )}
//           {/* 네 번째 페이지 (로그인)*/}
//           {activeIndex === 3 && (
//             <div className="flex space-x-2">
//               <button
//                 onClick={handlePrev}
//                 className="w-1/3 h-14 bg-gray-100 text-gray-500 rounded-xl font-semibold text-lg"
//               >
//                 이전
//               </button>
//               <button
//                 onClick={handleNext} // 마지막 로그인 슬라이드로 이동
//                 className="w-2/3 h-14 bg-[linear-gradient(254.31deg,_#FCFFEA_-34.59%,_#FFEA8C_71.94%,_#FFE88D_98.09%)] rounded-xl font-semibold text-lg text-gray-800"
//               >
//                 시작하기
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Onboarding;

import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperCore } from "swiper";
import { handleSocialLogin } from "../../utils/socialLogin";

// Swiper CSS 파일 임포트
import "swiper/css";
import "swiper/css/pagination";

interface OnboardingProps {
  onFinishOnboarding: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onFinishOnboarding }) => {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 환경변수에서 서버 URL 가져오기
  const rawBase = import.meta.env.VITE_SERVER_API_URL as string | undefined;
  const base = useMemo(() => (rawBase ?? "").trim(), [rawBase]);

  // '다음' 버튼 클릭 핸들러
  const handleNext = () => {
    swiper?.slideNext();
  };

  // '이전' 버튼 클릭 핸들러
  const handlePrev = () => {
    swiper?.slidePrev();
  };

  // 소셜 로그인 핸들러
  const onNaverLogin = () => {
    handleSocialLogin("naver", base);
  };

  const onGoogleLogin = () => {
    handleSocialLogin("google", base);
  };

  // 이메일 로그인 - window.location 사용 (Router 외부이므로)
  const onEmailLogin = () => {
    window.location.href = "/login/email";
  };

  const totalSlides = 5;

  return (
    <div className="relative w-full h-screen bg-white">
      <Swiper
        modules={[Pagination]}
        onSwiper={setSwiper}
        onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        className="w-full h-full"
      >
        {/* === 슬라이드 1 === */}
        <SwiperSlide className="flex flex-col h-full px-6 pt-24 pb-40">
          <div className="flex-grow flex flex-col justify-end items-center text-center">
            <h2 className="text-[24px] font-bold leading-relaxed">
              영양제 분석부터 섭취까지
              <br />
              비타체크와 함께
            </h2>
          </div>
          <div className="flex-grow-[1.5] flex justify-center items-center pt-18">
            <img
              src="/images/onboarding1.png"
              alt="마법사 고양이"
              className="w-70"
            />
          </div>
        </SwiperSlide>

        {/* === 슬라이드 2 === */}
        <SwiperSlide className="flex flex-col h-full px-6 pt-24 pb-40">
          <div className="flex-grow flex flex-col justify-end items-center text-center">
            <h2 className="text-2xl font-semibold leading-relaxed">
              건강고민을 선택하고
              <br />
              영양제 추천 받아보세요!
            </h2>
          </div>
          <div className="flex-grow-[1.5] relative flex justify-center items-start pt-10 w-full">
            <img
              src="/images/onboarding2.png"
              alt="목적 고양이"
              className="w-70"
            />
          </div>
        </SwiperSlide>

        {/* === 슬라이드 3 === */}
        <SwiperSlide className="flex flex-col h-full px-6 pt-24 pb-40">
          <div className="flex-grow flex flex-col justify-end items-center text-center">
            <h2 className="text-2xl font-semibold leading-relaxed">
              영양제 조합 분석으로
              <br />
              중복 섭취를 피하세요!
            </h2>
          </div>
          <div className="flex-grow-[1.5] relative flex justify-center items-start pt-10 w-full">
            <img
              src="/images/onboarding3.png"
              alt="조합 고양이"
              className="w-70"
            />
          </div>
        </SwiperSlide>

        {/* === 슬라이드 4 === */}
        <SwiperSlide className="flex flex-col h-full px-6 pt-24 pb-40">
          <div className="flex-grow flex flex-col justify-end items-center text-center">
            <h2 className="text-2xl font-semibold leading-relaxed">
              매일 먹는 영양제
              <br />
              알림으로 챙겨보세요!
            </h2>
          </div>
          <div className="flex-grow-[1.5] relative flex justify-center items-start pt-[115px] w-full">
            <img
              src="/images/onboarding4.png"
              alt="알림 온보딩"
              className="w-70"
            />
          </div>
        </SwiperSlide>

        {/* === 슬라이드 5 (로그인) === */}
        <SwiperSlide className="flex flex-col h-full px-6 pt-16 pb-10">
          {/* 뒤로가기 버튼 */}
          <button onClick={handlePrev} className="absolute top-10 left-4 p-2">
            <svg
              width="15"
              height="27"
              viewBox="0 0 15 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.0774 -5.54812e-05L15 1.92253L3.84516 13.0774L15 24.2322L13.0774 26.1548L-1.71776e-06 13.0774L13.0774 -5.54812e-05Z"
                fill="#1C1B1F"
              />
            </svg>
          </button>

          <div className="flex-grow flex flex-col justify-center items-center space-y-4 pb-40 pt-30">
            <img
              src="/images/onboarding-logo.png"
              alt="VitaCheck 로고"
              className="w-50"
            />
          </div>
          <div className="space-y-3">
            {/* 네이버 로그인 버튼 */}
            <button
              onClick={onNaverLogin}
              className="w-full h-14 bg-[#03CF5D] text-white rounded-xl flex items-center justify-center font-semibold text-lg"
            >
              <span className="mr-2">
                <img src="/images/PNG/소셜로그인/naver.png" alt="naver" />
              </span>
              네이버로 시작하기
            </button>

            {/* 구글 로그인 버튼 */}
            <button
              onClick={onGoogleLogin}
              className="w-full h-14 bg-white border border-[#9C9A9A] text-black rounded-xl flex items-center justify-center font-semibold text-lg"
            >
              <span className="mr-2">
                <img src="/images/PNG/소셜로그인/google.png" alt="google" />
              </span>
              Google로 시작하기
            </button>

            {/* 이메일 로그인 버튼 */}
            <button
              onClick={onEmailLogin}
              className="w-full h-14 bg-[linear-gradient(254.31deg,_#FCFFEA_-34.59%,_#FFEA8C_71.94%,_#FFE88D_98.09%)] text-black rounded-xl flex items-center justify-center font-semibold text-lg"
            >
              <span className="mr-2 w-[16px]">
                <img src="/images/onboarding-email.png" alt="email" />
              </span>
              이메일로 시작하기
            </button>

            {/* 로그인 없이 이용하기 버튼 */}
            <button
              onClick={onFinishOnboarding}
              className="w-full h-14 text-[#202020] underline text-sm mt-4"
            >
              로그인 없이 이용하기
            </button>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* === 커스텀 Pagination Dots === */}
      {activeIndex < totalSlides - 1 && (
        <div className="absolute z-10 bottom-32 left-0 w-full flex justify-center items-center space-x-2">
          {Array.from({ length: totalSlides - 1 }).map((_, index) => (
            <span
              key={index}
              className={`block h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-5 bg-[#FFDB67]" : "w-2 bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      )}

      {/* === 하단 네비게이션 버튼 === */}
      {activeIndex < totalSlides - 1 && (
        <div
          className="absolute bottom-0 left-0 w-full bg-white p-6 pt-5 z-10"
          style={{
            paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
          }}
        >
          {/* 첫 번째 페이지 */}
          {activeIndex === 0 && (
            <button
              onClick={handleNext}
              className="w-full h-14 bg-[linear-gradient(254.31deg,_#FCFFEA_-34.59%,_#FFEA8C_71.94%,_#FFE88D_98.09%)] rounded-xl font-semibold text-[16px] text-black"
            >
              다음
            </button>
          )}
          {/* 두 번째 페이지 */}
          {activeIndex === 1 && (
            <div className="flex space-x-2">
              <button
                onClick={handlePrev}
                className="w-1/3 h-14 bg-gray-100 text-gray-500 rounded-xl font-semibold text-lg"
              >
                이전
              </button>
              <button
                onClick={handleNext}
                className="w-2/3 h-14 bg-[linear-gradient(254.31deg,_#FCFFEA_-34.59%,_#FFEA8C_71.94%,_#FFE88D_98.09%)] rounded-xl font-semibold text-lg text-gray-800"
              >
                다음
              </button>
            </div>
          )}
          {/* 세 번째 페이지 */}
          {activeIndex === 2 && (
            <div className="flex space-x-2">
              <button
                onClick={handlePrev}
                className="w-1/3 h-14 bg-gray-100 text-gray-500 rounded-xl font-semibold text-lg"
              >
                이전
              </button>
              <button
                onClick={handleNext}
                className="w-2/3 h-14 bg-[linear-gradient(254.31deg,_#FCFFEA_-34.59%,_#FFEA8C_71.94%,_#FFE88D_98.09%)] rounded-xl font-semibold text-lg text-gray-800"
              >
                다음
              </button>
            </div>
          )}
          {/* 네 번째 페이지 */}
          {activeIndex === 3 && (
            <div className="flex space-x-2">
              <button
                onClick={handlePrev}
                className="w-1/3 h-14 bg-gray-100 text-gray-500 rounded-xl font-semibold text-lg"
              >
                이전
              </button>
              <button
                onClick={handleNext}
                className="w-2/3 h-14 bg-[linear-gradient(254.31deg,_#FCFFEA_-34.59%,_#FFEA8C_71.94%,_#FFE88D_98.09%)] rounded-xl font-semibold text-lg text-gray-800"
              >
                시작하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Onboarding;
