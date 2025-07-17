import { useLocation } from "react-router-dom";
import RecommendedProductSection from "../../components/Purpose/PurposeRecommendedProductSection";
import useIsMobile from "@/hooks/useIsMoblie";

const PurposeProductList = () => {
  const location = useLocation();
  const selected = location.state?.selected || [];
  const isMobile = useIsMobile();

   let titleText = "";

   if (isMobile) {
   // 모바일 버전
      if (selected.length === 1) {
         titleText = selected[0];
      } else if (selected.length >= 2) {
         titleText = `${selected[0]} 외 ${selected.length - 1}`;
      }
   } else {
      // PC 버전
      if (selected.length === 1) {
         titleText = selected[0];
      } else if (selected.length === 2) {
         titleText = `${selected[0]} / ${selected[1]}`;
      } else if (selected.length === 3) {
         titleText = `${selected[0]} / ${selected[1]} / ${selected[2]}`;
      }
   }

   return (
      <> 
         {/* 모바일 전용 */}
         {/* 목적 제목 / 목적 드롭다운 */}
         <div className="md:hidden flex items-center gap-[22px] w-[430px] mx-auto mt-[124px]">
            {/* 제목 */}
            <div className="ml-[38px]">
               <h1 className="text-[30px] tracking-[-0.6px] font-semibold">{titleText}</h1>
            </div>

            {/* 드롭다운 */}
            <div className="relative">
               <select
                  className="w-[100px] h-[24px] pl-[5px] pr-[3px] text-[14px] font-medium bg-[#D9D9D9] focus:outline-none"
               >
                  {selected.map((item: string, index: number) => (
                  <option key={index} value={item}>{item}</option>
                  ))}
               </select>
            </div>
         </div>
         <div className="md:hidden">
            <div className="w-[430px] mx-auto mt-[20px]">
               <div className="flex flex-col ml-[38px]">
                  <RecommendedProductSection />
               </div>
            </div>
            <div className="w-[430px] mx-auto mt-[20px]">
               <div className="flex flex-col ml-[38px]">
                  <RecommendedProductSection />
               </div>
            </div>
         </div>

         {/* PC 전용 - 배경색 포함 */}
         <div className="hidden md:block w-full bg-[#FAFAFA] pb-[187px]">
            <div className="max-w-[1280px] mx-auto pt-[100px]">
               {/* 상단 헤더 라인: 제목 */}
               <div className="flex justify-between items-center">
                  <h1 className="text-[52px] tracking-[-1.04px] font-bold">{titleText}</h1>
                  {/* 드롭다운 */}
                  <div className="relative">
                     <select
                        className="w-[200px] h-[45px] pl-[5px] pr-[3px] text-[24px] font-medium bg-[#D9D9D9] focus:outline-none"
                     >
                        {selected.map((item: string, index: number) => (
                        <option key={index} value={item}>{item}</option>
                        ))}
                     </select>
                  </div>
               </div>
            </div>
            <div className="w-[1280px] mx-auto mt-[60px]">
               <div className="flex flex-col">
                  <RecommendedProductSection />
               </div>
            </div>
            <div className="w-[1280px] mx-auto mt-[60px]">
               <div className="flex flex-col">
                  <RecommendedProductSection />
               </div>
            </div>
         </div>
      </>
   );
};

export default PurposeProductList;