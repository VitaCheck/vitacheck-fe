import ScrapList from "@/components/Scrap/ScrapList";
import ScrapTabHeader from "@/components/Scrap/ScrapTabHeader";
import ScrapIngredientList from "@/components/Scrap/ScrapIngredientList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";

const dummyItems = [
  { imageUrl: Logo, title: "제품 1" },
  { imageUrl: Logo, title: "제품 1" },
  { imageUrl: Logo, title: "제품 1" },
  { imageUrl: Logo, title: "제품 1" },
  { imageUrl: Logo, title: "제품 1" },
  { imageUrl: Logo, title: "제품 1" },
];

const dummyIngredients = ["오메가 3", "비타민 A", "유산균"];

// const ScrapPage = () => {
//   const [tab, setTab] = useState<"product" | "ingredient">("product");
//   const navigate = useNavigate();

//   const goBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div>
//       {/* 상단 */}
//       <div className="flex items-center justify-between mb-2">
//         <div className="w-full px-6 pt-4 pb-2 flex items-center">
//           <button
//             onClick={goBack}
//             className="mr-2 text-2xl text-black cursor-pointer"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>
//           <h1 className="text-[24px] font-semibold py-2">찜한 제품/성분</h1>
//         </div>
//       </div>

//       <ScrapTabHeader activeTab={tab} onChange={setTab} />

//       {/* 리스트 */}
//       {tab === "product" ? (
//         <ScrapList items={dummyItems} />
//       ) : (
//         <ScrapIngredientList items={dummyIngredients} />
//       )}
//     </div>
//   );
// };

const ScrapPage = () => {
  const [tab, setTab] = useState<"product" | "ingredient">("product");
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    // 배경색 및 정렬 처리
    <div className="bg-white sm:bg-[#F5F5F5] min-h-screen sm:pt-8 sm:px-4">
      {/* 콘텐츠 박스 */}
      <div className="sm:max-w-[850px] sm:mx-auto sm:bg-white sm:rounded-[20px] sm:shadow-sm sm:p-8">
        {/* 상단 */}
        <div className="flex items-center justify-between mb-2">
          <div className="w-full px-6 pt-4 pb-2 flex items-center sm:px-0 sm:pt-0 sm:pb-4">
            {/* 뒤로가기 버튼: sm 이상이면 숨김 */}
            <button
              onClick={goBack}
              className="mr-2 text-2xl text-black cursor-pointer sm:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex-1">
              <h1 className="text-[24px] font-semibold py-2">찜한 제품/성분</h1>
            </div>
          </div>
        </div>

        {/* 탭 헤더 */}
        <ScrapTabHeader activeTab={tab} onChange={setTab} />

        {/* 리스트 */}
        {tab === "product" ? (
          <ScrapList items={dummyItems} />
        ) : (
          <ScrapIngredientList items={dummyIngredients} />
        )}
      </div>
    </div>
  );
};

export default ScrapPage;
