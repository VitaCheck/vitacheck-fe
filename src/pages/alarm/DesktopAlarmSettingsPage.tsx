import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { FiSearch, FiType } from "react-icons/fi";

interface Alarm {
  notificationRoutineId: number;
  supplementId: number;
  supplementName: string;
  supplementImageUrl: string;
  daysOfWeek: string[];
  times: string[];
}

const DesktopAlarmSettingsPage = () => {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addBtnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const res = await axios.get("/api/v1/notifications/routines");
        setAlarms(res.data.result);
      } catch (error) {
        console.error("알람 리스트 불러오기 실패:", error);
      }
    };
    fetchAlarms();
  }, []);

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

  const toggleAlarm = (id: number) => {
    // TODO: 토글 API 연동
    console.log("토글할 알람 id:", id);
  };

  const formatTimes = (times: string[]) => {
    if (times.length <= 3) return times.join(" | ");
    return times.slice(0, 3).join(" | ") + " ...";
  };

  return (
    <div className="hidden md:flex flex-col min-h-screen px-[320px] py-[60px] bg-[#FAFAFA]">
      {/* 상단 고정 영역 (메뉴 포지셔닝을 위해 relative) */}
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
                // 직접 입력 플로우로 이동
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
            {alarms.map((alarm) => (
              <div
                key={alarm.notificationRoutineId}
                onClick={() =>
                  navigate(
                    `/alarm/settings/edit/${alarm.notificationRoutineId}`
                  )
                }
                className="flex justify-between items-center border-b border-gray-300 pb-6 cursor-pointer"
              >
                <div className="flex flex-col">
                  <div className="text-[35.57px] font-semibold">
                    {alarm.supplementName}
                  </div>
                  <div className="text-[35.57px] font-medium text-gray-500 mt-1">
                    {formatTimes(alarm.times)}
                  </div>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation(); // 토글 클릭 시 edit로 이동 막음
                    toggleAlarm(alarm.notificationRoutineId);
                  }}
                  className="w-12 h-7 flex items-center px-1 rounded-full cursor-pointer transition-colors bg-[#FCC000]"
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform translate-x-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopAlarmSettingsPage;
