import { MdOutlineArrowForwardIos } from "react-icons/md";

interface TimingTabProps {
  intakeTime: string;
}

const TimingTab = ({ intakeTime }: TimingTabProps) => {
  return (
    <>
      {/* 모바일 전용 */}
      <div className="sm:hidden">
        <div className="flex flex-col items-center px-[10px] mt-[28px] w-full h-[235px] gap-y-[24px]">
          <div className="flex items-center justify-center w-[356px] h-[56px] bg-[#F2F2F2] rounded-[12px]">
            <span className="font-Regular text-[14px] tracking-[-0.32px]">
                오메가 3에 대해 더 자세히 알고 싶다면 ?
            </span>
            <MdOutlineArrowForwardIos className="h-[22px] ml-[20px]"/>
          </div>

          <div className="flex justify-center items-center bg-white border-[#AAAAAA] border-[0.5px] rounded-[16px] w-[356px] h-[81px]">
            <div className="w-[294px] h-[30px] flex justify-between items-center">
              <p className="font-medium text-[21px]">{intakeTime}</p>
              <p className="bg-[#EEEEEE] font-semibold text-[12px] w-[43px] h-[26px] flex justify-center items-center rounded-[20px]">1 포</p>
            </div>
          </div>
        </div>
      </div>


      {/* PC 전용 */}
      <div className="hidden sm:block">
        <div className="flex flex-col items-center w-[567px] mt-[36px]">
          <div className="flex items-center justify-between w-full h-[67px] bg-[#F2F2F2] rounded-[16px] px-[25px]">
            <div className="flex-1 text-center">
              <span className="font-Regular text-[22px] tracking-[-1px]">
                오메가 3에 대해 더 자세히 알고 싶다면 ?
              </span>
            </div>  
            <MdOutlineArrowForwardIos className="text-[22px]" />
          </div>
          <div className="flex flex-col justify-center items-center w-full mt-[26px] border-[#AAAAAA] border-1 rounded-[18px]">
            <div className="flex justify-between w-full px-[40px] py-[30px]">
              <p className="font-medium text-[21px]">{intakeTime}</p>
              <span className="bg-[#EEEEEE] rounded-full text-[18px] px-[18px] py-[4px] font-medium">1 포</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );    
};

export default TimingTab;