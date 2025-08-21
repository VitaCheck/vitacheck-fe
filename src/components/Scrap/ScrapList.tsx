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
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  // 로그인 안 된 경우
  if (!token) {
    return (
      <div className="text-center text-gray-400 text-sm py-10">
        로그인 후 사용할 수 있습니다.
      </div>
    );
  }

  // 로그인 되어있지만 찜한 게 없는 경우
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
