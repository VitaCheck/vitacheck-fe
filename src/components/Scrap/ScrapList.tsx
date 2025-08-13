import ScrapItemCard from "./ScrapItemCard";

interface ScrapListProps {
  items: { id: number; imageUrl: string; title: string }[];
  onToggleLike?: (id: number) => void;
  processingIds?: number[];
}

const ScrapList = ({
  items,
  onToggleLike,
  processingIds = [],
}: ScrapListProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center text-gray-400 text-sm py-10">
        찜한 제품이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4 px-[5%] mb-5">
      {items.map((item) => (
        <ScrapItemCard
          key={item.id}
          id={item.id}
          imageUrl={item.imageUrl}
          title={item.title}
          liked
          onToggleLike={onToggleLike}
          likeDisabled={processingIds.includes(item.id)}
        />
      ))}
    </div>
  );
};

export default ScrapList;
