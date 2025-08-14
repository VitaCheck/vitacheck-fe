import { useMediaQuery } from "react-responsive";
import MobileEmailSignupPage from "./MobileEmailSignupPage";
import DesktopEmailSignupPage from "./DesktopEmailSignupPage";

const EmailSignupPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });

  return isMobile ? <MobileEmailSignupPage /> : <DesktopEmailSignupPage />;
};

export default EmailSignupPage;
