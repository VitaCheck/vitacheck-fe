const IngredientInfo = () => {
  return (
    <div className="space-y-5 max-w-screen-md mx-auto px-4 md:px-8">
      <section>
        <h2 className="font-semibold leading-loose">유산균이란?</h2>
        <p className="text-sm pb-5">
          당류를 분해하여 젖산을 만드는 작용을 하는 세균을 통틀어 이르는 말
        </p>
      </section>

      <section>
        <h2 className="font-semibold leading-loose">효능</h2>
        <p className="text-sm pb-5">
          장 건강 개선, 면역력 강화, 피부 건강 개선, 대사 조절
        </p>
      </section>

      <section>
        <h2 className="font-semibold leading-loose">부작용 및 주의사항</h2>
        <p className="text-sm  pb-5">
          프로바이오틱스(유산균) 알러지 주의
        </p>
      </section>
      
            <div className="flex items-center border-b border-gray-200 pb-1" />

        <section>
          
        <h2 className="font-semibold leading-loose">권장 섭취량</h2>
        <p className="text-sm pb-5">
          권장 →
        </p>
         <p className="text-sm pb-5">
          상한 →
        </p>
      </section>
    </div>
  );
};

export default IngredientInfo;
