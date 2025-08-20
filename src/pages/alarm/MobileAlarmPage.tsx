// /alarm - Mobile
import React, { useEffect, useMemo, useState } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { DayOfWeek, Supplement } from "@/types/alarm";
import {
  fmtYmd,
  normalizeSupplement,
  fixTime,
  formatTimes,
} from "@/utils/alarm";

type Props = {
  year: number;
  month: number;
  today: Date;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  checkedIds: string[]; // (호환용) 미사용
  toggleChecked: (id: string) => void; // (호환용) 미사용
  getDaysInMonth: (year: number, month: number) => number;
};

const DOW_KEYS: DayOfWeek[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const uniq = <T,>(a: T[]) => Array.from(new Set(a));

/** 선택 요일의 시간만 추출 + HH:mm 정규화(+고유/정렬) */
const timesForDay = (s: Supplement, dow: DayOfWeek): string[] => {
  if (Array.isArray(s.schedules) && s.schedules.length) {
    const onlyDay = s.schedules
      .filter((sch) => sch?.dayOfWeek === dow)
      .map((sch) => fixTime(sch?.time))
      .filter(Boolean);
    return uniq(onlyDay).sort((x, y) => x.localeCompare(y));
  }
  return uniq((s.times ?? []).map(fixTime).filter(Boolean)).sort((x, y) =>
    x.localeCompare(y)
  );
};

const MobileAlarmPage = ({
  year,
  month,
  today,
  setYear,
  setMonth,
  checkedIds, // eslint-disable-line @typescript-eslint/no-unused-vars
  toggleChecked, // eslint-disable-line @typescript-eslint/no-unused-vars
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
  const onClickDate = (day: number) =>
    setSelectedDate(new Date(year, month, day));

  /** 데스크탑과 동일한 규칙: /routines + /records 병합 */
  const fetchSupplementsByDate = async (date: Date) => {
    const ymd = fmtYmd(date);
    const dowKey = DOW_KEYS[date.getDay()];
    const tzOffset = -new Date().getTimezoneOffset();

    const [routinesRes, recordsRes] = await Promise.allSettled([
      axios.get("/api/v1/notifications/routines", {
        params: { date: ymd, tzOffset },
      }),
      axios.get("/api/v1/notifications/records", {
        params: { date: ymd, tzOffset },
      }), // 존재하지 않는 API
    ]);

    // records → Map<routineId, isTaken>
    let recordMap = new Map<number, boolean>();
    if (recordsRes.status === "fulfilled") {
      const body = recordsRes.value.data;
      const list: any[] = Array.isArray(body?.result)
        ? body.result
        : Array.isArray(body)
          ? body
          : Array.isArray(body?.data)
            ? body.data
            : Array.isArray(body?.content)
              ? body.content
              : [];
      recordMap = new Map(
        list.map((it: any) => {
          const id = Number(
            it?.notificationRoutineId ?? it?.routineId ?? it?.id ?? 0
          );
          const taken =
            typeof it?.isTaken === "boolean"
              ? it.isTaken
              : typeof it?.taken === "boolean"
                ? it.taken
                : it?.status === "TAKEN";
          return [id, Boolean(taken)];
        })
      );
    }

    // routines 정규화 + 요일 필터/시간 추출 + records 병합
    let rawList: any[] = [];
    if (routinesRes.status === "fulfilled") {
      const body = routinesRes.value.data;
      rawList = Array.isArray(body?.result)
        ? body.result
        : Array.isArray(body)
          ? body
          : Array.isArray(body?.data)
            ? body.data
            : Array.isArray(body?.content)
              ? body.content
              : [];
    }

    const normalized: Supplement[] = rawList
      .map(normalizeSupplement)
      .filter(
        (s) =>
          (s.daysOfWeek?.length ?? 0) === 0 || s.daysOfWeek.includes(dowKey)
      )
      .map((s) => {
        const id = s.notificationRoutineId;
        const mergedIsTaken = recordMap.get(id) ?? s.isTaken;
        return { ...s, isTaken: mergedIsTaken, times: timesForDay(s, dowKey) };
      });

    setSupplements(normalized);
  };

  useEffect(() => {
    fetchSupplementsByDate(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // 진행률(서버 isTaken 기준)
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

  // 토글 → 서버값 우선 확정, 없으면 재조회
  const handleItemToggle = async (id: number) => {
    if (togglingIds.has(id)) return;

    // 낙관적 토글
    setSupplements((prev) =>
      prev.map((s) =>
        s.notificationRoutineId === id ? { ...s, isTaken: !s.isTaken } : s
      )
    );
    setTogglingIds((prev) => new Set(prev).add(id));

    try {
      await axios.post(`/api/v1/notifications/records/${id}/toggle`, null, {
        params: { date: fmtYmd(selectedDate) },
      });

      // 동일 날짜 재조회(응답에 isTaken이 없을 수 있으므로)
      await fetchSupplementsByDate(selectedDate);
    } catch (err) {
      // 롤백
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
        onClick={() => navigate("/alarm/settings")}
      >
        <img
          src="/images/medical_services.png"
          alt="메디컬 아이콘"
          className="w-[28px]"
        />
        <span>나의 영양제 관리</span>
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
