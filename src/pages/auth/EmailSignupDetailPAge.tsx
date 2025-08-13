import { useMediaQuery } from "react-responsive";
import MobileEmailSignupDetailPage from "./MobileEmailSignupDetailPage";
import DesktopEmailSignupDetailPage from "./DesktopEmailSignupDetailPage";

const EmailSignupPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });

  return isMobile ? (
    <MobileEmailSignupDetailPage />
  ) : (
    <DesktopEmailSignupDetailPage />
  );
};

export default EmailSignupPage;
