import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import MobileAlarmSettingsPage from "./MobileAlarmSettingsPage";
import DesktopAlarmSettingsPage from "./DesktopAlarmSettingsPage";

export interface Alarm {
  id: number;
  name: string;
  times: string[];
  enabled: boolean;
}

const AlarmSettingsPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [showModal, setShowModal] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: 1,
      name: "멀티비타민",
      times: ["09:30", "12:30", "18:30"],
      enabled: true,
    },
    {
      id: 2,
      name: "유산균",
      times: ["09:30", "12:30", "18:30", "21:30"],
      enabled: true,
    },
    {
      id: 3,
      name: "오메가3",
      times: ["09:30", "12:30"],
      enabled: true,
    },
  ]);

  const toggleAlarm = (id: number) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  return isMobile ? (
    <MobileAlarmSettingsPage
      alarms={alarms}
      toggleAlarm={toggleAlarm}
      showModal={showModal}
      setShowModal={setShowModal}
    />
  ) : (
    <DesktopAlarmSettingsPage
      alarms={alarms}
      toggleAlarm={toggleAlarm}
      showAddPanel={showPanel}
      setShowAddPanel={setShowPanel}
    />
  );
};

export default AlarmSettingsPage;
