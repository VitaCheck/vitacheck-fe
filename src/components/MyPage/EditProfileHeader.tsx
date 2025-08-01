import { useNavigate } from "react-router-dom";

function EditProfileHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mb-6">
      <button onClick={() => navigate(-1)} className="cursor-pointer">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 className="text-[24px] font-semibold ml-3">내 정보 수정</h1>
    </div>
  );
}

export default EditProfileHeader;
