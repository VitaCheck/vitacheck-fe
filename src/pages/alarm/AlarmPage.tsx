import { useEffect, useRef, useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import MobileAlarmPage from "./MobileAlarmPage";
import DesktopAlarmPage from "./DesktopAlarmPage";
import {
  requestNotificationPermission,
  getFcmToken,
  registerServiceWorker,
} from "@/lib/firebase";
import axios from "@/lib/axios";

const LAST_POSTED_FCM_TOKEN_KEY = "lastPostedFcmToken";

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

  // === FCM 동기화(권한 요청 + 토큰 업서트) ===
  const ensureFcmSynced = useCallback(async () => {
    // 1) 권한
    const perm = await requestNotificationPermission();
    if (perm !== "granted") return;

    // 2) 토큰
    const token = await getFcmToken();
    if (!token) return;

    // 3) 이전에 업서트한 토큰과 같으면 스킵
    const last = localStorage.getItem(LAST_POSTED_FCM_TOKEN_KEY);
    if (last === token) return;

    // 4) 서버 업서트
    await axios.put("/api/v1/users/me/fcm-token", { token });

    // 5) 기록
    localStorage.setItem(LAST_POSTED_FCM_TOKEN_KEY, token);
  }, []);

  // 페이지 최초 진입 시: SW 등록 + 권한이 이미 허용된 경우 자동 동기화
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      // 서비스워커 등록 (루트: /firebase-messaging-sw.js 이어야 함)
      await registerServiceWorker();

      // 권한이 이미 granted면 자동으로 동기화 (조용히)
      if ("Notification" in window && Notification.permission === "granted") {
        await ensureFcmSynced();
      }
    })();
  }, [ensureFcmSynced]);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  return (
    <div className="relative">
      {/* 상단: 알림 안내/버튼 (권한이 없을 때만 보이도록) */}
      {"Notification" in window && Notification.permission !== "granted" && (
        <div className="mb-3 rounded-lg border px-3 py-2 text-sm flex items-center justify-between">
          <span>브라우저 알림을 켜면 설정한 시간에 복용 알림을 받아요.</span>
          <button
            className="ml-3 rounded-md border px-3 py-1 text-sm"
            onClick={ensureFcmSynced}
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
