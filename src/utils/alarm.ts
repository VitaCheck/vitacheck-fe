import type { Supplement, Schedule } from "../types/alarm";

// ===== 최소 디버그 유틸 =====
const DEBUG_ALARM = true;
export const dbg = (...args: any[]) => {
  if (DEBUG_ALARM) {
    console.log("%c[ALARM]", "color:#7c3aed;font-weight:bold", ...args);
  }
};

// 시간 포맷 보정
export const fixTime = (t?: string) => (t ? t.slice(0, 5) : "");

// 시간 배열을 보기 좋게 변환
export const formatTimes = (times?: string[]) => {
  const arr = Array.isArray(times) ? times.map(fixTime).filter(Boolean) : [];
  return arr.length
    ? arr.length <= 3
      ? arr.join(" | ")
      : arr.slice(0, 3).join(" | ") + " ..."
    : "—";
};

// YYYY-MM-DD 포맷
export const fmtYmd = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// BE 응답 → Supplement 타입으로 정규화
export const normalizeSupplement = (raw: any): Supplement => {
  const id = Number(raw?.notificationRoutineId ?? raw?.id ?? 0);
  const supplementId =
    raw?.supplementId != null ? Number(raw.supplementId) : undefined;
  const name = String(raw?.supplementName ?? raw?.name ?? "알 수 없음");
  const imageUrl = raw?.supplementImageUrl ?? raw?.imageUrl ?? undefined;

  let isTaken = false;
  if (typeof raw?.isTaken === "boolean") isTaken = raw.isTaken;
  else if (typeof raw?.taken === "boolean") isTaken = raw.taken;

  let times: string[] | undefined = Array.isArray(raw?.times)
    ? raw.times.filter(Boolean).map(fixTime)
    : undefined;
  let daysOfWeek: string[] | undefined = Array.isArray(raw?.daysOfWeek)
    ? raw.daysOfWeek.filter(Boolean)
    : undefined;
  const schedules: Schedule[] | undefined = Array.isArray(raw?.schedules)
    ? raw.schedules
    : undefined;

  if ((!times || !times.length) && Array.isArray(schedules)) {
    times = Array.from(
      new Set(schedules.map((s) => fixTime((s as any)?.time)).filter(Boolean))
    );
  }
  if ((!daysOfWeek || !daysOfWeek.length) && Array.isArray(schedules)) {
    daysOfWeek = Array.from(
      new Set(schedules.map((s) => (s as any)?.dayOfWeek).filter(Boolean))
    );
  }

  return {
    notificationRoutineId: id,
    supplementId,
    supplementName: name,
    supplementImageUrl: imageUrl,
    times: times ?? [],
    daysOfWeek: daysOfWeek ?? [],
    isTaken,
    schedules,
  };
};
