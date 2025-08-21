// import { useEffect, useRef, useState, useCallback } from "react";
// import { useMediaQuery } from "react-responsive";

// import MobileAlarmPage from "./MobileAlarmPage";
// import DesktopAlarmPage from "./DesktopAlarmPage";

// const AlarmPage = () => {
//   const isMobile = useMediaQuery({ maxWidth: 639 });
//   const today = new Date();

//   const [year, setYear] = useState(today.getFullYear());
//   const [month, setMonth] = useState(today.getMonth());
//   const [checkedIds, setCheckedIds] = useState<string[]>([]);
//   const initRef = useRef(false);

//   const toggleChecked = (id: string) => {
//     setCheckedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const getDaysInMonth = (year: number, month: number) =>
//     new Date(year, month + 1, 0).getDate();

//   const needPermissionBanner =
//     typeof Notification !== "undefined" &&
//     Notification.permission !== "granted";

//   const perm =
//     typeof Notification !== "undefined" ? Notification.permission : "default";

//   return (
//     <div className="relative">
//       {isMobile ? (
//         <MobileAlarmPage
//           year={year}
//           month={month}
//           today={today}
//           setYear={setYear}
//           setMonth={setMonth}
//           checkedIds={checkedIds}
//           toggleChecked={toggleChecked}
//           getDaysInMonth={getDaysInMonth}
//         />
//       ) : (
//         <DesktopAlarmPage
//           year={year}
//           month={month}
//           today={today}
//           setYear={setYear}
//           setMonth={setMonth}
//           toggleChecked={toggleChecked}
//           getDaysInMonth={getDaysInMonth}
//         />
//       )}
//     </div>
//   );
// };

// export default AlarmPage;
// src/pages/alarm/AlarmPage.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import MobileAlarmPage from "./MobileAlarmPage";
import DesktopAlarmPage from "./DesktopAlarmPage";

import { enableWebPush } from "@/lib/push";

const AlarmPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const initRef = useRef(false);

  // 🔽 추가: 버튼 로딩 상태
  const [enabling, setEnabling] = useState(false);

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const needPermissionBanner =
    typeof Notification !== "undefined" &&
    Notification.permission !== "granted";

  // 🔽 추가: 버튼 클릭 핸들러
  const onEnablePush = useCallback(async () => {
    setEnabling(true);
    const res = await enableWebPush({
      onMessage: (p) => {
        // 포그라운드 수신 시 원하는 UX (토스트/배지 등)
        console.log("[PUSH][FG] payload:", p);
      },
    });
    setEnabling(false);

    if (!res.ok) {
      const msg: Record<string, string> = {
        not_supported: "이 환경에서는 웹푸시를 지원하지 않아요.",
        sw_error: "서비스워커 등록에 실패했어요.",
        permission_denied: "알림 권한이 거부되었어요. 설정에서 허용해 주세요.",
        permission_blocked: "알림 권한을 허용해 주세요.",
        no_token: "토큰 발급에 실패했어요. 새로고침 후 다시 시도해 주세요.",
        unknown: "알 수 없는 오류가 발생했어요.",
      };
      alert(msg[res.reason] ?? msg.unknown);
    }
    // 성공이면 Notification.permission 이 'granted'로 바뀌면서 배너는 자동으로 사라짐
  }, []);

  return (
    <div className="relative">
      {/* 🔽 상단 배너: 권한 미허용일 때만 노출 */}
      {needPermissionBanner && (
        <div className="mb-3 rounded-lg border px-3 py-2 text-sm flex items-center justify-between bg-white">
          <span>브라우저 알림을 켜면 설정한 시간에 복용 알림을 받아요.</span>
          <button
            className="ml-3 rounded-md border px-3 py-1 text-sm"
            disabled={enabling}
            onClick={onEnablePush}
          >
            {enabling ? "설정 중..." : "알림 켜기"}
          </button>
        </div>
      )}

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
