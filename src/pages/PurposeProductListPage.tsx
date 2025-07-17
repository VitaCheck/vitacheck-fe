import { useLocation } from "react-router-dom";
import RecommendedProductSection from "../components/PurposeRecommendedProductSection";


const PurposeProductList = () => {
  const location = useLocation();
  const selected = location.state?.selected || [];

    let titleText = "";

   if (selected.length === 1) {
      titleText = selected[0];
   } else if (selected.length >= 2) {
      titleText = `${selected[0]} 외 ${selected.length - 1}`;
   }

   return (
      <>
         {/* 목적 제목 / 목적 드롭다운 */}
         <div className="flex items-center gap-[22px] w-[430px] mx-auto mt-[124px]">
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
      </>
   );
};

export default PurposeProductList;