import Heart from "../../assets/heart-filled.svg";

interface ScrapItemCardProps {
  imageUrl: string;
  title: string;
  liked?: boolean;
}

const ScrapItemCard = ({
  imageUrl,
  title,
  liked = true,
}: ScrapItemCardProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[156px] h-[140px] bg-white rounded-[14px] shadow-[2px_3px_12.4px_rgba(0,0,0,0.16)]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain p-2"
        />
        {liked && (
          <img
            src={Heart}
            alt="like"
            className="absolute bottom-3 right-3 w-5 h-5"
          />
        )}
      </div>
      <p className="mt-3 text-[18px] font-medium">{title}</p>
    </div>
  );
};

export default ScrapItemCard;
