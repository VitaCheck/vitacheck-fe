import type { Combination } from "@/types/combination";
import FlipCard from "./FlipCard";

interface CombinationCardListProps {
  goodCombinations: Combination[];
  cautionCombinations: Combination[];
}

export default function CombinationCardList({
  goodCombinations,
  cautionCombinations,
}: CombinationCardListProps) {
  return (
    <>
      {/* ⚠️ 주의가 필요한 조합 */}
      {cautionCombinations?.length > 0 && (
        <>
          {/* 📱 모바일 - 주의 조합 */}
          <div className="mt-10 px-7 md:hidden">
            <h2 className="text-[22px] font-semibold text-black">
              주의가 필요한 조합 TOP 5
            </h2>
            <p className="mt-1 text-[14px] text-[#6B6B6B]">
              카드를 눌러서 확인해 보세요 !
            </p>
          </div>
          <div className="hide-scrollbar overflow-x-auto px-3 md:hidden">
            <div className="mt-5 mr-4 mb-5 ml-4 flex w-max gap-[16px]">
              {cautionCombinations.map((combo: Combination) => (
                <FlipCard
                  key={combo.id}
                  name={combo.name}
                  description={combo.description}
                />
              ))}
            </div>
          </div>

          {/* 💻 PC - 주의 조합 */}
          <section className="mt-20 hidden md:block">
            <div className="mx-auto w-full max-w-[1050px] px-6 md:px-8">
              <h2 className="font-Pretendard mt-3 mb-1 w-full text-left text-[24px] leading-[120%] font-bold tracking-[-0.02em] text-black lg:text-[28px] xl:text-[32px]">
                주의가 필요한 조합 TOP 5
              </h2>
              <span className="font-Pretendard block text-left text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-[#6B6B6B] lg:text-[20px] xl:text-[22px]">
                카드를 눌러서 확인해 보세요 !
              </span>
              <div className="mt-8 mb-15 flex gap-2 lg:gap-4 xl:gap-6">
                {cautionCombinations.map((combo: Combination) => (
                  <FlipCard
                    key={combo.id}
                    name={combo.name}
                    description={combo.description}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ===== 궁합이 좋은 조합 ===== */}
      {goodCombinations?.length > 0 && (
        <>
          {/* 📱 모바일 - 좋은 조합 */}
          <div className="mt-10 px-7 md:hidden">
            <h2 className="text-[22px] font-semibold text-black">
              궁합이 좋은 조합 TOP 5
            </h2>
            <p className="mt-1 text-[14px] text-[#6B6B6B]">
              카드를 눌러서 확인해 보세요 !
            </p>
          </div>
          <div className="hide-scrollbar overflow-x-auto px-3 md:hidden">
            <div className="mt-5 mr-4 mb-15 ml-4 flex w-max gap-[16px]">
              {goodCombinations.map((combo: Combination) => (
                <FlipCard
                  key={combo.id}
                  name={combo.name}
                  description={combo.description}
                />
              ))}
            </div>
          </div>

          {/* 💻 PC - 좋은 조합 */}
          <section className="mt-10 hidden md:block">
            <div className="mx-auto w-full max-w-[1050px] px-6 md:px-8">
              <h2 className="font-Pretendard mt-3 mb-1 w-full text-left text-[24px] leading-[120%] font-bold tracking-[-0.02em] text-black lg:text-[28px] xl:text-[32px]">
                궁합이 좋은 조합 TOP 5
              </h2>
              <span className="font-Pretendard block text-left text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-[#6B6B6B] lg:text-[20px] xl:text-[22px]">
                카드를 눌러서 확인해 보세요 !
              </span>
              <div className="mt-8 mb-20 flex gap-2 lg:gap-4 xl:gap-6">
                {goodCombinations.map((combo: Combination) => (
                  <FlipCard
                    key={combo.id}
                    name={combo.name}
                    description={combo.description}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
