// /alarm
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Supplement = {
  notificationRoutineId: number;
  supplementId: number;
  supplementName: string;
  supplementImageUrl: string;
  daysOfWeek: string[];
  times: string[];
};

type Props = {
  year: number;
  month: number;
  today: Date;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
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
  checkedIds,
  toggleChecked,
  getDaysInMonth,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const navigate = useNavigate();

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

  const onClickDate = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const fetchSupplementsByDate = async (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const res = await axios.get("/api/v1/notifications/routines", {
      params: { date: formattedDate },
    });

    setSupplements(res.data.result);
  };

  useEffect(() => {
    fetchSupplementsByDate(selectedDate);
  }, [selectedDate]);

  const percentComplete = supplements.length
    ? Math.round((checkedIds.length / supplements.length) * 100)
    : 0;

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
    // const cellDate = new Date(year, month, i);

    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === i;
    const isSelected =
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === i;

    let className =
      "w-8 h-8 flex items-center justify-center text-sm cursor-pointer select-none rounded-full transition-all ";

    if (isSelected) {
      className += "bg-[#FFDB67] text-black font-semibold";
    } else if (isToday) {
      className += "bg-[#E7E7E7] text-black font-semibold";
    } else {
      className += "text-gray-800";
    }

    calendarCells.push(
      <div
        key={"day-" + i}
        className={className}
        onClick={() => onClickDate(i)}
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
      {supplements.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-4 rounded-lg bg-[#F4F4F4]">
          <span className="text-[20px] font-medium text-black">
            오늘은 섭취할 영양제가 없어요!
          </span>
        </div>
      ) : (
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
      )}

      <div className="border border-gray-300/50 rounded-xl p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onPrevMonth} className="text-lg font-bold px-2">
            <FiChevronLeft className="text-[24px]" />
          </button>
          <div className="text-base font-semibold">
            {year}년 {month + 1}월
          </div>
          <button onClick={onNextMonth} className="text-lg font-bold px-2">
            <FiChevronRight className="text-[24px]" />
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

      <button
        className="w-full h-[64px] px-4 py-4 
             flex items-center justify-center
             gap-[10px] text-black text-[20px] font-medium 
             border border-[#AAAAAA] rounded-[18px] transition"
      >
        <div
          onClick={() => navigate("/alarm/settings")}
          className="flex items-center gap-[10px]"
        >
          <img
            src="/images/medical_services.png"
            alt="메디컬 아이콘"
            className="w-[28px]"
          />
          <span>나의 영양제 관리</span>
        </div>
      </button>

      <div className="text-lg font-semibold">💊 나의 영양제</div>

      <div className="grid grid-cols-1 gap-4">
        {/* {supplements.map(({ notificationRoutineId, supplementName, times }) => {
          const isChecked = checkedIds.includes(
            notificationRoutineId.toString()
          );
          return (
            <div
              key={notificationRoutineId}
              className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-colors ${
                isChecked ? "bg-gray-100" : "bg-white border border-gray-300"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-base font-semibold">
                  {supplementName}
                </span>
                <span className="text-gray-500 text-sm">
                  {times.join(" | ")}
                </span>
              </div>

              <label className="relative cursor-pointer w-5 h-5">
                <input
                  type="checkbox"
                  id={notificationRoutineId.toString()}
                  checked={isChecked}
                  onChange={() =>
                    toggleChecked(notificationRoutineId.toString())
                  }
                  className="sr-only peer"
                />
                <div
                  className="w-5 h-5 rounded-sm border border-gray-400 
             peer-checked:bg-[#FFC200] peer-checked:border-none 
             flex items-center justify-center"
                >
                  <svg
                    className="w-3 h-3 text-white hidden peer-checked:block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </label>
            </div>
          );
        })} */}
        {supplements.map(({ notificationRoutineId, supplementName, times }) => {
          const isChecked = checkedIds.includes(
            notificationRoutineId.toString()
          );

          return (
            <div
              key={notificationRoutineId}
              onClick={() => toggleChecked(notificationRoutineId.toString())}
              className={`w-full h-[86px] flex items-center justify-between px-6 py-4 rounded-[12px] border cursor-pointer transition ${
                isChecked
                  ? "bg-[#FFF8DC] border-none"
                  : "bg-white border-[#9C9A9A]"
              }`}
            >
              {/* 텍스트 영역 */}
              <div className="flex flex-col">
                <span className="text-[20px] font-semibold text-black">
                  {supplementName}
                </span>
                <span className="text-[16px] text-[#808080]">
                  {times.join(" | ")}
                </span>
              </div>

              {/* 체크박스 */}
              <div
                className={`w-[28px] h-[28px] rounded-[6px] border flex items-center justify-center ${
                  isChecked ? "bg-[#FFC200] border-none" : "border-[#D9D9D9]"
                }`}
              >
                {isChecked && (
                  <img
                    src="/images/check.svg"
                    alt="체크됨"
                    className="w-[24px] h-[18px]"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileAlarmPage;
