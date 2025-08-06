import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";

const EmailSignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agrees, setAgrees] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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

  const handleSignup = async (e: React.FormEvent) => {
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
      const response = await axios.post("/api/v1/auth/signup", {
        email,
        password,
        nickname,
        agreeToMarketing: agrees.marketing,
      });
      console.log("회원가입 성공:", response.data);
      navigate("/login");
    } catch (error) {
      setErrorMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
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

          <div className="mb-6">
            <label className="block mb-2 text-[22px] font-semibold">
              이메일
            </label>
            <input
              type="email"
              placeholder="이메일 주소를 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 text-[18px] text-[#6B6B6B] placeholder-[#AAAAAA] focus:outline-none"
              required
            />
          </div>

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
                onClick={() => setShowPassword((prev) => !prev)}
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

          <div className="mb-6">
            <label className="block mb-2 text-[22px] font-semibold">
              비밀번호 확인
            </label>
            <input
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 text-[18px] text-[#6B6B6B] placeholder-[#AAAAAA] focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-[22px] font-semibold">
              닉네임
            </label>
            <input
              type="text"
              placeholder="유저닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 text-[18px] text-[#6B6B6B] placeholder-[#AAAAAA] focus:outline-none"
              required
            />
          </div>

          {/* 약관 동의 */}
          <div className="mb-6 space-y-3 text-[18px] text-[#202020]">
            <label className="flex items-center gap-2 font-semibold">
              <input
                type="checkbox"
                checked={agrees.all}
                onChange={handleToggleAll}
              />
              전체 동의
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agrees.terms}
                onChange={() => handleCheckboxChange("terms")}
              />
              서비스 이용약관 동의 (필수)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agrees.privacy}
                onChange={() => handleCheckboxChange("privacy")}
              />
              개인정보 수집 및 이용 동의 (필수)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agrees.marketing}
                onChange={() => handleCheckboxChange("marketing")}
              />
              마케팅 이용 동의 (선택)
            </label>
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
