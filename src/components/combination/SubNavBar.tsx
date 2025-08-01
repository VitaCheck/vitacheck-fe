import { useNavigate } from 'react-router-dom';
import CatFace from '../assets/cat-face.png';

const SubNavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[62px] px-4 flex items-center justify-between bg-white md:hidden">
      {/* ← 뒤로가기 버튼 */}
      <button onClick={() => navigate(-1)} className="text-2xl">
        ←
      </button>

      {/* 고양이 프로필 이미지 (회색 배경 + 확대 + 위치 조정) */}
      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
        <img
          src={CatFace}
          alt="고양이"
          className="w-[44px] h-[44px] object-cover scale-[1.2] translate-x-[-2px] translate-y-[6px]"
        />
      </div>
    </div>
  );
};

export default SubNavBar;
