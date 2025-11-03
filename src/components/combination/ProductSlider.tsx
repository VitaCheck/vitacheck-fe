import { useRef } from "react";
import type { SupplementItem } from "@/types/combination";
import checkedBoxIcon from "../../assets/check box.png";
import boxIcon from "../../assets/box.png";

interface ProductSliderProps {
  selectedItems: SupplementItem[];
  checkedIndices: number[];
  onToggleCheckbox: (cursorId: number) => void;
}

const PAGE_COUNT = 4;
const GAP_W = 16;
const cardWidthCSS = `calc((100% - ${GAP_W * (PAGE_COUNT - 1)}px) / ${PAGE_COUNT})`;

export default function ProductSlider({
  selectedItems,
  checkedIndices,
  onToggleCheckbox,
}: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const page = el.clientWidth;
    const delta = direction === "right" ? page : -page;
    let target = el.scrollLeft + delta;
    target = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <>
      {/* PC 슬라이더 */}
      <div className="hidden px-4 md:block">
        <div className="relative mx-auto w-full max-w-[1050px] overflow-visible">
          <div className="relative h-[300px] overflow-hidden rounded-[45.5px] border border-[#B2B2B2] bg-white px-[60px] py-[30px]">
            <div className="w-full">
              <div
                ref={scrollRef}
                className="hide-scrollbar flex snap-x snap-mandatory gap-[16px] overflow-x-auto scroll-smooth"
              >
                {selectedItems.map((item: SupplementItem) => (
                  <div
                    key={item.cursorId}
                    className={`relative flex h-[250px] flex-shrink-0 snap-start flex-col items-center rounded-[22.76px] pt-[80px] ${
                      checkedIndices.includes(item.cursorId)
                        ? "bg-[#EEEEEE]"
                        : "bg-white"
                    }`}
                    style={{ width: cardWidthCSS, minWidth: cardWidthCSS }}
                  >
                    <img
                      src={
                        checkedIndices.includes(item.cursorId)
                          ? checkedBoxIcon
                          : boxIcon
                      }
                      alt="checkbox"
                      onClick={() => onToggleCheckbox(item.cursorId)} // props 사용
                      className="absolute top-[10px] left-[18px] h-[50px] w-[50px] cursor-pointer"
                    />
                    <img
                      src={item.imageUrl}
                      className="mt-[-20px] mb-3 h-[100px] w-[120px] object-contain"
                    />
                    <p
                      className="font-pretendard mt-1 text-center font-medium"
                      style={{
                        fontSize: "18px",
                        lineHeight: "100%",
                        letterSpacing: "-0.02em",
                        color: "#000000",
                      }}
                    >
                      {item.supplementName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedItems.length > 4 && (
            <>
              <button
                onClick={() => handleScroll("left")}
                aria-label="왼쪽으로 스크롤"
                className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
              >
                <img
                  src="/images/PNG/조합 3-1/Frame 724.png"
                  alt="왼쪽"
                  className="h-[65px] w-[65px] object-contain"
                />
              </button>
              <button
                onClick={() => handleScroll("right")}
                aria-label="오른쪽으로 스크롤"
                className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
              >
                <img
                  src="/images/PNG/조합 3-1/Frame 667.png"
                  alt="오른쪽"
                  className="h-[65px] w-[65px] object-contain"
                />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 모바일 슬라이더 */}
      <div className="scrollbar-hide mx-auto mt-3 w-full max-w-[358px] overflow-x-auto overflow-y-hidden rounded-[20px] border border-[#B2B2B2] bg-white px-3 py-2 py-3 md:hidden">
        <div className="flex w-max gap-3">
          {selectedItems.map((item: SupplementItem) => (
            <div
              key={item.cursorId}
              className={`relative flex h-[135px] w-[135px] flex-shrink-0 flex-col items-center rounded-[22.76px] pt-[35px] ${
                checkedIndices.includes(item.cursorId)
                  ? "bg-[#EEEEEE]"
                  : "bg-white"
              }`}
            >
              <img
                src={
                  checkedIndices.includes(item.cursorId)
                    ? checkedBoxIcon
                    : boxIcon
                }
                alt="checkbox"
                onClick={() => onToggleCheckbox(item.cursorId)} // props 사용
                className="absolute top-[1px] left-[110px] h-[30px] w-[30px] cursor-pointer"
              />
              <img
                src={item.imageUrl}
                className="mt-[-25px] mb-3 h-[80px] w-[80px] object-contain"
              />
              <p className="font-pretendard [display:-webkit-box] max-h-[34px] min-h-[34px] overflow-hidden px-2 text-center text-[14px] leading-[1.15] font-medium break-words text-black [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                {item.supplementName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
