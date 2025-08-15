export const PRE_SIGNUP_TOKEN_KEY = "preSignupToken";
export const PRE_SIGNUP_DATA_KEY = "preSignupData";

export const setPreSignupToken = (t: string) =>
  sessionStorage.setItem(PRE_SIGNUP_TOKEN_KEY, t);
export const getPreSignupToken = () =>
  sessionStorage.getItem(PRE_SIGNUP_TOKEN_KEY);
export const clearPreSignupToken = () =>
  sessionStorage.removeItem(PRE_SIGNUP_TOKEN_KEY);

export const setPreSignupData = (data: unknown) =>
  sessionStorage.setItem(PRE_SIGNUP_DATA_KEY, JSON.stringify(data));
export const getPreSignupData = <T = unknown>(): T | null => {
  try {
    const raw = sessionStorage.getItem(PRE_SIGNUP_DATA_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};
export const clearPreSignupData = () =>
  sessionStorage.removeItem(PRE_SIGNUP_DATA_KEY);
