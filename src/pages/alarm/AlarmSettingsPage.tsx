import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import MobileAlarmSettingsPage from "./MobileAlarmSettingsPage";
import DesktopAlarmSettingsPage from "./DesktopAlarmSettingsPage";

const AlarmSettingsPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const [showModal, setShowModal] = useState(false); // 모바일용 모달

  return isMobile ? (
    <MobileAlarmSettingsPage
      showModal={showModal}
      setShowModal={setShowModal}
    />
  ) : (
    <DesktopAlarmSettingsPage />
  );
};

export default AlarmSettingsPage;
