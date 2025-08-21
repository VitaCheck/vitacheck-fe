import MainCard from "./MainCard";
import Combination from "../../assets/combination.svg";
import Ingredient from "../../assets/ingredient.svg";
import Object from "../../assets/object.svg";
import Alarm from "../../assets/alarm.svg";

import MobileMainCard from "./MobileMainCard";

const NavSection = () => {
  return (
    <div>
      {/* 데스크탑에서 MainCard 사용 */}
      <div className="flex-row gap-4 w-full justify-around px-[9%] sm:px-[10%] py-13 hidden sm:flex">
        <MainCard
          title="목적별 검색"
          subtitle={"건강 고민에 맞는 영양제<br/>체-크"}
          icon={Object}
          to="/object"
        />
        <MainCard
          title="성분별 검색"
          subtitle={"인기 있는 성분<br/>체-크"}
          icon={Ingredient}
          to="/ingredient"
        />
        <MainCard
          title="조합 분석"
          subtitle={"권장량 초과 여부<br/>체-크"}
          icon={Combination}
          to="/combination"
        />
        <MainCard
          title="알림"
          subtitle={"영양제 루틴<br/>체-크"}
          icon={Alarm}
          to="/alarm"
        />
      </div>

      {/* 모바일에서 MobileMainCard 사용 */}
      <div className="py-10 sm:hidden justify-center items-center">
        <div className="mx-auto inline-flex flex-nowrap gap-4 justify-center items-center">
          <MobileMainCard title="목적별" icon={Object} to="/object" />
          <MobileMainCard title="성분별" icon={Ingredient} to="/ingredient" />
          <MobileMainCard title="조합" icon={Combination} to="/combination" />
          <MobileMainCard title="섭취알림" icon={Alarm} to="/alarm" />
        </div>
      </div>
    </div>
  );
};

export default NavSection;
