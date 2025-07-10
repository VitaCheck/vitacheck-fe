import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
   const navigate = useNavigate();

  return (
   <>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[430px] h-[54px] bg-white z-50" />
      <div className="fixed top-[54px] left-1/2 -translate-x-1/2 w-[430px] h-[62px] bg-white flex items-center justify-between z-50">
         {/* 왼쪽 '<' 버튼 */}
         <div
            onClick={() => navigate(-1)} 
            className="w-[34px] h-[54px] flex items-center justify-center ml-[24px]">
         <MdArrowBackIos className="text-3xl" />
         </div>

         {/* 오른쪽 동그라미 버튼 */}
         <div className="w-[54px] h-[54px] flex items-center justify-center mr-[24px]">
            <img
               src="/images/VitaCheckMyPage/AfterLoginProfile.png"
               alt="프로필"
               className="w-[36px] h-[36px] rounded-full object-cover"
            />
         </div>
      </div>
   </>
  );
};

export default Navbar;
