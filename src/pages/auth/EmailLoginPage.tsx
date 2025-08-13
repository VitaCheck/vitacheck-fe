import { useMediaQuery } from "react-responsive";
import MobileLoginPage from "./MobileEmailLoginPage";
import DesktopLoginPage from "./DesktopEmailLoginPage";

const EmailLoginPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });

  return isMobile ? <MobileLoginPage /> : <DesktopLoginPage />;
};

export default EmailLoginPage;
