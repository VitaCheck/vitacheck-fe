import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailSignupPage = () => {
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

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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
    const updated = { ...agrees, [key]: !agrees[key] };
    updated.all = updated.terms && updated.privacy && updated.marketing;
    setAgrees(updated);
  };

  const generateNickname = () => {
    const randomNick = `유저${Math.floor(Math.random() * 10000)}`;
    setNickname(randomNick);
  };

  //   const handleSignup = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setErrorMessage("");

  //     if (password !== confirmPassword) {
  //       setErrorMessage("비밀번호가 일치하지 않습니다.");
  //       return;
  //     }

  //     if (!agrees.terms || !agrees.privacy) {
  //       setErrorMessage("필수 약관에 동의해주세요.");
  //       return;
  //     }
  //   };

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
      // 다음 페이지에서 꺼내 쓸 데이터 저장
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
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <main className="min-h-[calc(100vh-100px-100px)] flex flex-1 justify-center items-center bg-[#FAFAFA]">
        <form onSubmit={handleSignup} className="w-full max-w-md px-6 py-10">
          <h1 className="text-center text-[34px] font-medium mb-10">
            회원가입
          </h1>

          {/* 이메일 */}
          <div className="mb-6">
            <label className="block mb-2 text-[22px] font-semibold">
              이메일
            </label>

            <div className="relative">
              <input
                type="email"
                placeholder="이메일 주소를 입력해주세요."
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="w-full px-4 py-3 border-b border-gray-300 text-[18px] text-[#6B6B6B] placeholder-[#AAAAAA] focus:outline-none"
                required
              />
              {isEmailValid && (
                <img
                  src="/images/check-green.png"
                  alt="유효한 이메일"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-[18px]"
                />
              )}
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="mb-6">
            <label className="block mb-2 text-[22px] font-semibold">
              비밀번호
            </label>
            <div className="w-full flex items-center border-b border-gray-300">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-4 py-3 text-[18px] text-[#6B6B6B] placeholder-[#AAAAAA] bg-transparent focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-2"
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
          <div className="mb-6">
            <label className="block mb-2 text-[22px] font-semibold">
              비밀번호 확인
            </label>

            <div className="w-full flex items-center border-b border-gray-300">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호를 다시 입력해주세요."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 px-4 py-3 text-[18px] text-[#6B6B6B] placeholder-[#AAAAAA] bg-transparent focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="px-2"
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
          <div className="mb-6">
            <label className="block mb-2 text-[22px] font-semibold">
              닉네임
            </label>

            <div className="flex items-center border-b border-gray-300">
              <input
                type="text"
                placeholder="유저닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="flex-1 px-4 py-3 text-[18px] text-[#6B6B6B] placeholder-[#AAAAAA] focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={generateNickname}
                className="text-[14px] px-3 py-1 border border-[#D9D9D9] rounded-md"
              >
                자동생성
              </button>
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="mb-6 space-y-3 text-[#202020]">
            <label className="flex items-center gap-2 font-semibold text-[22px]">
              <input
                type="checkbox"
                checked={agrees.all}
                onChange={handleToggleAll}
                className="appearance-none w-[28px] h-[28px] border border-gray-300 rounded-[4px] checked:bg-[#FFD54E] checked:border-none relative"
              />
              <span className="absolute w-[28px] h-[28px] pointer-events-none flex justify-center items-center">
                {agrees.all && (
                  <img
                    src="/images/check-white.png"
                    alt="전체 동의 체크"
                    className="w-[16px]"
                  />
                )}
              </span>
              전체 동의
            </label>

            {/* 개별 동의 */}
            <div className="ml-[30px] space-y-2 text-[18px] font-medium text-[#6B6B6B]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agrees.terms}
                  onChange={() => handleCheckboxChange("terms")}
                  className="appearance-none w-[28px] h-[28px] border border-gray-300 rounded-[4px] checked:bg-[#FFD54E] checked:border-none relative"
                />
                <span className="absolute w-[28px] h-[28px] pointer-events-none flex justify-center items-center">
                  {agrees.terms && (
                    <img
                      src="/images/check-white.png"
                      alt="전체 동의 체크"
                      className="w-[16px]"
                    />
                  )}
                </span>
                서비스 이용약관 동의 (필수)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agrees.privacy}
                  onChange={() => handleCheckboxChange("privacy")}
                  className="appearance-none w-[28px] h-[28px] border border-gray-300 rounded-[4px] checked:bg-[#FFD54E] checked:border-none relative"
                />
                <span className="absolute w-[28px] h-[28px] pointer-events-none flex justify-center items-center">
                  {agrees.privacy && (
                    <img
                      src="/images/check-white.png"
                      alt="전체 동의 체크"
                      className="w-[16px]"
                    />
                  )}
                </span>
                개인정보 수집 및 이용 동의 (필수)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agrees.marketing}
                  onChange={() => handleCheckboxChange("marketing")}
                  className="appearance-none w-[28px] h-[28px] border border-gray-300 rounded-[4px] checked:bg-[#FFD54E] checked:border-none relative"
                />
                <span className="absolute w-[28px] h-[28px] pointer-events-none flex justify-center items-center">
                  {agrees.marketing && (
                    <img
                      src="/images/check-white.png"
                      alt="전체 동의 체크"
                      className="w-[16px]"
                    />
                  )}
                </span>
                마케팅 이용 동의 (선택)
              </label>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full h-[83px] bg-[#FFE88D] text-black text-[22px] font-bold py-3 rounded-lg transition-colors"
          >
            다음
          </button>
        </form>
      </main>
    </div>
  );
};

export default EmailSignupPage;
