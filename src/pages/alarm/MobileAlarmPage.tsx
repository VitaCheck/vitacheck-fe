import React from "react";

type Props = {
  year: number;
  month: number;
  today: Date;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  supplements: { id: string; label: string; time: string[] }[];
  checkedIds: string[];
  toggleChecked: (id: string) => void;
  getDaysInMonth: (year: number, month: number) => number;
};

const MobileAlarmPage = ({
  year,
  month,
  today,
  setYear,
  setMonth,
  supplements,
  checkedIds,
  toggleChecked,
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
        className={`w-8 h-8 flex items-center justify-center text-sm cursor-default select-none ${
          isToday
            ? "bg-[#FFDB67] rounded-full font-semibold text-black"
            : "text-gray-800"
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
    <div className="md:hidden p-4 space-y-4">
      <h2 className="font-semibold text-[30px]">섭취 알림</h2>
      <div className="flex items-center justify-center gap-3">
        <img
          src={getCatImage()}
          alt="섭취율 고양이"
          className="w-[122px] h-[122px] select-none"
        />
        <div className="flex items-baseline gap-1">
          <span className="text-[35px] font-bold">{percentComplete}%</span>
        </div>
        <div className="text-[20px] font-bold text-black">섭취 완료</div>
      </div>

      <div className="border border-gray-300/50 rounded-xl p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onPrevMonth} className="text-lg font-bold px-2">
            &lt;
          </button>
          <div className="text-base font-semibold">
            {year}년 {month + 1}월
          </div>
          <button onClick={onNextMonth} className="text-lg font-bold px-2">
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">
          {weekDays.map((d) => (
            <div key={d} className="text-center font-semibold">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-sm text-center select-none">
          {calendarCells}
        </div>
      </div>

      <div className="text-lg font-semibold">💊 나의 영양제</div>

      <div className="grid grid-cols-1 gap-4">
        {supplements.map(({ id, label, time }) => (
          <div
            key={id}
            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-gray-100"
          >
            <div className="flex flex-col">
              <span className="text-base font-semibold">{label}</span>
              <span className="text-gray-500 text-sm">{time.join(" | ")}</span>
            </div>
            <input
              id={id}
              type="checkbox"
              checked={checkedIds.includes(id)}
              onChange={() => toggleChecked(id)}
              className="w-5 h-5 accent-gray-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileAlarmPage;
