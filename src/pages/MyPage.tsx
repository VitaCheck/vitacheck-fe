import MenuItem from "../components/MyPage/MenuItem";
import ProfileCat from "../assets/ProfileCat.svg";
import Profile from "../assets/Profile2.svg";
import { useNavigate } from "react-router-dom";
import Back from "../assets/back.svg";
import Bell from "../assets/MyPageBell.svg";
import Scrap from "../assets/MyPageScrap.svg";
import Vita from "../assets/MyPageVita.svg";
import Mypage4 from "../assets/mypage4.svg";
import Lock from "../assets/mypagelock.svg";
import Logout from "../assets/logout.svg";
import { useEffect, useMemo, useState } from "react";
import { getMyProfileImageUrl, getUserInfo, type UserInfo } from "@/apis/user";
import { useLogout } from "@/hooks/useLogout";

// ✅ 약관 API 훅 (이미 작성해둔 파일)
import { useTerms, type Term } from "@/apis/terms";
import Modal from "@/components/Modal";

/** ─────────────────────────────────────────────────────────
 * 간단 모달 컴포넌트 (TermsModal 대체/내장)
 * 프로젝트에 이미 TermsModal 컴포넌트가 있으면 그걸 import 해서 써도 됩니다.
 * ───────────────────────────────────────────────────────── */
function InlineTermsModal({
  open,
  title,
  html,
  onClose,
}: {
  open: boolean;
  title?: string;
  html?: string;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="닫기"
      />
      {/* panel */}
      <div className="relative max-h-[80vh] w-[min(680px,92vw)] overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title ?? "약관"}</h3>
          <button
            onClick={onClose}
            className="rounded-md border px-3 py-1 text-sm"
          >
            닫기
          </button>
        </div>
        <div
          className="prose max-w-none overflow-y-auto pr-1"
          style={{ maxHeight: "60vh" }}
          dangerouslySetInnerHTML={{
            __html: html ?? "<p>내용이 없습니다.</p>",
          }}
        />
      </div>
    </div>
  );
}

function MyPage() {
  const navigate = useNavigate();
  const logout = useLogout();
  const [userLoadFailed, setUserLoadFailed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const confirmDelete = async () => {
    // 1) 모달 닫기
    closeDeleteModal();

    // 2) 로컬 데이터 정리(프로젝트에서 쓰는 키들 전부)
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("access_token"); // 혹시 다른 키도 쓰면 함께 제거
      localStorage.removeItem("refreshToken");
      // 필요시 추가: localStorage.clear(); (다 지우고 싶다면)
    } catch {
      console.log("");
    }

    navigate("/login", { replace: true });
  };

  const confirmLogout = async () => {
    closeLogoutModal();
    await logout("/login");
  };

  const goToMain = () => {
    navigate("/"); // 메인 페이지로 이동
  };

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [, setProfileLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUserLoadFailed(true);
        return;
      }
      try {
        const user = await getUserInfo();
        setUserInfo(user);
        setProfileLoading(true);
        const url = await getMyProfileImageUrl();
        setProfileUrl(url); // null이면 기본 이미지로 대체
      } catch (error) {
        console.error("유저 정보/프로필 이미지 불러오기 실패", error);
        setUserLoadFailed(true);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchUser();
  }, []);

  const imgSrc = userLoadFailed ? Profile : (profileUrl ?? ProfileCat);

  /** ─────────────────────────────────────────────────────────
   * 약관 모달 상태 + 데이터
   * ───────────────────────────────────────────────────────── */
  const {
    data: allTerms,
    isLoading: termsLoading,
    error: termsError,
  } = useTerms();
  const [openKey, setOpenKey] = useState<null | "service" | "privacy">(null);

  // 키워드로 약관 고르기: 제목에 포함되는 텍스트 우선, 실패 시 합리적 fallback
  const pickTerm = (keyword: "service" | "privacy"): Term | undefined => {
    const list = allTerms ?? [];
    if (list.length === 0) return undefined;

    const byTitle =
      keyword === "service"
        ? list.find(
            (t) => t.title?.includes("이용약관") || t.title?.includes("서비스")
          )
        : list.find((t) => t.title?.includes("개인정보"));

    if (byTitle) return byTitle;

    const required = list.filter((t) => t.required);
    if (keyword === "privacy") {
      // 개인정보는 보통 필수 약관 2개 중 하나일 가능성이 높음
      return required[1] ?? required[0] ?? list[0];
    }
    // service
    return required[0] ?? list[0];
  };

  const selectedTerm = useMemo(() => {
    if (!openKey) return undefined;
    return pickTerm(openKey);
  }, [openKey, allTerms]);

  const modalTitle = termsLoading
    ? "로딩 중…"
    : termsError
      ? "약관 조회 오류"
      : selectedTerm?.title ||
        (openKey === "privacy" ? "개인정보 처리방침" : "서비스 이용약관");

  const modalHtml = termsLoading
    ? "<p>약관을 불러오는 중...</p>"
    : termsError
      ? "<p style='color:#ef4444'>약관을 불러오는 중 오류가 발생했습니다.</p>"
      : selectedTerm?.content || "<p>내용이 없습니다.</p>";

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
            <img
              src={Back}
              alt="icon"
              className="w-[20px] h-[20px] object-contain"
            />
          </button>
          <h1 className="text-[24px] font-semibold py-2">마이페이지</h1>
        </div>

        {/* 사용자 정보 카드 */}
        <div className="w-[90%] h-[25vh] sm:h-auto bg-white rounded-2xl px-6 py-8 sm:py-4 flex items-center relative shadow">
          <img
            src={imgSrc}
            alt="profile"
            className="w-[100px] h-[100px] rounded-[50px] mr-6 object-cover border-gray-300 border"
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
              {/* 서비스 이용약관 */}
              <div
                className="flex items-center justify-between px-4 py-4 cursor-pointer"
                onClick={() => navigate("/terms/service")}
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

              {/* 개인정보 처리방침 */}
              <div
                className="flex items-center justify-between px-4 py-4 cursor-pointer"
                onClick={() => navigate("/terms/privacy")}
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
                onClick={openLogoutModal}
              />
            </div>
          )}
        </div>

        {/* 로그아웃 */}
        {!userLoadFailed && (
          <div className="mt-auto mb-3 flex items-center justify-center gap-4 sm:hidden">
            <button
              className="text-[#6B6B6B] text-sm cursor-pointer hover:text-black"
              onClick={openLogoutModal}
            >
              로그아웃
            </button>
            <span className="text-[#D1D1D1]">|</span>
            <button
              className="text-[#6B6B6B] text-sm cursor-pointer hover:text-black"
              onClick={openDeleteModal}
            >
              회원 탈퇴
            </button>
          </div>
        )}
      </div>

      {/* ✅ 약관 모달 (공통) */}
      <InlineTermsModal
        open={openKey !== null}
        title={modalTitle}
        html={modalHtml}
        onClose={() => setOpenKey(null)}
      />

      <Modal
        open={showLogoutModal}
        title="로그아웃"
        description="로그아웃 하시겠습니까?"
        cancelText="닫기"
        confirmText="로그아웃"
        onCancel={closeLogoutModal}
        onConfirm={confirmLogout}
      />

      {/* ✅ 탈퇴 모달 */}
      <Modal
        open={showDeleteModal}
        title="탈퇴하기"
        description="정말 비타체크 서비스를 탈퇴하시겠습니까?"
        cancelText="닫기"
        confirmText="탈퇴하기"
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default MyPage;
