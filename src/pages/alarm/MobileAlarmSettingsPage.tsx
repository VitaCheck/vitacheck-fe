// /alarm /settings
import { useEffect, useState } from "react";
import AlarmAddModal from "./AlarmAddModal";
import axios from "@/lib/axios";

interface Alarm {
  notificationRoutineId: number;
  supplementId: number;
  supplementName: string;
  supplementImageUrl: string;
  daysOfWeek: string[];
  times: string[];
}

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const MobileAlarmSettingsPage = ({ showModal, setShowModal }: Props) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const res = await axios.get("/api/v1/notifications/routines");
        setAlarms(res.data.result);
      } catch (error) {
        console.error("알람 목록 불러오기 실패:", error);
      }
    };
    fetchAlarms();
  }, []);

  const toggleAlarm = (id: number) => {
    // TODO: 토글 API 연동
    console.log("토글할 알람 ID:", id);
  };

  const formatTimes = (times: string[]) => {
    if (times.length <= 3) return times.join(" | ");
    return times.slice(0, 3).join(" | ") + " ...";
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
        {alarms.map((alarm) => (
          <div
            key={alarm.notificationRoutineId}
            className="flex justify-between items-center border-b border-gray-300 pb-4"
            style={{ height: "141px" }}
          >
            <div>
              <div className="text-[20px] font-semibold">
                {alarm.supplementName}
              </div>
              <div className="text-[18px] text-gray-500 mt-1">
                {formatTimes(alarm.times)}
              </div>
            </div>
            <div
              onClick={() => toggleAlarm(alarm.notificationRoutineId)}
              className={`w-12 h-7 flex items-center px-1 rounded-full cursor-pointer transition-colors bg-[#FFDB67]`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform translate-x-5" />
            </div>
          </div>
        ))}
      </div>

      {showModal && <AlarmAddModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default MobileAlarmSettingsPage;
