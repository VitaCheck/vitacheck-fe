import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { postSocialSignup } from "@/apis/auth";
import { saveTokens } from "@/lib/auth";

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
  // 1) 이미 YYYY-MM-DD라면 그대로
  if (birthDate && /^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return birthDate;
  // 2) birthyear + birthday(MM-DD) 조합
  if (birthyear && birthday && /^\d{2}-\d{2}$/.test(birthday)) {
    return `${birthyear}-${birthday}`;
  }
  return "";
};

type StateByValues = {
  provider: string;
  providerId: string;
  email: string;
  fullName?: string;
  next?: string;

  // 원본 키가 state로 올 수도 있음
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

  // 토큰 플로우라도 미리 받은 값이 있을 수 있음
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

  // ✅ 쿼리에서 값 추출 (네이버 원본 키와 우리 스펙 키 둘 다 대응)
  const fromQuery = useMemo(
    () => ({
      email: params.get("email") || "",
      fullName: params.get("fullName") || "",
      provider: params.get("provider") || "",
      providerId: params.get("providerId") || "",
      next: params.get("next") || "",

      // 네이버 원본 키
      birthyear: params.get("birthyear") || "",
      birthday: params.get("birthday") || "",
      mobile: params.get("mobile") || "",

      // 우리 스펙 키로 오는 경우도 대비
      birthDate: params.get("birthDate") || "",
      phoneNumber: params.get("phoneNumber") || "",
      gender: params.get("gender") || "", // M/F 또는 MALE/FEMALE/OTHER
      nickname: params.get("nickname") || "",
    }),
    [params]
  );

  // ✅ preset 만들기: state 우선, 없으면 쿼리 사용
  const preset = useMemo(() => {
    const base = {
      email: fromQuery.email,
      fullNameFromState: fromQuery.fullName,
      provider: fromQuery.provider,
      providerId: fromQuery.providerId,
      next: fromQuery.next,
      // 가공
      gender: mapGender(fromQuery.gender),
      birthDate: toBirthDate(
        fromQuery.birthDate,
        fromQuery.birthyear,
        fromQuery.birthday
      ),
      phoneNumber: fromQuery.phoneNumber || fromQuery.mobile,
      nickname: fromQuery.nickname,
    };

    if (state && "socialTempToken" in state) {
      return {
        mode: "token" as const,
        socialTempToken: state.socialTempToken,
        next: state.next ?? base.next,

        email: base.email,
        fullNameFromState: base.fullNameFromState,
        provider: base.provider,
        providerId: base.providerId,

        gender: mapGender(state.gender) || base.gender,
        birthDate:
          toBirthDate(state.birthDate, state.birthyear, state.birthday) ||
          base.birthDate,
        phoneNumber: (state.phoneNumber || state.mobile) ?? base.phoneNumber,
        nickname: state.nickname ?? base.nickname,
      };
    }

    if (state && "provider" in state) {
      return {
        mode: "values" as const,
        provider: state.provider ?? base.provider,
        providerId: state.providerId ?? base.providerId,
        email: state.email ?? base.email,
        fullNameFromState: state.fullName ?? base.fullNameFromState,
        next: state.next ?? base.next,

        gender: mapGender(state.gender) || base.gender,
        birthDate:
          toBirthDate(
            state.birthDate,
            (state as any).birthyear,
            (state as any).birthday
          ) || base.birthDate,
        phoneNumber:
          (state.phoneNumber || (state as any).mobile) ?? base.phoneNumber,
        nickname: state.nickname ?? base.nickname,
      };
    }

    return { mode: "values" as const, ...base };
  }, [state, fromQuery]);

  // ✅ form 상태 (닉네임만 사용자가 입력)
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
      // nickname은 사용자 입력 필드
    }));
  }, [preset]);

  // 디버깅 로그 (지금 보이는 값 확인)
  // useEffect(() => {
  //   console.table({
  //     email: form.email,
  //     fullName: form.fullName,
  //     provider: form.provider,
  //     providerId: form.providerId,
  //     gender: form.gender,
  //     birthDate: form.birthDate,
  //     phoneNumber: form.phoneNumber,
  //     nickname: form.nickname,
  //   });
  // }, [form]);

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
      // ✅ 제미나이 추가: preset 객체에서 토큰을 가져옵니다.
      const socialTempToken =
        preset.mode === "token" ? preset.socialTempToken : undefined;

      console.log("🚀 before post"); // onSubmit 호출 확인용
      console.log("✅ API로 전달하려는 토큰 값:", socialTempToken);
      console.log("✅ 현재 preset 객체의 내용:", preset);

      // const res = await postSocialSignup(body);
      const res = await postSocialSignup(body, socialTempToken);
      console.log("✅ signup res.status:", res.status);
      console.log("✅ signup res.data:", res.data);
      console.log("✅ signup headers:", res.headers);

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
      if (err?.response) {
        console.log("❌ signup error status:", err.response.status);
        console.log("❌ signup error data:", err.response.data);
        console.log("❌ signup error headers:", err.response.headers);
      } else {
        console.log("❌ signup error (no response):", err);
      }
      console.error(err);
      alert("회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-4 p-6">
      <h1 className="text-xl font-semibold">추가 정보 입력</h1>

      {/* 읽기 전용 표시 */}
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

      {/* 닉네임만 입력 */}
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

      {/* 생년월일 */}
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

      {/* 성별 */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">성별</label>
        <input
          name="gender"
          value={form.gender}
          readOnly
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* 전화번호 */}
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
