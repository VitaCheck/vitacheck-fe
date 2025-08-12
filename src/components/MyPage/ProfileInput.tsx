import React from "react";

interface ProfileInputProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
}

function ProfileInput({
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
  placeholder,
}: ProfileInputProps) {
  return (
    <div>
      <label className="text-[18px] text-[#000000] block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-md p-2 text-[15px] 
          ${disabled ? "bg-gray-100 text-gray-500" : ""}`}
      />
    </div>
  );
}

export default ProfileInput;
