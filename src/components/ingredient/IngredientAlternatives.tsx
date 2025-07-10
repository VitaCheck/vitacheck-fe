const foods = [
  { name: "요거트", emoji: "🥛" },
  { name: "된장", emoji: "🫘" },
  { name: "발효 식초", emoji: "🍎" },
  { name: "장아찌", emoji: "🥒" },
  { name: "김치", emoji: "🥬" },
  { name: "오이", emoji: "🥒" },
];


const IngredientAlternatives = () => {
  return (
    <div className="grid grid-cols-2 gap-x-20 gap-y-10 max-w-[900px] mx-auto">
      {foods.map((food, index) => (
        <div
          key={index}
          className="w-full h-[80px] flex items-center justify-center bg-gray-100 rounded-4xl shadow-sm"
        >
          <span className="text-base font-medium">
            {food.emoji} {food.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default IngredientAlternatives;
