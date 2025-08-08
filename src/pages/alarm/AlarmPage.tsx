import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

import MobileAlarmPage from "./MobileAlarmPage";
import DesktopAlarmPage from "./DesktopAlarmPage";

const AlarmPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  // useMutation
  const toggleRoutineMutation = useMutation({
    mutationFn: (routineId: number) =>
      axios.post(`/api/v1/notifications/records/${routineId}/toggle`),
    onSuccess: () => {
      console.log("토글 성공!");
    },
    onError: () => {
      console.error("토글 실패!");
    },
  });

  const handleToggle = () => {
    toggleRoutineMutation.mutate(1); // 예시 ID
  };

  return (
    <div>
      {/* <button
        onClick={handleToggle}
        disabled={toggleRoutineMutation.isPending}
        className="m-4 px-4 py-2 bg-yellow-400 text-white rounded"
      >
        {toggleRoutineMutation.isPending ? "요청 중..." : "루틴 토글 테스트"}
      </button> */}

      {isMobile ? (
        <MobileAlarmPage
          year={year}
          month={month}
          today={today}
          setYear={setYear}
          setMonth={setMonth}
          checkedIds={checkedIds}
          toggleChecked={toggleChecked}
          getDaysInMonth={getDaysInMonth}
        />
      ) : (
        <DesktopAlarmPage
          year={year}
          month={month}
          today={today}
          setYear={setYear}
          setMonth={setMonth}
          toggleChecked={toggleChecked}
          getDaysInMonth={getDaysInMonth}
        />
      )}
    </div>
  );
};

export default AlarmPage;
