import type { Alarm } from "./AlarmSettingsPage";
import AlarmAddModal from "./AlarmAddModal";

interface Props {
  alarms: Alarm[];
  toggleAlarm: (id: number) => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const MobileAlarmSettingsPage = ({
  alarms,
  toggleAlarm,
  showModal,
  setShowModal,
}: Props) => {
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
            key={alarm.id}
            className="flex justify-between items-center border-b border-gray-300 pb-4"
            style={{ height: "141px" }}
          >
            <div>
              <div className="text-[20px] font-semibold">{alarm.name}</div>
              <div className="text-[18px] text-gray-500 mt-1">
                {formatTimes(alarm.times)}
              </div>
            </div>
            <div
              onClick={() => toggleAlarm(alarm.id)}
              className={`w-12 h-7 flex items-center px-1 rounded-full cursor-pointer transition-colors ${
                alarm.enabled ? "bg-[#FFDB67]" : "bg-gray-400"
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

export default MobileAlarmSettingsPage;
