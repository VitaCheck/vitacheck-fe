import type { Combination } from "@/types/combination"; // 1번에서 만든 타입
import FlipCard from "./FlipCard";
import LoadingSkeletonCard from "./LoadingSkeletonCard";

interface CombinationCardListProps {
  goodCombinations: Combination[];
  riskyCombinations: Combination[];
  isLoading: boolean;
  isMobile: boolean; // 스켈레톤 크기 구분을 위해 isMobile 전달
}

export default function CombinationCardList({
  goodCombinations,
  riskyCombinations,
  isLoading,
  isMobile,
}: CombinationCardListProps) {
  return (
    <>
      {/* ⚠️ 주의가 필요한 조합 */}

      {/* 모바일 - 주의 조합 */}
      <div className="mt-8 px-7 md:hidden">
        <h2 className="text-[22px] font-semibold text-black">
          주의가 필요한 조합 TOP 5
        </h2>
        <p className="mt-1 text-[14px] text-[#6B6B6B]">
          카드를 눌러서 확인해 보세요 !
        </p>
      </div>
      <div className="hide-scrollbar overflow-x-auto px-3 md:hidden">
        <div className="mt-5 mr-4 mb-5 ml-4 flex w-max gap-[16px]">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <LoadingSkeletonCard key={i} isMobile />
              ))
            : riskyCombinations.map((combo) => (
                <FlipCard
                  key={combo.id}
                  name={combo.name}
                  description={combo.description}
                />
              ))}
        </div>
      </div>

      {/* PC - 주의 조합 (풀블리드 배경) */}
      <div className="hidden md:block">
        <div className="-mx-4 lg:-mx-[80px] xl:-mx-[120px] 2xl:-mx-[250px]">
          <div className="mx-auto max-w-screen-xl px-4 lg:px-[80px] xl:px-[120px] 2xl:px-[250px]">
            <h2 className="text-lg font-semibold whitespace-nowrap md:text-2xl">
              주의가 필요한 조합 TOP 5
            </h2>
            <span className="font-Pretendard text-[16px] leading-[120%] font-semibold tracking-[-0.02em] text-[#6B6B6B] lg:text-[16px] xl:text-[18px]">
              카드를 눌러서 확인해 보세요 !
            </span>
            <div className="mt-8 mb-15 flex justify-center">
              <div className="flex w-full gap-[15px] lg:gap-[25px] xl:gap-[25px]">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <LoadingSkeletonCard key={i} isMobile={false} />
                    ))
                  : riskyCombinations.map((combo) => (
                      <FlipCard
                        key={combo.id}
                        name={combo.name}
                        description={combo.description}
                      />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 궁합이 좋은 조합 ===== */}

      {/* 모바일 - 좋은 조합 */}
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
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <LoadingSkeletonCard key={i} isMobile />
              ))
            : goodCombinations.map((combo) => (
                <FlipCard
                  key={combo.id}
                  name={combo.name}
                  description={combo.description}
                />
              ))}
        </div>
      </div>

      {/* PC - 좋은 조합 (풀블리드 배경) */}
      <div className="hidden md:block">
        <div className="-mx-4 lg:-mx-[80px] xl:-mx-[120px] 2xl:-mx-[250px]">
          <div className="mx-auto max-w-screen-xl px-4 lg:px-[80px] xl:px-[120px] 2xl:px-[250px]">
            <h2 className="text-lg font-semibold whitespace-nowrap md:text-2xl">
              궁합이 좋은 조합 TOP 5
            </h2>
            <span className="font-Pretendard text-[16px] leading-[120%] font-semibold tracking-[-0.02em] text-[#6B6B6B] lg:text-[16px] xl:text-[18px]">
              카드를 눌러서 확인해 보세요 !
            </span>
            <div className="mt-8 mb-20 flex justify-center">
              <div className="flex w-full gap-[15px] lg:gap-[25px] xl:gap-[25px]">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <LoadingSkeletonCard key={i} isMobile={false} />
                    ))
                  : goodCombinations.map((combo) => (
                      <FlipCard
                        key={combo.id}
                        name={combo.name}
                        description={combo.description}
                      />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
