import { useState } from "react";
import flipIcon from "../../assets/flip.png";

interface FlipCardProps {
  name: string;
  description: string;
}

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
          <div
            className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-white px-[6px] py-[10px] text-center text-[18px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
            style={{ backfaceVisibility: "hidden" }}
          >
            {name}
            <img
              src={flipIcon}
              alt="회전 아이콘"
              className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
            />
          </div>
          <div
            className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-[#FFFBCC] px-[6px] py-[10px] text-center text-[18px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
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

      {/* PC용 카드 */}
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
          <div
            className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-white px-[2px] py-[2px] text-center text-[20px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
            style={{ backfaceVisibility: "hidden" }}
          >
            {name}
            <img
              src={flipIcon}
              alt="회전 아이콘"
              className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
            />
          </div>
          <div
            className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-[#FFFBCC] px-[6px] py-[10px] text-center text-[20px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
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
