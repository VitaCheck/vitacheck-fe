import { useState } from "react";
import flipIcon from "../../assets/flip.png"; // TODO: 경로 확인

interface FlipCardProps {
  name: string;
  description: string;
}

/** PC에서 '+'가 포함된 긴 이름을 줄바꿈 처리합니다. */
const formatIngredientNameForPC = (ingredientName: string) => {
  if (ingredientName.includes("+")) {
    const parts = ingredientName.split("+").map((p) => p.trim());
    if (parts.every((p) => p.length < 7)) return ingredientName;
    return parts
      .map((part, idx) => (idx === 0 ? part : `\n+\n${part}`))
      .join("");
  }
  return ingredientName;
};

const FlipCard: React.FC<FlipCardProps> = ({ name, description }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <>
      {/* 모바일 카드 */}
      <div
        className="block h-[135px] w-[150px] cursor-pointer md:hidden"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className={`relative h-full w-full transition-transform duration-500 ${
            flipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* 카드 앞면 */}
          <div
            className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-white px-[6px] py-[10px] text-center text-[18px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040] overflow-hidden" // ⬅️ overflow-hidden 추가
            style={{ backfaceVisibility: "hidden" }}
          >
            {name}
            <img
              src={flipIcon}
              alt="회전 아이콘"
              className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
            />
          </div>
          {/* 카드 뒷면 */}
          <div
            className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-[#FFFBCC] px-[6px] py-[10px] text-center text-[18px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040] overflow-hidden" // ⬅️ overflow-hidden 추가
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {description}
            <img
              src={flipIcon}
              alt="회전 아이콘"
              className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
            />
          </div>
        </div>
      </div>

      {/* PC 카드 */}
      <div
        className="hidden h-[165px] w-[235px] cursor-pointer md:block"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className={`relative h-full w-full transition-transform duration-500 ${
            flipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* 카드 앞면 */}
          <div
            className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-white px-[2px] py-[2px] text-center text-[20px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040] overflow-hidden" // ⬅️ overflow-hidden 추가
            style={{ backfaceVisibility: "hidden" }}
          >
            <span style={{ whiteSpace: "pre-line" }}>
              {formatIngredientNameForPC(name)}
            </span>
            <img
              src={flipIcon}
              alt="회전 아이콘"
              className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
            />
          </div>
          {/* 카드 뒷면 */}
          <div
            className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-[#FFFBCC] px-[6px] py-[10px] text-center text-[20px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040] overflow-hidden" // ⬅️ overflow-hidden 추가
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {description}
            <img
              src={flipIcon}
              alt="회전 아이콘"
              className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FlipCard;
