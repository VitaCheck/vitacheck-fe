//  src/lib/auth.ts
const mask = (t?: string) => (t ? `${t.slice(0, 4)}...${t.slice(-6)}` : "none");

export const saveTokens = (accessToken: string, refreshToken: string) => {
  console.debug(
    "[AUTH] saveTokens AT:",
    mask(accessToken),
    "RT:",
    mask(refreshToken)
  );
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
