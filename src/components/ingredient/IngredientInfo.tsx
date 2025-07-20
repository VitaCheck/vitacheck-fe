const IngredientInfo = () => {
  return (
    <div className="space-y-5 max-w-screen-md mx-auto px-4 py-5 md:px-8">
      <section>
        <h2 className="font-semibold leading-loose text-2xl">유산균</h2>
        <p className="text-sm pb-5">
          우리 몸에 살고 있는 100개가 넘는 균주 중에서 몸에 좋은 균을
          유익균(유산균) 또는 프로바이오틱스라고 해요. 반대로 나쁜 영향을 주는
          균을 '유해균'이라고 해요. 건강한 장 환경과 원활한 배변활동을 위해서는
          여러 종류의 균들이 균형을 이뤄야해요.
        </p>
      </section>

      <section>
        <h2 className="font-semibold leading-loose text-2xl">효능</h2>
        <p className="text-sm">
          장 건강 개선, 면역력 강화, 피부 건강 개선, 대사 조절
        </p>
      </section>

      <div className="flex items-center border-b border-gray-200 pb-1" />

      <section>
        <h2 className="font-semibold leading-loose text-2xl">
          부작용 및 주의사항
        </h2>
        <p className="text-sm pb-5">프로바이오틱스(유산균) 알러지 주의</p>
      </section>

      <section>
        <h2 className="font-semibold leading-loose text-2xl">권장 섭취량</h2>

        <div className="mt-3 relative w-full">
          {/* 전체 게이지 바 */}
          <div className="w-full h-6 bg-gray-100 rounded-full relative overflow-hidden">
            {/* 노란색 권장 섭취 바 (66.66%) */}
            <div
              className="h-6 bg-[#FFE17E] rounded-full"
              style={{ width: "66.66%" }}
            />

            {/* 1/3 지점 점선 */}
            <div className="absolute left-1/3 top-0 h-full border-r border-dotted border-gray-500" />

            {/* 2/3 지점 점선 */}
            <div className="absolute left-2/3 top-0 h-full border-r border-dotted border-gray-500" />
          </div>

          {/* 섭취량 텍스트: 2번째 점선 아래 정중앙 */}
          <div className="text-sm text-black mt-1 absolute left-2/3 transform -translate-x-1/2">
            50mg
          </div>
        </div>
      </section>
    </div>
  );
};

export default IngredientInfo;
