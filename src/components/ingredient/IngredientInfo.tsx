import type { IngredientDetail } from "@/types/ingredient";

interface Props {
  id: string;
  data: IngredientDetail;
}

const IngredientInfo = ({ id, data }: Props) => {
  if (!id) return <div className="px-5 py-10">잘못된 접근입니다.</div>;

  return (
    <div className="space-y-8 max-w-screen-md mx-auto px-5 py-5 sm:px-8">
      {/* 이름 + 설명 */}
      <section>
        <h2 className="font-semibold text-2xl">{data.name || "이름 없음"}</h2>
        <p className="text-sm pb-6">{data.description || "설명 없음"}</p>
      </section>

      {/* 효능 */}
      <section>
        <h2 className="font-semibold text-2xl pb-2">효능</h2>
        <p className="text-sm">
          {data.effect || "등록된 효능 정보가 없습니다."}
        </p>
        {/* 회색 밑줄 */}
        <div className="mt-4 border-b border-gray-300"></div>
      </section>

      {/* 부작용 및 주의사항 */}
      <h2 className="font-semibold text-2xl mb-2">부작용 및 주의사항</h2>

      <section className="flex items-start gap-4">
        {/* 왼쪽 이미지 */}
        <div className="flex w-20 h-20">
          <img
            src="/images/PNG/성분 2-1/caution.png"
            alt="부작용 이미지"
            className="w-full h-full rounded-md"
          />
        </div>

        {/* 오른쪽 텍스트 영역 */}
        <div className="flex-1">
          <p className="text-sm">{data.caution || "부작용 정보가 없습니다."}</p>
        </div>
      </section>

      {/* 권장 섭취량 */}
      <section>
        <h2 className="font-semibold text-2xl">권장 섭취량</h2>

        {data.recommendedDosage && data.upperLimit ? (
          <div className="mt-6">
            {(() => {
              const recommended = Number(data.recommendedDosage);
              const upper = Number(data.upperLimit);
              const unit = data.unit || "mg";
              const maxValue = Math.max(upper, recommended) * 1.2;
              const recPos = Math.min(100, (recommended / maxValue) * 100);
              const upperPos = Math.min(100, (upper / maxValue) * 100);
              const fmt = (v: number) =>
                Number(v).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                });

              return (
                <div className="relative w-full">
                  {/* 상단 라벨 */}
                  <div
                    className="absolute -top-6 text-sm font-medium"
                    style={{
                      left: `${recPos}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    권장
                  </div>
                  <div
                    className="absolute -top-6 text-sm font-medium"
                    style={{
                      left: `${upperPos}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    상한
                  </div>

                  {/* 막대 (회색 배경 + 노란색 채움) */}
                  <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#FFE17E] rounded-full"
                      style={{ width: `${upperPos}%` }}
                      aria-hidden
                    />
                    {/* 점선 마커: 권장 / 상한 */}
                    <div
                      className="absolute top-0 bottom-0 border-l border-black border-dotted opacity-70"
                      style={{ left: `${recPos}%` }}
                      aria-hidden
                    />
                    <div
                      className="absolute top-0 bottom-0 border-l border-black border-dotted opacity-70"
                      style={{ left: `${upperPos}%` }}
                      aria-hidden
                    />
                  </div>

                  {/* 하단 수치 */}
                  <div
                    className="absolute -bottom-6 text-sm"
                    style={{
                      left: `${recPos}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {fmt(recommended)}
                    {unit}
                  </div>
                  <div
                    className="absolute -bottom-6 text-sm"
                    style={{
                      left: `${upperPos}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {fmt(upper)}
                    {unit}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default IngredientInfo;
