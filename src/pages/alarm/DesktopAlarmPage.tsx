// DesktopAlarmPage.tsx
import type { Dispatch, SetStateAction } from "react";

interface Supplement {
  id: string;
  label: string;
  time: string[];
}

interface Props {
  year: number;
  month: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth: Dispatch<SetStateAction<number>>;
  checkedIds: string[];
  toggleChecked: (id: string) => void;
  supplements: Supplement[];
  today: Date;
  getDaysInMonth: (year: number, month: number) => number;
}

const DesktopAlarmPage = ({
  year,
  month,
  setYear,
  setMonth,
  checkedIds,
  toggleChecked,
  supplements,
  today,
  getDaysInMonth,
}: Props) => {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const prevMonthDays = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);

  const onPrevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const onNextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const percentComplete = Math.round(
    (checkedIds.length / supplements.length) * 100
  );

  const getCatImage = () => {
    if (percentComplete === 100) return "/images/rate3.png";
    if (percentComplete > 0) return "/images/rate2.png";
    return "/images/rate1.png";
  };

  const calendarCells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarCells.push(
      <div
        key={"prev-" + i}
        className="text-gray-300 text-center py-1 cursor-default select-none"
      >
        {prevMonthDays - i}
      </div>
    );
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      year === today.getFullYear() &&
      month === today.getMonth() &&
      i === today.getDate();
    calendarCells.push(
      <div
        key={"day-" + i}
        className={`flex items-center justify-center text-[25px] cursor-default select-none rounded-full transition-all duration-200 ${
          isToday ? "bg-[#FFDB67] font-semibold text-black" : "text-black"
        }`}
      >
        {i}
      </div>
    );
  }
  while (calendarCells.length < 42) {
    calendarCells.push(
      <div
        key={"next-" + calendarCells.length}
        className="text-gray-300 text-center py-1 cursor-default select-none"
      >
        &nbsp;
      </div>
    );
  }

  return (
    <div className="hidden md:flex justify-center items-start gap-[120px] bg-[#FAFAFA] px-[100px] py-[60px] min-h-screen">
      {/* 왼쪽: 달력 */}
      <div>
        <div className="text-[52px] font-extrabold mb-10">섭취알림</div>
        <div className="bg-white rounded-[20px] p-6 w-[576.82px] h-[546.3px] border border-[#9C9A9A]">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onPrevMonth} className="text-2xl font-bold px-2">
              &lt;
            </button>
            <div className="text-[30px] font-semibold">
              {year}년 {month + 1}월
            </div>
            <button onClick={onNextMonth} className="text-2xl font-bold px-2">
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-7 text-[25px] text-[#9E9E9E] mb-2">
            {weekDays.map((d) => (
              <div key={d} className="text-center text-[30px] font-semibold">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-6 text-[25px] text-center select-none">
            {calendarCells}
          </div>
        </div>
      </div>

      {/* 오른쪽: 체크리스트 */}
      <div className="flex-1 max-w-[500px]">
        <div className="flex justify-end mb-6">
          <button className="w-[287px] h-[80px] bg-[#FFEB9D] hover:bg-[#FFE88F] transition text-black text-[25px] font-semibold rounded-full px-6 py-2 flex items-center justify-center gap-2">
            <img
              src="/images/medical_services.png"
              alt="메디컬 아이콘"
              className="w-[31.67px]"
            />
            나의 영양제 관리
          </button>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={getCatImage()}
              alt="섭취율 고양이"
              className="w-[153px] h-[153px] select-none"
            />
            <span className="text-[44px] font-bold text-black">
              {percentComplete}%
            </span>
            <span className="text-[25px] font-bold text-black">섭취 완료</span>
          </div>
        </div>

        <div className="space-y-4">
          {supplements.map(({ id, label, time }) => (
            <div
              key={id}
              className="w-[454px] h-[104px] flex items-center justify-between px-4 py-3 rounded-[12px] bg-white border border-[#9C9A9A]"
            >
              <div className="flex flex-col">
                <label htmlFor={id} className="text-[26px] font-medium">
                  {label}
                </label>
                <span className="text-[20px] font-medium text-gray-500">
                  {time.join(" | ")}
                </span>
              </div>
              <input
                id={id}
                type="checkbox"
                checked={checkedIds.includes(id)}
                onChange={() => toggleChecked(id)}
                className="w-6 h-6 accent-[#8B8B8B]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesktopAlarmPage;
