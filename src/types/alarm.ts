// 타입 정의
// types/alarm.ts
export type DayOfWeek = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

export interface Schedule {
  dayOfWeek: DayOfWeek;
  time: string; // "HH:mm" 형식
}

export interface Supplement {
  notificationRoutineId: number;
  supplementId?: number;
  supplementName: string;
  supplementImageUrl?: string;
  daysOfWeek: string[];
  times: string[];
  isTaken: boolean;
  schedules?: Schedule[];
}
