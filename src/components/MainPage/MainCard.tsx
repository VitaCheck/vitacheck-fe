// interface MainCardProps {
//   title: string;
//   subtitle: string;
//   icon: string;
// }

// const MainCard = ({ title, subtitle, icon }: MainCardProps) => {
//   return (
//     <div className="bg-[#f4f4f4] rounded-[22px] p-2 flex items-center w-[23%]">
//       <div className="flex flex-col">
//         <img src={icon} alt="icon" className="w-12 h-12 mr-4" />
//         <h3 className="text-xl font-semibold">{title}</h3>
//         <p className="text-gray-500">{subtitle}</p>
//       </div>
//     </div>
//   );
// };

// export default MainCard;

interface MainCardProps {
  title: string;
  subtitle: string;
  icon: string;
}

const MainCard = ({ title, subtitle, icon }: MainCardProps) => {
  return (
    <div className="bg-[#f4f4f4] rounded-[22px] p-2 flex flex-col items-center w-[23%] sm:w-[45%] md:w-[23%]">
      <div className="flex justify-center mb-4">
        <img src={icon} alt="icon" className="w-12 h-12" />
      </div>
      {/* 모바일에서는 제목이 박스 밖에 위치하도록 수정 */}
      <h3 className="text-xl font-semibold text-gray-800 sm:hidden mb-2">
        {title}
      </h3>
      {/* 큰 화면에서는 제목과 부가 설명을 함께 표시 */}
      <div className="hidden sm:block text-center">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default MainCard;
