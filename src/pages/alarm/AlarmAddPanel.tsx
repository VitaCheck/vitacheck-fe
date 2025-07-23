// interface Props {
//   onClose: () => void;
// }

// const AlarmAddPanel = ({ onClose }: Props) => {
//   return (
//     <div className="p-8 h-full flex flex-col">
//       {/* 상단 바 */}
//       <div className="flex justify-between items-center mb-6">
//         <button
//           className="text-[25.86px] text-black font-medium"
//           onClick={onClose}
//         >
//           취소
//         </button>
//         <h2 className="text-[28.11px] font-bold text-[#6B6B6B]">알림 추가</h2>
//         <button className="text-[25.86px] text-black font-bold">저장</button>
//       </div>

//       {/* 알림 이름 */}
//       <div className="mb-6">
//         <label className="block text-[22.48px] font-semibold mb-2 text-[#808080]">
//           영양제 이름
//         </label>
//         <input
//           type="text"
//           placeholder="멀티비타민"
//           className="w-full border border-gray-300 rounded-[8px] p-3 text-[17.99px]"
//         />
//       </div>

//       {/* 요일 선택 */}
//       <div className="mb-6">
//         <label className="block text-[22.48px] font-semibold mb-2 text-[#808080]">
//           복용 요일 선택
//         </label>
//         <div className="grid grid-cols-7 gap-2">
//           {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
//             <button
//               key={day}
//               className="border border-gray-300 rounded-[8px] py-2 text-[19.22px] text-[#AAAAAA]"
//             >
//               {day}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 시간 선택 */}
//       <div className="mb-6">
//         <label className="block text-[22.48px] font-semibold mb-2 text-[#808080]">
//           복용 시간 선택
//         </label>
//         <div className="flex justify-between items-center border border-gray-300 rounded-[8px] px-4 py-3 text-[17.99px] mb-2">
//           <span>복용 시간 1</span>
//           <span className="text-gray-500">오후 10:13</span>
//         </div>
//         <button className="w-full border border-gray-300 rounded-[8px] py-3 text-[17.99px] text-gray-400">
//           복용 시간 추가
//         </button>
//       </div>

//       {/* 삭제 버튼 */}
//       {/* <div className="mt-auto">
//         <button className="w-full border border-red-400 text-red-500 rounded-[8px] py-3 text-sm">
//           알림 삭제
//         </button>
//       </div> */}
//     </div>
//   );
// };

// export default AlarmAddPanel;
import { useState } from "react";
import type { Alarm } from "./AlarmSettingsPage";

interface Props {
  onClose: () => void;
  alarmToEdit?: Alarm | null;
  onDelete?: (id: number) => void;
}

const AlarmAddPanel = ({ onClose, alarmToEdit, onDelete }: Props) => {
  const isEdit = Boolean(alarmToEdit);

  const [name, setName] = useState(alarmToEdit?.name || "");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    alarmToEdit?.days || []
  );
  const [time, setTime] = useState(alarmToEdit?.times[0] || "오후 10:13");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="p-8 h-full flex flex-col">
      {/* 상단 바 */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-[25.86px] text-black font-medium"
          onClick={onClose}
        >
          취소
        </button>
        <h2 className="text-[28.11px] font-bold text-[#6B6B6B]">
          {isEdit ? "알림 수정" : "알림 추가"}
        </h2>
        <button className="text-[25.86px] text-black font-bold">저장</button>
      </div>

      {/* 알림 이름 */}
      <div className="mb-6">
        <label className="block text-[22.48px] font-semibold mb-2 text-[#808080]">
          영양제 이름
        </label>
        <input
          type="text"
          placeholder="멀티비타민"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-[8px] p-3 text-[17.99px]"
        />
      </div>

      {/* 요일 선택 */}
      <div className="mb-6">
        <label className="block text-[22.48px] font-semibold mb-2 text-[#808080]">
          복용 요일 선택
        </label>
        <div className="grid grid-cols-7 gap-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`border rounded-[8px] py-2 text-[19.22px] ${
                selectedDays.includes(day)
                  ? "bg-[#FFEB9D] border-yellow-400 text-black font-semibold"
                  : "border-gray-300 text-[#AAAAAA]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* 시간 선택 */}
      <div className="mb-6">
        <label className="block text-[22.48px] font-semibold mb-2 text-[#808080]">
          복용 시간 선택
        </label>
        <div className="flex justify-between items-center border border-gray-300 rounded-[8px] px-4 py-3 text-[17.99px] mb-2">
          <span>복용 시간 1</span>
          <span className="text-gray-500">{time}</span>
        </div>
        <button className="w-full border border-gray-300 rounded-[8px] py-3 text-[17.99px] text-gray-400">
          복용 시간 추가
        </button>
      </div>

      {/* 삭제 버튼 */}
      {isEdit && onDelete && alarmToEdit && (
        <div className="mt-auto">
          <button
            onClick={() => onDelete(alarmToEdit.id)}
            className="w-full border border-red-400 text-red-500 rounded-[8px] py-3 text-[17.99px] font-semibold"
          >
            알림 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default AlarmAddPanel;
