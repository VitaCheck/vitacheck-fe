import { useState } from "react";
import { useMediaQuery } from "react-responsive";
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

  return isMobile ? (
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
  );
};

export default AlarmPage;

// import { useState } from "react";
// import { useMediaQuery } from "react-responsive";
// import { useQuery } from "@tanstack/react-query";
// import axios from "@/lib/axios";

// import MobileAlarmPage from "./MobileAlarmPage";
// import DesktopAlarmPage from "./DesktopAlarmPage";

// const AlarmPage = () => {
//   const isMobile = useMediaQuery({ maxWidth: 768 });
//   const today = new Date();

//   const [year, setYear] = useState(today.getFullYear());
//   const [month, setMonth] = useState(today.getMonth());
//   const [checkedIds, setCheckedIds] = useState<string[]>([]);

//   const toggleChecked = (id: string) => {
//     setCheckedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const getDaysInMonth = (year: number, month: number) =>
//     new Date(year, month + 1, 0).getDate();

//   // ✅ TanStack Query 적용
//   const { data: routines, isLoading, isError, refetch } = useQuery({
//     queryKey: ["routines"],
//     queryFn: async () => {
//       const res = await axios.get("/api/v1/notifications/routines");
//       return res.data.result;
//     },
//   });

//   return isMobile ? (
//     <MobileAlarmPage
//       year={year}
//       month={month}
//       today={today}
//       setYear={setYear}
//       setMonth={setMonth}
//       checkedIds={checkedIds}
//       toggleChecked={toggleChecked}
//       getDaysInMonth={getDaysInMonth}
//       routines={routines ?? []}
//       isLoading={isLoading}
//       isError={isError}
//       refetchRoutines={refetch}
//     />
//   ) : (
//     <DesktopAlarmPage
//       year={year}
//       month={month}
//       today={today}
//       setYear={setYear}
//       setMonth={setMonth}
//       checkedIds={checkedIds}
//       toggleChecked={toggleChecked}
//       getDaysInMonth={getDaysInMonth}
//       routines={routines ?? []}
//       isLoading={isLoading}
//       isError={isError}
//       refetchRoutines={refetch}
//     />
//   );
// };

// export default AlarmPage;
