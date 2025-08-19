// alarm
import {
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
  useMemo,
} from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import type { Supplement } from "@/types/alarm";
import { dbg, formatTimes, fmtYmd } from "@/utils/alarm";

// ==== 컴포넌트 ====
interface Props {
  year: number;
  month: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth: Dispatch<SetStateAction<number>>;
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

  const percentComplete = useMemo(() => {
    if (!supplements.length) return 0;
    const takenCount = supplements.filter((s) => s.isTaken).length;
    return Math.round((takenCount / supplements.length) * 100);
  }, [supplements]);

  const catImage = useMemo(() => {
    if (percentComplete === 100) return "/images/rate3.png";
    if (percentComplete > 0) return "/images/rate2.png";
    return "/images/rate1.png";
  }, [percentComplete]);

  // 요일 키 헬퍼
  const DOW_KEYS: Array<"SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT"> =
    ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const fetchSupplementsByDate = async (date: Date) => {
    const ymd = fmtYmd(date);
    const dowKey = DOW_KEYS[date.getDay()]; // 선택 날짜의 요일 키
    try {
      dbg("GET /routines", { date: ymd, dowKey });
      const t0 = performance.now();
      const res = await axios.get("/api/v1/notifications/routines", {
        params: { date: ymd },
      });
      dbg(
        "GET status/time",
        res?.status,
        `${Math.round(performance.now() - t0)}ms`
      );

      // 다양한 래퍼 대응 (result / data / content / items ...)
      let listRaw: any[] = [];
      const body = res?.data;
      if (Array.isArray(body?.result)) listRaw = body.result;
      else if (Array.isArray(body)) listRaw = body;
      else if (Array.isArray(body?.data)) listRaw = body.data;
      else if (Array.isArray(body?.result?.content))
        listRaw = body.result.content;
      else if (Array.isArray(body?.content)) listRaw = body.content;
      else if (Array.isArray(body?.items)) listRaw = body.items;

      // 선택 요일에 해당하는 루틴만 남김
      const filteredRaw = listRaw.filter((x) => {
        const days = Array.isArray(x?.daysOfWeek)
          ? x.daysOfWeek
          : Array.isArray(x?.schedules)
            ? x.schedules.map((s: any) => s?.dayOfWeek).filter(Boolean)
            : [];

        // days 정보가 없으면(매일/상시로 간주) 보여주고, 있으면 해당 요일만
        return days.length === 0 ? true : days.includes(dowKey);
      });

      // times도 선택 요일 기준으로만 추출
      const toTimesForDay = (x: any): string[] => {
        if (Array.isArray(x?.times)) return x.times;
        if (Array.isArray(x?.schedules)) {
          return x.schedules
            .filter((s: any) => s?.dayOfWeek === dowKey)
            .map((s: any) => s?.time)
            .filter((t: any) => typeof t === "string");
        }
        return [];
      };

      const normalized = filteredRaw.map((x) => {
        const id =
          x.notificationRoutineId ??
          x.routineId ??
          x.id ??
          x.notificationId ??
          0;

        const isTaken =
          typeof x.isTaken === "boolean"
            ? x.isTaken
            : typeof x.taken === "boolean"
              ? x.taken
              : false;

        return {
          notificationRoutineId: id,
          supplementName: x.supplementName ?? x.name ?? "이름없음",
          times: toTimesForDay(x),
          isTaken,
        } as Supplement;
      });

      setSupplements(normalized);
    } catch (e) {
      dbg("GET ERROR", e);
      setSupplements([]);
    }
  };

  // 최초/날짜 변경 시 조회
  useEffect(() => {
    dbg("selectedDate →", fmtYmd(selectedDate));
    fetchSupplementsByDate(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // POST: 섭취 토글 (핵심 로그만)
  const toggleSupplementTaken = async (notificationRoutineId: number) => {
    if (togglingIds.has(notificationRoutineId)) return;

    const ymd = fmtYmd(selectedDate);
    const before = supplements.find(
      (s) => s.notificationRoutineId === notificationRoutineId
    );
    dbg("TOGGLE start", {
      id: notificationRoutineId,
      date: ymd,
      beforeIsTaken: before?.isTaken,
    });

    // 낙관적 업데이트
    setSupplements((prev) =>
      prev.map((s) =>
        s.notificationRoutineId === notificationRoutineId
          ? { ...s, isTaken: !s.isTaken }
          : s
      )
    );
    setTogglingIds((prev) => new Set(prev).add(notificationRoutineId));

    try {
      const url = `/api/v1/notifications/records/${notificationRoutineId}/toggle?date=${ymd}`;
      const t0 = performance.now();
      const res = await axios.post(url);
      dbg(
        "TOGGLE status/time",
        res?.status,
        `${Math.round(performance.now() - t0)}ms`
      );

      const serverIsTaken = res?.data?.result?.isTaken;
      dbg("TOGGLE serverIsTaken", serverIsTaken);

      if (typeof serverIsTaken === "boolean") {
        setSupplements((prev) =>
          prev.map((s) =>
            s.notificationRoutineId === notificationRoutineId
              ? { ...s, isTaken: serverIsTaken }
              : s
          )
        );
      } else {
        // 서버가 명시 안 주면 같은 날짜 재조회
        await fetchSupplementsByDate(selectedDate);
      }
    } catch (error) {
      dbg("TOGGLE ERROR", error);
      // 롤백
      setSupplements((prev) =>
        prev.map((s) =>
          s.notificationRoutineId === notificationRoutineId
            ? { ...s, isTaken: !s.isTaken }
            : s
        )
      );
      alert("섭취 상태 업데이트에 실패했습니다.");
    } finally {
      setTogglingIds((prev) => {
        const n = new Set(prev);
        n.delete(notificationRoutineId);
        return n;
      });
    }
  };

  // 캘린더 셀
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
    if (isSelected) cellClass += "bg-[#FFDB67] font-semibold text-black";
    else if (isToday) cellClass += "bg-[#E7E7E7] text-black font-semibold";
    else cellClass += "text-black";

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
    <div className="hidden md:flex md:flex-wrap lg:flex-nowrap justify-center items-start bg-[#FAFAFA] md:gap-6 lg:gap-[120px] md:px-6 lg:px-[100px] md:py-8 lg:py-[60px] min-h-screen overflow-x-hidden">
      <div>
        <div className="text-[44px] font-semibold mb-10">섭취알림</div>
        <div
          className="
  bg-white rounded-[20px] p-6
  w-full max-w-[576px]
  border border-[#9C9A9A]
  flex-[1_1_520px]
"
        >
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

          {/* ▼▼ 여기부터 달력 본문을 정사각형 블록으로 감싸기 ▼▼ */}
          <div className="w-full md:aspect-auto lg:aspect-square">
            <div className="grid grid-rows-[auto_1fr] h-full">
              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 text-[25px] text-[#9E9E9E] mb-2">
                {weekDays.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[30px] font-semibold"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* 날짜 그리드: 남은 영역을 꽉 채움 */}
              <div className="grid grid-cols-7 grid-rows-6 gap-y-6 text-[25px] text-center select-none h-full overflow-hidden">
                {calendarCells}
              </div>
            </div>
          </div>
          {/* ▲▲ 여기까지 교체 ▲▲ */}
        </div>
      </div>
      <div className="w-[2px] h-[600px] bg-[#C8C8C8] mt-[70px]" />
      <div className="w-full lg:flex-1 lg:max-w-[500px]">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/alarm/settings")}
            className="w-full max-w-[320px] h-[80px] bg-[#FFEB9D] hover:bg-[#FFE88F] transition text-black text-[25px] font-semibold rounded-full px-6 py-2 flex items-center justify-center gap-2"
          >
            <img
              src="/images/medical_services.png"
              alt="메디컬 아이콘"
              className="w-[31.67px]"
            />
            나의 영양제 관리
          </button>
        </div>

        {/* <div className="flex items-center justify-center">
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
        </div> */}
        {/* ✅ 요약 블록: 이미지 + (퍼센트/라벨 세로 스택) */}
        <div className="flex items-center justify-center">
          {supplements.length === 0 ? (
            <div className="w-full max-w-md h-[104px] flex items-center justify-center rounded-xl bg-[#F4F4F4]">
              <span className="text-[24px] font-medium">
                오늘은 섭취할 영양제가 없어요!
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <img
                src={catImage}
                alt="섭취율 고양이"
                className="w-[153px] h-[153px] select-none"
              />
              {/* ✅ 퍼센트 + 라벨: 같은 줄, 겹침 방지 */}
              <div className="flex items-baseline gap-2 min-w-0">
                <span
                  className="
            font-bold leading-none tracking-tight
            whitespace-nowrap flex-shrink-0
            text-[clamp(28px,5vw,44px)]
          "
                >
                  {percentComplete}%
                </span>
                <span
                  className="
            font-bold text-black
            whitespace-nowrap flex-shrink-0
            text-[clamp(14px,2.2vw,20px)]
          "
                >
                  섭취 완료
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {supplements.map(
            ({ notificationRoutineId, supplementName, times, isTaken }) => {
              const toggling = togglingIds.has(notificationRoutineId);
              return (
                <div
                  key={notificationRoutineId}
                  onClick={() => toggleSupplementTaken(notificationRoutineId)}
                  className={`w-full h-[104px] flex items-center justify-between px-6 py-4 rounded-[12px] border cursor-pointer transition ${
                    isTaken
                      ? "bg-[#FFF8DC] border-none border-transparent"
                      : "bg-white border-[#9C9A9A]"
                  } ${toggling ? "opacity-60 pointer-events-none" : ""}`}
                >
                  <div className="flex flex-col">
                    <span className="text-[20px] font-semibold text-black">
                      {supplementName}
                    </span>
                    <span className="text-[16px] text-[#808080]">
                      {formatTimes(times)}
                    </span>
                  </div>

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
    </div>
  );
};

export default DesktopAlarmPage;
