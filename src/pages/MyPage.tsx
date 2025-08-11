import MenuItem from "../components/MyPage/MenuItem";
import ProfileCat from "../assets/ProfileCat.svg";
import Profile from "../assets/Profile2.svg";
import { useNavigate } from "react-router-dom";
// import Service from "../assets/Service.svg";
import Bell from "../assets/MyPageBell.svg";
import Scrap from "../assets/MyPageScrap.svg";
import Vita from "../assets/MyPageVita.svg";
import Mypage4 from "../assets/mypage4.svg";
import Lock from "../assets/mypagelock.svg";
import Logout from "../assets/logout.svg";
import { useEffect, useState } from "react";
import { getUserInfo, type UserInfo } from "@/apis/user";

function MyPage() {
  const navigate = useNavigate();
  const [userLoadFailed, setUserLoadFailed] = useState(false);

  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
  };

  const goToMain = () => {
    navigate("/"); // 메인 페이지로 이동
  };

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUserLoadFailed(true); // 토큰 없으면 실패 처리
        return;
      }

      try {
        const user = await getUserInfo(token);
        setUserInfo(user);
      } catch (error) {
        console.error("유저 정보 불러오기 실패", error);
        setUserLoadFailed(true); // 실패 시 true
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col sm:mr-[18%] sm:ml-[18%]">
      <div className="absolute top-0 left-0 w-full h-[45vh] bg-[#FFDB67] -z-10 sm:hidden" />
      <div className="absolute top-[45vh] left-0 w-full h-[55vh] bg-[#F3F3F3] -z-10" />

      <div className="flex flex-col flex-1 items-center sm:mt-10">
        <div className="w-full px-6 pt-4 pb-2 flex items-center sm:hidden">
          <button
            onClick={goToMain}
            className="mr-2 text-2xl text-black cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-[24px] font-semibold py-2">마이페이지</h1>
        </div>

        {/* 사용자 정보 카드 */}
        <div className="w-[90%] h-[25vh] sm:h-auto bg-white rounded-2xl px-6 py-8 sm:py-4 flex items-center relative shadow">
          <img
            // src={ProfileCat}
            src={userLoadFailed ? Profile : ProfileCat}
            alt="profile"
            className="w-[100px] h-[100px] rounded-[30px] mr-6 object-cover"
          />

          <div className="flex-1">
            <p className="text-[20px] font-semibold text-[#E9B201]">
              {userInfo?.nickname || ""}
              <span className="text-black">
                {userLoadFailed ? "로그인 후" : "님"}
              </span>
            </p>
            <p className="text-sm">
              {userLoadFailed
                ? "이용가능한 기능입니다."
                : "오늘도 비타체크 하세요!"}
            </p>

            {/* sm 미만: 아래에 버튼 표시 */}
            <button
              className="mt-2 bg-[#EBEBEB] rounded-full px-4 py-1 flex items-center justify-between cursor-pointer text-[13px] sm:hidden"
              onClick={
                () =>
                  userLoadFailed
                    ? navigate("/login") // 로그인 안되어있으면 로그인 페이지 이동
                    : navigate("/mypage/edit") // 로그인 되어있으면 내 정보 수정 이동
              }
            >
              <span className="mr-2">
                {userLoadFailed ? "로그인하기" : "내 정보 수정"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 25 25"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* sm 이상: 우측 중앙에 버튼 정렬 */}
          <button
            className="hidden sm:flex items-center absolute right-6 top-1/2 -translate-y-1/2 bg-white border border-[#AAAAAA] rounded-[25px] px-4 py-1 cursor-pointer text-[13px]"
            onClick={() =>
              userLoadFailed ? navigate("/login") : navigate("/mypage/edit")
            }
          >
            <span className="mr-2">
              {userLoadFailed ? "로그인하기" : "내 정보 수정"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 25 25"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-[#000000]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* 메뉴 리스트 */}
        <div className="mt-6 space-y-3 w-[90%]">
          <MenuItem
            label="찜한 제품/성분"
            icon={Scrap}
            onClick={() => navigate("/scrap")}
          />

          <div className="w-full mt-6 mb-6">
            {/* 박스 전체 */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              {/* 나의 영양제 관리 (위쪽) */}
              <div
                className="flex items-center justify-between px-4 py-4 cursor-pointer"
                onClick={() => navigate("/alarm/settings")}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl ml-1">
                    <img src={Vita} alt="Vita" className="w-full h-auto" />
                  </span>
                  <span className="text-base font-medium text-black">
                    나의 영양제 관리
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-[#1C1B1F]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              <div
                className="flex items-center justify-between px-4 py-4 cursor-pointer"
                onClick={() => navigate("/notificationCenter")}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl ml-1">
                    <img src={Bell} alt="Bell" className="w-full h-auto" />
                  </span>
                  <span className="text-base font-medium text-black">
                    알림 설정
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-[#1C1B1F]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 mb-6">
            {/* 박스 전체 */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              {/* 나의 영양제 관리 (위쪽) */}
              <div
                className="flex items-center justify-between px-4 py-4 cursor-pointer"
                onClick={() => navigate("")}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl ml-1">
                    <img src={Mypage4} alt="Vita" className="w-full h-auto" />
                  </span>
                  <span className="text-base font-medium text-black">
                    서비스 이용약관
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-[#1C1B1F]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              <div
                className="flex items-center justify-between px-4 py-4 cursor-pointer"
                onClick={() => navigate("")}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl ml-1">
                    <img src={Lock} alt="Lock" className="w-full h-auto" />
                  </span>
                  <span className="text-base font-medium text-black">
                    개인정보 처리방침
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-[#1C1B1F]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {!userLoadFailed && (
            <div className="hidden sm:block">
              <MenuItem
                label="로그아웃"
                icon={Logout}
                onClick={() => navigate("/logout")}
              />
            </div>
          )}
        </div>

        {/* 로그아웃 */}
        {!userLoadFailed && (
          <div
            className="mt-auto mb-2 text-black text-sm underline cursor-pointer sm:hidden"
            onClick={handleLogout}
          >
            로그아웃
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPage;
