import ScrapItemCard from "./ScrapItemCard";

interface ScrapListProps {
  items: { imageUrl: string; title: string }[];
}

const ScrapList = ({ items }: ScrapListProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4 px-[5%] mb-5">
      {items.map((item, index) => (
        <ScrapItemCard
          key={index}
          imageUrl={item.imageUrl}
          title={item.title}
        />
      ))}
    </div>
  );
};

export default ScrapList;
