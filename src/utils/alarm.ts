import type { Supplement, Schedule, DayOfWeek } from "@/types/alarm";

// ===== 최소 디버그 유틸 =====
const DEBUG_ALARM = true;
export const dbg = (...args: any[]) => {
  if (DEBUG_ALARM) {
    console.log("%c[ALARM]", "color:#7c3aed;font-weight:bold", ...args);
  }
};

// ===== Day & 매핑/정렬 =====
export const DAY_ORDER: DayOfWeek[] = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

export const EN_TO_KO: Record<DayOfWeek, string> = {
  SUN: "일",
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
};

export const KO_TO_EN: Record<string, DayOfWeek> = {
  일: "SUN",
  월: "MON",
  화: "TUE",
  수: "WED",
  목: "THU",
  금: "FRI",
  토: "SAT",
};

export const isDayOfWeek = (v: any): v is DayOfWeek =>
  typeof v === "string" &&
  (DAY_ORDER as readonly string[]).includes(v.toUpperCase());

// 정렬 헬퍼
export const sortDays = (arr: DayOfWeek[]) =>
  [...arr].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));

// ===== 공용 유틸 =====
export const unique = <T>(arr: T[]) => Array.from(new Set(arr));

// "HH:mm" 포맷 보정 (HH:mm 또는 HH:mm:ss 허용, 유효 범위 클램프)
export const fixTime = (t?: string) => {
  if (!t) return "";
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return "";
  const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
  const mm = Math.min(59, Math.max(0, parseInt(m[2], 10)));
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

// 오전/오후 표시용
export const formatTime = (time: string) => {
  const [hStr, mm = "00"] = fixTime(time).split(":");
  const h = parseInt(hStr || "0", 10);
  const isPM = h >= 12;
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${isPM ? "오후" : "오전"} ${String(display).padStart(2, "0")}:${mm}`;
};

// 시간 배열을 보기 좋게 변환
export const formatTimes = (times?: string[]) => {
  const arr = Array.isArray(times) ? times.map(fixTime).filter(Boolean) : [];
  return arr.length
    ? arr.length <= 3
      ? arr.join(" | ")
      : arr.slice(0, 3).join(" | ") + " ..."
    : "—";
};

// YYYY-MM-DD
export const fmtYmd = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// days x times → schedules
export const toSchedules = (days: DayOfWeek[], times: string[]): Schedule[] =>
  days.flatMap((d) => times.map((t) => ({ dayOfWeek: d, time: fixTime(t) })));

// ===== BE 응답 → Supplement 정규화 =====
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

  let daysOfWeek: DayOfWeek[] | undefined = Array.isArray(raw?.daysOfWeek)
    ? raw.daysOfWeek
        .filter(Boolean)
        .map((d: string) => d.toUpperCase())
        .filter(isDayOfWeek)
    : undefined;

  const schedules: Schedule[] | undefined = Array.isArray(raw?.schedules)
    ? raw.schedules
        .map((s: any) => ({
          dayOfWeek: String(s?.dayOfWeek || "").toUpperCase(),
          time: fixTime(s?.time),
        }))
        .filter((s: any): s is Schedule => isDayOfWeek(s.dayOfWeek) && !!s.time)
    : undefined;

  if ((!times || !times.length) && schedules) {
    times = unique(schedules.map((s) => s.time)).sort();
  }
  if ((!daysOfWeek || !daysOfWeek.length) && schedules) {
    daysOfWeek = sortDays(unique(schedules.map((s) => s.dayOfWeek)));
  } else if (daysOfWeek) {
    daysOfWeek = sortDays(unique(daysOfWeek));
  }

  return {
    notificationRoutineId: id,
    supplementId,
    supplementName: name,
    supplementImageUrl: imageUrl,
    times: unique(times ?? []).sort(),
    daysOfWeek: daysOfWeek ?? [],
    isTaken,
    schedules,
  };
};
