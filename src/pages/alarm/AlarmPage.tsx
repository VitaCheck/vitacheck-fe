import { useState } from "react";

const AlarmPage = () => {
  const supplements = [
    {
      id: "multi",
      label: "멀티비타민",
      time: ["09:30", "12:30", "18:30"],
    },
    {
      id: "probiotics",
      label: "유산균",
      time: ["09:30"],
    },
    {
      id: "omega3",
      label: "오메가3",
      time: ["09:30", "12:30"],
    },
  ];
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
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

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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
    <div>
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="ml-[38px] font-medium text-[30px] ">섭취 알림</h2>
        {/*  모바일 버전 */}
        <div className="md:hidden p-4 rounded-lg space-y-4">
          {/* 섭취할 영양제가 있을 때: 고양이 + 섭취율 */}
          {supplements.length > 0 && (
            <div className="flex items-center justify-center gap-3">
              <img
                src={getCatImage()}
                alt="섭취율 고양이"
                className="w-24 h-24 select-none"
              />
              <div className="flex items-baseline gap-1">
                <span className="text-[35px] font-extrabold">
                  {percentComplete}
                </span>
                <span className="text-[35px] font-bold">%</span>
              </div>
              <div className="text-[20px] font-medium text-black">
                섭취 완료
              </div>
            </div>
          )}

          {/* 섭취할 영양제가 없을 경우 메시지 */}
          {supplements.length === 0 && (
            <div className="bg-gray-100 text-black text-center rounded-[16px] px-4 py-5 w-full">
              오늘은 섭취할 영양제가 없어요!
            </div>
          )}

          {/* 달력 */}
          <div className="border border-gray-300/50 rounded-xl p-4 bg-white">
            {/* 상단: 달 이동 */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onPrevMonth}
                className="text-gray-600 text-lg font-bold px-2"
              >
                &lt;
              </button>
              <div className="text-base font-semibold">
                {year}년 {month + 1}월
              </div>
              <button
                onClick={onNextMonth}
                className="text-gray-600 text-lg font-bold px-2"
              >
                &gt;
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">
              {weekDays.map((d) => (
                <div key={d} className="text-center font-semibold">
                  {d}
                </div>
              ))}
            </div>

            {/* 날짜 셀 */}
            <div className="grid grid-cols-7 gap-y-2 text-sm text-center select-none">
              {calendarCells}
            </div>
          </div>

          {/* 나의 영양제 관리 */}
          <div className="w-full mt-4 py-2 border border-gray-300 rounded flex items-center justify-center gap-2 transition cursor-default">
            <img
              src="/images/medical_services.png"
              alt="메디컬 아이콘"
              className="w-6 h-6"
            />
            나의 영양제 관리
          </div>

          <div className="space-y-4 mt-2">💊 나의 영양제</div>

          {/* 영양제 체크리스트: supplements가 있을 경우에만 렌더링 */}
          {supplements.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {supplements.map(({ id, label, time }) => (
                <div
                  key={id}
                  className="flex items-center justify-between px-4 py-4 rounded-2xl bg-gray-100"
                >
                  {/* 왼쪽: 이름 + 시간 */}
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">{label}</span>
                    <span className="text-gray-500 text-sm">
                      {time.join(" | ")}
                    </span>
                  </div>

                  {/* 오른쪽: 체크박스 */}
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
          )}
        </div>

        {/* ✅ PC 버전 */}
        <div className="hidden md:flex gap-8 border p-6 rounded-lg">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={onPrevMonth}
                className="text-gray-600 font-bold text-xl px-2"
              >
                &lt;
              </button>
              <div className="text-center font-semibold">
                {year}년 {month + 1}월
              </div>
              <button
                onClick={onNextMonth}
                className="text-gray-600 font-bold text-xl px-2"
              >
                &gt;
              </button>
            </div>
            <div className="grid grid-cols-7 text-xs text-gray-400 select-none mb-2">
              {weekDays.map((d) => (
                <div key={d} className="text-center font-semibold">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm">
              {calendarCells}
            </div>
          </div>

          <div className="w-px bg-gray-300"></div>

          <div className="flex-1">
            <button className="bg-yellow-300 rounded-md px-4 py-2 mb-4 flex items-center gap-2 text-sm font-semibold hover:bg-yellow-400 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-3-3v6m6 3v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2m16-8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6h18z"
                />
              </svg>
              나의 영양제 관리
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl select-none">🐱</div>
              <div className="font-semibold">{percentComplete}% 섭취 완료</div>
            </div>

            <ul className="space-y-4">
              {supplements.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {supplements.map(({ id, label, time }) => (
                    <div
                      key={id}
                      className="flex items-center justify-between px-4 py-4 rounded-2xl bg-gray-100"
                    >
                      {/* 왼쪽: 이름 + 시간 */}
                      <div className="flex flex-col">
                        <span className="text-base font-semibold">{label}</span>
                        <span className="text-gray-500 text-sm">
                          {time.join(" | ")}
                        </span>
                      </div>

                      {/* 오른쪽: 체크박스 */}
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
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmPage;
