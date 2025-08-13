import { useNavigate } from "react-router-dom";
import Heart from "../../assets/heart-filled.svg";

interface ScrapItemCardProps {
  id: number;
  imageUrl: string;
  title: string;
  liked?: boolean;
  onToggleLike?: (id: number) => void;
  likeDisabled?: boolean;
}

const ScrapItemCard = ({
  id,
  imageUrl,
  title,
  liked = true,
  onToggleLike,
  likeDisabled = false,
}: ScrapItemCardProps) => {
  const navigate = useNavigate();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 이동 방지
    e.preventDefault();
    if (!likeDisabled && onToggleLike) onToggleLike(id);
  };

  return (
    <button
      type="button"
      onClick={() => navigate(`/product/${id}`)}
      className="flex flex-col items-center focus:outline-none"
      aria-label={`${title} 상세 보기`}
    >
      <div className="relative w-[156px] h-[140px] bg-white rounded-[14px] shadow-[2px_3px_12.4px_rgba(0,0,0,0.16)]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain p-2"
        />

        {liked && (
          <button
            type="button"
            onClick={handleLikeClick}
            disabled={likeDisabled}
            aria-label="찜 취소"
            className="absolute bottom-3 right-3 w-6 h-6 flex items-center justify-center disabled:opacity-60"
          >
            <img
              src={Heart}
              alt="like"
              className="w-5 h-5 pointer-events-none"
            />
          </button>
        )}
      </div>
      <p className="mt-3 text-[18px] font-medium line-clamp-1">{title}</p>
    </button>
  );
};

export default ScrapItemCard;
