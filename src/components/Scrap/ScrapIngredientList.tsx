import ScrapIngredientItem from "./ScrapIngredientItem";

interface ScrapIngredientListProps {
  items: string[];
}

const ScrapIngredientList = ({ items }: ScrapIngredientListProps) => {
  return (
    <div
      className="
        px-6 py-4
        flex flex-col gap-6
        sm:grid sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 sm:px-0 sm:justify-items-center
      "
    >
      {items.map((name, idx) => (
        <ScrapIngredientItem key={idx} name={name} />
      ))}
    </div>
  );
};

export default ScrapIngredientList;
