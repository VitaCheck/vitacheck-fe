// /alarm
import React, { useEffect, useMemo, useState } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type DayOfWeek = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
type Schedule = { dayOfWeek: DayOfWeek; time: string };

type RawSupplement = {
  notificationRoutineId?: number;
  id?: number;
  supplementId?: number;
  supplementName?: string;
  name?: string;
  supplementImageUrl?: string;
  imageUrl?: string;
  daysOfWeek?: string[];
  times?: string[];
  schedules?: Schedule[];
  isTaken?: boolean;
};

type Supplement = {
  notificationRoutineId: number;
  supplementId: number;
  supplementName: string;
  supplementImageUrl?: string;
  daysOfWeek: string[];
  times: string[];
  isTaken: boolean; // ✅ 서버 진실값
};

type Props = {
  year: number;
  month: number;
  today: Date;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  // 아래 두 prop은 더 이상 사용하지 않지만, 상위 호환을 위해 유지
  checkedIds: string[];
  toggleChecked: (id: string) => void;
  getDaysInMonth: (year: number, month: number) => number;
};

const fixTime = (t?: string) => (t ? t.slice(0, 5) : "");
const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));
// util: yyyy-MM-dd (로컬 타임존 기준)
const fmtYmd = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const normalizeSupplement = (raw: RawSupplement): Supplement => {
  const notificationRoutineId = Number(
    raw.notificationRoutineId ?? raw.id ?? 0
  );
  const supplementId = Number(raw.supplementId ?? 0);
  const supplementName = String(raw.supplementName ?? raw.name ?? "알 수 없음");
  const supplementImageUrl = raw.supplementImageUrl ?? raw.imageUrl;

  let daysOfWeek = Array.isArray(raw.daysOfWeek)
    ? raw.daysOfWeek.filter(Boolean)
    : undefined;
  let times = Array.isArray(raw.times)
    ? raw.times.filter(Boolean).map(fixTime)
    : undefined;

  const schedules = Array.isArray(raw.schedules) ? raw.schedules : undefined;

  if ((!daysOfWeek || !daysOfWeek.length) && schedules) {
    daysOfWeek = uniq(
      schedules
        .map((s) => s?.dayOfWeek)
        .filter((v): v is DayOfWeek => Boolean(v))
    );
  }
  if ((!times || !times.length) && schedules) {
    times = uniq(schedules.map((s) => fixTime(s?.time)).filter(Boolean));
  }

  return {
    notificationRoutineId,
    supplementId,
    supplementName,
    supplementImageUrl,
    daysOfWeek: daysOfWeek ?? [],
    times: times ?? [],
    isTaken: Boolean(raw.isTaken), // ✅ 서버 값 반영
  };
};

const formatTimes = (times?: string[]) => {
  const arr = Array.isArray(times) ? times.map(fixTime).filter(Boolean) : [];
  if (!arr.length) return "—";
  if (arr.length <= 3) return arr.join(" | ");
  return arr.slice(0, 3).join(" | ") + " ...";
};

// ==== 컴포넌트 ====
const MobileAlarmPage = ({
  year,
  month,
  today,
  setYear,
  setMonth,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkedIds,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleChecked,
  getDaysInMonth,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
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
    const res = await axios.get("/api/v1/notifications/routines", {
      params: { date: fmtYmd(date) },
    });
    const listRaw: RawSupplement[] = Array.isArray(res?.data?.result)
      ? res.data.result
      : [];
    setSupplements(listRaw.map(normalizeSupplement));
  };

  useEffect(() => {
    fetchSupplementsByDate(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // ✅ 서버의 isTaken으로 진행률 계산
  const percentComplete = useMemo(() => {
    if (!supplements.length) return 0;
    const taken = supplements.filter((s) => s.isTaken).length;
    return Math.round((taken / supplements.length) * 100);
  }, [supplements]);

  const getCatImage = () => {
    if (percentComplete === 100) return "/images/rate3.png";
    if (percentComplete > 0) return "/images/rate2.png";
    return "/images/rate1.png";
  };

  // const handleItemToggle = async (id: number) => {
  //   if (togglingIds.has(id)) return;

  //   // 낙관적 업데이트: 로컬 isTaken 토글
  //   setSupplements((prev) =>
  //     prev.map((s) =>
  //       s.notificationRoutineId === id ? { ...s, isTaken: !s.isTaken } : s
  //     )
  //   );
  //   setTogglingIds((prev) => new Set(prev).add(id));

  //   try {
  //     const res = await axios.post(
  //       `/api/v1/notifications/records/${id}/toggle`,
  //       null,
  //       { params: { date: fmtYmd(selectedDate) } }
  //     );
  //     const serverIsTaken = Boolean(res?.data?.result?.isTaken);

  //     // 서버 값으로 확정
  //     setSupplements((prev) =>
  //       prev.map((s) =>
  //         s.notificationRoutineId === id ? { ...s, isTaken: serverIsTaken } : s
  //       )
  //     );
  //   } catch (err) {
  //     console.error("섭취 토글 실패:", err);
  //     // 롤백
  //     setSupplements((prev) =>
  //       prev.map((s) =>
  //         s.notificationRoutineId === id ? { ...s, isTaken: !s.isTaken } : s
  //       )
  //     );
  //     alert("섭취 상태 업데이트에 실패했습니다.");
  //   } finally {
  //     setTogglingIds((prev) => {
  //       const n = new Set(prev);
  //       n.delete(id);
  //       return n;
  //     });
  //   }
  // };
  // ✅ 토글 -> 서버호출 -> 즉시 재조회(동일 date 파라미터)
  const handleItemToggle = async (id: number) => {
    if (togglingIds.has(id)) return;

    // 낙관적 토글(원하면 유지, 불안하면 제거)
    setSupplements((prev) =>
      prev.map((s) =>
        s.notificationRoutineId === id ? { ...s, isTaken: !s.isTaken } : s
      )
    );
    setTogglingIds((prev) => new Set(prev).add(id));

    try {
      await axios.post(
        `/api/v1/notifications/records/${id}/toggle`,
        null,
        { params: { date: fmtYmd(selectedDate) } } // 🔴 토글에도 date 명시
      );

      // 🔴 서버 진실값으로 동기화 (같은 date로 재조회)
      const res = await axios.get("/api/v1/notifications/routines", {
        params: { date: fmtYmd(selectedDate) },
      });
      const listRaw = Array.isArray(res?.data?.result) ? res.data.result : [];
      setSupplements(listRaw.map(normalizeSupplement)); // (normalizeSupplement는 이전 메시지 코드 사용)
    } catch (err) {
      console.error("섭취 토글 실패:", err);
      // 낙관적 토글 롤백
      setSupplements((prev) =>
        prev.map((s) =>
          s.notificationRoutineId === id ? { ...s, isTaken: !s.isTaken } : s
        )
      );
      alert("섭취 상태 업데이트에 실패했습니다.");
    } finally {
      setTogglingIds((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  // 캘린더 셀 구성
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
  for (let i = 1; i <= getDaysInMonth(year, month); i++) {
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
    if (isSelected) className += "bg-[#FFDB67] text-black font-semibold";
    else if (isToday) className += "bg-[#E7E7E7] text-black font-semibold";
    else className += "text-gray-800";

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
        {supplements.map(
          ({ notificationRoutineId, supplementName, times, isTaken }) => {
            const toggling = togglingIds.has(notificationRoutineId);

            return (
              <div
                key={notificationRoutineId}
                onClick={() => handleItemToggle(notificationRoutineId)}
                className={`w-full h-[86px] flex items-center justify-between px-6 py-4 rounded-[12px] border cursor-pointer transition ${
                  isTaken
                    ? "bg-[#FFF8DC] border-none"
                    : "bg-white border-[#9C9A9A]"
                } ${toggling ? "opacity-60 pointer-events-none" : ""}`}
              >
                {/* 텍스트 영역 */}
                <div className="flex flex-col">
                  <span className="text-[20px] font-semibold text-black">
                    {supplementName}
                  </span>
                  <span className="text-[16px] text-[#808080]">
                    {formatTimes(times)}
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
            );
          }
        )}
      </div>
    </div>
  );
};

export default MobileAlarmPage;
