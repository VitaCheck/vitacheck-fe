import Heart from "../../assets/heart-filled.svg";

interface ScrapIngredientItemProps {
  id: number;
  name: string;
  onToggleLike: (id: number) => void;
  processing?: boolean;
}

const ScrapIngredientItem = ({
  id,
  name,
  onToggleLike,
  processing = false,
}: ScrapIngredientItemProps) => {
  return (
    <div
      className="relative bg-white sm:bg-[#F4F4F4] rounded-[10px] px-[22px] py-[14px] h-[70px] shadow-[2px_3px_12.4px_rgba(0,0,0,0.16)]
                 flex items-center justify-between
                 sm:flex sm:items-center sm:justify-center sm:h-[190px] sm:w-[210px] sm:px-0 sm:py-0"
    >
      <span className="text-base font-medium sm:text-[23px] sm:text-center">
        {name}
      </span>

      <button
        type="button"
        onClick={() => onToggleLike(id)}
        disabled={processing}
        aria-label="성분 찜 취소"
        className={`sm:absolute sm:bottom-[10px] sm:right-[10px] ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <img src={Heart} alt="찜한 아이콘" className="w-5 h-4" />
      </button>
    </div>
  );
};

export default ScrapIngredientItem;
