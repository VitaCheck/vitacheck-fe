import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";

const MobileSignupDetailPage = () => {
  const [gender, setGender] = useState<"FEMALE" | "MALE" | null>(null);
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const base = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("signupData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!base?.email || !base?.password || !base?.nickname) {
      navigate("/signup/email", { replace: true });
    }
  }, [base, navigate]);

  const genderCardStyle = (selected: boolean) =>
    `w-[150px] h-[170px] rounded-2xl border border-gray-200 flex items-center justify-center cursor-pointer shadow-sm transition ${
      selected ? "bg-[#FFF8DC] border-none" : "bg-white"
    }`;

  const handleBirthChange = (value: string) => {
    const onlyNums = value.replace(/\D/g, "").slice(0, 8);
    let formatted = onlyNums;
    if (onlyNums.length > 4)
      formatted = onlyNums.slice(0, 4) + "." + onlyNums.slice(4);
    if (onlyNums.length > 6)
      formatted =
        onlyNums.slice(0, 4) +
        "." +
        onlyNums.slice(4, 6) +
        "." +
        onlyNums.slice(6);
    setBirth(formatted);
  };

  const handlePhoneChange = (value: string) => {
    const onlyNums = value.replace(/\D/g, "").slice(0, 11);
    let formatted = onlyNums;
    if (onlyNums.length > 3 && onlyNums.length <= 7) {
      formatted = onlyNums.slice(0, 3) + "-" + onlyNums.slice(3);
    } else if (onlyNums.length > 7) {
      formatted =
        onlyNums.slice(0, 3) +
        "-" +
        onlyNums.slice(3, 7) +
        "-" +
        onlyNums.slice(7);
    }
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!gender) {
      setError("성별을 선택해주세요.");
      return;
    }

    const birthDate = birth.replace(/\./g, "-");
    const phoneNumber = phone;

    const body = {
      email: base.email,
      password: base.password,
      fullName: base.nickname,
      nickname: base.nickname,
      gender,
      birthDate,
      phoneNumber,
      agreeToMarketing: !!base.agreeToMarketing,
    };

    try {
      setIsSubmitting(true);
      await axios.post("/api/v1/auth/signup", body);
      sessionStorage.removeItem("signupData");
      navigate("/login/email");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setError(msg);
      console.error("Signup error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto min-h-dvh max-w-[480px] bg-white">
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

      <main className="px-5 pb-36 pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 성별 선택 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <div
                onClick={() => setGender("FEMALE")}
                className={genderCardStyle(gender === "FEMALE")}
              >
                <img
                  src="/images/female.png"
                  alt="여성"
                  className="w-[120px]"
                />
              </div>
              <p className="text-[18px] font-semibold">여성</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div
                onClick={() => setGender("MALE")}
                className={genderCardStyle(gender === "MALE")}
              >
                <img src="/images/male.png" alt="남성" className="w-[120px]" />
              </div>
              <p className="text-[18px] font-semibold">남성</p>
            </div>
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-[16px] font-semibold mb-2">
              생년월일
            </label>
            <input
              type="text"
              placeholder="YYYY.MM.DD"
              value={birth}
              onChange={(e) => handleBirthChange(e.target.value)}
              className="w-full border-b border-gray-300 py-3 text-[16px] outline-none"
              required
            />
          </div>

          {/* 휴대폰 번호 */}
          <div>
            <label className="block text-[16px] font-semibold mb-2">
              휴대폰 번호
            </label>
            <input
              type="text"
              placeholder="010-1234-1234"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full border-b border-gray-300 py-3 text-[16px] outline-none"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[480px] bg-white/70 px-4 pb-6 pt-2 backdrop-blur">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="pointer-events-auto inline-flex h-[68px] w-full items-center justify-center rounded-2xl bg-[#FFEB9D] text-[18px] font-bold text-black disabled:opacity-60"
        >
          회원가입 완료하기
        </button>
      </div>
    </div>
  );
};

export default MobileSignupDetailPage;
