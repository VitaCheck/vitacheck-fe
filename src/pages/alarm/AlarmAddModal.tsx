import { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

interface Props {
  onClose: () => void;
}

const AlarmAddModal = ({ onClose }: Props) => {
  const [name, setName] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [newTime, setNewTime] = useState<string>("09:00");

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddTime = () => {
    if (newTime && !times.includes(newTime)) {
      setTimes([...times, newTime]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div
        className="w-full bg-white rounded-t-3xl px-6 pt-5 pb-10 h-[70%] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onClose} className="font-medium text-[23px]">
            취소
          </button>
          <span className="text-gray-500 font-bold text-[25px]">알림 추가</span>
          <button className="font-bold text-[23px]">저장</button>
        </div>

        {/* 이름 입력 */}
        <label className="block text-[#808080] font-semibold text-[20px] mb-1">
          영양제 이름
        </label>
        <input
          className="w-full h-[50px] border border-[#AAAAAA] rounded-[10px] px-3 py-2 bg-white mx-auto"
          placeholder="예: 오메가3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 복용 요일 선택 */}
        <label className="block text-[#808080] font-semibold text-[20px] mb-1 mt-[38px]">
          복용 요일 선택
        </label>
        <div className="flex justify-between mb-4">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <button
              key={day}
              className={`w-[47.5px] h-[47.5px] rounded-[9.5px] border border-[#AAAAAA] ${
                days.includes(day)
                  ? "bg-[#808080] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        {/* 복용 시간 선택 */}
        <label className="block text-[#808080] font-semibold text-[20px] mb-1 mt-[38px]">
          복용 시간 선택
        </label>
        {/* <div className="flex flex-col items-center gap-3 mb-4">
          <TimePicker
            onChange={(value) => {
              if (value !== null) {
                setNewTime(value);
              }
            }}
            value={newTime}
            format="HH:mm"
            disableClock={true}
            clearIcon={null}
            className="!w-[160px] !rounded-[10px] !border !border-[#AAAAAA]"
          />

          <button
            className="border border-gray-500 px-3 py-1 rounded text-sm"
            onClick={handleAddTime}
          >
            복용 시간 추가
          </button>
        </div>

        {times.length > 0 && (
          <div
            className="w-full h-[60px]
      flex flex-col justify-center items-center
      px-[12px] py-[15px] gap-[10px]
      bg-white border border-[#AAAAAA] rounded-[10px]
      text-sm text-gray-700 mx-auto"
          >
            복용 시간: {times.join(" | ")}
          </div>
        )} */}

        <button className="w-full h-[60px] border border-red-400 rounded-[10px] text-red-500 py-2 rounded mt-[103px]">
          알림 삭제
        </button>
      </div>
    </div>
  );
};

export default AlarmAddModal;
