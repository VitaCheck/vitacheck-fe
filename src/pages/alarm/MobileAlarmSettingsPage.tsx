import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlarmAddModal from "./AlarmAddModal";
import AlarmEditModal from "./AlarmEditModal";
import AddOptionsModal from "./AddOptionsModal";
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
  showModal: boolean; // 옵션 모달(추가하기) 표시 플래그
  setShowModal: (value: boolean) => void;
}

const MobileAlarmSettingsPage = ({ showModal, setShowModal }: Props) => {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

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
            onClick={() => setEditId(alarm.notificationRoutineId)}
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
              onClick={(e) => {
                e.stopPropagation();
                toggleAlarm(alarm.notificationRoutineId);
              }}
              className="w-12 h-7 flex items-center px-1 rounded-full cursor-pointer transition-colors bg-[#FFDB67]"
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform translate-x-5" />
            </div>
          </div>
        ))}
      </div>

      {/* ➕ 옵션 모달 */}
      {showModal && (
        <AddOptionsModal
          onClose={() => setShowModal(false)}
          onSearch={() => {
            setShowModal(false);
            // 검색 플로우로 이동(원하는 경로로 변경 가능)
            navigate("/search");
          }}
          onManual={() => {
            setShowModal(false);
            setShowManualModal(true); // 직접 입력 모달 열기
          }}
        />
      )}

      {/* 직접 입력 모달 */}
      {showManualModal && (
        <AlarmAddModal onClose={() => setShowManualModal(false)} />
      )}

      {/* 편집 모달 */}
      {editId !== null && (
        <AlarmEditModal id={editId} onClose={() => setEditId(null)} />
      )}
    </div>
  );
};

export default MobileAlarmSettingsPage;
