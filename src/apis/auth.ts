// // import axios from "axios";

// // const BASE_URL = import.meta.env.VITE_SERVER_API_URL;

// // export const postSocialSignup = async (data: {
// //   email: string;
// //   nickname: string;
// //   birth: string;
// //   gender: string;
// //   phoneNumber: string;
// // }) => {
// //   const response = await axios.post(
// //     `${BASE_URL}/api/v1/auth/social-signup`,
// //     data
// //   );
// //   return response.data;
// // };

// // FILE: src/apis/auth.ts
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_SERVER_API_URL;

// // 백엔드 스펙에 맞춤
// export type SocialSignupPayload = {
//   email: string;
//   fullName: string;
//   provider: string;
//   providerId: string;
//   nickname: string;
//   gender: "MALE" | "FEMALE" | "OTHER";
//   birthDate: string; // ✅ birth → birthDate
//   phoneNumber: string;
// };

// // 응답은 프로젝트마다 달라 방어적 타입
// export type SocialSignupResponse = {
//   isSuccess?: boolean;
//   result?: {
//     accessToken?: string;
//     refreshToken?: string;
//   };
//   accessToken?: string;
//   refreshToken?: string;
// };

// export const postSocialSignup = (data: SocialSignupPayload) => {
//   // headers(Authorization)도 접근할 수 있게 응답 전체 반환
//   return axios.post<SocialSignupResponse>(
//     `${BASE_URL}/api/v1/auth/social-signup`,
//     data,
//     { withCredentials: true }
//   );
// };

// import axios from "axios";
// import type { AxiosRequestConfig } from "axios";

// const BASE_URL = import.meta.env.VITE_SERVER_API_URL;

// // 백엔드 스펙에 맞춤
// export type SocialSignupPayload = {
//   email: string;
//   fullName: string;
//   provider: string;
//   providerId: string;
//   nickname: string;
//   gender: "MALE" | "FEMALE" | "OTHER";
//   birthDate: string; // ✅ birth → birthDate
//   phoneNumber: string;
// };

// // 응답은 프로젝트마다 달라 방어적 타입
// export type SocialSignupResponse = {
//   isSuccess?: boolean;
//   result?: {
//     accessToken?: string;
//     refreshToken?: string;
//   };
//   accessToken?: string;
//   refreshToken?: string;
// };

// /**
//  * 소셜 회원가입을 요청하는 API 함수
//  * @param data - 회원가입에 필요한 유저 정보
//  * @param socialTempToken - 소셜 로그인 직후 발급된 임시 인증 토큰
//  * @returns Axios Promise
//  */
// export const postSocialSignup = (
//   data: SocialSignupPayload,
//   socialTempToken?: string // 1. 임시 토큰을 두 번째 인자로 받도록 추가 (옵셔널)
// ) => {
//   // 2. Axios 요청 설정을 준비합니다.
//   const config: AxiosRequestConfig = {
//     // 기존의 withCredentials 설정은 그대로 유지합니다.
//     withCredentials: true,
//   };

//   // 3. socialTempToken이 전달된 경우, config 객체에 Authorization 헤더를 추가합니다.
//   if (socialTempToken) {
//     config.headers = {
//       Authorization: `Bearer ${socialTempToken}`,
//     };
//   }

//   // headers(Authorization)도 접근할 수 있게 응답 전체 반환
//   // 4. 수정된 config 객체를 사용하여 요청을 보냅니다.
//   return axios.post<SocialSignupResponse>(
//     `${BASE_URL}/api/v1/auth/social-signup`,
//     data,
//     config
//   );
// };

// FILE: src/apis/auth.ts
// import axios, { type AxiosRequestConfig } from "axios";

// const BASE_URL = import.meta.env.VITE_SERVER_API_URL;

// export type SocialSignupPayload = {
//   email: string;
//   fullName: string;
//   provider: string;
//   providerId: string;
//   nickname: string;
//   gender: "MALE" | "FEMALE" | "OTHER";
//   birthDate: string;
//   phoneNumber: string;
// };

// export type SocialSignupResponse = {
//   isSuccess?: boolean;
//   result?: {
//     accessToken?: string;
//     refreshToken?: string;
//   };
//   accessToken?: string;
//   refreshToken?: string;
// };

// /**
//  * 소셜 회원가입
//  * - URL로 전달받은 임시토큰(signupToken/socialTempToken)을 Authorization 헤더에 넣어서 호출
//  * - 쿠키 방식과도 호환(withCredentials:true 유지)
//  */
// export const postSocialSignup = (
//   data: SocialSignupPayload,
//   socialTempToken?: string
// ) => {
//   const config: AxiosRequestConfig = {
//     withCredentials: true, // 쿠키 방식 병행 가능
//     timeout: 15000,
//     headers: {
//       "Content-Type": "application/json",
//       ...(socialTempToken
//         ? { Authorization: `Bearer ${socialTempToken}` }
//         : undefined),
//     },
//     // 필요시: validateStatus: (s) => s < 500,
//   };

//   return axios.post<SocialSignupResponse>(
//     `${BASE_URL}/api/v1/auth/social-signup`,
//     data,
//     config
//   );
// };
import axios, { type AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_API_URL;

export type SocialSignupPayload = {
  email: string;
  fullName: string;
  provider: string;
  providerId: string;
  nickname: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  birthDate: string;
  phoneNumber: string;
};

export type SocialSignupResponse = {
  isSuccess?: boolean;
  result?: { accessToken?: string; refreshToken?: string };
  accessToken?: string;
  refreshToken?: string;
};

export const postSocialSignup = (
  data: SocialSignupPayload,
  signupToken?: string
) => {
  const config: AxiosRequestConfig = {
    withCredentials: true,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      ...(signupToken ? { Authorization: `Bearer ${signupToken}` } : undefined),
    },
  };

  return axios.post<SocialSignupResponse>(
    `${BASE_URL}/api/v1/auth/social-signup`,
    data,
    config
  );
};
