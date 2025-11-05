import { useEffect, useMemo, useRef, useState } from "react";

import Bg1 from "../../assets/bg1.png";
import Bg2 from "../../assets/bg2.png";
import Bg3 from "../../assets/bg3.png";
import Bg4 from "../../assets/bg4.png";

import Cat1 from "../../assets/cat1.png";
import Cat2 from "../../assets/cat2.png";
import Cat3 from "../../assets/cat3.png";
import Cat4 from "../../assets/cat4.png";

import Text1 from "../../assets/text1.png";
import Text2 from "../../assets/text2.png";
import Text3 from "../../assets/text3.png";
import Text4 from "../../assets/text4.png";

const ROTATE_MS = 4000;

const MainTop = () => {
  const slides = useMemo(
    () => [
      {
        bg: Bg1,
        cat: Cat1,
        text: Text1,
        styles: {
          text: "top-[15%] left-[8%] w-[40%] sm:w-[35%] sm:left-[13%] lg:left-[18%] lg:w-[30%] xl:w-[25%]",
          cat: "bottom-0 right-[5%] w-[30%] sm:w-[30%] sm:right-[10%] lg:right-[15%] xl:w-[20%]",
        },
      },
      {
        bg: Bg2,
        cat: Cat2,
        text: Text2,
        styles: {
          text: "top-[15%] left-[8%] w-[40%] sm:w-[40%] sm:left-[13%] lg:left-[18%] lg:w-[35%] xl:w-[25%]",
          cat: "bottom-3 right-[5%] w-[20%] sm:w-[15%] sm:right-[10%] lg:w-[15%] lg:right-[15%] xl:w-[10%] xl:right-[17%]",
        },
      },
      {
        bg: Bg3,
        cat: Cat3,
        text: Text3,
        styles: {
          text: "top-[15%] left-[8%] w-[45%] sm:w-[45%] sm:left-[13%] lg:left-[18%] lg:w-[40%] xl:w-[30%]",
          cat: "bottom-[3%] right-[5%] w-[18%] sm:w-[15%] sm:right-[10%] lg:w-[15%] lg:right-[15%] xl:w-[10%] xl:right-[17%]",
        },
      },
      {
        bg: Bg4,
        cat: Cat4,
        text: Text4,
        styles: {
          text: "top-[15%] left-[8%] w-[35%] sm:w-[30%] sm:left-[13%] lg:left-[18%] lg:w-[25%] xl:w-[20%]",
          cat: "bottom-[-5%] right-[5%] w-[30%] sm:w-[30%] sm:right-[10%] lg:right-[15%] xl:w-[20%] xl:right-[15%]",
        },
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;

    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, ROTATE_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [paused, slides.length]);

  return (
    <header
      className="relative w-full min-h-[200px] sm:min-h-[300px] lg:min-h-[380px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* 배경 */}
          <img
            src={s.bg}
            alt={`배경 ${i + 1}`}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* 텍스트 */}
          <img
            src={s.text}
            alt={`텍스트 ${i + 1}`}
            className={`absolute object-contain ${s.styles.text}`}
            draggable={false}
          />

          {/* 고양이 */}
          <img
            src={s.cat}
            alt={`고양이 ${i + 1}`}
            className={`absolute object-contain ${s.styles.cat}`}
            draggable={false}
          />
        </div>
      ))}

      <div
        className="
          absolute bottom-[10px] right-[7%] sm:right-[5%] lg:right-[16%] xl:right-[17%]
          bg-[rgba(244,244,244,0.6)] text-black text-sm
          px-[10px] py-[4px] rounded-full
          backdrop-blur-[2px]
          font-medium
        "
      >
        {index + 1} / {slides.length}
      </div>
    </header>
  );
};

export default MainTop;
