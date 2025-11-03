import { useEffect, useState } from "react";

// 태블릿 세로 모드 기준점 1023px
const useIsMobile = (breakpoint = 1023) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    window.innerWidth < breakpoint
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
