import React from "react";

interface Props {
  item: {
    name: string;
    imageUrl: string;
  };
  isSelected: boolean;
  onToggle: () => void;
}

export default function CombinationProductCard({
  item,
  isSelected,
  onToggle,
}: Props) {
  return (
    <div
      className={`relative rounded-xl p-4 bg-white shadow-md transition hover:shadow-lg ${
        isSelected ? "bg-gray-100" : ""
      }`}
    >
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-28 object-contain mb-2"
      />
      <div className="text-center text-sm font-medium">{item.name}</div>

      {/* 선택/해제 버튼 */}
      <button
        onClick={onToggle}
        className="absolute top-2 right-2 w-6 h-6 rounded border border-gray-400 bg-white flex items-center justify-center text-sm"
      >
        {isSelected ? "✓" : "+"}
      </button>
    </div>
  );
}
