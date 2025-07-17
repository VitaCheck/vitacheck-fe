import { Link } from "react-router-dom";

interface MainCardProps {
  title: string;
  subtitle: string;
  icon: string;
  to: string;
}

const MainCard = ({ title, subtitle, icon, to }: MainCardProps) => {
  return (
    <Link
      to={to}
      className="bg-[#f4f4f4] rounded-[22px] p-4 flex flex-col items-start w-[23%] sm:w-[45%] md:w-[23%] hover:shadow-md transition"
    >
      <div className="mb-4">
        <img src={icon} alt="icon" className="w-12 h-12" />
      </div>

      {/* 모바일에서는 제목이 박스 밖에 위치하도록 수정 */}
      <h3 className="text-xl font-semibold text-gray-800 sm:hidden mb-2 text-left">
        {title}
      </h3>

      {/* 큰 화면에서는 제목과 부가 설명을 함께 표시 */}
      <div className="hidden sm:block text-left">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p
          className="text-gray-500"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      </div>
    </Link>
  );
};

export default MainCard;
