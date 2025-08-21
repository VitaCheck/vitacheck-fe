import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AlarmAddModal from "./AlarmAddModal";
import AlarmEditModal from "./AlarmEditModal";
import AddOptionsModal from "./AddOptionsModal";
import axios from "@/lib/axios";

// ✅ 공용 타입/유틸
import type { DayOfWeek, Schedule, Supplement } from "@/types/alarm";
import { normalizeSupplement, EN_TO_KO, formatTimes } from "@/utils/alarm";

// ==== 확장 타입 (isEnabled만 추가)
type Alarm = Supplement & { isEnabled?: boolean };

// ==== props ====
interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const normalizeAlarm = (raw: any): Alarm => {
  const base = normalizeSupplement(raw);
  const isEnabled =
    typeof raw?.enabled === "boolean"
      ? raw.enabled
      : typeof raw?.isEnabled === "boolean"
        ? raw.isEnabled
        : typeof raw?.status === "string"
          ? raw.status.toUpperCase() === "ACTIVE"
          : // ✅ 값이 없으면 'false'로 강제하지 않고 undefined 유지
            undefined;

  return { ...base, isEnabled };
};

// ==== UI 포맷터
const formatDaysLine = (days: DayOfWeek[]) =>
  days.length ? days.map((d) => EN_TO_KO[d]).join(" ") : "-";

const MobileAlarmSettingsPage = ({ showModal, setShowModal }: Props) => {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  // ✅ 로그인 체크용 (중복 alert 방지)
  const alertedRef = useRef(false);
  const safeAlert = (msg: string) => {
    if (alertedRef.current) return;
    alertedRef.current = true;
    alert(msg);
  };

  const getToken = () => {
    const raw =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("ACCESS_TOKEN") ||
      localStorage.getItem("token") ||
      "";
    const val = raw.trim();
    if (!val || val === "null" || val === "undefined") return "";
    return val;
  };

  // ✅ 로그인 가드
  useEffect(() => {
    const token = getToken();
    if (!token) {
      safeAlert("로그인이 필요합니다.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // 재조회
  const fetchAlarms = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/notifications/routines");
      const rawList = res?.data?.result ?? [];
      const normalized: Alarm[] = Array.isArray(rawList)
        ? rawList.map(normalizeAlarm)
        : [];
      setAlarms(normalized);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        safeAlert("세션이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login", { replace: true });
        return;
      }
      console.error("알람 목록 불러오기 실패:", error);
      setAlarms([]);
    }
  }, [navigate]);

  useEffect(() => {
    if (getToken()) {
      fetchAlarms();
    }
  }, [fetchAlarms]);

  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  const toggleAlarm = async (id: number) => {
    if (togglingIds.has(id)) return;

    const before =
      alarms.find((a) => a.notificationRoutineId === id)?.isEnabled ?? false;
    const optimistic = !before;

    setAlarms((prev) =>
      prev.map((a) =>
        a.notificationRoutineId === id ? { ...a, isEnabled: optimistic } : a
      )
    );
    setTogglingIds((prev) => new Set(prev).add(id));

    try {
      // PATCH 바디가 필요한 서버도 있으니 {}를 명시 (빈 바디로 인한 415 회피)
      const res = await axios.patch(
        `/api/v1/notifications/routines/${id}/toggle`,
        {}
      );
      console.log("[toggle] status:", res.status, res.data);

      const enabled = pickEnabled(res?.data);
      console.log("[toggle] parsed enabled:", enabled);

      if (typeof enabled === "boolean") {
        // ✅ 서버가 명확히 알려주면 그 값으로 고정
        setAlarms((prev) =>
          prev.map((a) =>
            a.notificationRoutineId === id ? { ...a, isEnabled: enabled } : a
          )
        );
      } else {
        // ✅ 서버가 즉시 값을 안 주는 케이스: 즉시 재조회로 롤백 느낌 주지 않도록 아주 짧게 지연 후 재조회
        setTimeout(fetchAlarms, 250);
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

  // 응답에서 enabled 값을 최대치로 끌어오는 유틸
  const pickEnabled = (data: any): boolean | undefined => {
    const r = data?.result ?? data;
    const v =
      r?.enabled ??
      r?.isEnabled ??
      (typeof r?.status === "string"
        ? r.status.toUpperCase?.() === "ACTIVE"
        : undefined) ??
      data?.enabled ??
      (typeof data?.status === "string"
        ? data.status.toUpperCase?.() === "ACTIVE"
        : undefined);

    return typeof v === "boolean" ? v : undefined;
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

          // ✅ days: normalize에서 이미 고정/정렬/유니크 보장
          const daysLine = formatDaysLine(alarm.daysOfWeek);
          // ✅ times: normalize에서 유니크/정렬, 표시만 formatTimes 사용
          const timesLine = formatTimes(alarm.times);

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
