// alarm

import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

interface Supplement {
  notificationRoutineId: number;
  supplementId: number;
  supplementName: string;
  supplementImageUrl: string;
  daysOfWeek: string[];
  times: string[];
  isTaken: boolean; // ✅ 추가
}

interface Props {
  year: number;
  month: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth: Dispatch<SetStateAction<number>>;
  // checkedIds: string[];
  toggleChecked: (id: string) => void;
  today: Date;
  getDaysInMonth: (year: number, month: number) => number;
}

const DesktopAlarmPage = ({
  year,
  month,
  setYear,
  setMonth,
  today,
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

  // const percentComplete = (() => {
  //   if (!Array.isArray(checkedIds) || !Array.isArray(supplements)) return 0;
  //   if (supplements.length === 0) return 0;
  //   return Math.round((checkedIds.length / supplements.length) * 100);
  // })();

  const percentComplete = useMemo(() => {
    if (!supplements || supplements.length === 0) return 0;
    const takenCount = supplements.filter((s) => s.isTaken).length;
    return Math.round((takenCount / supplements.length) * 100);
  }, [supplements]);

  // const getCatImage = () => {
  //   if (percentComplete === 100) return "/images/rate3.png";
  //   if (percentComplete > 0) return "/images/rate2.png";
  //   return "/images/rate1.png";
  // };

  const catImage = useMemo(() => {
    if (percentComplete === 100) return "/images/rate3.png";
    if (percentComplete > 0) return "/images/rate2.png";
    return "/images/rate1.png";
  }, [percentComplete]);

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

    console.log("📦 영양제 리스트 응답:", res.data);
    console.log(
      "🥤 isTaken 체크용:",
      res.data.result.map((r: any) => ({
        id: r.notificationRoutineId,
        isTaken: r.isTaken,
      }))
    );
    setSupplements(res.data.result);
  };

  const toggleSupplementTaken = async (notificationRoutineId: number) => {
    try {
      const res = await axios.post(
        `/api/v1/notifications/records/${notificationRoutineId}/toggle`
      );

      const { isTaken } = res.data.result;

      // 현재 상태 업데이트 (옵셔널)
      setSupplements((prev) =>
        prev.map((s) =>
          s.notificationRoutineId === notificationRoutineId
            ? { ...s, isTaken }
            : s
        )
      );
    } catch (error) {
      console.error("섭취 토글 실패:", error);
    }
  };

  useEffect(() => {
    fetchSupplementsByDate(selectedDate);
  }, [selectedDate]);

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
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === i;

    const isSelected =
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === i;

    let cellClass =
      "w-[54px] h-[54px] flex items-center justify-center text-[25px] cursor-pointer select-none rounded-full transition-all duration-200 ";

    if (isSelected) {
      cellClass += "bg-[#FFDB67] font-semibold text-black";
    } else if (isToday) {
      cellClass += "bg-[#E7E7E7] text-black font-semibold";
    } else {
      cellClass += "text-black";
    }

    calendarCells.push(
      <div
        key={"day-" + i}
        className={cellClass}
        onClick={() => onClickDate(i)}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="hidden md:flex justify-center items-start gap-[120px] bg-[#FAFAFA] px-[100px] py-[60px] min-h-screen">
      <div>
        <div className="text-[52px] font-extrabold mb-10">섭취알림</div>
        <div className="bg-white rounded-[20px] p-6 w-[576.82px] border border-[#9C9A9A]">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onPrevMonth} className="text-2xl font-bold px-2">
              <FiChevronLeft className="text-[35px]" />
            </button>
            <div className="text-[30px] font-semibold">
              {year}년 {month + 1}월
            </div>
            <button onClick={onNextMonth} className="text-2xl font-bold px-2">
              <FiChevronRight className="text-[35px]" />
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

      <div className="w-[2px] h-[600px] bg-[#C8C8C8] mt-[70px]" />

      <div className="flex-1 max-w-[500px]">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/alarm/settings")}
            className="w-[287px] h-[80px] bg-[#FFEB9D] hover:bg-[#FFE88F] transition text-black text-[25px] font-semibold rounded-full px-6 py-2 flex items-center justify-center gap-2"
          >
            <img
              src="/images/medical_services.png"
              alt="메디컬 아이콘"
              className="w-[31.67px]"
            />
            나의 영양제 관리
          </button>
        </div>
        <div className="flex items-center justify-center">
          {supplements.length === 0 ? (
            <div className="w-full max-w-md h-[104px] flex items-center justify-center rounded-xl bg-[#F4F4F4]">
              <span className="text-[24px] font-medium">
                오늘은 섭취할 영양제가 없어요!
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3">
                <img
                  src={catImage}
                  alt="섭취율 고양이"
                  className="w-[153px] h-[153px] select-none"
                />
                <span className="text-[44px] font-bold text-black">
                  {percentComplete}%
                </span>
              </div>
              <div className="text-[20px] font-bold text-black">섭취 완료</div>
            </>
          )}
        </div>

        <div className="space-y-4">
          {supplements.map(
            ({ notificationRoutineId, supplementName, times, isTaken }) => (
              <div
                key={notificationRoutineId}
                onClick={() => toggleSupplementTaken(notificationRoutineId)}
                className={`w-[454px] h-[104px] flex items-center justify-between px-6 py-4 rounded-[12px] border border-[#9C9A9A] cursor-pointer transition ${
                  isTaken ? "bg-[#FFF8DC] border-none" : "bg-white"
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
                    isTaken ? "bg-[#FFC200] border-none" : "border-[#D9D9D9]"
                  }`}
                >
                  {isTaken && (
                    <img
                      src="/images/check.svg"
                      alt="체크됨"
                      className="w-[24px] h-[18px]"
                    />
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopAlarmPage;
