import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SettingRow from "../components/SettingPage/SettingRow";
import {
  getMyNotificationSettings,
  updateMyNotificationSetting,
  type NotificationSetting,
} from "@/apis/notification";

type UISettings = {
  benefit: { email: boolean; push: boolean };
  intake: { supplement: boolean; push: boolean };
};
import Back from "../assets/back.svg";

function NotificationSettingsPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<UISettings>({
    benefit: { email: false, push: false },
    intake: { supplement: false, push: false },
  });
  const [loading, setLoading] = useState(true);

  // 서버 응답 → UI 상태 매핑
  const applyFromServer = (list: NotificationSetting[]) => {
    const next: UISettings = {
      benefit: { email: false, push: false },
      intake: { supplement: false, push: false },
    };

    list.forEach(({ type, channel, enabled }) => {
      if (type === "EVENT" && channel === "EMAIL") next.benefit.email = enabled;
      if (type === "EVENT" && channel === "PUSH") next.benefit.push = enabled;

      if (type === "INTAKE" && channel === "EMAIL")
        next.intake.supplement = enabled;
      if (type === "INTAKE" && channel === "PUSH") next.intake.push = enabled;
    });

    setSettings(next);
  };

  // 최초 데이터 로드
  useEffect(() => {
    (async () => {
      try {
        const server = await getMyNotificationSettings();
        applyFromServer(server);
      } catch (e) {
        console.error("알림 설정 조회 실패:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 토글 이벤트
  const toggle = (
    group: "benefit" | "intake",
    key: "email" | "push" | "supplement"
  ) => {
    const prev = settings;
    const next = {
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !prev[group][key as keyof (typeof prev)[typeof group]],
      },
    } as UISettings;

    setSettings(next);

    // 서버에 보낼 payload 매핑
    let payload: NotificationSetting | null = null;

    if (group === "benefit" && key === "email")
      payload = {
        type: "EVENT",
        channel: "EMAIL",
        enabled: next.benefit.email,
      };
    if (group === "benefit" && key === "push")
      payload = { type: "EVENT", channel: "PUSH", enabled: next.benefit.push };

    if (group === "intake" && key === "supplement")
      payload = {
        type: "INTAKE",
        channel: "EMAIL",
        enabled: next.intake.supplement,
      };
    if (group === "intake" && key === "push")
      payload = { type: "INTAKE", channel: "PUSH", enabled: next.intake.push };

    if (!payload) return;

    // API 호출 (실패 시 롤백)
    updateMyNotificationSetting(payload).catch((err) => {
      console.error("업데이트 실패, 롤백합니다.", err);
      setSettings(prev);
    });
  };

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 flex justify-center items-start sm:bg-[#F3F3F3] sm:mt-15">
      <div className="w-full sm:max-w-[700px] sm:bg-white sm:rounded-2xl sm:p-10 sm:shadow-md">
        {/* 상단 헤더 */}
        <div className="w-full pt-4 pb-2 flex items-center sm:border-b sm:border-[#D9D9D9] sm:pt-0">
          <button
            onClick={() => navigate("/NotificationCenter")}
            className="mr-2 text-2xl text-black sm:hidden"
          >
            <img
              src={Back}
              alt="icon"
              className="w-[20px] h-[20px] object-contain cursor-pointer"
            />
          </button>
          <h1 className="text-xl font-semibold py-2 sm:ml-2">알림설정</h1>
        </div>

        {/* 이벤트 및 혜택 알림 */}
        <section className="mt-4 pb-5 border-b border-gray-200 px-3">
          <h2 className="text-[20px] font-semibold mb-4">
            이벤트 및 혜택 알림
          </h2>
          <SettingRow
            label="이메일"
            checked={settings.benefit.email}
            onToggle={() => toggle("benefit", "email")}
          />
          {/* <SettingRow
            label="문자 알림"
            checked={settings.benefit.sms}
            onToggle={() => toggle("benefit", "sms")}
          /> */}
          <SettingRow
            label="푸시 알림"
            checked={settings.benefit.push}
            onToggle={() => toggle("benefit", "push")}
          />
        </section>

        {/* 섭취알림 */}
        <section className="mt-4 px-3">
          <h2 className="text-[20px] font-semibold mb-4">섭취알림</h2>
          <SettingRow
            label="이메일"
            checked={settings.intake.supplement}
            onToggle={() => toggle("intake", "supplement")}
          />
          {/* <SettingRow
            label="문자 알림"
            checked={settings.benefit.sms}
            onToggle={() => toggle("benefit", "sms")}
          /> */}
          <SettingRow
            label="푸시 알림"
            checked={settings.intake.push}
            onToggle={() => toggle("intake", "push")}
          />
        </section>
      </div>
    </div>
  );
}

export default NotificationSettingsPage;
