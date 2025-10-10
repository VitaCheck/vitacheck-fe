import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSocialSignup } from "@/apis/auth";
import { saveTokens } from "@/lib/auth";
import { syncFcmTokenForce } from "@/lib/push";

type Gender = "FEMALE" | "MALE" | "OTHER";

export default function SocialSignupDetailPage() {
  const [gender, setGender] = useState<Gender | null>(null);
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
    if (
      !base?.socialTempToken ||
      !base?.email ||
      !base?.nickname ||
      !base?.fullName ||
      !base?.provider ||
      !base?.providerId
    ) {
      alert("필수 정보가 누락되었습니다. 다시 로그인해주세요.");
      navigate("/login", { replace: true });
      return;
    }
    if (base?.presetGender) setGender(base.presetGender as Gender);
    if (base?.presetBirthDate)
      setBirth(base.presetBirthDate.replace(/-/g, "."));
    if (base?.phoneNumber) setPhone(base.phoneNumber);
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
    if (onlyNums.length > 6) {
      formatted =
        onlyNums.slice(0, 4) +
        "." +
        onlyNums.slice(4, 6) +
        "." +
        onlyNums.slice(6);
    }
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

    try {
      setIsSubmitting(true);

      const body = {
        email: base.email,
        fullName: base.fullName,
        provider: base.provider,
        providerId: base.providerId,
        nickname: base.nickname,
        gender,
        birthDate,
        phoneNumber,
        agreeToMarketing: !!base.agreeToMarketing,
      };

      const result = await postSocialSignup(body as any, base.socialTempToken);
      const at = result?.result?.accessToken ?? result?.accessToken ?? "";
      const rt = result?.result?.refreshToken ?? result?.refreshToken ?? "";

      if (at) {
        saveTokens(at, rt);
        await syncFcmTokenForce().catch((err) => {
          console.error("[SocialSignupDetail] syncFcmTokenForce failed", err);
        });
      }

      const next = typeof base?.next === "string" ? base.next : "/";
      sessionStorage.removeItem("signupData");
      navigate(next.startsWith("/") ? next : "/", { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setError(msg);
      console.error("Social signup error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FAFAFA] py-10">
      <h1 className="text-[34px] font-medium mb-10">회원가입</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
        {/* 성별 선택 */}
        <div className="flex justify-between gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              onClick={() => setGender("FEMALE")}
              className={genderCardStyle(gender === "FEMALE")}
            >
              <img src="/images/female.png" alt="여성" className="w-[151px]" />
            </div>
            <p className="text-[22px] font-semibold">여성</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              onClick={() => setGender("MALE")}
              className={genderCardStyle(gender === "MALE")}
            >
              <img src="/images/male.png" alt="남성" className="w-[151px]" />
            </div>
            <span className="text-[22px] font-semibold">남성</span>
          </div>
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block text-[18px] font-semibold mb-2">
            생년월일
          </label>
          <input
            type="text"
            placeholder="YYYY.MM.DD"
            value={birth}
            onChange={(e) => handleBirthChange(e.target.value)}
            className="w-full border-b border-gray-300 py-2 px-1 text-[18px] focus:outline-none"
            required
            inputMode="numeric"
          />
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <label className="block text-[18px] font-semibold mb-2">
            휴대폰 번호
          </label>
          <input
            type="text"
            placeholder="010-1234-5678"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className="w-full border-b border-gray-300 py-2 px-1 text-[18px] focus:outline-none"
            required
            inputMode="numeric"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[82px] bg-[#FFEB9D] text-black text-[20px] font-bold rounded-lg disabled:opacity-60"
        >
          {isSubmitting ? "처리 중..." : "회원가입 완료하기"}
        </button>
      </form>
    </div>
  );
}
