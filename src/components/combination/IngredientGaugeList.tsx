import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IngredientResult } from "@/types/combination";
import {
  computeFillPercent,
  calcGauge,
  REC_LINE_POS,
  UPPER_LINE_POS,
} from "@/utils/gauage";
import vitaminArrow from "../../assets/비타민 C_arrow.png";
import line from "/images/PNG/조합 2-1/background line.png";

interface IngredientGaugeListProps {
  ingredientResults: IngredientResult[];
}

export default function IngredientGaugeList({
  ingredientResults,
}: IngredientGaugeListProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"전체" | "초과">("전체");
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  // '초과' 탭 필터링 로직 (원본 코드에서 가져옴)
  const filteredIngredients: IngredientResult[] =
    activeTab === "전체"
      ? ingredientResults
      : ingredientResults.filter((i) => {
          // 게이지 기준(상한선 라인) 초과 체크
          const gauge = calcGauge(i);
          const isOverUpperInGauge = gauge.isOverUpperLimit;
          const isOverUpperLine = gauge.widthPct > gauge.upperPct;

          // 🔥 렌더링 게이지 기준으로도 상한 라인(두 번째 점선) 초과 시 포함
          const fillPct = computeFillPercent(i);
          const exceedsSecondDashed = fillPct > UPPER_LINE_POS;

          // (선택) 일반 기준치 예외 처리 유지
          let isOverGeneralLimit = false;
          if (i.recommendedAmount === null && i.upperAmount === null) {
            if (i.unit === "IU") {
              if (
                i.ingredientName.includes("비타민 D") &&
                i.totalAmount > 4000
              ) {
                isOverGeneralLimit = true;
              } else if (
                i.ingredientName.includes("비타민 A") &&
                i.totalAmount > 10000
              ) {
                isOverGeneralLimit = true;
              }
            } else if (i.unit === "mg") {
              if (
                i.ingredientName.includes("비타민 C") &&
                i.totalAmount > 2000
              ) {
                isOverGeneralLimit = true;
              } else if (i.totalAmount > 1000) {
                // 이 로직은 너무 광범위할 수 있으니 주의 (원본 코드 주석 참고)
                isOverGeneralLimit = true;
              }
            }
          }

          // ✅ ‘초과’ 탭 표시 조건
          const shouldShow = computeFillPercent(i) > UPPER_LINE_POS;
          return shouldShow || isOverGeneralLimit; // 게이지 기준 또는 일반 기준 초과
        });

  return (
    <>
      {/* PC 섭취량 탭 */}
      <div className="mt-[55px] hidden md:block">
        <div className="relative mx-auto w-full max-w-[1100px]">
          <div className="pointer-events-none absolute top-[56px] right-1/15 left-1/15 z-0 h-[8px] rounded-full bg-[#E5E5E5]" />
          <div className="relative z-10 flex justify-center">
            <div className="flex gap-80">
              {["전체", "초과"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "전체" | "초과")}
                  className="font-pretendard relative mb-5 py-2 text-[30px] leading-[120%] font-semibold tracking-[-0.02em]"
                >
                  <span
                    className={
                      activeTab === tab
                        ? tab === "초과"
                          ? "text-[#E70000]"
                          : "text-black"
                        : "text-[#9C9A9A]"
                    }
                  >
                    {tab}
                  </span>
                  {activeTab === tab && (
                    <span className="absolute top-[56px] left-1/2 z-10 h-[8px] w-[140px] -translate-x-1/2 rounded-full bg-black" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 버전 탭 */}
      <div className="mt-10 mb-2 md:hidden">
        <div className="relative mx-auto w-[350px]">
          <img
            src={line}
            alt=""
            className="pointer-events-none absolute bottom-0 left-1/2 h-[6px] w-[calc(100%-32px)] max-w-[358px] -translate-x-1/2 select-none"
          />
          <div className="relative z-10 flex justify-center gap-x-30 text-center">
            {["전체", "초과"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "전체" | "초과")}
                className="relative py-2"
              >
                <span
                  className={`font-pretendard text-[20px] font-medium ${
                    activeTab === tab
                      ? tab === "초과"
                        ? "text-[#E70000]"
                        : "text-black"
                      : "text-[#9C9A9A]"
                  }`}
                >
                  {tab}
                </span>
                {activeTab === tab && (
                  <span className="absolute bottom-[-0.1px] left-1/2 h-[4px] w-[60px] -translate-x-1/2 rounded-full bg-black" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* '초과' 탭 경고 배너 */}
      {activeTab === "초과" && (
        <>
          <div className="mt-8 hidden md:block">
            <div className="relative z-20 mx-auto w-full max-w-[1100px] px-6">
              <div className="flex h-[102px] w-full items-center justify-center rounded-[22px] bg-[#E5E5E5]">
                <p className="font-pretendard text-center text-[32px]">
                  적정 섭취량을 준수하세요!
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-center md:hidden">
            <div
              className="flex items-center justify-center rounded-[15px]"
              style={{
                width: "350px",
                height: "68px",
                background: "#F4F4F4",
              }}
            >
              <p className="font-inter text-[20px] font-medium text-black">
                적정 섭취량을 준수하세요!
              </p>
            </div>
          </div>
        </>
      )}

      {/* 모바일 섭취량 그래프 */}
      {filteredIngredients && filteredIngredients.length > 0 ? (
        <div className="mx-auto w-full max-w-[370px] space-y-4 px-4 md:hidden">
          <div className="mx-auto mt-5 mb-1 grid w-full max-w-[370px] grid-cols-[120px_1fr] items-center">
            <div />
            <div className="relative h-[24px] w-[200px]">
              <span
                className="absolute -top-1 z-20 -translate-x-1/2 text-[14px] font-medium whitespace-nowrap text-black"
                style={{ left: `${REC_LINE_POS}%` }}
              >
                권장
              </span>
              <span
                className="absolute -top-1 z-20 -translate-x-1/2 text-[14px] font-medium whitespace-nowrap text-black"
                style={{ left: `${UPPER_LINE_POS}%` }}
              >
                상한
              </span>
            </div>
          </div>

          {filteredIngredients
            .slice(0, showAllIngredients ? filteredIngredients.length : 5)
            .map((ingredient) => {
              const { ingredientName } = ingredient;
              const fillPct = computeFillPercent(ingredient);
              const over = fillPct > UPPER_LINE_POS;

              return (
                <div
                  key={ingredientName}
                  className="mx-auto grid w-full max-w-[370px] grid-cols-[120px_1fr] items-center"
                >
                  <div
                    className="flex w-[120px] cursor-pointer items-center px-2"
                    onClick={() =>
                      navigate(
                        `/ingredients/${encodeURIComponent(ingredientName)}`
                      )
                    }
                  >
                    <span
                      className="font-pretendard inline-block text-[15px] font-medium"
                      style={{ lineHeight: "100%", letterSpacing: "-2%" }}
                    >
                      {ingredientName}
                    </span>
                    <img
                      src={vitaminArrow}
                      alt="화살표"
                      className="mt-0.5 ml-1"
                      style={{ width: 20, height: 12 }}
                    />
                  </div>
                  <div className="relative h-[40px] w-[200px] overflow-hidden rounded-full bg-[#EFEFEF]">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${fillPct}%`,
                        background: over ? "#FF7E7E" : "#FFE17E",
                      }}
                    />
                    <div
                      className="absolute top-0 z-10 h-full border-l-2 border-dashed"
                      style={{
                        left: `${REC_LINE_POS}%`,
                        borderColor: "#000000",
                      }}
                    />
                    <div
                      className="absolute top-0 z-10 h-full border-l-2 border-dashed"
                      style={{
                        left: `${UPPER_LINE_POS}%`,
                        borderColor: "#000000",
                      }}
                    />
                  </div>
                </div>
              );
            })}

          {filteredIngredients.length > 5 && !showAllIngredients && (
            <div className="mx-auto mt-7 flex max-w-[370px] flex-col items-center justify-center">
              <img
                src="/images/PNG/조합 3-1/펼쳐보기 arrow.png" // TODO: 경로 확인
                alt="더보기"
                className="h-[15px] w-[35px] cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => setShowAllIngredients(true)}
              />
              <p className="font-pretendard mt-4 text-[14px] text-[#666]">
                클릭하여 모든 성분 보기
              </p>
            </div>
          )}

          {filteredIngredients.length > 5 && showAllIngredients && (
            <div className="mx-auto flex w-full max-w-[370px] flex-col items-center justify-center">
              <img
                src="/images/PNG/조합 3-1/Frame 499.png" // TODO: 경로 확인
                alt="접기"
                className="h-[35px] w-full max-w-[370px] cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => setShowAllIngredients(false)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 px-4 text-center text-gray-500 md:hidden">
          {ingredientResults.length === 0
            ? "영양제를 선택해주세요."
            : activeTab === "초과"
              ? "초과된 성분이 없습니다."
              : "데이터를 불러오는 중입니다..."}
        </div>
      )}

      {/* PC 섭취량 그래프 */}
      {filteredIngredients && filteredIngredients.length > 0 ? (
        <div className="hidden w-full md:block">
          <div className="mx-auto mt-5 grid w-full max-w-[1200px] grid-cols-[200px_1fr] items-center gap-6 px-6 md:px-8">
            <div />
            <div className="relative h-6">
              <span
                className="absolute -top-1 z-20 translate-x-[-50%] text-[16px] font-medium whitespace-nowrap text-black lg:text-[18px]"
                style={{ left: `${REC_LINE_POS}%` }}
              >
                권장
              </span>
              <span
                className="absolute -top-1 z-20 translate-x-[-50%] text-[16px] font-medium whitespace-nowrap text-black lg:text-[18px]"
                style={{ left: `${UPPER_LINE_POS}%` }}
              >
                상한
              </span>
            </div>
          </div>

          <div className="mx-auto mt-2 w-full max-w-[1200px] space-y-5 px-6 md:px-8">
            {filteredIngredients
              .slice(0, showAllIngredients ? filteredIngredients.length : 5)
              .map((ingredient) => {
                const { ingredientName } = ingredient;
                const fillPct = computeFillPercent(ingredient);
                const over = fillPct > UPPER_LINE_POS;

                return (
                  <div
                    key={ingredientName}
                    className="grid w-full grid-cols-[200px_1fr] items-center gap-6"
                  >
                    <div
                      className="flex h-[48px] cursor-pointer items-center"
                      onClick={() =>
                        navigate(
                          `/ingredients/${encodeURIComponent(ingredientName)}`
                        )
                      }
                    >
                      <span className="text-[20px] font-medium lg:text-[24px]">
                        {ingredientName}
                      </span>
                      <img
                        src={vitaminArrow}
                        alt="화살표"
                        className="mt-1 ml-3"
                        style={{ width: 25, height: 20 }}
                      />
                    </div>
                    <div className="relative w-full">
                      <div className="relative h-[48px] w-full overflow-hidden rounded-full bg-[#EFEFEF] lg:h-[56px]">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full"
                          style={{
                            width: `${fillPct}%`,
                            background: over ? "#FF7E7E" : "#FFE17E",
                          }}
                        />
                        <div
                          className="absolute top-0 z-10 h-full border-l-2 border-dashed"
                          style={{
                            left: `${REC_LINE_POS}%`,
                            borderColor: "#000000",
                          }}
                        />
                        <div
                          className="absolute top-0 z-10 h-full border-l-2 border-dashed"
                          style={{
                            left: `${UPPER_LINE_POS}%`,
                            borderColor: "#000000",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

            {filteredIngredients.length > 5 && !showAllIngredients && (
              <div className="mt-6 flex w-full flex-col items-center justify-center">
                <img
                  src="/images/PNG/조합 3-1/펼쳐보기 arrow.png" // TODO: 경로 확인
                  alt="더보기"
                  className="h-[20px] w-[55px] cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => setShowAllIngredients(true)}
                />
                <p className="font-pretendard mt-3 text-[16px] text-[#666] lg:text-[18px]">
                  클릭하여 모든 성분 보기
                </p>
              </div>
            )}

            {filteredIngredients.length > 5 && showAllIngredients && (
              <div className="mt-3 flex w-full flex-col items-center justify-center">
                <img
                  src="/images/PNG/조합 3-1/Frame 499.png" // TODO: 경로 확인
                  alt="접기"
                  className="h-[92px] w-full max-w-[1100px] cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => setShowAllIngredients(false)}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-20 hidden flex-col items-center px-[60px] text-center text-gray-500 md:flex">
          {ingredientResults.length === 0
            ? "영양제를 선택해주세요."
            : activeTab === "초과"
              ? "초과된 성분이 없습니다."
              : "데이터를 불러오는 중입니다..."}
        </div>
      )}
    </>
  );
}
