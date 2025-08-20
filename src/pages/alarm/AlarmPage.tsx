import { useEffect, useRef, useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";

import MobileAlarmPage from "./MobileAlarmPage";
import DesktopAlarmPage from "./DesktopAlarmPage";

import { enableWebPush, syncFcmToken } from "@/lib/push";

const AlarmPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const initRef = useRef(false);

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ 앱 최초 진입 시: 권한이 이미 허용(granted)된 경우에만 조용히 서버와 토큰 동기화
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      // 로그인 전이면 서버에서 401이 날 수 있으니 에러는 무시
      syncFcmToken(false).catch(() => {});
    }
  }, []);

  // ✅ 사용자 액션으로 푸시 활성화 (권한 요청 → 토큰 발급 → 서버 업서트)
  const onEnablePush = useCallback(async () => {
    const res = await enableWebPush({
      onMessage: (p) => {
        // 포그라운드 메시지 수신 처리 (원하면 토스트로 변경)
        console.log("[PUSH][FG] payload:", p);
      },
    });

    if (!res.ok) {
      alert(`푸시 활성화 실패: ${res.reason}`);
      return;
    }
    // 성공 시 배너가 자동으로 사라지도록 상태 갱신 유도
    // (브라우저가 즉시 permission을 'granted'로 반영함)
  }, []);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const needPermissionBanner =
    typeof Notification !== "undefined" &&
    Notification.permission !== "granted";

  const perm =
    typeof Notification !== "undefined" ? Notification.permission : "default";

  return (
    <div className="relative">
      {/* 상단: 브라우저 푸시 안내 배너 (권한 미허용 시에만 노출) */}
      {needPermissionBanner && (
        <div className="mb-3 rounded-lg border px-3 py-2 text-sm flex items-center justify-between bg-white">
          <span>브라우저 알림을 켜면 설정한 시간에 복용 알림을 받아요.</span>
          <button
            className="ml-3 rounded-md border px-3 py-1 text-sm"
            onClick={onEnablePush}
          >
            알림 켜기
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
