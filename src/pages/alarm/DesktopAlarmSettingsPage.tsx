import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { FiSearch, FiType } from "react-icons/fi";

// ==== 타입 ====
type DayOfWeek = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
interface Schedule {
  dayOfWeek: DayOfWeek;
  time: string; // 정규화 후 항상 "HH:mm"
}
interface Alarm {
  notificationRoutineId: number;
  supplementId: number;
  supplementName: string;
  supplementImageUrl?: string;
  daysOfWeek?: string[];
  times?: string[];
  schedules?: Schedule[];
  isEnabled?: boolean; // 서버 enabled/isEnabled/status를 통일
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

// 서버 응답 한 항목을 안전하게 정규화
const normalizeAlarm = (raw: any): Alarm => {
  const id = Number(raw?.notificationRoutineId ?? raw?.id ?? 0);

  const timesFromSchedules: string[] = Array.isArray(raw?.schedules)
    ? raw.schedules
        .map((s: any) => {
          const time = s?.time;
          if (!time) return undefined;
          if (typeof time === "string") return fixTime(time); // "HH:mm"
          // 객체 {hour, minute, ...}
          return formatTimeObject(time);
        })
        .filter((v: any): v is string => typeof v === "string")
    : [];

  const daysFromSchedules: string[] = Array.isArray(raw?.schedules)
    ? raw.schedules.map((s: any) => s?.dayOfWeek).filter(Boolean)
    : [];

  const times: string[] = Array.isArray(raw?.times)
    ? raw.times.filter(Boolean).map(fixTime)
    : timesFromSchedules;

  const daysOfWeek: string[] = Array.isArray(raw?.daysOfWeek)
    ? raw.daysOfWeek.filter(Boolean)
    : daysFromSchedules;

  // enabled 매핑
  let isEnabled: boolean | undefined = undefined;
  if (typeof raw?.isEnabled === "boolean") isEnabled = raw.isEnabled;
  else if (typeof raw?.enabled === "boolean") isEnabled = raw.enabled;
  else if (typeof raw?.status === "string") isEnabled = raw.status === "ACTIVE";

  return {
    notificationRoutineId: id,
    supplementId: Number(raw?.supplementId ?? 0),
    supplementName: String(raw?.supplementName ?? raw?.name ?? "알 수 없음"),
    supplementImageUrl: raw?.supplementImageUrl ?? raw?.imageUrl ?? undefined,
    times,
    daysOfWeek,
    schedules: Array.isArray(raw?.schedules)
      ? raw.schedules
          .filter((s: any) => s?.dayOfWeek)
          .map((s: any) => ({
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

const formatTimes = (times?: string[]) => {
  const arr = Array.isArray(times) ? times : [];
  if (arr.length === 0) return "—";
  if (arr.length <= 3) return arr.join(" | ");
  return arr.slice(0, 3).join(" | ") + " ...";
};

// ==== 컴포넌트 ====
const DesktopAlarmSettingsPage = () => {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  const addBtnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // 최근 토글 보호(외부 재조회가 옛값으로 덮어쓰는 걸 방지)
  const lastPatchedRef = useRef<Map<number, number>>(new Map());
  const RECENT_MS = 2000; // 2초 보호

  // 목록 재조회
  const fetchAlarms = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/notifications/routines");
      const listRaw: any[] = Array.isArray(res?.data?.result)
        ? res.data.result
        : Array.isArray(res?.data)
          ? res.data
          : [];
      const list = listRaw.map(normalizeAlarm);

      // 최근 토글 보호 + 서버 enabled 미제공 시 이전값 보존
      setAlarms((prev) => {
        const now = Date.now();
        const prevMap = new Map<number, Alarm>(
          prev.map((a) => [a.notificationRoutineId, a])
        );
        return list.map((nextItem) => {
          const prevItem = prevMap.get(nextItem.notificationRoutineId);
          const lastAt = lastPatchedRef.current.get(
            nextItem.notificationRoutineId
          );
          const isProtected =
            typeof lastAt === "number" && now - lastAt < RECENT_MS;

          const resolvedEnabled = isProtected
            ? prevItem?.isEnabled // 보호 중이면 이전값 유지
            : typeof nextItem.isEnabled === "boolean"
              ? nextItem.isEnabled // 서버가 명시하면 서버값
              : prevItem?.isEnabled; // 서버가 안 주면 이전값

          return { ...nextItem, isEnabled: resolvedEnabled };
        });
      });
    } catch (error) {
      console.error("알람 리스트 불러오기 실패:", error);
      setAlarms([]);
    }
  }, []);

  // mount 시 1회 로드
  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  // 메뉴 바깥 클릭 / Esc 닫기
  useEffect(() => {
    if (!showAddMenu) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        addBtnRef.current &&
        !addBtnRef.current.contains(t)
      ) {
        setShowAddMenu(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAddMenu(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [showAddMenu]);

  // 설정 스위치 토글(활성/비활성) — 서버 응답의 enabled를 신뢰하고 확정, 재조회는 기본적으로 하지 않음
  const toggleEnabled = async (id: number) => {
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
      const r = res?.data?.result ?? {};
      const serverEnabled =
        typeof r.enabled === "boolean"
          ? r.enabled
          : typeof r.isEnabled === "boolean"
            ? r.isEnabled
            : undefined;

      // 최근 토글시각 기록 → fetchAlarms가 보호 로직 적용
      lastPatchedRef.current.set(id, Date.now());

      if (typeof serverEnabled === "boolean") {
        // 서버값으로 확정
        setAlarms((prev) =>
          prev.map((a) =>
            a.notificationRoutineId === id
              ? { ...a, isEnabled: serverEnabled }
              : a
          )
        );
      } else {
        // 드문 경우: 응답에 enabled가 없으면 재조회
        await fetchAlarms();
      }
    } catch (e) {
      console.error("알림 활성/비활성 토글 실패:", e);
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
    <div className="hidden md:flex flex-col min-h-screen px-[320px] py-[60px] bg-[#FAFAFA]">
      {/* 상단 고정 영역 */}
      <div className="relative w-full flex justify-between items-center mb-10 mx-auto">
        <h1 className="text-[52px] font-bold">나의 영양제 관리</h1>

        <button
          ref={addBtnRef}
          onClick={() => setShowAddMenu((v) => !v)}
          className="flex items-center gap-2 bg-[#FFEB9D] text-[25px] font-semibold rounded-full px-6 py-3"
          aria-haspopup="menu"
          aria-expanded={showAddMenu}
        >
          알림 추가
        </button>

        {/* 알림 추가 메뉴 */}
        {showAddMenu && (
          <div
            ref={menuRef}
            role="menu"
            className="absolute right-0 top-[72px] w-[466px] h-[310px] rounded-2xl shadow-xl bg-white border border-gray-100 p-4 z-50"
          >
            <div className="px-2 py-1 text-[22px] text-black font-medium">
              영양제 추가하기
            </div>

            <button
              role="menuitem"
              onClick={() => {
                setShowAddMenu(false);
                requestAnimationFrame(() => {
                  window.dispatchEvent(new CustomEvent("focus-global-search"));
                });
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition"
            >
              <span className="inline-flex items-center justify-center w-[70px] h-[70px] rounded-full bg-gray-100">
                <FiSearch className="text-xl w-[48px] h-[48px]" />
              </span>
              <div className="text-left">
                <div className="text-[20px] font-semibold">제품 검색하기</div>
                <div className="text-[16px] text-[#6B6B6B]">
                  맨 위 검색창에서 영양제를 검색 해보세요.
                </div>
              </div>
            </button>

            <button
              role="menuitem"
              onClick={() => {
                setShowAddMenu(false);
                navigate("/alarm/settings/add?mode=manual");
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition"
            >
              <span className="inline-flex items-center justify-center w-[70px] h-[70px] rounded-full bg-gray-100">
                <FiType className="text-xl w-[48px] h-[48px]" />
              </span>
              <div className="text-[16px] font-semibold">직접 입력하기</div>
            </button>
          </div>
        )}
      </div>

      {/* 알람 리스트 */}
      <div className="flex w-full justify-center">
        <div className="w-full max-w-[720px] mx-auto">
          <div className="space-y-6 w-full">
            {alarms.map((alarm) => {
              const on = alarm.isEnabled === true; // undefined면 회색(off)
              const busy = togglingIds.has(alarm.notificationRoutineId);

              return (
                <div
                  key={alarm.notificationRoutineId}
                  onClick={() =>
                    navigate(
                      `/alarm/settings/edit/${alarm.notificationRoutineId}`
                    )
                  }
                  className="flex justify-between items-center border-b border-gray-300 pb-6 cursor-pointer"
                >
                  {/* 왼쪽: 이름/시간 */}
                  <div className="flex flex-col">
                    <div className="text-[35.57px] font-semibold">
                      {alarm.supplementName}
                    </div>
                    <div className="text-[35.57px] font-medium text-gray-500 mt-1">
                      {formatTimes(alarm.times)}
                    </div>
                  </div>

                  {/* 오른쪽: ON/OFF 토글 */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEnabled(alarm.notificationRoutineId);
                    }}
                    className={[
                      "w-12 h-7 flex items-center px-1 rounded-full cursor-pointer transition-colors",
                      busy ? "opacity-60 pointer-events-none" : "",
                      on ? "bg-[#FCC000]" : "bg-gray-300",
                    ].join(" ")}
                    aria-label={on ? "알림 끄기" : "알림 켜기"}
                    role="switch"
                    aria-checked={!!on}
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

            {alarms.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                등록된 알림이 없습니다. 상단의 <b>알림 추가</b>로 시작해보세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopAlarmSettingsPage;
