import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SettingRow from "../components/SettingPage/SettingRow";

function NotificationSettingsPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    benefit: {
      email: true,
      sms: true,
      push: true,
    },
    intake: {
      supplement: true,
      sms: true,
      push: true,
    },
  });

  const toggle = (group: "benefit" | "intake", key: string) => {
    setSettings((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !prev[group][key as keyof (typeof prev)[typeof group]],
      },
    }));
  };

  return (
    <div className="min-h-screen bg-white px-6">
      {/* 상단 헤더 */}
      <div className="w-full pt-4 pb-2 flex items-center">
        <button
          onClick={() => navigate("/NotificationCenter")}
          className="mr-2 text-2xl text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold py-2">알림설정</h1>
      </div>

      {/* 이벤트 및 혜택 알림 */}
      <section className="mt-4 pb-5 border-b border-gray-200 px-3">
        <h2 className="text-lg font-semibold mb-4">이벤트 및 혜택 알림</h2>
        <SettingRow
          label="이메일"
          checked={settings.benefit.email}
          onToggle={() => toggle("benefit", "email")}
        />
        <SettingRow
          label="문자 알림"
          checked={settings.benefit.sms}
          onToggle={() => toggle("benefit", "sms")}
        />
        <SettingRow
          label="앱 푸시"
          checked={settings.benefit.push}
          onToggle={() => toggle("benefit", "push")}
        />
      </section>

      {/* 섭취알림 */}
      <section className="mt-4 px-3">
        <h2 className="text-lg font-semibold mb-4">섭취알림</h2>
        <SettingRow
          label="나의 영양제 복용알림"
          checked={settings.intake.supplement}
          onToggle={() => toggle("intake", "supplement")}
        />
        <SettingRow
          label="문자 알림"
          checked={settings.intake.sms}
          onToggle={() => toggle("intake", "sms")}
        />
        <SettingRow
          label="앱 푸시"
          checked={settings.intake.push}
          onToggle={() => toggle("intake", "push")}
        />
      </section>
    </div>
  );
}

export default NotificationSettingsPage;
