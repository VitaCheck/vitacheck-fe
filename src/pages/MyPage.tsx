import MenuItem from "../components/MyPage/MenuItem";
import ProfileCat from "../assets/ProfileCat.svg";
import { useNavigate } from "react-router-dom";

function MyPage() {
  const navigate = useNavigate();

  const handleEditInfo = () => {
    alert("내 정보 수정 페이지로 이동");
  };

  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
  };

  const goToMain = () => {
    navigate("/"); // 메인 페이지로 이동
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-0 left-0 w-full h-[45vh] bg-[#FFDB67] -z-10" />
      <div className="absolute top-[45vh] left-0 w-full h-[55vh] bg-[#F3F3F3] -z-10" />

      <div className="flex flex-col flex-1 items-center">
        <div className="w-full px-6 pt-4 pb-2 flex items-center">
          <button onClick={goToMain} className="mr-2 text-2xl text-black">
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
          <h1 className="text-xl font-semibold py-2">마이페이지</h1>
        </div>

        {/* 사용자 정보 카드 */}
        <div className="w-[90%] mt-4 bg-white rounded-2xl p-10 flex items-center shadow py-11">
          <img
            src={ProfileCat}
            alt="profile"
            className="w-[100px] h-[100px] rounded-[30px] mr-10 object-cover"
          />
          <div className="flex-1">
            <p className="text-[20px] font-semibold text-[#E9B201]">
              유엠씨야채<span className="text-black"> 님</span>
            </p>
            <p className="text-sm">오늘도 비타체크 하세요!</p>

            <button
              className="mt-2 bg-[#EBEBEB] rounded-full px-4 py-1 flex items-center justify-between cursor-pointer text-[13px]"
              onClick={handleEditInfo}
            >
              <span className="mr-2">내 정보 수정</span>
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
        </div>

        {/* 메뉴 리스트 */}
        <div className="mt-6 w-full px-6 space-y-3">
          <MenuItem
            label="찜한 제품"
            icon="💛"
            onClick={() => alert("찜한 제품")}
          />

          <div className="w-full mt-6 mb-6">
            {/* 박스 전체 */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              {/* 나의 영양제 관리 (위쪽) */}
              <div
                className="flex items-center justify-between px-4 py-4 cursor-pointer"
                onClick={() => alert("영양제 관리")}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">💊</span>
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
                  className="w-4 h-4 text-gray-400"
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
                onClick={() => alert("알림 설정")}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔔</span>
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
                  className="w-4 h-4 text-gray-400"
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

          <MenuItem
            label="고객센터"
            icon="🎧"
            onClick={() => alert("고객센터")}
          />
        </div>

        {/* 로그아웃 */}
        <div
          className="mt-auto mb-8 text-black text-sm underline cursor-pointer"
          onClick={handleLogout}
        >
          로그아웃
        </div>
      </div>
    </div>
  );
}

export default MyPage;
