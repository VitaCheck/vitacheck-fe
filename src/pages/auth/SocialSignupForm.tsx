import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { postSocialSignup } from "@/apis/auth";
import { saveTokens } from "@/lib/auth";
// 파일 상단에 추가
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

export default function SocialSignupForm() {
  const { state } = useLocation() as { state: LocationState };
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // 쿼리 기본값(안전망)
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

  // preset(state 우선 → query 보조)
  // const preset = useMemo(() => {
  //   const base = {
  //     email: fromQuery.email,
  //     fullNameFromState: fromQuery.fullName,
  //     provider: fromQuery.provider,
  //     providerId: fromQuery.providerId,
  //     next: fromQuery.next,
  //     gender: mapGender(fromQuery.gender),
  //     birthDate: toBirthDate(
  //       fromQuery.birthDate,
  //       fromQuery.birthyear,
  //       fromQuery.birthday
  //     ),
  //     phoneNumber: fromQuery.phoneNumber || fromQuery.mobile,
  //     nickname: fromQuery.nickname,
  //   };

  //   if (state && "socialTempToken" in state) {
  //     return {
  //       mode: "token" as const,
  //       socialTempToken: state.socialTempToken,
  //       next: state.next ?? base.next,
  //       email: base.email,
  //       fullNameFromState: base.fullNameFromState,
  //       provider: base.provider,
  //       providerId: base.providerId,
  //       gender: mapGender(state.gender) || base.gender,
  //       birthDate:
  //         toBirthDate(state.birthDate, state.birthyear, state.birthday) ||
  //         base.birthDate,
  //       phoneNumber: (state.phoneNumber || state.mobile) ?? base.phoneNumber,
  //       nickname: state.nickname ?? base.nickname,
  //     };
  //   }

  //   if (state && "provider" in state) {
  //     return {
  //       mode: "values" as const,
  //       provider: state.provider ?? base.provider,
  //       providerId: state.providerId ?? base.providerId,
  //       email: state.email ?? base.email,
  //       fullNameFromState: state.fullName ?? base.fullNameFromState,
  //       next: state.next ?? base.next,
  //       gender: mapGender(state.gender) || base.gender,
  //       birthDate:
  //         toBirthDate(
  //           state.birthDate,
  //           (state as any).birthyear,
  //           (state as any).birthday
  //         ) || base.birthDate,
  //       phoneNumber:
  //         (state.phoneNumber || (state as any).mobile) ?? base.phoneNumber,
  //       nickname: state.nickname ?? base.nickname,
  //     };
  //   }

  //   if (fromQuery.signupToken) {
  //     return {
  //       mode: "token" as const,
  //       socialTempToken: fromQuery.signupToken,
  //       next: base.next,
  //       email: base.email,
  //       fullNameFromState: base.fullNameFromState,
  //       provider: base.provider,
  //       providerId: base.providerId,
  //       gender: base.gender,
  //       birthDate: base.birthDate,
  //       phoneNumber: base.phoneNumber,
  //       nickname: base.nickname,
  //     };
  //   }

  //   return { mode: "values" as const, ...base };
  // }, [state, fromQuery]);

  // ✅ preset 작성 (state 우선 → query 보조 → token payload 최후 보조)
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

    // 공통: 토큰이 있으면 payload를 미리 파싱해서 보조로 쓴다
    const tempTokenFromState =
      state && "socialTempToken" in state ? state.socialTempToken : "";
    const tempTokenFromQuery = fromQuery.signupToken;
    const tokenToUse = tempTokenFromState || tempTokenFromQuery || "";
    const claims = tokenToUse ? decodeJwt(tokenToUse) : null;
    console.log("JWT Claims:", claims); // 🔍 여기에 추가

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

        // 우선순위: state 값 → query/base → token payload
        email: base.email || fromToken.email,
        fullNameFromState: base.fullNameFromState || fromToken.fullName,
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
        fullNameFromState:
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

        // query가 비어 있으면 token payload로 채움
        email: base.email || fromToken.email,
        fullNameFromState: base.fullNameFromState || fromToken.fullName,
        provider: base.provider || fromToken.provider,
        providerId: base.providerId || fromToken.providerId,

        gender: base.gender || fromToken.gender,
        birthDate: base.birthDate || fromToken.birthDate,
        phoneNumber: base.phoneNumber || fromToken.phoneNumber,
        nickname: base.nickname,
      };
    }

    // 완전 빈 경우
    return { mode: "values" as const, ...base };
  }, [state, fromQuery]);

  // 폼 상태
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    provider: "",
    providerId: "",
    nickname: "",
    gender: "" as "" | Gender,
    birthDate: "",
    phoneNumber: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      email: (preset as any).email ?? prev.email,
      fullName: (preset as any).fullNameFromState ?? prev.fullName,
      provider: (preset as any).provider ?? prev.provider,
      providerId: (preset as any).providerId ?? prev.providerId,
      gender: ((preset as any).gender as Gender | "") ?? prev.gender,
      birthDate: (preset as any).birthDate ?? prev.birthDate,
      phoneNumber: (preset as any).phoneNumber ?? prev.phoneNumber,
    }));
  }, [preset]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const body = {
        email: form.email,
        fullName: form.fullName,
        provider: form.provider,
        providerId: form.providerId,
        nickname: form.nickname.trim(),
        gender: (form.gender || "OTHER") as Gender,
        birthDate: form.birthDate,
        phoneNumber: form.phoneNumber,
      };

      const socialTempToken =
        (preset as any).mode === "token"
          ? (preset as any).socialTempToken
          : undefined;

      if (!(socialTempToken && socialTempToken.length > 0)) {
        alert(
          "임시 토큰이 만료되었거나 누락되었습니다. 다시 소셜 로그인 해주세요."
        );
        setSubmitting(false);
        return;
      }

      // 개발 중 디버깅에만 사용
      console.debug(
        "[signup] using temp token:",
        socialTempToken.slice(0, 12) + "..."
      );

      const res = await postSocialSignup(body, socialTempToken);

      const at =
        res.data?.result?.accessToken ||
        res.data?.accessToken ||
        res.headers?.authorization?.replace?.(/^Bearer\s+/i, "");
      const rt = res.data?.result?.refreshToken || res.data?.refreshToken || "";
      if (at) saveTokens?.(at, rt);

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

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-4 p-6">
      <h1 className="text-xl font-semibold">추가 정보 입력</h1>

      <div className="space-y-1">
        <label className="text-sm text-gray-600">이메일</label>
        <input
          name="email"
          value={form.email}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-50"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600">소셜 제공자</label>
        <input
          name="provider"
          value={form.provider}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-50"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600">Provider ID</label>
        <input
          name="providerId"
          value={form.providerId}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-50"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600">이름 (fullName)</label>
        <input
          name="fullName"
          value={form.fullName}
          readOnly
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600">닉네임</label>
        <input
          name="nickname"
          value={form.nickname}
          onChange={onChange}
          placeholder="별명"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600">생년월일</label>
        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          readOnly
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600">성별</label>
        <input
          name="gender"
          value={form.gender}
          readOnly
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600">전화번호</label>
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          readOnly
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full h-11 rounded bg-black text-white disabled:opacity-60"
      >
        {submitting ? "처리 중..." : "회원가입"}
      </button>
    </form>
  );
}
