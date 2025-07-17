import { useState } from "react";
import AlarmAddModal from "./AlarmAddModal";

interface Alarm {
  id: number;
  name: string;
  times: string[];
  enabled: boolean;
}

const AlarmSettingsPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: 1,
      name: "멀티비타민",
      times: ["09:30", "12:30", "18:30"],
      enabled: true,
    },
    {
      id: 2,
      name: "유산균",
      times: ["09:30", "12:30", "18:30", "21:30"],
      enabled: true,
    },
    {
      id: 3,
      name: "오메가3",
      times: ["09:30", "12:30"],
      enabled: true,
    },
  ]);

  const toggleAlarm = (id: number) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const formatTimes = (times: string[]) => {
    if (times.length <= 3) {
      return times.join(" | ");
    } else {
      return times.slice(0, 3).join(" | ") + " ...";
    }
  };

  return (
    <div className="min-h-screen px-4 py-5">
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[30px] font-bold">나의 영양제 관리</h1>
        <div className="flex gap-3 items-center">
          <img
            src="/images/add.png"
            alt="알림 추가"
            className="w-6 h-6"
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>

      {/* 알림 리스트 */}
      <div>
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className="flex justify-between items-center border-b border-gray-700 pb-4"
            style={{ height: "141px" }}
          >
            <div>
              <div className="text-[24px]">{alarm.name}</div>
              <div className="text-[24px] text-gray-400 mt-1">
                {formatTimes(alarm.times)}
              </div>
            </div>

            {/* 스위치 컴포넌트 */}
            <div
              onClick={() => toggleAlarm(alarm.id)}
              className={`w-12 h-7 flex items-center px-1 rounded-full cursor-pointer transition-colors ${
                alarm.enabled ? "bg-[#FFDB67]" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  alarm.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
      {showModal && <AlarmAddModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AlarmSettingsPage;
