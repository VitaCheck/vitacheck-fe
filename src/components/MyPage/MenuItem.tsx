interface MenuItemProps {
  label: string;
  icon: string;
  onClick?: () => void;
}

function MenuItem(props: MenuItemProps) {
  const { label, icon, onClick } = props;

  return (
    <div
      className="bg-white w-full rounded-xl px-4 py-4 flex items-center justify-between shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{icon}</span>
        <span className="text-base font-medium">{label}</span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4 text-gray-400"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}
export default MenuItem;
