// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "@/lib/axios";

// const DesktopEmailSignupDetailPage = () => {
//   const [gender, setGender] = useState<"FEMALE" | "MALE" | null>(null);
//   const [birth, setBirth] = useState("");
//   const [phone, setPhone] = useState("");
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   // 1단계 데이터 불러오기
//   const base = useMemo(() => {
//     try {
//       const raw = sessionStorage.getItem("signupData");
//       return raw ? JSON.parse(raw) : null;
//     } catch {
//       return null;
//     }
//   }, []);

//   useEffect(() => {
//     if (!base?.email || !base?.password || !base?.nickname) {
//       navigate("/signup/email", { replace: true });
//     }
//   }, [base, navigate]);

//   const genderCardStyle = (selected: boolean) =>
//     `w-[160px] h-[180px] rounded-xl border border-gray-200 flex justify-center items-center cursor-pointer shadow-sm transition ${
//       selected ? "bg-[#FFF8DC] border-none" : "bg-white"
//     }`;

//   // 생년월일 입력 자동 포맷 (YYYY.MM.DD)
//   const handleBirthChange = (value: string) => {
//     // 숫자만 추출
//     const onlyNums = value.replace(/\D/g, "").slice(0, 8);
//     let formatted = onlyNums;
//     if (onlyNums.length > 4) {
//       formatted = onlyNums.slice(0, 4) + "." + onlyNums.slice(4);
//     }
//     if (onlyNums.length > 6) {
//       formatted =
//         onlyNums.slice(0, 4) +
//         "." +
//         onlyNums.slice(4, 6) +
//         "." +
//         onlyNums.slice(6);
//     }
//     setBirth(formatted);
//   };

//   // 전화번호 입력 자동 포맷 (010-1234-5678)
//   const handlePhoneChange = (value: string) => {
//     const onlyNums = value.replace(/\D/g, "").slice(0, 11);
//     let formatted = onlyNums;
//     if (onlyNums.length > 3 && onlyNums.length <= 7) {
//       formatted = onlyNums.slice(0, 3) + "-" + onlyNums.slice(3);
//     } else if (onlyNums.length > 7) {
//       formatted =
//         onlyNums.slice(0, 3) +
//         "-" +
//         onlyNums.slice(3, 7) +
//         "-" +
//         onlyNums.slice(7);
//     }
//     setPhone(formatted);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!gender) {
//       setError("성별을 선택해주세요.");
//       return;
//     }

//     // 서버 전송용 포맷 변환
//     const birthDate = birth.replace(/\./g, "-"); // YYYY-MM-DD
//     const phoneNumber = phone; // 이미 010-1234-5678 형태

//     const body = {
//       email: base.email,
//       password: base.password,
//       fullName: base.nickname,
//       nickname: base.nickname,
//       gender,
//       birthDate,
//       phoneNumber,
//       agreeToMarketing: !!base.agreeToMarketing,
//     };

//     try {
//       setIsSubmitting(true);
//       await axios.post("/api/v1/auth/signup", body);
//       sessionStorage.removeItem("signupData");
//       navigate("/login/email");
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
//       setError(msg);
//       console.error("Signup error:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-[#FAFAFA] py-10">
//       <h1 className="text-[34px] font-medium mb-10">회원가입</h1>

//       <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
//         {/* 성별 선택 */}
//         <div className="flex justify-between gap-4">
//           <div className="flex flex-col items-center gap-2">
//             <div
//               onClick={() => setGender("FEMALE")}
//               className={genderCardStyle(gender === "FEMALE")}
//             >
//               <img src="/images/female.png" alt="여성" className="w-[151px]" />
//             </div>
//             <p className="text-[22px] font-semibold">여성</p>
//           </div>

//           <div className="flex flex-col items-center gap-2">
//             <div
//               onClick={() => setGender("MALE")}
//               className={genderCardStyle(gender === "MALE")}
//             >
//               <img src="/images/male.png" alt="남성" className="w-[151px]" />
//             </div>
//             <span className="text-[22px] font-semibold">남성</span>
//           </div>
//         </div>

//         {/* 생년월일 */}
//         <div>
//           <label className="block text-[18px] font-semibold mb-2">
//             생년월일
//           </label>
//           <input
//             type="text"
//             placeholder="YYYY.MM.DD"
//             value={birth}
//             onChange={(e) => handleBirthChange(e.target.value)}
//             className="w-full border-b border-gray-300 py-2 px-1 text-[18px] focus:outline-none"
//             required
//           />
//         </div>

//         {/* 휴대폰 번호 */}
//         <div>
//           <label className="block text-[18px] font-semibold mb-2">
//             휴대폰 번호
//           </label>
//           <input
//             type="text"
//             placeholder="010-1234-1234"
//             value={phone}
//             onChange={(e) => handlePhoneChange(e.target.value)}
//             className="w-full border-b border-gray-300 py-2 px-1 text-[18px] focus:outline-none"
//             required
//           />
//         </div>

//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full h-[82px] bg-[#FFEB9D] text-black text-[20px] font-bold rounded-lg disabled:opacity-60"
//         >
//           {isSubmitting ? "처리 중..." : "회원가입 완료하기"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default DesktopEmailSignupDetailPage;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";

const DesktopEmailSignupDetailPage = () => {
  const [gender, setGender] = useState<"FEMALE" | "MALE" | "OTHER" | null>(
    null
  );
  const [birth, setBirth] = useState(""); // UI: YYYY.MM.DD
  const [phone, setPhone] = useState(""); // UI: 010-1234-5678
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // 1단계 데이터 + 임시 토큰 불러오기
  const base = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("signupData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const preSignupToken = useMemo(() => {
    return sessionStorage.getItem("preSignupToken"); // ✅ 1단계에서 저장해야 함
  }, []);

  useEffect(() => {
    // 필수 데이터/토큰 없으면 1단계로
    if (!base?.email || !base?.password || !base?.nickname || !preSignupToken) {
      navigate("/signup/email", { replace: true });
    }
  }, [base, preSignupToken, navigate]);

  const genderCardStyle = (selected: boolean) =>
    `w-[160px] h-[180px] rounded-xl border border-gray-200 flex justify-center items-center cursor-pointer shadow-sm transition ${
      selected ? "bg-[#FFF8DC] border-none" : "bg-white"
    }`;

  // 생년월일 입력 자동 포맷 (YYYY.MM.DD)
  const handleBirthChange = (value: string) => {
    const onlyNums = value.replace(/\D/g, "").slice(0, 8);
    let formatted = onlyNums;
    if (onlyNums.length > 4)
      formatted = `${onlyNums.slice(0, 4)}.${onlyNums.slice(4)}`;
    if (onlyNums.length > 6)
      formatted = `${onlyNums.slice(0, 4)}.${onlyNums.slice(4, 6)}.${onlyNums.slice(6)}`;
    setBirth(formatted);
  };

  // 전화번호 입력 자동 포맷 (010-1234-5678)
  const handlePhoneChange = (value: string) => {
    const onlyNums = value.replace(/\D/g, "").slice(0, 11);
    let formatted = onlyNums;
    if (onlyNums.length > 3 && onlyNums.length <= 7) {
      formatted = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    } else if (onlyNums.length > 7) {
      formatted = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7)}`;
    }
    setPhone(formatted);
  };

  // 클라이언트 검증(간단)
  const validate = () => {
    if (!gender) return "성별을 선택해주세요.";
    const birthDate = birth.replace(/\./g, "-"); // -> YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate))
      return "생년월일 형식이 올바르지 않습니다.";
    if (!/^010-\d{4}-\d{4}$/.test(phone))
      return "휴대폰 번호 형식이 올바르지 않습니다.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    // 서버 전송용 포맷
    const birthDate = birth.replace(/\./g, "-"); // YYYY-MM-DD
    const phoneNumber = phone;

    // ⚠️ 최종 가입 바디는 스펙에 맞춰 "이 4개만" 보냄
    const body = {
      fullName: base.nickname, // 이름 입력 UI가 따로 있으면 그 값을 넣으세요
      gender, // "MALE" | "FEMALE" | "OTHER"
      birthDate, // "yyyy-MM-dd"
      phoneNumber, // "010-1234-5678"
    };

    try {
      setIsSubmitting(true);
      await axios.post("/api/v1/auth/signup", body, {
        headers: { Authorization: `Bearer ${preSignupToken}` }, // ✅ 임시 토큰 필수
        withCredentials: true,
      });

      // 가입 성공 후 정리
      sessionStorage.removeItem("signupData");
      sessionStorage.removeItem("preSignupToken");
      navigate("/login/email");
    } catch (err: any) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        (status === 401
          ? "가입 유효 시간이 만료되었습니다. 처음부터 다시 시도해주세요."
          : "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setError(msg);
      console.error("Signup error:", err);
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
};

export default DesktopEmailSignupDetailPage;
