// // FILE: src/pages/auth/SocialSignupForm.tsx
// import { useLocation, useNavigate } from "react-router-dom";
// import { useMemo, useState } from "react";
// import { postSocialSignup } from "@/apis/auth";
// import { saveTokens } from "@/lib/auth";

// type StateByValues = {
//   provider: string;
//   providerId: string;
//   email: string;
//   fullName?: string;
//   next?: string;
// };

// type StateByTempToken = {
//   socialTempToken: string;
//   next?: string;
// };

// type LocationState = StateByValues | StateByTempToken | undefined;

// export default function SocialSignupForm() {
//   const { state } = useLocation() as { state: LocationState };
//   const navigate = useNavigate();

//   // 콜백에서 받은 값들 정리
//   const preset = useMemo(() => {
//     if (!state) return {};
//     if ("socialTempToken" in state) {
//       return {
//         mode: "token" as const,
//         socialTempToken: state.socialTempToken,
//         next: state.next,
//       };
//     }
//     return {
//       mode: "values" as const,
//       provider: state.provider,
//       providerId: state.providerId,
//       email: state.email,
//       fullNameFromState: state.fullName ?? "",
//       next: state.next,
//     };
//   }, [state]);

//   const [form, setForm] = useState({
//     // 백엔드 스펙에 맞춤
//     email: (preset as any).email ?? "",
//     fullName: (preset as any).fullNameFromState ?? "",
//     provider: (preset as any).provider ?? "",
//     providerId: (preset as any).providerId ?? "",
//     nickname: "",
//     gender: "MALE" as "MALE" | "FEMALE" | "OTHER",
//     birthDate: "", // YYYY-MM-DD
//     phoneNumber: "",
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const onChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (submitting) return;
//     setSubmitting(true);

//     try {
//       // payload 구성 (임시토큰 플로우 vs 값 직접 전달)
//       let payload: any = {
//         nickname: form.nickname,
//         gender: form.gender,
//         birthDate: form.birthDate,
//         phoneNumber: form.phoneNumber,
//       };

//       if ((preset as any).mode === "token") {
//         payload.socialTempToken = (preset as any).socialTempToken;
//         // 👉 백엔드가 socialTempToken만 받아도 되는 설계면 이것만 보내면 됨.
//         // 만약 백엔드가 여기서도 email/provider 등을 요구하면 필요에 따라 병합.
//       } else {
//         // 값 직접 전달 방식
//         payload = {
//           ...payload,
//           email: form.email,
//           fullName: form.fullName, // 반드시 포함
//           provider: form.provider,
//           providerId: form.providerId,
//         };
//       }

//       const res = await postSocialSignup(payload);
//       // 응답 형태 예: { isSuccess, result: { accessToken, refreshToken } }
//       const at =
//         res?.result?.accessToken ||
//         res?.data?.accessToken ||
//         res?.headers?.authorization?.replace?.(/^Bearer\s+/i, "");
//       const rt = res?.result?.refreshToken || res?.data?.refreshToken || "";

//       if (at) {
//         // 팀 공통 유틸로 저장
//         saveTokens?.(at, rt);
//       }

//       const next = (preset as any).next;
//       const safeNext =
//         typeof next === "string" && next.startsWith("/") ? next : "/";
//       navigate(safeNext, { replace: true });
//     } catch (err) {
//       console.error(err);
//       alert("회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-4 p-6">
//       <h1 className="text-xl font-semibold">추가 정보 입력</h1>

//       {/* 값 직접 전달 방식이면 읽기 전용으로 보여주기 */}
//       {preset && (preset as any).mode === "values" && (
//         <>
//           <div className="space-y-1">
//             <label className="text-sm text-gray-600">이메일</label>
//             <input
//               name="email"
//               value={form.email}
//               readOnly
//               className="w-full border rounded px-3 py-2 bg-gray-50"
//             />
//           </div>

//           <div className="space-y-1">
//             <label className="text-sm text-gray-600">소셜 제공자</label>
//             <input
//               name="provider"
//               value={form.provider}
//               readOnly
//               className="w-full border rounded px-3 py-2 bg-gray-50"
//             />
//           </div>

//           <div className="space-y-1">
//             <label className="text-sm text-gray-600">Provider ID</label>
//             <input
//               name="providerId"
//               value={form.providerId}
//               readOnly
//               className="w-full border rounded px-3 py-2 bg-gray-50"
//             />
//           </div>
//         </>
//       )}

//       {/* fullName이 콜백에서 안 온 경우 입력 받기 */}
//       <div className="space-y-1">
//         <label className="text-sm text-gray-600">이름 (fullName)</label>
//         <input
//           name="fullName"
//           value={form.fullName}
//           onChange={onChange}
//           placeholder="홍길동"
//           className="w-full border rounded px-3 py-2"
//           required
//         />
//       </div>

//       <div className="space-y-1">
//         <label className="text-sm text-gray-600">닉네임</label>
//         <input
//           name="nickname"
//           value={form.nickname}
//           onChange={onChange}
//           placeholder="별명"
//           className="w-full border rounded px-3 py-2"
//           required
//         />
//       </div>

//       <div className="space-y-1">
//         <label className="text-sm text-gray-600">생년월일</label>
//         <input
//           type="date"
//           name="birthDate"
//           value={form.birthDate}
//           onChange={onChange}
//           className="w-full border rounded px-3 py-2"
//           required
//         />
//       </div>

//       <div className="space-y-1">
//         <label className="text-sm text-gray-600">성별</label>
//         <select
//           name="gender"
//           value={form.gender}
//           onChange={onChange}
//           className="w-full border rounded px-3 py-2"
//           required
//         >
//           <option value="MALE">남성</option>
//           <option value="FEMALE">여성</option>
//           <option value="OTHER">기타/선택안함</option>
//         </select>
//       </div>

//       <div className="space-y-1">
//         <label className="text-sm text-gray-600">전화번호</label>
//         <input
//           name="phoneNumber"
//           value={form.phoneNumber}
//           onChange={onChange}
//           placeholder="010-1234-5678"
//           className="w-full border rounded px-3 py-2"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={submitting}
//         className="w-full h-11 rounded bg-black text-white disabled:opacity-60"
//       >
//         {submitting ? "처리 중..." : "회원가입"}
//       </button>
//     </form>
//   );
// }
// FILE: src/pages/auth/SocialSignupForm.tsx
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { postSocialSignup } from "@/apis/auth";
import { saveTokens } from "@/lib/auth";

type StateByValues = {
  provider: string;
  providerId: string;
  email: string;
  fullName?: string;
  next?: string;
};

type StateByTempToken = {
  socialTempToken: string;
  next?: string;
};

type LocationState = StateByValues | StateByTempToken | undefined;

export default function SocialSignupForm() {
  const { state } = useLocation() as { state: LocationState };
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // ✅ 쿼리 파라미터에서 값 추출 (신규 유저는 백엔드가 쿼리로 전달)
  const fromQuery = useMemo(
    () => ({
      email: params.get("email") || "",
      fullName: params.get("fullName") || "",
      provider: params.get("provider") || "",
      providerId: params.get("providerId") || "",
      next: params.get("next") || "",
    }),
    [params]
  );

  // ✅ 콜백에서 받은 값 정리: state 우선, 없으면 쿼리 사용
  const preset = useMemo(() => {
    if (state && "socialTempToken" in state) {
      return {
        mode: "token" as const,
        socialTempToken: state.socialTempToken,
        next: state.next,
      };
    }
    if (state && "provider" in state) {
      return {
        mode: "values" as const,
        provider: state.provider,
        providerId: state.providerId,
        email: state.email,
        fullNameFromState: state.fullName ?? "",
        next: state.next,
      };
    }
    // ▶️ state가 없으면 쿼리 파라미터로 values 채움
    return {
      mode: "values" as const,
      provider: fromQuery.provider,
      providerId: fromQuery.providerId,
      email: fromQuery.email,
      fullNameFromState: fromQuery.fullName,
      next: fromQuery.next,
    };
  }, [state, fromQuery]);

  const [form, setForm] = useState({
    // 백엔드 스펙에 맞춤
    email: (preset as any).email ?? "",
    fullName: (preset as any).fullNameFromState ?? "",
    provider: (preset as any).provider ?? "",
    providerId: (preset as any).providerId ?? "",
    nickname: "",
    gender: "MALE" as "MALE" | "FEMALE" | "OTHER",
    birthDate: "", // YYYY-MM-DD
    phoneNumber: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      // payload 구성 (임시토큰 플로우 vs 값 직접 전달)
      let payload: any = {
        nickname: form.nickname,
        gender: form.gender,
        birthDate: form.birthDate,
        phoneNumber: form.phoneNumber,
      };

      if ((preset as any).mode === "token") {
        payload.socialTempToken = (preset as any).socialTempToken;
      } else {
        payload = {
          ...payload,
          email: form.email,
          fullName: form.fullName, // 반드시 포함
          provider: form.provider,
          providerId: form.providerId,
        };
      }

      const res = await postSocialSignup(payload);

      // 응답 위치 방어적으로 처리
      const at =
        res?.result?.accessToken ||
        res?.data?.accessToken ||
        res?.headers?.authorization?.replace?.(/^Bearer\s+/i, "");
      const rt = res?.result?.refreshToken || res?.data?.refreshToken || "";

      if (at) saveTokens?.(at, rt);

      const next = (preset as any).next;
      const safeNext =
        typeof next === "string" && next.startsWith("/") ? next : "/";
      navigate(safeNext, { replace: true });
    } catch (err) {
      console.error(err);
      alert("회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-4 p-6">
      <h1 className="text-xl font-semibold">추가 정보 입력</h1>

      {/* 값 직접 전달/쿼리 방식이면 읽기 전용으로 보여주기 */}
      {(preset as any).mode === "values" && (
        <>
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
        </>
      )}

      {/* fullName이 콜백/쿼리에서 안 온 경우 입력 받기 (항상 수정 가능) */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">이름 (fullName)</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          placeholder="홍길동"
          className="w-full border rounded px-3 py-2"
          required
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
          onChange={onChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600">성별</label>
        <select
          name="gender"
          value={form.gender}
          onChange={onChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
          <option value="OTHER">기타/선택안함</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600">전화번호</label>
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={onChange}
          placeholder="010-1234-5678"
          className="w-full border rounded px-3 py-2"
          required
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
