// src/pages/auth/SocialSignupForm.tsx
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { postSocialSignup } from "@/apis/auth";
import { saveTokens } from "@/lib/auth";

/* ---------- 유틸 (이하 동일) ---------- */
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

function maskPhone010(input: string): string {
  let digits = (input || "").replace(/\D/g, "");
  digits = digits.slice(0, 11);

  if (!digits.startsWith("010")) {
    const tail8 = digits.slice(-8);
    digits = "010" + tail8;
  }

  const tail = digits.slice(3);
  const mid = tail.slice(0, 4);
  const end = tail.slice(4, 8);
  let out = "010";
  if (mid) out += `-${mid}`;
  if (end) out += `-${end}`;
  return out;
}

function genUserNick() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `유저${n}`;
}

/* ---------- 타입 (이하 동일) ---------- */
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

  // 쿼리 파싱 (동일)
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

  // preset 생성 (동일)
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

  const [form, setForm] = useState({
    email: "",
    nickname: "",
    phoneNumber: "",
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
      phoneNumber: maskPhone010((preset as any).phoneNumber ?? ""),
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

    if (!form.nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
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

      const body = {
        email: form.email,
        fullName: hiddenInfo.fullName,
        provider: hiddenInfo.provider,
        providerId: hiddenInfo.providerId,
        nickname: form.nickname.trim(),
        gender: (hiddenInfo.gender || "OTHER") as Gender,
        birthDate: hiddenInfo.birthDate,
        phoneNumber: form.phoneNumber.trim(),
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
      console.error("회원가입 API 에러:", err);

      if (err?.response?.status === 401) {
        alert("인증이 만료되었습니다. 다시 소셜 로그인 해주세요.");
      } else {
        const serverMessage = err?.response?.data?.message || JSON.stringify(err?.response?.data);
        const errorMessage = `회원가입에 실패했습니다.\n\n[서버 응답]\n${serverMessage}`;
        alert(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const regenNickname = () => setForm((f) => ({ ...f, nickname: genUserNick() }));

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-6 p-6">
      {/* ===== [수정된 부분] 디버깅 UI 추가 ===== */}
      <div style={{ border: '2px solid red', padding: '10px', fontSize: '12px', borderRadius: '8px' }}>
        <strong style={{ display: 'block', marginBottom: '4px' }}>[디버깅용 정보]</strong>
        <p style={{ wordBreak: 'break-all' }}>
          <strong>임시 토큰: </strong>
          {(preset as any).mode === "token" ? ((preset as any).socialTempToken || "토큰 없음") : "N/A (토큰 모드 아님)"}
        </p>
      </div>
      {/* ======================================= */}

      <h1 className="text-[22px] font-semibold">회원가입</h1>

      <div className="space-y-1">
        <label className="text-sm text-gray-600">이메일</label>
        <input
          name="email"
          value={form.email}
          readOnly
          className="w-full border-b border-gray-300 px-3 py-3 bg-transparent text-[#2B2B2B]"
        />
      </div>

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

      <div className="space-y-1">
        <label className="text-sm text-gray-600">전화번호</label>
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={onChange}
          inputMode="tel"
          maxLength={13}
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
