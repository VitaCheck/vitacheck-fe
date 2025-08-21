import ScrapIngredientItem from "./ScrapIngredientItem";

interface ScrapIngredientListProps {
  items: { id: number; name: string }[];
  onToggleLike: (id: number) => void;
  processingIds: number[];
}

const ScrapIngredientList = ({
  items,
  onToggleLike,
  processingIds,
}: ScrapIngredientListProps) => {
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
        찜한 성분이 없습니다.
      </div>
    );
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-6 sm:grid sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 sm:px-0 sm:justify-items-center">
      {items.map((item) => (
        <ScrapIngredientItem
          key={item.id}
          id={item.id}
          name={item.name}
          onToggleLike={onToggleLike}
          processing={processingIds.includes(item.id)}
        />
      ))}
    </div>
  );
};

export default ScrapIngredientList;
