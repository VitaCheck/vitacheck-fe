import Heart from "../../assets/heart-filled.svg";

interface ScrapIngredientItemProps {
  name: string;
}

const ScrapIngredientItem = ({ name }: ScrapIngredientItemProps) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-[10px] px-[22px] py-[14px] h-[70px] shadow-[2px_3px_12.4px_rgba(0,0,0,0.16)]">
      <span className="text-base font-medium">{name}</span>
      <img src={Heart} alt="찜한 아이콘" className="w-5 h-4" />
    </div>
  );
};

export default ScrapIngredientItem;
