import { useNavigate } from "react-router-dom";
import Back from "../../assets/back.svg";

function EditProfileHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center sm:px-2 mb-6 sm:flex-col sm:items-start sm:border-b sm:border-[#AAAAAA] sm:pb-2">
      <button onClick={() => navigate(-1)} className="cursor-pointer sm:hidden">
        <img
          src={Back}
          alt="icon"
          className="w-[20px] h-[20px] object-contain"
        />
      </button>
      <h1 className="text-[24px] max-sm:ml-2 font-semibold">내 정보 수정</h1>
    </div>
  );
}

export default EditProfileHeader;
