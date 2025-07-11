// components/SelectedProductList.tsx
interface Props {
  selectedItems: { name: string; imageUrl: string }[];
  onRemove: (name: string) => void;
}

export default function SelectedProductList({ selectedItems, onRemove }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {selectedItems.map((item, idx) => (
        <div
          key={idx}
          className="relative w-full p-2 rounded-lg border shadow-sm flex flex-col items-center justify-between min-h-[160px]"
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-[80px] object-contain mb-2"
          />
          <p className="text-xs text-center break-words leading-tight">{item.name}</p>
          <button
            onClick={() => onRemove(item.name)}
            className="absolute top-1 right-2 text-gray-400 hover:text-black text-lg"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
