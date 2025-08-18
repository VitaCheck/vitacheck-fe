// 타입 정의
// types/alarm.ts
export type DayOfWeek = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

export interface Schedule {
  dayOfWeek: DayOfWeek;
  time: string; // "HH:mm"
}

export interface Supplement {
  notificationRoutineId: number;
  supplementId?: number;
  supplementName: string;
  supplementImageUrl?: string;
  // ✅ 더 안전하게: DayOfWeek로 명확히 타이핑
  daysOfWeek: DayOfWeek[];
  times: string[];
  isTaken: boolean;
  schedules?: Schedule[];
}
