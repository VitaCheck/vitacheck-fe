// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { fetchAiRecommendations } from "@/apis/aiRecommendApi";
// import { fetchSupplementDetail } from "@/apis/supplementApi";
// import type { SupplementDetail } from "@/apis/supplementApi";
// import ProductCard from "@/components/ProductCard";
// import AI from "@/assets/aiicon.png";

// interface EnrichedCombination {
//   combinationName: string;
//   reason: string;
//   supplements: SupplementDetail[];
// }

// const AiRecommendPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation() as { state?: { selectedPurposes?: string[] } };

//   const selectedPurposes = location.state?.selectedPurposes || [
//     "눈 건강",
//     "피로감",
//   ];

//   const [recommendations, setRecommendations] = useState<EnrichedCombination[]>(
//     []
//   );
//   const [isLoading, setIsLoading] = useState(true);
//   const [mainReason, setMainReason] = useState<string>("");

//   useEffect(() => {
//     const loadRecommendations = async () => {
//       try {
//         setIsLoading(true);
//         // 1️⃣ AI 추천 결과 가져오기
//         const aiRes = await fetchAiRecommendations({
//           purposes: selectedPurposes,
//         });
//         const combos = aiRes.result?.recommendedCombinations || [];

//         // 2️⃣ 각 조합별 supplementIds를 기반으로 상세조회
//         const enriched: EnrichedCombination[] = await Promise.all(
//           combos.map(async (combo) => {
//             const supplementDetails = await Promise.all(
//               combo.supplementIds.map((id) =>
//                 fetchSupplementDetail(id).catch((err) => {
//                   console.error("❌ 개별 제품 조회 실패:", err);
//                   return null;
//                 })
//               )
//             );
//             return {
//               combinationName: combo.combinationName,
//               reason: combo.reason,
//               supplements: supplementDetails.filter(
//                 (item): item is SupplementDetail => item !== null
//               ),
//             };
//           })
//         );

//         setRecommendations(enriched);

//         // 상단 reason은 첫 번째 조합 기준으로 표시
//         if (enriched.length > 0) {
//           setMainReason(enriched[0].reason);
//         } else {
//           setMainReason("추천 결과가 없습니다.");
//         }
//       } catch (error) {
//         console.error("❌ AI 추천 불러오기 실패:", error);
//         setMainReason("AI 추천 정보를 불러오지 못했습니다.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadRecommendations();
//   }, [selectedPurposes]);

//   return (
//     <div className="flex flex-col w-full min-h-screen px-[24px] pt-[40px] pb-[80px] font-[Pretendard] bg-[#FCFDE7]">
//       {/* 상단 헤더 */}
//       <div className="flex items-center gap-[8px] mb-[14px]">
//         <img src={AI} alt="AI" className="w-[22px] h-[22px]" />
//         <h1 className="text-[22px] font-semibold text-[#222]">
//           AI 추천 영양제 조합
//         </h1>
//       </div>

//       {/* 설명 박스 */}
//       <div className="bg-[#F4F4F4] rounded-[10px] p-[12px] text-[13px] text-[#555] leading-[1.6] mb-[24px] whitespace-pre-line">
//         {isLoading
//           ? "AI가 사용자 목적에 맞는 조합을 분석 중입니다..."
//           : mainReason}
//       </div>

//       {/* 조합 목록 */}
//       {!isLoading && recommendations.length > 0 ? (
//         <div className="flex flex-col gap-[32px]">
//           {recommendations.map((combo, idx) => (
//             <div
//               key={idx}
//               className="bg-white rounded-[16px] p-[20px] shadow-[2px_4px_12px_rgba(0,0,0,0.15)]"
//             >
//               <h2 className="text-[16px] font-semibold text-[#222] mb-[8px]">
//                 {combo.combinationName}
//               </h2>
//               <p className="text-[13px] text-[#666] leading-[1.5] mb-[16px]">
//                 {combo.reason}
//               </p>

//               {/* 제품 카드 */}
//               <div className="grid grid-cols-2 gap-x-[10px] gap-y-[20px] justify-items-center">
//                 {combo.supplements.map((s) => (
//                   <ProductCard
//                     key={s.supplementId}
//                     id={s.supplementId}
//                     imageSrc={s.supplementImageUrl}
//                     name={s.supplementName}
//                     widthClass="w-[150px]"
//                     heightClass="h-[150px]"
//                     fontSize={14}
//                   />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         !isLoading && (
//           <p className="text-center text-[#666] mt-[40px]">
//             추천 결과가 없습니다.
//           </p>
//         )
//       )}
//     </div>
//   );
// };

// export default AiRecommendPage;

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchAiRecommendations } from "@/apis/aiRecommendApi";
import { fetchSupplementDetail } from "@/apis/supplementApi";
import type { SupplementDetail } from "@/apis/supplementApi";
import ProductCard from "@/components/ProductCard";
import AI from "@/assets/aiicon.png";
import LoadingCat from "@/assets/loadingcat.png";

interface EnrichedCombination {
  combinationName: string;
  reason: string;
  supplements: SupplementDetail[];
}

const AiRecommendPage = () => {
  const location = useLocation() as { state?: { selectedPurposes?: string[] } };
  const selectedPurposes = location.state?.selectedPurposes || ["눈 건강"];

  const [recommendations, setRecommendations] = useState<EnrichedCombination[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  // ✅ 내부 전용 애니메이션 정의 (이 컴포넌트 안에서만 작동)
  const bounceStyle = `
    @keyframes bounceSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .bounce-slow {
      animation: bounceSlow 1.8s ease-in-out infinite;
    }
  `;

  const LoadingSection = () => (
    <div className="flex flex-col items-center justify-center mt-[80px] mb-[60px]">
      <style>{bounceStyle}</style>

      <img
        src={LoadingCat}
        alt="로딩 중 고양이"
        className="w-[309px] h-[285px] mb-4 bounce-slow"
      />
      <p className="text-[15px] text-black animate-pulse">
        영양제 조합을 찾는 중이에요...
      </p>
    </div>
  );

  useEffect(() => {
    const loadRecommendations = async () => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      try {
        setIsLoading(true);
        const aiRes = await fetchAiRecommendations({
          purposes: selectedPurposes,
        });

        console.log(
          "📤 보낸 요청:",
          JSON.stringify({ purposes: selectedPurposes })
        );

        const combos = aiRes.result?.recommendedCombinations || [];

        const enrichedData: EnrichedCombination[] = await Promise.all(
          combos.map(async (combo) => {
            const supplementDetails = await Promise.all(
              combo.supplementIds.map((id: number) =>
                fetchSupplementDetail(id).catch((err) => {
                  console.error("❌ 개별 제품 조회 실패:", err);
                  return null;
                })
              )
            );

            return {
              combinationName: combo.combinationName,
              reason: combo.reason,
              supplements: supplementDetails.filter(
                (s): s is SupplementDetail => s !== null
              ),
            };
          })
        );

        setRecommendations(enrichedData);
      } catch (error) {
        console.error("❌ AI 추천 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [JSON.stringify(selectedPurposes)]);

  return (
    <div className="flex flex-col w-full min-h-screen px-8 pt-[40px] pb-[80px] font-[Pretendard] sm:px-30">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-[8px] mb-[14px]">
        <img src={AI} alt="AI" className="w-[22px] h-[22px]" />
        <h1 className="text-[22px] font-semibold text-[#222]">
          AI 추천 영양제 조합
        </h1>
      </div>

      {/* 로딩 문구 */}
      {isLoading && <LoadingSection />}

      {/* 결과 표시 */}
      {!isLoading && recommendations.length > 0 ? (
        <div className="flex flex-col gap-[40px]">
          {recommendations.map((combo, idx) => (
            <div key={idx} className="flex flex-col gap-[16px]">
              <div className="bg-[#F3F3F3] rounded-[16px] p-[18px] shadow-[2px_4px_12px_rgba(0,0,0,0.08)] border border-[#EAEAEA]">
                <h2 className="text-[16px] font-semibold text-[#222] mb-[8px]">
                  {combo.combinationName}
                </h2>
                <p className="text-[13px] text-[#555] leading-[1.6] whitespace-pre-line">
                  {combo.reason}
                </p>
              </div>

              <div
                className="
                  grid grid-cols-2 sm:grid-cols-3 
                  gap-x-[10px] gap-y-[20px] 
                  justify-items-center 
                  bg-white rounded-[16px]
                "
              >
                {combo.supplements.map((s) => (
                  <ProductCard
                    key={s.supplementId}
                    id={s.supplementId}
                    imageSrc={s.supplementImageUrl}
                    name={s.supplementName}
                    widthClass="w-[150px]"
                    heightClass="h-[150px]"
                    fontSize={14}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <p className="text-center text-[#666] mt-[40px]">
            추천 결과가 없습니다.
          </p>
        )
      )}
    </div>
  );
};

export default AiRecommendPage;
