// import { useNavigate } from "react-router-dom";

// interface IngredientCardProps {
//   id: number;
//   name: string;
// }

// const IngredientCard = ({ id, name }: IngredientCardProps) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       className="bg-white mb-3 rounded-[10px] px-[22px] py-[14px] h-[60px] shadow-[2px_3px_12.4px_rgba(0,0,0,0.16)]
//                  flex items-center justify-between sm:h-[70px] sm:w-full cursor-pointer"
//       onClick={() => navigate(`/ingredient/${id}`)}
//     >
//       <span className="text-base font-medium sm:text-[18px] sm:text-left">
//         {name}
//       </span>

//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         strokeWidth={2}
//         stroke="currentColor"
//         className="w-4 h-4 text-[#1C1B1F]"
//       >
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//       </svg>
//     </div>
//   );
// };

// export default IngredientCard;


import { useNavigate } from "react-router-dom";

interface IngredientCardProps {
  id: number;
  name: string;
}

const IngredientCard = ({ id, name }: IngredientCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ingredients/${encodeURIComponent(name)}`, {
      state: { id },
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-white mb-3 rounded-[10px] px-[22px] py-[14px] h-[60px] shadow-[2px_3px_12.4px_rgba(0,0,0,0.16)]
                 flex items-center justify-between sm:h-[70px] sm:w-full cursor-pointer w-full text-left"
    >
      <span className="text-base font-medium sm:text-[18px] sm:text-left">
        {name}
      </span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4 text-[#1C1B1F]"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

export default IngredientCard;
