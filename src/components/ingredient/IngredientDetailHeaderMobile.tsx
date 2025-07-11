import { useNavigate } from "react-router-dom";
import BackIcon from "../../assets/back.svg";
import HomeIcon from "../../assets/Vector.svg";
import LoginIcon from "../../assets/login.svg";

interface Props {
  title: string;
}

const IngredientDetailHeaderMobile = ({ }: Props) => {
  const navigate = useNavigate();

  return (
    <header className="md:hidden relative flex items-center justify-center px-4 py-3 bg-white">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2"
      >
        <img src={BackIcon} alt="뒤로가기" className="w-5 h-5" />
      </button>

      {/* 홈 & 로그인 버튼 */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-4">
        <button onClick={() => navigate("/")}>
          <img src={HomeIcon} alt="홈" className="w-5 h-5" />
        </button>
        <button onClick={() => navigate("/login")}>
          <img src={LoginIcon} alt="로그인" className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default IngredientDetailHeaderMobile;
