import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MobileEmailSignupPage = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agrees, setAgrees] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handleToggleAll = () => {
    const newValue = !agrees.all;
    setAgrees({
      all: newValue,
      terms: newValue,
      privacy: newValue,
      marketing: newValue,
    });
  };

  const handleCheckboxChange = (key: keyof typeof agrees) => {
    const updated = { ...agrees, [key]: !agrees[key] } as typeof agrees;
    updated.all = updated.terms && updated.privacy && updated.marketing;
    setAgrees(updated);
  };

  const generateNickname = () => {
    const randomNick = `유저${Math.floor(Math.random() * 10000)}`;
    setNickname(randomNick);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agrees.terms || !agrees.privacy) {
      setErrorMessage("필수 약관에 동의해주세요.");
      return;
    }

    try {
      sessionStorage.setItem(
        "signupData",
        JSON.stringify({
          email,
          password,
          nickname,
          agreeToMarketing: agrees.marketing,
        })
      );
      navigate("/signup/email/detail");
    } catch (error) {
      setErrorMessage("임시 저장에 실패했습니다. 다시 시도해주세요.");
      console.error("Signup stash failed:", error);
    }
  };

  return (
    <div className="relative mx-auto min-h-dvh max-w-[480px] bg-white">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-[20px] py-[20px]">
        <button onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img
            src="/images/PNG/네비게이션 바/Go back.png"
            alt="뒤로가기"
            className="w-[26.15px] object-contain"
          />
        </button>
        <h1 className="text-[24px] font-semibold">회원가입</h1>
      </header>

      <main className="px-5 pb-36 pt-4">
        <form onSubmit={handleSignup} className="space-y-8">
          {/* 이메일 */}
          <div>
            <label className="block mb-2 text-[18px] font-semibold">
              이메일
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="이메일 주소를 입력해주세요."
                inputMode="email"
                autoCapitalize="none"
                autoComplete="email"
                required
                className="ml-[12px] w-full border-0 border-b border-[#D9D9D9] bg-transparent py-3 text-[16px] text-[#6B6B6B] placeholder-[#AAAAAA] outline-none focus:border-[#202020]"
              />
              {isEmailValid && (
                <img
                  src="/images/check-green.png"
                  alt="유효한 이메일"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-[18px]"
                />
              )}
            </div>
            {!isEmailValid && email && (
              <p className="text-red-500 text-sm mt-1">
                올바른 이메일 형식이 아닙니다.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block mb-2 text-[18px] font-semibold">
              비밀번호
            </label>
            <div className="flex items-center gap-2 border-b border-[#D9D9D9]">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요."
                autoComplete="new-password"
                required
                className="ml-[12px] w-full bg-transparent py-3 text-[16px] text-[#6B6B6B] placeholder-[#AAAAAA] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="px-2 py-2"
              >
                <img
                  src={
                    showPassword
                      ? "/images/ion_eye-1.png"
                      : "/images/ion_eye.png"
                  }
                  alt="비밀번호 보기"
                  className="w-[18px]"
                />
              </button>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block mb-2 text-[18px] font-semibold">
              비밀번호 확인
            </label>
            <div className="flex items-center gap-2 border-b border-[#D9D9D9]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요."
                autoComplete="new-password"
                required
                className="ml-[12px] w-full bg-transparent py-3 text-[16px] text-[#6B6B6B] placeholder-[#AAAAAA] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="px-2 py-2"
              >
                <img
                  src={
                    showConfirmPassword
                      ? "/images/ion_eye-1.png"
                      : "/images/ion_eye.png"
                  }
                  alt="비밀번호 보기"
                  className="w-[18px]"
                />
              </button>
            </div>
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block mb-2 text-[18px] font-semibold">
              닉네임
            </label>
            <div className="flex items-center border-b border-[#D9D9D9]">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="유저닉네임"
                required
                className="ml-[12px] w-full bg-transparent py-3 text-[16px] text-[#6B6B6B] placeholder-[#AAAAAA] outline-none"
              />
              <button
                type="button"
                onClick={generateNickname}
                className="flex-shrink-0 w-auto whitespace-nowrap text-[14px] text-[#6B6B6B] px-3 py-1 border border-[#D9D9D9] rounded-md"
              >
                자동생성
              </button>
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="space-y-3 text-[#202020]">
            <label className="relative flex items-center gap-2 text-[18px] font-semibold">
              <input
                type="checkbox"
                checked={agrees.all}
                onChange={handleToggleAll}
                className="appearance-none w-[24px] h-[24px] border border-gray-300 rounded-[4px] checked:bg-[#FFD54E] checked:border-none"
              />
              {/* 체크마크 오버레이 */}
              <span className="absolute left-0 w-[24px] h-[24px] pointer-events-none flex items-center justify-center">
                {agrees.all && (
                  <img
                    src="/images/check-white.png"
                    alt="전체 동의"
                    className="w-[14px]"
                  />
                )}
              </span>
              전체 동의
            </label>

            <div className="ml-7 space-y-2 text-[16px] font-medium text-[#6B6B6B]">
              {(
                [
                  { key: "terms", label: "서비스 이용약관 동의 (필수)" },
                  {
                    key: "privacy",
                    label: "개인정보 수집 및 이용 동의 (필수)",
                  },
                  { key: "marketing", label: "마케팅 이용 동의 (선택)" },
                ] as const
              ).map(({ key, label }) => (
                <label key={key} className="relative flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={agrees[key]}
                    onChange={() => handleCheckboxChange(key)}
                    className="appearance-none w-[24px] h-[24px] border border-gray-300 rounded-[4px] checked:bg-[#FFD54E] checked:border-none"
                  />
                  <span className="absolute left-0 w-[24px] h-[24px] pointer-events-none flex items-center justify-center">
                    {agrees[key] && (
                      <img
                        src="/images/check-white.png"
                        alt="체크"
                        className="w-[14px]"
                      />
                    )}
                  </span>
                  {label}
                </label>
              ))}
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </form>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[480px] bg-white/70 px-4 pb-6 pt-2 backdrop-blur">
        <button
          onClick={handleSignup}
          className="pointer-events-auto inline-flex h-[68px] w-full items-center justify-center rounded-2xl bg-[#FFE88D] text-[18px] font-bold text-black"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MobileEmailSignupPage;
