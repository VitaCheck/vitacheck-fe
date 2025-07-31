import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";

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
      {/* 상단 고정 영역 */}
      <div className="w-full flex justify-between items-center mb-10 max-w-[720px] mx-auto">
        <h1 className="text-[52px] font-bold">나의 영양제 관리</h1>
        <button
          onClick={() => navigate("/alarm/settings/add")}
          className="flex items-center gap-2 bg-[#FFEB9D] text-[25px] font-semibold rounded-full px-6 py-3"
        >
          알림 추가
        </button>
      </div>

      {/* 알람 리스트 */}
      <div className="flex w-full justify-center">
        <div className="w-full max-w-[720px] mx-auto">
          <div className="space-y-6 w-full">
            {alarms.map((alarm) => (
              <div
                key={alarm.notificationRoutineId}
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
                    e.stopPropagation();
                    toggleAlarm(alarm.notificationRoutineId);
                  }}
                  className={`w-12 h-7 flex items-center px-1 rounded-full cursor-pointer transition-colors bg-[#FCC000]`}
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
