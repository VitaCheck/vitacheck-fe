// import { useNavigate } from "react-router-dom";

// interface ProductCardProps {
//   id: number;
//   imageSrc: string;
//   name: string;
//   widthClass?: string;
//   heightClass?: string;
//   fontSize?: number | string;
//   fontSizeClass?: string;
// }

// function ProductCard({
//   id,
//   imageSrc,
//   name,
//   widthClass = "w-[166px]",
//   heightClass = "h-[150px]",
//   fontSize = 18,
//   fontSizeClass = "",
// }: ProductCardProps) {
//   const navigate = useNavigate();

//   return (
//     <div
//       className="inline-block pt-3 pb-3 px-2 cursor-pointer"
//       onClick={() => navigate(`/product/${id}`)}
//     >
//       <div
//         className={`bg-white rounded-xl flex justify-center items-center
//           transition-transform duration-200 ease-in-out transform hover:scale-[1.03]
//           hover:shadow-lg ${widthClass} ${heightClass}`}
//         style={{
//           boxShadow: "2px 4px 12.2px rgba(0, 0, 0, 0.25)",
//         }}
//       >
//         <img src={imageSrc} alt={name} className="w-24 h-24 object-contain" />
//       </div>

//       <p
//         className={`mt-3 text-center font-semibold text-black ${widthClass} ${fontSizeClass}`}
//         style={{
//           fontSize:
//             !fontSizeClass && typeof fontSize === "number"
//               ? `${fontSize}px`
//               : undefined,
//         }}
//       >
//         {name}
//       </p>
//     </div>
//   );
// }

// export default ProductCard;

// src/components/ProductCard.tsx
import { useNavigate } from "react-router-dom";
import { logClick } from "@/apis/logs";

interface ProductCardProps {
  id: number;
  imageSrc: string;
  name: string;
  widthClass?: string;
  heightClass?: string;
  fontSize?: number | string;
  fontSizeClass?: string;
}

function ProductCard({
  id,
  imageSrc,
  name,
  widthClass = "w-[166px]",
  heightClass = "h-[150px]",
  fontSize = 18,
  fontSizeClass = "",
}: ProductCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    // 로그는 비동기 전송하되, 네비게이션은 즉시 진행
    logClick(name, "SUPPLEMENT").catch(() => {
      // 로깅 실패해도 화면 전환에 영향 없게 무시
    });
    navigate(`/product/${id}`);
  };

  return (
    <div
      className="inline-block pt-3 pb-3 px-2 cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={`bg-white rounded-xl flex justify-center items-center 
          transition-transform duration-200 ease-in-out transform hover:scale-[1.03]
          hover:shadow-lg ${widthClass} ${heightClass}`}
        style={{ boxShadow: "2px 4px 12.2px rgba(0, 0, 0, 0.25)" }}
      >
        {/* 사진만 클릭 시 전송하고 싶다면 아래 img에 onClick 넣고 부모 onClick 제거 */}
        <img src={imageSrc} alt={name} className="w-24 h-24 object-contain" />
      </div>

      <p
        className={`mt-3 text-center font-semibold text-black ${widthClass} ${fontSizeClass}`}
        style={{
          fontSize:
            !fontSizeClass && typeof fontSize === "number"
              ? `${fontSize}px`
              : undefined,
        }}
      >
        {name}
      </p>
    </div>
  );
}

export default ProductCard;
