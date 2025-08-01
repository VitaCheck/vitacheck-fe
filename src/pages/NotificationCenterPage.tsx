import { useNavigate } from "react-router-dom";
import Setting from "../assets/Setting.svg";

function NotificationCenterPage() {
  const navigate = useNavigate();

  const notifications = [
    {
      type: "공지사항",
      icon: "🔔",
      message: "[영양제] 20대에게 가장 인기 많은 영양제! 지금 확인해보세요 🔍",
    },
    {
      type: "섭취알림",
      icon: "💊",
      message: (
        <>
          유엠씨야채님, '오메가3' 복용 시간이에요! ⏰ <br /> 설정하신 시간 오전
          09:30 입니다"
        </>
      ),
    },
    {
      type: "공지사항",
      icon: "🔔",
      message: "[영양제] 20대에게 가장 인기 많은 영양제! 지금 확인해보세요 🔍",
    },
  ];

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white sm:bg-[#F3F3F3] px-4 py-6 flex justify-center items-start sm:mt-10">
      <div className="w-full sm:max-w-[700px] sm:bg-white sm:rounded-2xl sm:p-8 sm:shadow-md">
        <div className="w-full pb-2 flex items-center justify-between">
          <div className="w-full pb-2 flex items-center justify-between sm:border-b sm:border-[#D9D9D9]">
            <div className="flex items-center">
              <button
                onClick={goBack}
                className="mr-2 text-2xl text-black sm:hidden"
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

              <h1 className="text-xl font-semibold py-2">알림센터</h1>
            </div>

            <img
              src={Setting}
              alt="알림 아이콘"
              className="w-6 h-6 cursor-pointer"
              onClick={() => navigate("/setting")}
            />
          </div>
        </div>
        <ul className="space-y-8 mt-4">
          {notifications.map((noti, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-xl">{noti.icon}</span>
              <div>
                <p className="text-lg font-medium text-black">{noti.type}</p>
                <p className="text-sm text-gray-800">{noti.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NotificationCenterPage;
