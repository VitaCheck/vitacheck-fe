import { useEffect, useRef, useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import MobileAlarmPage from "./MobileAlarmPage";
import DesktopAlarmPage from "./DesktopAlarmPage";

import { enableWebPush } from "@/lib/push";
interface NotificationPermissionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function NotificationPermissionModal({
  open,
  onClose,
  onConfirm,
  isLoading,
}: NotificationPermissionModalProps) {
  if (!open) return null;

  return (
    // 오버레이
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {/* 모달 컨텐츠 */}
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="text-center text-lg font-medium text-black">알림켜기</h3>

        {/* 이미지와 동일한 텍스트 및 줄바꿈 적용 */}
        <p className="my-4 text-center text-sm text-[#9C9A9A]">
          브라우저를 알림을 켜면
          <br />
          설정한 시간에 복용알림을 받을 수 있어요
        </p>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-[#EEEEEE] py-3 font-semibold text-[#6B6B6B] transition hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-[#FFEB9D] py-3 font-semibold text-black transition hover:brightness-95 disabled:opacity-50"
          >
            {isLoading ? "설정 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}

const AlarmPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const initRef = useRef(false);

  const [enabling, setEnabling] = useState(false);

  // 🔽 추가: 모달이 닫혔는지(취소 눌렀는지) 상태
  const [modalDismissed, setModalDismissed] = useState(false);

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  // "알림 권한이 '허용'이 아닌 경우"에 true
  const needPermission =
    typeof Notification !== "undefined" &&
    Notification.permission !== "granted";

  const onEnablePush = useCallback(async () => {
    setEnabling(true);

    const res = await enableWebPush();
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
    // 성공 시: Notification.permission이 'granted'가 됨
    // -> needPermission이 false가 됨
    // -> 모달이 자동으로 닫힘 (open 조건이 false가 되므로)
  }, []);

  return (
    <div className="relative">
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

      {/* 모달 렌더링  */}
      <NotificationPermissionModal
        // (알림 권한이 없고) && (유저가 '취소'를 누르지 않았을 때)
        open={needPermission && !modalDismissed}
        isLoading={enabling}
        onConfirm={onEnablePush}
        onClose={() => setModalDismissed(true)} // '취소' 누르면 모달 닫기
      />
    </div>
  );
};

export default AlarmPage;
