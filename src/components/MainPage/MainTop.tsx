import Logo from "../../assets/logo.svg";
import Character from "../../assets/VitaCheckcharacter.svg";

const MainTop = () => {
  return (
    <header className="bg-gradient-to-r from-[#FFEA8C] to-[#FCFFEA] via-[#FFE88D] px-[9%] sm:px-[15%] flex flex-row sm:flex-row justify-between sm:items-center py-5">
      <div className="flex flex-col sm:items-center mb-4 sm:mb-0 items-start sm:text-center">
        <h1 className="text-2xl sm:text-4xl font-semibold text-gray-800 mt-2 sm:text-center">
          건강한 선택을 돕는
        </h1>
        <img
          src={Logo}
          alt="VitaCheck로고"
          className="w-3/4 sm:w-full h-auto sm:mt-5 mt-2"
        />
      </div>
      <div className="flex justify-center sm:justify-end">
        <img
          src={Character}
          alt="VitaCheck Character"
          className="w-[120px] sm:w-[200px] h-auto"
        />
      </div>
    </header>
  );
};

export default MainTop;
