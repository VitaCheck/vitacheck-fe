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
  isEnabled?: boolean; // ✅ 토글 상태
}

// ==== props ====
interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

// ==== 헬퍼 ====
const pad2 = (n?: number) =>
  typeof n === "number" ? String(n).padStart(2, "0") : undefined;

const formatTimeObject = (t?: { hour?: number; minute?: number }) => {
  const hh = pad2(t?.hour);
  const mm = pad2(t?.minute);
  return hh && mm ? `${hh}:${mm}` : undefined;
};

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

// API 응답 정규화
const normalizeAlarm = (raw: any): Alarm => {
  const fromSchedules =
    Array.isArray(raw?.schedules) && raw.schedules.length > 0;

  const timesFromSchedules: string[] = fromSchedules
    ? raw.schedules
        .map((s: any) =>
          typeof s?.time === "string"
            ? fixTime(s.time)
            : formatTimeObject(s?.time)
        )
        .filter(Boolean)
    : [];

  const times: string[] = Array.isArray(raw?.times)
    ? raw.times.filter(Boolean).map(fixTime)
    : timesFromSchedules;

  const daysOfWeek: string[] = Array.isArray(raw?.daysOfWeek)
    ? raw.daysOfWeek
    : fromSchedules
      ? raw.schedules.map((s: Schedule) => s.dayOfWeek)
      : [];

  // enabled 매핑
  const isEnabled =
    typeof raw?.enabled === "boolean"
      ? raw.enabled
      : typeof raw?.isEnabled === "boolean"
        ? raw.isEnabled
        : typeof raw?.status === "string"
          ? raw.status === "ACTIVE"
          : undefined;

  return {
    notificationRoutineId: Number(raw.notificationRoutineId),
    supplementId: Number(raw.supplementId ?? 0),
    supplementName: String(raw.supplementName ?? raw?.name ?? ""),
    supplementImageUrl: raw?.supplementImageUrl ?? raw?.imageUrl,
    daysOfWeek,
    times: Array.from(new Set(times)).sort(),
    schedules: fromSchedules
      ? raw.schedules.map((s: any) => ({
          dayOfWeek: s.dayOfWeek as DayOfWeek,
          time:
            typeof s?.time === "string"
              ? fixTime(s.time)
              : (formatTimeObject(s?.time) ?? ""),
        }))
      : undefined,
    isEnabled,
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
    ? alarm.schedules.map((s) => s.time).filter(Boolean)
    : alarm.times;

  return Array.from(new Set(times)).sort(); // "HH:mm" 포맷이면 문자열 정렬로 시간 순서 유지
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
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set()); // ✅ 토글 중인 항목 잠금

  // 재조회
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

  // ✅ 토글 API 연동 (낙관적 업데이트)
  const toggleAlarm = async (id: number) => {
    if (togglingIds.has(id)) return;

    const before =
      alarms.find((a) => a.notificationRoutineId === id)?.isEnabled ?? false;
    const optimistic = !before;

    // 낙관적 업데이트
    setAlarms((prev) =>
      prev.map((a) =>
        a.notificationRoutineId === id ? { ...a, isEnabled: optimistic } : a
      )
    );
    setTogglingIds((prev) => new Set(prev).add(id));

    try {
      const res = await axios.patch(
        `/api/v1/notifications/routines/${id}/toggle`
      );
      const enabled = res?.data?.result?.enabled;
      if (typeof enabled === "boolean") {
        // 서버값 확정
        setAlarms((prev) =>
          prev.map((a) =>
            a.notificationRoutineId === id ? { ...a, isEnabled: enabled } : a
          )
        );
      } else {
        // 드문 케이스: 응답에 enabled 없으면 재조회
        await fetchAlarms();
      }
    } catch (e) {
      console.error("알림 토글 실패:", e);
      // 롤백
      setAlarms((prev) =>
        prev.map((a) =>
          a.notificationRoutineId === id ? { ...a, isEnabled: before } : a
        )
      );
      alert("알림 ON/OFF 변경에 실패했습니다.");
    } finally {
      setTogglingIds((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
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
          const on = alarm.isEnabled === true;
          const busy = togglingIds.has(alarm.notificationRoutineId);

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

                {/* 요일 */}
                <div className="text-[16px] text-gray-400 mt-1">{daysLine}</div>

                {/* 시간 */}
                <div className="text-[18px] text-gray-600 mt-1">
                  {timesLine}
                </div>
              </div>

              {/* ✅ 토글 */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAlarm(alarm.notificationRoutineId);
                }}
                className={[
                  "w-12 h-7 flex items-center px-1 rounded-full cursor-pointer transition-colors",
                  busy ? "opacity-60 pointer-events-none" : "",
                  on ? "bg-[#FFDB67]" : "bg-gray-300",
                ].join(" ")}
                role="switch"
                aria-checked={!!on}
                aria-label={on ? "알림 끄기" : "알림 켜기"}
              >
                <div
                  className={[
                    "w-5 h-5 rounded-full bg-white shadow-md transform transition-transform",
                    on ? "translate-x-5" : "translate-x-0",
                  ].join(" ")}
                />
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
            await fetchAlarms();
            setShowManualModal(false);
          }}
        />
      )}

      {/* 편집 모달 */}
      {editId !== null && (
        <AlarmEditModal
          id={editId}
          onClose={() => setEditId(null)}
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
