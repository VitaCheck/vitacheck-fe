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
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex flex-1 justify-center items-center bg-[#FAFAFA]">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md px-6 py-10 bg-white rounded-lg shadow-none"
        >
          <h1 className="text-center text-[24px] font-bold mb-10">로그인</h1>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold">이메일</label>
            <input
              type="email"
              placeholder="이메일 주소를 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label className="block mb-2 text-sm font-semibold">비밀번호</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[50%] -translate-y-1/2 text-gray-500 text-sm"
            >
              {showPassword ? "숨기기" : "보기"}
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#FFDB67] hover:bg-[#f4cc4e] text-black font-semibold py-3 rounded-lg transition-colors"
          >
            로그인
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
