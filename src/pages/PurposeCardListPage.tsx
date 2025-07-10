import { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const PurposeCardList = () => {
   const navigate = useNavigate();

   const goToProductList = () => {
      const selectedTitles = cards
         .filter(card => selectedIds.includes(card.id))
         .map(card => card.title);

      navigate("/products", {
         state: { selected: selectedTitles }
      });
   };

   const cards = [
    { id: 0, title: '눈 건강', imageUrl: "/images/VitaCheckPurpose/purpose1.png"},
    { id: 1, title: '뼈 건강', imageUrl: "/images/VitaCheckPurpose/purpose2.png"},
    { id: 2, title: '수면/스트레스', imageUrl: "/images/VitaCheckPurpose/purpose3.png" },
    { id: 3, title: '혈중 콜레스테롤', imageUrl: "/images/VitaCheckPurpose/purpose4.png" },
    { id: 4, title: '체지방', imageUrl: "/images/VitaCheckPurpose/purpose5.png" },
    { id: 5, title: '피부 건강', imageUrl: "/images/VitaCheckPurpose/purpose6.png" },
    { id: 6, title: '피로감', imageUrl: "/images/VitaCheckPurpose/purpose7.png" },
    { id: 7, title: '면역력', imageUrl: "/images/VitaCheckPurpose/purpose8.png" },
    { id: 8, title: '소화/위 건강', imageUrl: "/images/VitaCheckPurpose/purpose9.png" },
    { id: 9, title: '운동 능력', imageUrl: "/images/VitaCheckPurpose/purpose10.png" },
    { id: 10, title: '여성 갱년기', imageUrl: "/images/VitaCheckPurpose/purpose11.png" },
    { id: 11, title: '치아/잇몸', imageUrl: "/images/VitaCheckPurpose/purpose12.png" },
    { id: 12, title: '탈모/손톱 건강', imageUrl: "/images/VitaCheckPurpose/purpose13.png" },
    { id: 13, title: '혈압', imageUrl: "/images/VitaCheckPurpose/purpose14.png"},
    { id: 14, title: '혈중 중성지방', imageUrl: "/images/VitaCheckPurpose/purpose15.png"},
    { id: 15, title: '빈혈', imageUrl: "/images/VitaCheckPurpose/purpose16.png"},
    { id: 16, title: '노화/항산화', imageUrl: "/images/VitaCheckPurpose/purpose17.png" },
    { id: 17, title: '두뇌활동', imageUrl: "/images/VitaCheckPurpose/purpose18.png" },
    { id: 18, title: '간 건강', imageUrl: "/images/VitaCheckPurpose/purpose19.png" },
    { id: 19, title: '혈관/혈액 순환', imageUrl: "/images/VitaCheckPurpose/purpose20.png" },
    { id: 20, title: '장 건강', imageUrl: "/images/VitaCheckPurpose/purpose21.png" },
    { id: 21, title: '호흡기 건강', imageUrl: "/images/VitaCheckPurpose/purpose22.png" },
    { id: 22, title: '관절 건강', imageUrl: "/images/VitaCheckPurpose/purpose23.png" },
    { id: 23, title: '임산부/태아 건강', imageUrl: "/images/VitaCheckPurpose/purpose24.png" },
    { id: 24, title: '혈당', imageUrl: "/images/VitaCheckPurpose/purpose25.png" },
    { id: 25, title: '갑상선 건강', imageUrl: "/images/VitaCheckPurpose/purpose26.png" },
    { id: 26, title: '여성 건강', imageUrl: "/images/VitaCheckPurpose/purpose27.png" },
    { id: 27, title: '남성 건강', imageUrl: "/images/VitaCheckPurpose/purpose28.png" },
   ];

   const [selectedIds, setSelectedIds] = useState<number[]>([]);

   const toggleCard = (id: number) => {
      setSelectedIds((prev) => {
         // 이미 선택되어 있다면 해제
         if (prev.includes(id)) {
            return prev.filter((v) => v !== id);
         }
         // 선택된 게 3개 미만일 때만 추가
         if (prev.length < 3) {
            return [...prev, id];
         }
         return prev; // 3개 이상이면 추가 안 함
      });
   };

   return(
      <>
         <div className="w-[430px] mx-auto mt-[124px] mb-[124px]">
            <div className="flex flex-col ml-[38px]">
               <h1 className="text-4xl tracking-[-0.72px] font-medium">목적별</h1>
               <h2 className="text-sm text-[#808080] mt-[1px] font-medium">최대 3개 선택</h2>
            </div>

            {/* 카드 리스트 */}
            <div className="mt-[33px] grid grid-cols-3 gap-x-[20px] gap-y-[46px] px-[30px]">
               {cards.map((card) => {
                  const isSelected = selectedIds.includes(card.id);
                  return (
                     <div
                     key={card.id}
                     className="w-[110px] h-[158px] flex flex-col items-center"
                     >
                     {/* 카드 네모 박스 */}
                     <div
                        onClick={() => toggleCard(card.id)}
                        className={`w-[110px] h-[118px] rounded-xl shadow-md cursor-pointer relative ${
                           isSelected ? "bg-[#EFEFEF]" : "bg-white"
                        }`}
                     >
                        {/* 이미지 (x:5, y:11) */}
                        <div className="absolute top-[11px] left-[5px] w-[100px] h-[100px] relative">
                           <img
                              src={card.imageUrl}
                              alt={card.title}
                              className="w-full h-full object-cover rounded-md"
                           />
                           {/* 체크박스 (이미지 기준 x:6, y:0) */}
                           <div
                           className={`absolute left-[6px] top-0 w-[14px] h-[14px] rounded-xs flex items-center justify-center
                              ${isSelected ? "bg-[#C7C7C7]" : "bg-white border border-[#9C9A9A]"}`}
                           >
                              {isSelected && <IoMdCheckmark className="text-white text-[10px]" />}
                           </div>
                        </div>
                     </div>

                     {/* 제목 (margin-top: 18px, height: 22px) */}
                     <p className="mt-[18px] h-[22px] text-sm text-center font-semibold">
                        {card.title}
                     </p>
                     </div>
                  );
               })}
            </div>
         </div>

         {/* 영양제 확인하기 버튼 */}
         <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[430px] h-[76px] bg-white z-10" />
         <button
            onClick={goToProductList}
            disabled={selectedIds.length === 0}
            className={`fixed bottom-[42px] left-1/2 -translate-x-1/2 w-[389px] h-[68px] rounded-4xl z-50
                         transition-all duration-200 flex justify-center items-center
                        ${selectedIds.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#FFEB9D]"}`}
         >
            <span className="text-black text-xl font-semibold ml-[109px] mr-[84px]">영양제 확인하기</span>
            <MdArrowForwardIos className="w-[18px] h-[18px]" />
         </button>
      </>
   );
};

export default PurposeCardList;