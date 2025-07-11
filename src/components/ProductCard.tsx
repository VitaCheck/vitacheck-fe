interface ProductCardProps {
  imageSrc: string;
  name: string;
  width?: number; // 기본 166
  height?: number; // 기본 150
}

function ProductCard({
  imageSrc,
  name,
  width = 166,
  height = 150,
}: ProductCardProps) {
  return (
    <div className="inline-block">
      <div
        className="bg-white rounded-xl flex justify-center items-center"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          boxShadow: "2px 4px 12.2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <img
          src={imageSrc}
          alt={name}
          className="w-24 h-24 object-contain" // 내부 이미지도 고정 크기로 제한
        />
      </div>

      <p
        className="mt-3 text-center text-[18px] font-semibold text-black"
        style={{ width: `${width}px` }}
      >
        {name}
      </p>
    </div>
  );
}

export default ProductCard;
