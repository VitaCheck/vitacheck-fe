import { useMediaQuery } from "react-responsive";
import MobileSocialSignupDetailPage from "./MobileSocialSignupDetailPage";
import DesktopSocialSignupDetailPage from "./DesktopSocialSignupDetailPage";

const SocialSignupDetailPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });

  return isMobile ? (
    <MobileSocialSignupDetailPage />
  ) : (
    <DesktopSocialSignupDetailPage />
  );
};

export default SocialSignupDetailPage;
