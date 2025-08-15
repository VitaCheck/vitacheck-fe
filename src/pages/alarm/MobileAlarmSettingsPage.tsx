import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AlarmAddModal from "./AlarmAddModal";
import AlarmEditModal from "./AlarmEditModal";
import AddOptionsModal from "./AddOptionsModal";
import axios from "@/lib/axios";

// ==== 타입 ====
type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

interface Schedule {
  dayOfWeek: DayOfWeek;
  time: string; // "HH:mm"
}

interface Alarm {
  notificationRoutineId: number;
  supplementId: number;
  supplementName: string;
  supplementImageUrl?: string;
  daysOfWeek: string[];
  times: string[];
  schedules?: Schedule[];
}

// ==== props ====
interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

// ==== 헬퍼 ====
const fixTime = (t?: string) => (t ? t.slice(0, 5) : "");

const DAY_LABEL: Record<DayOfWeek, string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

// API 응답 정규화 (이전 그대로)
const normalizeAlarm = (raw: any): Alarm => {
  const fromSchedules =
    Array.isArray(raw?.schedules) && raw.schedules.length > 0;

  const times: string[] = Array.isArray(raw?.times)
    ? raw.times.filter(Boolean).map(fixTime)
    : fromSchedules
      ? raw.schedules.map((s: Schedule) => fixTime(s.time)).filter(Boolean)
      : [];

  const daysOfWeek: string[] = Array.isArray(raw?.daysOfWeek)
    ? raw.daysOfWeek
    : fromSchedules
      ? raw.schedules.map((s: Schedule) => s.dayOfWeek)
      : [];

  return {
    notificationRoutineId: Number(raw.notificationRoutineId),
    supplementId: Number(raw.supplementId ?? 0),
    supplementName: String(raw.supplementName ?? ""),
    supplementImageUrl: raw.supplementImageUrl,
    daysOfWeek,
    times,
    schedules: raw.schedules,
  };
};

// 알람의 전체 요일 집합(표시용)
const getDaysForAlarm = (alarm: Alarm): DayOfWeek[] => {
  const days: DayOfWeek[] = alarm.schedules?.length
    ? (alarm.schedules.map((s) => s.dayOfWeek).filter(Boolean) as DayOfWeek[])
    : (alarm.daysOfWeek as DayOfWeek[]);

  const order: DayOfWeek[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const uniq = Array.from(new Set(days));
  return order.filter((d) => uniq.includes(d));
};

// 고유 시간 목록(중복 제거 + 정렬)
const getUniqueTimes = (alarm: Alarm): string[] => {
  const times = alarm.schedules?.length
    ? alarm.schedules.map((s) => fixTime(s.time)).filter(Boolean)
    : alarm.times;

  const uniq = Array.from(new Set(times));
  return uniq.sort(); // "HH:mm" 포맷이면 문자열 정렬로 시간 순서 유지
};

// UI 출력용 포맷터
const formatDaysLine = (days: DayOfWeek[]) =>
  days.length ? days.map((d) => DAY_LABEL[d]).join(" ") : "-";

const formatTimesLine = (times: string[]) => {
  if (times.length === 0) return "-";
  if (times.length <= 3) return times.join(" | ");
  return times.slice(0, 3).join(" | ") + " ...";
};

const MobileAlarmSettingsPage = ({ showModal, setShowModal }: Props) => {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  // ✅ 재조회 함수 분리
  const fetchAlarms = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/notifications/routines");
      const rawList = res?.data?.result ?? [];
      const normalized: Alarm[] = Array.isArray(rawList)
        ? rawList.map(normalizeAlarm)
        : [];
      setAlarms(normalized);
    } catch (error) {
      console.error("알람 목록 불러오기 실패:", error);
      setAlarms([]);
    }
  }, []);

  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  const toggleAlarm = (id: number) => {
    console.log("토글할 알람 ID:", id);
    // TODO: POST /api/v1/notifications/records/{notificationRoutineId}/toggle
  };

  return (
    <div className="min-h-screen px-4 py-5 md:hidden">
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[30px] font-bold">나의 영양제 관리</h1>
        <img
          src="/images/add.png"
          alt="알림 추가"
          className="w-6 h-6"
          onClick={() => setShowModal(true)}
        />
      </div>

      {/* 알림 리스트 */}
      <div className="space-y-6">
        {alarms.map((alarm) => {
          const daysLine = formatDaysLine(getDaysForAlarm(alarm));
          const timesLine = formatTimesLine(getUniqueTimes(alarm));

          return (
            <div
              key={alarm.notificationRoutineId}
              className="flex justify-between items-center border-b border-gray-300 pb-4"
              style={{ height: "141px" }}
              onClick={() => setEditId(alarm.notificationRoutineId)}
            >
              <div>
                <div className="text-[20px] font-semibold">
                  {alarm.supplementName || "이름 없음"}
                </div>

                {/* ✅ 요일 표시 (시간 위) */}
                <div className="text-[16px] text-gray-400 mt-1">{daysLine}</div>

                {/* ✅ 중복 제거된 시간 표시 */}
                <div className="text-[18px] text-gray-600 mt-1">
                  {timesLine}
                </div>
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAlarm(alarm.notificationRoutineId);
                }}
                className="w-12 h-7 flex items-center px-1 rounded-full cursor-pointer transition-colors bg-[#FFDB67]"
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform translate-x-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ➕ 옵션 모달 */}
      {showModal && (
        <AddOptionsModal
          onClose={() => setShowModal(false)}
          onSearch={() => {
            setShowModal(false);
            navigate("/search");
          }}
          onManual={() => {
            setShowModal(false);
            setShowManualModal(true);
          }}
        />
      )}

      {/* 직접 입력 모달 */}
      {showManualModal && (
        <AlarmAddModal
          onClose={() => setShowManualModal(false)}
          onCreated={async () => {
            await fetchAlarms(); // 부모에 있는 재조회 함수
            setShowManualModal(false);
          }}
        />
      )}

      {/* 편집 모달 */}
      {editId !== null && (
        <AlarmEditModal
          id={editId}
          onClose={() => setEditId(null)}
          // ✅ 저장 성공 시 바로 목록 재조회
          onSaved={async () => {
            await fetchAlarms();
            setEditId(null);
          }}
        />
      )}
    </div>
  );
};

export default MobileAlarmSettingsPage;
