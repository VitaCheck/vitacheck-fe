interface ProductCardProps {
  imageSrc: string;
  name: string;
  widthClass?: string;
  heightClass?: string;
  fontSize?: number | string;
  fontSizeClass?: string;
}

function ProductCard({
  imageSrc,
  name,
  widthClass = "w-[166px]",
  heightClass = "h-[150px]",
  fontSize = 18,
  fontSizeClass = "",
}: ProductCardProps) {
  return (
    <div className="inline-block pt-3 pb-3 px-2">
      <div
        className={`bg-white rounded-xl flex justify-center items-center 
          transition-transform duration-200 ease-in-out transform hover:scale-[1.03] cursor-pointer
          hover:shadow-lg ${widthClass} ${heightClass}`}
        style={{
          boxShadow: "2px 4px 12.2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <img src={imageSrc} alt={name} className="w-24 h-24 object-contain" />
      </div>

      <p
        className={`mt-3 text-center font-semibold text-black ${widthClass} ${fontSizeClass}`}
        style={{
          fontSize:
            !fontSizeClass && typeof fontSize === "number"
              ? `${fontSize}px`
              : undefined,
        }}
      >
        {name}
      </p>
    </div>
  );
}

export default ProductCard;
