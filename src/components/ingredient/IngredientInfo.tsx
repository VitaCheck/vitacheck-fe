const IngredientInfo = () => {
  return (
    <div className="space-y-5 pl-10">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gray-200 mr-4" />  
        <span className="text-1.5xl font-semibold">아침 또는 식전에 드세요!</span>
      </div>

      <section>
        <h2 className="font-semibold leading-loose">유산균이란?</h2>
        <p className="text-sm text-gray-600 border-b border-gray-200 pb-2">내용을 여기에 작성</p>
      </section>

      <section>
        <h2 className="font-semibold leading-loose">효능</h2>
        <p className="text-sm text-gray-600 border-b border-gray-200 pb-2">내용을 여기에 작성</p>
      </section>

      <section>
        <h2 className="font-semibold leading-loose">부작용 및 주의사항</h2>
        <p className="text-sm text-gray-600 border-b border-gray-200 pb-2">내용을 여기에 작성</p>
      </section>
    </div>
  );
};

export default IngredientInfo;