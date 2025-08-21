// import { Link } from "react-router-dom";

// interface MobileMainCardProps {
//   title: string;
//   icon: string;
//   to: string;
// }

// const MobileMainCard = ({ title, icon, to }: MobileMainCardProps) => {
//   return (
//     <Link to={to} className="flex flex-col items-center w-[80px] sm:w-[90px]">
//       {/* 원형 배경 안의 아이콘 */}
//       <div className="w-[70px] h-[70px] rounded-[18px] bg-[#f4f4f4] flex items-center justify-center">
//         <img
//           src={icon}
//           alt="icon"
//           className="w-[35px] h-[35px] object-contain"
//         />
//       </div>

//       {/* 텍스트 */}
//       <p className="mt-2 text-center text-[14px] font-medium text-black">
//         {title}
//       </p>
//     </Link>
//   );
// };

// export default MobileMainCard;


// MobileMainCard.tsx (퍼센트 폭 제거, 콘텐츠 기준 고정폭 + 축소)
import { Link } from "react-router-dom";

interface MobileMainCardProps {
  title: string;
  icon: string;
  to: string;
}

const MobileMainCard = ({ title, icon, to }: MobileMainCardProps) => {
  return (
    <Link
      to={to}
      className="
        flex-none flex flex-col items-center
      "
    >
      {/* 네모 박스: 화면 줄어들면 자동 축소 (한 줄 유지) */}
      <div
        className="
          rounded-[18px] bg-[#f4f4f4] flex items-center justify-center
          w-[clamp(60px,18vw,90px)] h-[clamp(60px,18vw,90px)]
        "
      >
        <img
          src={icon}
          alt="icon"
          className="w-[clamp(30px,8vw,45px)] h-[clamp(30px,8vw,45px)] object-contain"
        />
      </div>

      <p className="mt-2 text-center text-[clamp(12px,3.5vw,15px)] font-medium text-black leading-none">
        {title}
      </p>
    </Link>
  );
};

export default MobileMainCard;