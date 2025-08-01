interface MenuItemProps {
  label: string;
  icon: string;
  onClick?: () => void;
}

function MenuItem({ label, icon, onClick }: MenuItemProps) {
  return (
    <div
      className="bg-white w-full rounded-xl px-4 py-4 flex items-center justify-between shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 ml-1">
        <img src={icon} alt="icon" className="w-4 h-5 object-contain" />
        <span className="text-base font-medium">{label}</span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4 text-[#1C1B1F]"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

export default MenuItem;
