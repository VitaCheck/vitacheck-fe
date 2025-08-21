//  src/apis/auth.ts

import axios from "axios";
import { saveTokens } from "@/lib/auth";
const BASE_URL = import.meta.env.VITE_SERVER_API_URL;

/* =========================
   이메일 1단계: pre-signup
   ========================= */
export type PreSignupPayload = {
  email: string;
  password: string;
  nickname: string;
  agreedTermIds: number[];
};

export type PreSignupResponseRaw = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string; // JWT 토큰
};

export type PreSignupResponse = {
  preSignupToken: string;
};

export const postPreSignup = async (
  data: PreSignupPayload
): Promise<PreSignupResponse> => {
  const res = await axios.post<PreSignupResponseRaw>(
    `${BASE_URL}/api/v1/auth/pre-signup`,
    data,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      timeout: 15000,
    }
  );

  const token = res?.data?.result;
  if (!token) {
    throw new Error("pre-signup 응답에 result(토큰)가 없습니다.");
  }
  return { preSignupToken: token };
};

/* =========================
   이메일 2단계: signup
   ========================= */
export type FinalSignupPayload = {
  fullName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  birthDate: string; // yyyy-MM-dd
  phoneNumber: string; // 010-1234-5678
};
export type FinalSignupResponse = {
  accessToken?: string;
  refreshToken?: string;
  result?: { accessToken?: string; refreshToken?: string };
};

export const postFinalSignup = async (
  data: FinalSignupPayload,
  preSignupToken: string
): Promise<FinalSignupResponse> => {
  const res = await axios.post<FinalSignupResponse>(
    `${BASE_URL}/api/v1/auth/signup`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${preSignupToken}`,
      },
      withCredentials: true,
      timeout: 15000,
    }
  );

  // ✅ 응답에서 토큰 꺼내기 + 저장
  const at = res.data?.accessToken ?? res.data?.result?.accessToken;
  const rt = res.data?.refreshToken ?? res.data?.result?.refreshToken;
  if (at && rt) saveTokens(at, rt);

  return res.data;
};

/* =========================
   소셜 전용 API
   ========================= */
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

export const postSocialSignup = async (
  data: SocialSignupPayload,
  signupToken?: string
) => {
  const res = await axios.post<SocialSignupResponse>(
    `${BASE_URL}/api/v1/auth/social-signup`,
    data,
    {
      withCredentials: true,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        ...(signupToken
          ? { Authorization: `Bearer ${signupToken}` }
          : undefined),
      },
    }
  );

  // ✅ 응답에서 토큰 꺼내기 + 저장
  const at = res.data?.accessToken ?? res.data?.result?.accessToken;
  const rt = res.data?.refreshToken ?? res.data?.result?.refreshToken;
  if (at && rt) saveTokens(at, rt);

  return res.data;
};

/* =========================
   (선택) 로그인 후 추가 약관 동의
   ========================= */
export type AgreeTermsPayload = { agreedTermIds: number[] };
export const postAgreeTerms = async (
  payload: AgreeTermsPayload,
  accessToken: string
) => {
  const res = await axios.post(`${BASE_URL}/api/v1/terms/agreements`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
    timeout: 15000,
  });
  return res.data;
};

/* =========================
   (편의) 최종 응답에서 토큰 꺼내기
   ========================= */
export const unwrapFinalTokens = (r: FinalSignupResponse) => ({
  accessToken: r.accessToken ?? r.result?.accessToken,
  refreshToken: r.refreshToken ?? r.result?.refreshToken,
});
