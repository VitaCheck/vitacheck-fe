import MainCard from "./MainCard";
import Logo from "../../assets/logo.svg";
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
          subtitle="건강 고민에 맞는 영양제 체크"
          icon={Logo}
        />
        <MainCard
          title="목적별 검색"
          subtitle="건강 고민에 맞는 영양제 체크"
          icon={Logo}
        />
        <MainCard
          title="목적별 검색"
          subtitle="건강 고민에 맞는 영양제 체크"
          icon={Logo}
        />
        <MainCard
          title="목적별 검색"
          subtitle="건강 고민에 맞는 영양제 체크"
          icon={Logo}
        />
      </div>

      {/* 모바일에서 MobileMainCard 사용 */}
      <div className="flex flex-row sm:flex-row gap-4 w-full justify-around px-[9%] sm:px-[10%] py-10 sm:hidden">
        <MobileMainCard title="목적별" icon={Object} to="/object" />
        <MobileMainCard title="성분별" icon={Ingredient} to="/ingredient" />
        <MobileMainCard title="조합" icon={Combination} to="/combination" />
        <MobileMainCard title="섭취알림" icon={Alarm} to="/alarm" />
      </div>
    </div>
  );
};

export default NavSection;
