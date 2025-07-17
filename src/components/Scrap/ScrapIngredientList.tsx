import ScrapIngredientItem from "./ScrapIngredientItem";

interface ScrapIngredientListProps {
  items: string[];
}

const ScrapIngredientList = ({ items }: ScrapIngredientListProps) => {
  return (
    <div className="flex flex-col gap-6 px-6 py-4">
      {items.map((name, idx) => (
        <ScrapIngredientItem key={idx} name={name} />
      ))}
    </div>
  );
};

export default ScrapIngredientList;
