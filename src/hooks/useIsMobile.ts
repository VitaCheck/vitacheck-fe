import { useState, useEffect } from "react";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    //
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    //
    if (typeof window === "undefined") return;

    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);

    // 컴포넌트 마운트 시점에 한 번 더 체크
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
