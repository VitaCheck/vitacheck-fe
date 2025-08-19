import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import MobileAlarmPage from "./MobileAlarmPage";
import DesktopAlarmPage from "./DesktopAlarmPage";

const AlarmPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });
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

  return (
    <div>
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
