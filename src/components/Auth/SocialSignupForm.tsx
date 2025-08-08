import { useState } from "react";
import { postSocialSignup } from "../../apis/auth";

export default function SocialSignupForm() {
  const [form, setForm] = useState({
    email: "silverk0527@gmail.com",
    nickname: "",
    birth: "",
    gender: "",
    phoneNumber: "",
  });

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAgreementChange = (key: keyof typeof agreements) => {
    const updated = { ...agreements, [key]: !agreements[key] };
    setAgreements(updated);
    setAgreeAll(Object.values(updated).every(Boolean));
  };

  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreements({
      service: newValue,
      privacy: newValue,
      marketing: newValue,
    });
  };

  const handleSubmit = async () => {
    if (!agreements.service || !agreements.privacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    try {
      await postSocialSignup(form);
      alert("회원가입 완료!");
    } catch (error) {
      alert("회원가입 실패");
    }
  };

  return (
    <div className="p-6 space-y-6 text-sm">
      <h2 className="text-base font-semibold">회원가입</h2>

      {/* 이메일 (표시만) */}
      <div className="space-y-1">
        <label className="text-sm font-medium">이메일</label>
        <input
          type="email"
          value={form.email}
          disabled
          className="w-full border-b p-2 bg-gray-50 text-gray-500"
        />
      </div>

      {/* 닉네임 */}
      <div className="space-y-1">
        <label className="text-sm font-medium">닉네임</label>
        <div className="relative flex items-center">
          <input
            name="nickname"
            placeholder="2~12자의 닉네임을 입력해주세요."
            value={form.nickname}
            onChange={handleChange}
            className="w-full border-b p-2 pr-24 focus:outline-none"
          />
          <button
            type="button"
            className="absolute right-0 text-xs text-gray-500 border px-2 py-1 rounded-md"
          >
            자동생성
          </button>
        </div>
      </div>

      {/* 약관 동의 */}
      <div className="space-y-2 pt-2">
        {/* 전체 동의 */}
        <label className="flex items-center font-semibold">
          <input
            type="checkbox"
            checked={agreeAll}
            onChange={handleAgreeAll}
            className="mr-2 accent-yellow-400"
          />
          전체 동의
        </label>

        {/* 개별 동의 */}
        <div className="pl-6 space-y-1 text-sm">
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={agreements.service}
                onChange={() => handleAgreementChange("service")}
                className="mr-2 accent-yellow-400"
              />
              서비스 이용약관 동의 (필수)
            </label>
            <button className="text-yellow-500 text-xs">보기</button>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={agreements.privacy}
                onChange={() => handleAgreementChange("privacy")}
                className="mr-2 accent-yellow-400"
              />
              개인정보 수집 및 이용 동의 (필수)
            </label>
            <button className="text-yellow-500 text-xs">보기</button>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={agreements.marketing}
                onChange={() => handleAgreementChange("marketing")}
                className="mr-2 accent-yellow-400"
              />
              마케팅 이용 동의 (선택)
            </label>
            <button className="text-yellow-500 text-xs">보기</button>
          </div>
        </div>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!(agreements.service && agreements.privacy)}
        className={`w-full py-3 rounded mt-4 text-sm font-semibold ${
          agreements.service && agreements.privacy
            ? "bg-yellow-300 text-black"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        다음
      </button>
    </div>
  );
}
