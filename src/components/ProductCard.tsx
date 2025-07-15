interface ProductCardProps {
  imageSrc: string;
  name: string;
  width?: number;
  height?: number;
  fontSize?: number | string;
}

function ProductCard({
  imageSrc,
  name,
  width = 166,
  height = 150,
  fontSize = 18,
}: ProductCardProps) {
  return (
    <div className="inline-block pt-3 pb-3 px-2">
      <div
        className="bg-white rounded-xl flex justify-center items-center"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          boxShadow: "2px 4px 12.2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <img src={imageSrc} alt={name} className="w-24 h-24 object-contain" />
      </div>

      <p
        className="mt-3 text-center font-semibold text-black"
        style={{
          width: `${width}px`,
          fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize,
        }}
      >
        {name}
      </p>
    </div>
  );
}

export default ProductCard;
