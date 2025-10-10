import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import TermsAgreement from "@/components/terms/TermsAgreement";

/* ---------- 유틸 ---------- */
type JwtPayload = Record<string, any>;
function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

type Gender = "MALE" | "FEMALE" | "OTHER";
const mapGender = (g?: string | null): Gender | "" => {
  if (!g) return "";
  const up = g.toUpperCase();
  if (up === "MALE" || up === "FEMALE" || up === "OTHER") return up as Gender;
  if (up === "M") return "MALE";
  if (up === "F") return "FEMALE";
  return "";
};

const toBirthDate = (
  birthDate?: string | null,
  birthyear?: string | null,
  birthday?: string | null
) => {
  if (birthDate && /^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return birthDate;
  if (birthyear && birthday && /^\d{2}-\d{2}$/.test(birthday))
    return `${birthyear}-${birthday}`;
  return "";
};

function genUserNick() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `유저${n}`;
}

/* ---------- 타입 ---------- */
type StateByValues = {
  provider: string;
  providerId: string;
  email: string;
  fullName?: string;
  next?: string;
  gender?: string;
  birthDate?: string;
  birthyear?: string;
  birthday?: string;
  mobile?: string;
  phoneNumber?: string;
  nickname?: string;
};
type StateByTempToken = {
  socialTempToken: string;
  next?: string;
  gender?: string;
  birthDate?: string;
  birthyear?: string;
  birthday?: string;
  mobile?: string;
  phoneNumber?: string;
  nickname?: string;
};
type LocationState = StateByValues | StateByTempToken | undefined;

/* ---------- 컴포넌트 ---------- */
export default function SocialSignupForm() {
  const { state } = useLocation() as { state: LocationState };
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [agrees, setAgrees] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

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

  // 쿼리 파싱
  const fromQuery = useMemo(
    () => ({
      email: params.get("email") || "",
      fullName: params.get("fullName") || "",
      provider: params.get("provider") || "",
      providerId: params.get("providerId") || "",
      next: params.get("next") || "",
      birthyear: params.get("birthyear") || "",
      birthday: params.get("birthday") || "",
      mobile: params.get("mobile") || "",
      birthDate: params.get("birthDate") || "",
      phoneNumber: params.get("phoneNumber") || "",
      gender: params.get("gender") || "",
      nickname: params.get("nickname") || "",
      signupToken:
        params.get("signupToken") ||
        params.get("socialTempToken") ||
        params.get("tempToken") ||
        "",
    }),
    [params]
  );

  // preset 생성
  const preset = useMemo(() => {
    const base = {
      email: fromQuery.email,
      fullNameFromState: fromQuery.fullName,
      provider: fromQuery.provider,
      providerId: fromQuery.providerId,
      next: fromQuery.next,
      gender: mapGender(fromQuery.gender),
      birthDate: toBirthDate(
        fromQuery.birthDate,
        fromQuery.birthyear,
        fromQuery.birthday
      ),
      // phoneNumber는 상세 페이지에서 받으므로 여기선 사용하지 않음
      nickname: fromQuery.nickname,
    };

    const tempTokenFromState =
      state && "socialTempToken" in state ? state.socialTempToken : "";
    const tempTokenFromQuery = fromQuery.signupToken;
    const tokenToUse = tempTokenFromState || tempTokenFromQuery || "";
    const claims = tokenToUse ? decodeJwt(tokenToUse) : null;

    const fromToken = {
      email: (claims?.email ?? claims?.user_email ?? "") as string,
      fullName: (claims?.name ?? claims?.fullName ?? "") as string,
      provider: (claims?.provider ?? claims?.iss ?? "") as string,
      providerId: (claims?.providerId ?? claims?.sub ?? "") as string,
      gender: mapGender(claims?.gender),
      birthDate: (claims?.birthDate as string) || "",
      phoneNumber: (claims?.phoneNumber as string) || "",
    };

    if (state && "socialTempToken" in state) {
      return {
        mode: "token" as const,
        socialTempToken: state.socialTempToken,
        next: state.next ?? base.next,
        email: base.email || fromToken.email,
        fullName: base.fullNameFromState || fromToken.fullName,
        provider: base.provider || fromToken.provider,
        providerId: base.providerId || fromToken.providerId,
        gender: mapGender(state.gender) || base.gender || fromToken.gender,
        birthDate:
          toBirthDate(state.birthDate, state.birthyear, state.birthday) ||
          base.birthDate ||
          fromToken.birthDate,
        nickname: state.nickname ?? base.nickname,
      };
    }

    if (state && "provider" in state) {
      return {
        mode: "values" as const,
        provider: state.provider ?? (base.provider || fromToken.provider),
        providerId:
          state.providerId ?? (base.providerId || fromToken.providerId),
        email: state.email ?? (base.email || fromToken.email),
        fullName:
          state.fullName ?? (base.fullNameFromState || fromToken.fullName),
        next: state.next ?? base.next,
        gender: mapGender(state.gender) || base.gender || fromToken.gender,
        birthDate:
          toBirthDate(
            state.birthDate,
            (state as any).birthyear,
            (state as any).birthday
          ) ||
          base.birthDate ||
          fromToken.birthDate,
        nickname: state.nickname ?? base.nickname,
      };
    }

    if (fromQuery.signupToken) {
      return {
        mode: "token" as const,
        socialTempToken: fromQuery.signupToken,
        next: base.next,
        email: base.email || fromToken.email,
        fullName: base.fullNameFromState || fromToken.fullName,
        provider: base.provider || fromToken.provider,
        providerId: base.providerId || fromToken.providerId,
        gender: base.gender || fromToken.gender,
        birthDate: base.birthDate || fromToken.birthDate,
        nickname: base.nickname,
      };
    }

    return {
      mode: "values" as const,
      ...base,
      fullName: base.fullNameFromState,
    };
  }, [state, fromQuery]);

  // 폼 상태: 전화번호 제거
  const [form, setForm] = useState({
    email: "",
    nickname: "",
  });

  const [hiddenInfo, setHiddenInfo] = useState({
    fullName: "",
    provider: "",
    providerId: "",
    gender: "" as "" | Gender,
    birthDate: "",
  });

  useEffect(() => {
    setForm({
      email: (preset as any).email ?? "",
      nickname: genUserNick(),
    });
    setHiddenInfo({
      fullName: (preset as any).fullName ?? "",
      provider: (preset as any).provider ?? "",
      providerId: (preset as any).providerId ?? "",
      gender: ((preset as any).gender as Gender | "") ?? "",
      birthDate: (preset as any).birthDate ?? "",
    });
  }, [preset]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    if (!hiddenInfo.fullName || !hiddenInfo.fullName.trim()) {
      alert("이름 정보가 누락되었습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    const socialTempToken =
      (preset as any).mode === "token"
        ? (preset as any).socialTempToken
        : undefined;

    if (!(socialTempToken && socialTempToken.length > 0)) {
      alert(
        "임시 토큰이 만료되었거나 누락되었습니다. 다시 소셜 로그인 해주세요."
      );
      return;
    }

    const next = (preset as any).next;
    const signupData = {
      flow: "social",
      socialTempToken,
      email: form.email,
      nickname: form.nickname.trim(),
      fullName: hiddenInfo.fullName,
      provider: hiddenInfo.provider,
      providerId: hiddenInfo.providerId,
      presetGender: hiddenInfo.gender || "",
      presetBirthDate: hiddenInfo.birthDate || "",
      agreeToMarketing: !!agrees.marketing,
      next: typeof next === "string" ? next : "/",
    };

    sessionStorage.setItem("signupData", JSON.stringify(signupData));
    navigate("/social-signup/details", { replace: true });
  };

  const regenNickname = () =>
    setForm((f) => ({ ...f, nickname: genUserNick() }));

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[420px] mx-auto px-5 py-6 min-h-[90vh]"
    >
      <h1 className="text-[24px] font-semibold">회원가입</h1>
      <div className="mt-8 space-y-8">
        {/* 이메일 */}
        <div className="space-y-2">
          <label className="block mb-2 text-[18px] font-semibold">이메일</label>
          <input
            name="email"
            value={form.email}
            readOnly
            className="ml-[12px] w-full border-0 border-b border-[#D9D9D9] bg-transparent py-3 text-[16px] text-[#6B6B6B] placeholder-[#AAAAAA] outline-none focus:border-[#202020]"
          />
        </div>

        {/* 닉네임 + 자동생성 */}
        <div className="space-y-2">
          <label className="block mb-2 text-[18px] font-semibold">
            <span className="flex items-center justify-between">
              닉네임
              <button
                type="button"
                onClick={regenNickname}
                className="shrink-0 rounded-[8px] border border-[#D9D9D9] px-2.5 py-1 text-[12px] text-[#6B6B6B] hover:bg-[#FAFAFA] active:bg-[#F3F3F3]"
              >
                자동생성
              </button>
            </span>
          </label>
          <input
            name="nickname"
            value={form.nickname}
            onChange={onChange}
            placeholder="예: 유저1234"
            required
            className="ml-[12px] w-full border-0 border-b border-[#D9D9D9] bg-transparent py-3 text-[16px] text-[#6B6B6B] placeholder-[#AAAAAA] outline-none focus:border-[#202020]"
          />
        </div>
      </div>
      <br /> <br />
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

        <TermsAgreement
          agrees={{
            terms: agrees.terms,
            privacy: agrees.privacy,
            marketing: agrees.marketing,
          }}
          handleCheckboxChange={(key) => handleCheckboxChange(key)}
        />
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}
      {/* CTA 버튼 */}
      <button
        type="submit"
        disabled={submitting || !agrees.terms || !agrees.privacy}
        className="mt-12 w-full h-[68px] rounded-[16px] bg-[#FFE88D] text-[20px] font-semibold text-black shadow-[0_2px_0_rgba(0,0,0,0.05)] active:scale-[0.98] transition disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        다음
      </button>
    </form>
  );
}
