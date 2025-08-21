// //  src/lib/auth.ts
// const mask = (t?: string) => (t ? `${t.slice(0, 4)}...${t.slice(-6)}` : "none");

// export const saveTokens = (accessToken: string, refreshToken: string) => {
//   console.debug(
//     "[AUTH] saveTokens AT:",
//     mask(accessToken),
//     "RT:",
//     mask(refreshToken)
//   );
//   localStorage.setItem("accessToken", accessToken);
//   localStorage.setItem("refreshToken", refreshToken);
// };
// export const getAccessToken = () => localStorage.getItem("accessToken");
// export const getRefreshToken = () => localStorage.getItem("refreshToken");
// export const clearTokens = () => {
//   localStorage.removeItem("accessToken");
//   localStorage.removeItem("refreshToken");
// };

//  src/lib/auth.ts
const mask = (t?: string) => (t ? `${t.slice(0, 4)}...${t.slice(-6)}` : "none");

export const saveTokens = (accessToken: string, refreshToken?: string) => {
  console.debug(
    "[AUTH] saveTokens AT:",
    mask(accessToken),
    "RT:",
    mask(refreshToken)
  );

  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  // ✅ 새 로그인마다 FCM 토큰 업서트를 유도하기 위해 캐시 리셋
  try {
    localStorage.removeItem("vc_last_fcm_token");
    // (선택) 유저별 캐시를 쓰기로 했다면 이것도 함께 제거
    localStorage.removeItem("vc_last_fcm_user");
  } catch {}
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // ✅ 로그아웃 시에도 FCM 캐시 정리
  try {
    localStorage.removeItem("vc_last_fcm_token");
    localStorage.removeItem("vc_last_fcm_user");
  } catch {}
};
