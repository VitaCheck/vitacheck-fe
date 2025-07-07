interface ProductCardProps {
  imageSrc: string;
  name: string;
}

function ProductCard({ imageSrc, name }: ProductCardProps) {
  return (
    <div className="inline-block">
      <div
        className="w-[166px] h-[150px] bg-white rounded-xl flex justify-center items-center"
        style={{ boxShadow: "2px 4px 12.2px rgba(0, 0, 0, 0.25)" }}
      >
        <img src={imageSrc} alt={name} className="w-30 h-30 object-contain" />
      </div>

      <p className="mt-3 w-[166px] text-center text-[18px] font-semibold text-black">
        {name}
      </p>
    </div>
  );
}

export default ProductCard;
