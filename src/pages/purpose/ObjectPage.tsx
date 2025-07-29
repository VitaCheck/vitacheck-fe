import { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const PurposeCardList = () => {
  const navigate = useNavigate();

  const goToProductList = () => {
    const selectedTitles = cards
      .filter((card) => selectedIds.includes(card.id))
      .map((card) => card.title);

    navigate("/products", {
      state: { selected: selectedTitles },
    });
  };

  const cards = [
    { id: 0, title: "눈 건강", imageUrl: "/images/VitaCheckPurpose/purpose1.png" },
    { id: 1, title: "뼈 건강", imageUrl: "/images/VitaCheckPurpose/purpose2.png" },
    { id: 2, title: "수면/스트레스", imageUrl: "/images/VitaCheckPurpose/purpose3.png" },
    { id: 3, title: "혈중 콜레스테롤", imageUrl: "/images/VitaCheckPurpose/purpose4.png" },
    { id: 4, title: "체지방", imageUrl: "/images/VitaCheckPurpose/purpose5.png" },
    { id: 5, title: "피부 건강", imageUrl: "/images/VitaCheckPurpose/purpose6.png" },
    { id: 6, title: "피로감", imageUrl: "/images/VitaCheckPurpose/purpose7.png" },
    { id: 7, title: "면역력", imageUrl: "/images/VitaCheckPurpose/purpose8.png" },
    { id: 8, title: "소화/위 건강", imageUrl: "/images/VitaCheckPurpose/purpose9.png" },
    { id: 9, title: "운동 능력", imageUrl: "/images/VitaCheckPurpose/purpose10.png" },
    { id: 10, title: "여성 갱년기", imageUrl: "/images/VitaCheckPurpose/purpose11.png" },
    { id: 11, title: "치아/잇몸", imageUrl: "/images/VitaCheckPurpose/purpose12.png" },
    { id: 12, title: "탈모/손톱 건강", imageUrl: "/images/VitaCheckPurpose/purpose13.png" },
    { id: 13, title: "혈압", imageUrl: "/images/VitaCheckPurpose/purpose14.png" },
    { id: 14, title: "혈중 중성지방", imageUrl: "/images/VitaCheckPurpose/purpose15.png" },
    { id: 15, title: "빈혈", imageUrl: "/images/VitaCheckPurpose/purpose16.png" },
    { id: 16, title: "노화/항산화", imageUrl: "/images/VitaCheckPurpose/purpose17.png" },
    { id: 17, title: "두뇌활동", imageUrl: "/images/VitaCheckPurpose/purpose18.png" },
    { id: 18, title: "간 건강", imageUrl: "/images/VitaCheckPurpose/purpose19.png" },
    { id: 19, title: "혈관/혈액 순환", imageUrl: "/images/VitaCheckPurpose/purpose20.png" },
    { id: 20, title: "장 건강", imageUrl: "/images/VitaCheckPurpose/purpose21.png" },
    { id: 21, title: "호흡기 건강", imageUrl: "/images/VitaCheckPurpose/purpose22.png" },
    { id: 22, title: "관절 건강", imageUrl: "/images/VitaCheckPurpose/purpose23.png" },
    { id: 23, title: "임산부/태아 건강", imageUrl: "/images/VitaCheckPurpose/purpose24.png" },
    { id: 24, title: "혈당", imageUrl: "/images/VitaCheckPurpose/purpose25.png" },
    { id: 25, title: "갑상선 건강", imageUrl: "/images/VitaCheckPurpose/purpose26.png" },
    { id: 26, title: "여성 건강", imageUrl: "/images/VitaCheckPurpose/purpose27.png" },
    { id: 27, title: "남성 건강", imageUrl: "/images/VitaCheckPurpose/purpose28.png" },
  ];

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleCard = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const renderCard = (card: (typeof cards)[number], isSelected: boolean) => (
      <div key={card.id} className="w-full max-w-[110px] md:max-w-[290px] flex flex-col items-center">
         <div
            onClick={() => toggleCard(card.id)}
            className={`
               w-[110px] h-[118px] md:w-[290px] md:h-[240px]
               rounded-xl shadow-md cursor-pointer relative md:rounded-3xl md:shadow-[2px_3px_12.4px_0px_rgba(0,0,0,0.16)]
               ${isSelected ? "bg-[#EFEFEF]" : "bg-white"}
            `}
         >
            <div
               className={`
                  top-[11px] left-[5px] w-[100px] h-[100px]
                  md:w-[214px] md:h-[214px] md:top-[13px] md:left-[38px]
                  relative
               `}
            >
               <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover"
               />
               <div
                  className={`
                     absolute left-[6px] top-0 md:left-[-14px] md:top-[9px]
                     w-[14px] h-[14px] md:w-[34px] md:h-[34px]
                  `}
               >
                  <img
                     src={
                        isSelected
                        ? "/images/PNG/PurposeObject/checkbox.png"   // 선택됨 이미지
                        : "/images/PNG/PurposeObject/box.png" // 선택 전 이미지
                     }
                     alt={isSelected ? "선택됨" : "선택되지 않음"}
                     className="w-full h-full object-contain"
                  />
               </div>
            </div>
         </div>
         <p className="mt-[18px] h-[22px] text-sm md:text-[34px] text-center font-semibold">
            {card.title}
         </p>
      </div>
   );



  return (
    <>
      {/* 모바일 전용 */}
      <div className="md:hidden w-[430px] mx-auto mt-[70px] mb-[124px]">
        <div className="flex flex-col ml-[38px]">
          <h1 className="text-4xl tracking-[-0.72px] font-medium">목적별</h1>
          <h2 className="text-sm text-[#808080] mt-[1px] font-medium">최대 3개 선택</h2>
        </div>
        <div className="mt-[33px] grid grid-cols-3 gap-x-[20px] gap-y-[46px] px-[30px]">
          {cards.map((card) => renderCard(card, selectedIds.includes(card.id)))}
        </div>
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[430px] h-[76px] bg-white z-10" />
        <button
          onClick={goToProductList}
          disabled={selectedIds.length === 0}
          className={`fixed bottom-[42px] left-1/2 -translate-x-1/2 w-[389px] h-[68px] rounded-4xl z-50 transition-all duration-200 flex justify-center items-center ${
            selectedIds.length === 0 ? "bg-[#EEEEEE] cursor-not-allowed" : "bg-[#FFEB9D]"
          }`}
        >
          <span className="text-black text-xl font-semibold ml-[109px] mr-[84px]">영양제 확인하기</span>
          <img
            src="/images/PNG/PurposeObject/arrowforward.png" // 실제 이미지 경로로 교체
            alt="화살표"
            className="h-[22px] object-contain"
         />
        </button>
      </div>

      {/* PC 전용 - 배경색 포함 */}
      <div className="hidden md:block w-full bg-[#FAFAFA]">
         <div className="max-w-[1280px] mx-auto pt-[100px] pb-[187px] scale-[0.66] origin-top">
            {/* 상단 헤더 라인: 제목 + 버튼 */}
            <div className="flex justify-between items-center mb-[6px]">
               <h1 className="text-[52px] font-bold">목적별</h1>
               <button
                  onClick={goToProductList}
                  disabled={selectedIds.length === 0}
                  className={`w-[212px] h-[80px] rounded-full text-[28px] font-semibold flex justify-center items-center transition ${
                     selectedIds.length === 0 ? "bg-[#EEEEEE] cursor-not-allowed" : "bg-[#FFEB9D]"
               }`}
               >
               영양제 확인
               </button>
            </div>
            <h2 className="text-[24px] font-medium text-[#808080]">최대 3개 선택</h2>

            {/* 카드 리스트 */}
            <div className="grid grid-cols-4 gap-x-[40px] gap-y-[70px] mt-[60px]">
               {cards.map((card) => renderCard(card, selectedIds.includes(card.id)))}
            </div>
         </div>
      </div>
    </>
  );
};

export default PurposeCardList;
