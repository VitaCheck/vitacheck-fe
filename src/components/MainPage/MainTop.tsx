import { useEffect, useMemo, useRef, useState } from "react";

import Banner1 from "../../assets/webbanner01.png";
import Banner2 from "../../assets/webbanner02.png";
import Banner3 from "../../assets/webbanner03.png";
import Banner4 from "../../assets/webbanner04.png";

const ROTATE_MS = 3000;

const MainTop = () => {
  const banners = useMemo(() => [Banner1, Banner2, Banner3, Banner4], []);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    banners.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [banners]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, ROTATE_MS);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused, banners.length]);

  return (
    <header
      className="
        relative z-0
        [background-repeat:no-repeat]
      "
    >
      <div
        className="
          relative
          mx-auto w-full
          h-[160px] sm:h-auto     /* 데스크톱에선 높이 자동 */
          overflow-hidden
          flex items-center justify-center
        "
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="프로모션 배너"
        role="img"
      >
        {banners.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`배너 ${i + 1}`}
            className={`
              /* 모바일: 겹쳐서 페이드, 가운데 정렬 + 좌우 크롭 강화 */
              absolute transition-opacity duration-700
              top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              h-full w-auto scale-x-130 origin-center
              ${i === index ? "opacity-100" : "opacity-0"}

              /* 데스크톱(sm↑): 활성 것만 흐름에 표시(너비 100%, 높이 자동) */
              sm:static sm:w-full sm:h-auto sm:object-contain
              sm:translate-x-0 sm:translate-y-0 sm:scale-x-100 sm:top-auto sm:left-auto
              ${i === index ? "sm:block" : "sm:hidden"}
            `}
            draggable={false}
          />
        ))}
      </div>
    </header>
  );
};

export default MainTop;
