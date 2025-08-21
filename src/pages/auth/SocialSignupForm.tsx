// src/pages/auth/SocialSignupForm.tsx
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { postSocialSignup } from "@/apis/auth";
import { saveTokens } from "@/lib/auth";

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

/** 010-0000-0000 마스킹 고정 */
function maskPhone010(input: string): string {
  // 숫자만
  let digits = (input || "").replace(/\D/g, "");
  // 최대 11자리까지만
  digits = digits.slice(0, 11);

  // 접두사는 무조건 010
  if (!digits.startsWith("010")) {
    // 뒤 8자리만 보존
    const tail8 = digits.slice(-8);
    digits = "010" + tail8;
  }

  const tail = digits.slice(3); // 나머지 8자리
  const mid = tail.slice(0, 4);
  const end = tail.slice(4, 8);
  let out = "010";
  if (mid) out += `-${mid}`;
  if (end) out += `-${end}`;
  return out;
}

/** 유저 + 4자리 랜덤 */
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

  // preset 생성(네이버/토큰 값)
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
      phoneNumber: fromQuery.phoneNumber || fromQuery.mobile,
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
        phoneNumber:
          (state.phoneNumber || state.mobile) ??
          (base.phoneNumber || fromToken.phoneNumber),
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
        phoneNumber:
          (state.phoneNumber || (state as any).mobile) ??
          (base.phoneNumber || fromToken.phoneNumber),
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
        phoneNumber: base.phoneNumber || fromToken.phoneNumber,
        nickname: base.nickname,
      };
    }

    return { mode: "values" as const, ...base, fullName: base.fullNameFromState };
  }, [state, fromQuery]);

  /* ---- 화면노출 폼: 이메일(readonly), 닉네임/전화번호 입력 ---- */
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    phoneNumber: "",
  });

  /* ---- 숨김값: 서버전송용 (수정 불가) ---- */
  const [hiddenInfo, setHiddenInfo] = useState({
    fullName: "",
    provider: "",
    providerId: "",
    gender: "" as "" | Gender,
    birthDate: "",
  });

  useEffect(() => {
    // 기본 세팅
    setForm({
      email: (preset as any).email ?? "",
      // 닉네임은 요청대로 "유저XXXX"로 자동 생성
      nickname: genUserNick(),
      // 전화번호는 010-0000-0000 형식으로 마스킹하여 초기값 세팅(없으면 010-)
      phoneNumber: maskPhone010((preset as any).phoneNumber ?? ""),
    });
    setHiddenInfo({
      fullName: (preset as any).fullName ?? "",
      provider: (preset as any).provider ?? "",
      providerId: (preset as any).providerId ?? "",
      gender: ((preset as any).gender as Gender | "") ?? "",
      birthDate: (preset as any).birthDate ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => {
      if (name === "phoneNumber") {
        return { ...f, phoneNumber: maskPhone010(value) };
      }
      return { ...f, [name]: value };
    });
  };

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // 유효성
    if (!form.nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    // 010-0000-0000 정확 길이 13
    if (form.phoneNumber.length !== 13) {
      alert("전화번호를 010-0000-0000 형식으로 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const socialTempToken =
        (preset as any).mode === "token"
          ? (preset as any).socialTempToken
          : undefined;

      if (!(socialTempToken && socialTempToken.length > 0)) {
        alert("임시 토큰이 만료되었거나 누락되었습니다. 다시 소셜 로그인 해주세요.");
        setSubmitting(false);
        return;
      }

      // 서버로 넘길 전체 데이터(네이버 값 + 사용자가 입력한 값)
      const body = {
        email: form.email,
        fullName: hiddenInfo.fullName,
        provider: hiddenInfo.provider,
        providerId: hiddenInfo.providerId,
        nickname: form.nickname.trim(),                 // 유저 + 4자리
        gender: (hiddenInfo.gender || "OTHER") as Gender,
        birthDate: hiddenInfo.birthDate,
        phoneNumber: form.phoneNumber.trim(),           // 010-0000-0000 형식
      };

      const result = await postSocialSignup(body, socialTempToken);

      const at = result?.result?.accessToken ?? result?.accessToken ?? "";
      const rt = result?.result?.refreshToken ?? result?.refreshToken ?? "";
      if (at) saveTokens(at, rt);

      const next = (preset as any).next;
      navigate(typeof next === "string" && next.startsWith("/") ? next : "/", {
        replace: true,
      });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        alert("인증이 만료되었습니다. 다시 소셜 로그인 해주세요.");
      } else {
        alert("회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 닉네임 재생성 버튼
  const regenNickname = () => setForm((f) => ({ ...f, nickname: genUserNick() }));

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-6 p-6">
      <h1 className="text-[22px] font-semibold">회원가입</h1>

      {/* 이메일 (읽기전용) */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">이메일</label>
        <input
          name="email"
          value={form.email}
          readOnly
          className="w-full border-b border-gray-300 px-3 py-3 bg-transparent text-[#2B2B2B]"
        />
      </div>

      {/* 닉네임 */}
      <div className="space-y-2">
        <label className="text-sm text-gray-600 flex items-center justify-between">
          <span>닉네임</span>
          <button
            type="button"
            onClick={regenNickname}
            className="border px-2 py-1 text-xs rounded hover:bg-gray-50"
          >
            자동생성
          </button>
        </label>
        <input
          name="nickname"
          value={form.nickname}
          onChange={onChange}
          placeholder="예: 유저1234"
          className="w-full border-b border-gray-300 px-3 py-3"
          required
        />
      </div>

      {/* 전화번호 */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">전화번호</label>
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={onChange}
          inputMode="tel"
          maxLength={13}                         // 010-0000-0000
          placeholder="010-0000-0000"
          className="w-full border-b border-gray-300 px-3 py-3"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full h-[56px] rounded bg-[#FFE88D] text-black font-semibold disabled:opacity-60"
      >
        {submitting ? "처리 중..." : "다음"}
      </button>
    </form>
  );
}
