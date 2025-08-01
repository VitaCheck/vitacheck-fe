interface Props {
  id: number;
  data: {
    name: string;
    description: string;
    effect: string;
    caution: string;
    upperLimit: number;
    recommendedDosage: number;
    unit: string;
  };
}
const IngredientInfo = ({ id, data }: Props) => {
  if (!id) return <div className="px-5 py-10">잘못된 접근입니다.</div>;

  return (
    <div className="space-y-5 max-w-screen-md mx-auto px-4 py-5 md:px-8">
      <section>
        <h2 className="font-semibold text-2xl">{data.name || "이름 없음"}</h2>
        <p className="text-sm pb-5">{data.description || "설명 없음"}</p>
      </section>

      <section>
        <h2 className="font-semibold text-2xl">효능</h2>
        <p className="text-sm">
          {data.effect || "등록된 효능 정보가 없습니다."}
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-2xl">부작용 및 주의사항</h2>
        <p className="text-sm">{data.caution || "부작용 정보가 없습니다."}</p>
      </section>

      <section>
        <h2 className="font-semibold text-2xl">권장 섭취량</h2>
        <div className="mt-2 text-sm">
          {data.recommendedDosage || "권장 섭취량 정보가 없습니다."}
        </div>
      </section>
    </div>
  );
};

export default IngredientInfo;
