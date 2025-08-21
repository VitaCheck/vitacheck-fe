// import api from "@/lib/axios";

// export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

// export interface RoutineSchedule {
//   dayOfWeek: DayOfWeek;
//   time: { hour: number; minute: number; second: number; nano: number };
// }

// export interface NotificationRoutine {
//   notificationRoutineId: number;
//   isCustom: boolean;
//   supplementId: number;
//   supplementName: string;
//   supplementImageUrl: string;
//   schedules: RoutineSchedule[];
//   enabled: boolean;
//   taken: boolean;
// }

// export async function getRoutinesByDate(
//   date: string
// ): Promise<NotificationRoutine[]> {
//   // date 형식: "YYYY-MM-DD"
//   const res = await api.get<{
//     isSuccess: boolean;
//     code: string;
//     message: string;
//     result: NotificationRoutine[];
//   }>("/api/v1/notifications/routines", { params: { date } });
//   return res.data.result ?? [];
// }



// src/apis/notifications.ts
import api from "@/lib/axios";

export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

// 백엔드가 "09:30" 문자열 또는 {hour, minute, ...} 객체 둘 다 줄 수 있으므로 유니온
export type RoutineTime =
  | string
  | { hour: number; minute: number; second?: number; nano?: number };

export interface RoutineSchedule {
  dayOfWeek: DayOfWeek;
  time: RoutineTime;
}

export interface NotificationRoutine {
  notificationRoutineId: number;
  isCustom: boolean;
  supplementId: number | null; // null 대응
  supplementName: string;
  supplementImageUrl: string;
  schedules: RoutineSchedule[];
  enabled: boolean;
  taken: boolean;
}

export async function getRoutinesByDate(
  date: string
): Promise<NotificationRoutine[]> {
  const res = await api.get<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: NotificationRoutine[];
  }>("/api/v1/notifications/routines", { params: { date } });
  return res.data.result ?? [];
}
