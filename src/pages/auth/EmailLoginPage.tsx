import { useState } from "react";
import axios from "@/lib/axios"; // 프로젝트에서 사용하는 axios 인스턴스 경로로 수정해줘
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(
        "/api/v1/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log("로그인 응답 데이터:", response.data);

      //   const token = response.data?.accessToken;
      const token = response.data?.result?.accessToken;

      if (token) {
        localStorage.setItem("accessToken", token);
        navigate("/mypage");
      } else {
        setErrorMessage("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error: any) {
      setErrorMessage("이메일 또는 비밀번호가 잘못되었습니다.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col justify-between ">
      <main className="min-h-[calc(100vh-100px-100px)] flex flex-1 justify-center items-center bg-[#FAFAFA]">
        <form onSubmit={handleLogin} className="w-full max-w-md px-6 py-10">
          <h1 className="text-center text-[34px] font-medium mb-10">로그인</h1>

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
                {showPassword ? (
                  <img
                    src="/images/ion_eye-1.png"
                    alt="비밀번호 숨기기"
                    className="w-[18px]"
                  />
                ) : (
                  <img
                    src="/images/ion_eye.png"
                    alt="비밀번호 보기"
                    className="w-[18px]"
                  />
                )}
              </button>
            </div>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full h-[83px] bg-[#FFE88D] text-black text-[22px] font-bold py-3 rounded-lg transition-colors"
          >
            로그인
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
