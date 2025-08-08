const foods = [
  { name: "요거트", emoji: "🥛" },
  { name: "된장", emoji: "🫘" },
  { name: "발효 식초", emoji: "🍎" },
  { name: "장아찌", emoji: "🥒" },
  { name: "김치", emoji: "🥬" },
  { name: "오이", emoji: "🥒" },
];

interface Props {
  id: number;
}

const IngredientAlternatives = ({ id }: Props) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 
                    gap-x-5 sm:gap-x-8 md:gap-x-15 
                    gap-y-4 sm:gap-y-8 md:gap-y-12 
                    max-w-md sm:max-w-xl md:max-w-4xl mx-auto px-5 pb-8"
    >
      {foods.map((food, index) => (
        <div
          key={index}
          className="flex items-center justify-start px-5 py-5 
                     bg-gray-100 rounded-[35px] shadow-sm 
                     h-[64px] w-full"
        >
          <span className="text-lg font-medium">{food.emoji}</span>
          <span className="ml-3 text-base font-medium">{food.name}</span>
        </div>
      ))}
    </div>
  );
};

export default IngredientAlternatives;
