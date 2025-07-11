interface SettingRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

function SettingRow({ label, checked, onToggle }: SettingRowProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-[#6B6B6B]">{label}</span>
      <div
        className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${
          checked ? "bg-[#FCC000]" : "bg-[#AAA]"
        }`}
        onClick={onToggle}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </div>
    </div>
  );
}

export default SettingRow;
