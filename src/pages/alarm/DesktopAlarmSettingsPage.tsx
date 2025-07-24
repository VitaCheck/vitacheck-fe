import { useState } from "react";
import type { Alarm } from "./AlarmSettingsPage";
import AlarmAddPanel from "./AlarmAddPanel";
import classNames from "classnames";

interface Props {
  alarms: Alarm[];
  toggleAlarm: (id: number) => void;
  showAddPanel: boolean;
  setShowAddPanel: (value: boolean) => void;
}

const DesktopAlarmSettingsPage = ({
  alarms,
  toggleAlarm,
  showAddPanel,
  setShowAddPanel,
}: Props) => {
  const [alarmToEdit, setAlarmToEdit] = useState<Alarm | null>(null);

  const formatTimes = (times: string[]) => {
    if (times.length <= 3) return times.join(" | ");
    return times.slice(0, 3).join(" | ") + " ...";
  };

  const handleAlarmClick = (alarm: Alarm) => {
    setAlarmToEdit(alarm);
    setShowAddPanel(true);
  };

  const handleClosePanel = () => {
    setAlarmToEdit(null);
    setShowAddPanel(false);
  };

  const handleDelete = (id: number) => {
    console.log(`Deleting alarm with id: ${id}`);
    // 삭제 로직은 나중에 구현 예정
    handleClosePanel();
  };

  return (
    <div className="hidden md:flex flex-col min-h-screen px-[320px] py-[60px] bg-[#FAFAFA]">
      {/* 상단 고정 영역 */}
      <div className="w-full flex justify-between items-center mb-10 max-w-[720px] mx-auto">
        <h1 className="text-[52px] font-bold">나의 영양제 관리</h1>
        <button
          onClick={() => {
            setAlarmToEdit(null); // 새 알람 추가
            setShowAddPanel(true);
          }}
          className="flex items-center gap-2 bg-[#FFEB9D] text-[25px] font-semibold rounded-full px-6 py-3"
        >
          알림 추가
        </button>
      </div>

      {/* 알람 리스트 + 패널 */}
      <div
        className={classNames(
          "flex w-full",
          showAddPanel ? "gap-12" : "justify-center"
        )}
      >
        {/* 리스트 */}
        <div
          className={classNames(
            showAddPanel ? "w-1/2" : "w-full max-w-[720px] mx-auto"
          )}
        >
          <div className="space-y-6 w-full">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="flex justify-between items-center border-b border-gray-300 pb-6 cursor-pointer"
                onClick={() => handleAlarmClick(alarm)}
              >
                <div className="flex flex-col">
                  <div className="text-[35.57px] font-semibold">
                    {alarm.name}
                  </div>
                  <div className="text-[35.57px] font-medium text-gray-500 mt-1">
                    {formatTimes(alarm.times)}
                  </div>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation(); // 토글 클릭 시 편집 패널 안 뜨게
                    toggleAlarm(alarm.id);
                  }}
                  className={`w-12 h-7 flex items-center px-1 rounded-full cursor-pointer transition-colors ${
                    alarm.enabled ? "bg-[#FCC000]" : "bg-gray-400"
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
        </div>

        {/* 패널 */}
        {showAddPanel && (
          <div className="w-1/2">
            <AlarmAddPanel
              onClose={handleClosePanel}
              alarmToEdit={alarmToEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopAlarmSettingsPage;
