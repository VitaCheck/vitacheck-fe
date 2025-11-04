type Provider = "naver" | "google";

export const handleSocialLogin = (provider: Provider, base: string): void => {
  if (!base) {
    console.error("VITE_SERVER_API_URL is missing");
    alert("서버 주소가 설정되지 않았습니다. 관리자에게 문의해주세요.");
    return;
  }

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
  }
};
