import { useEffect, useState } from "react";
import ProfileInput from "./ProfileInput";
import {
  getUserInfo,
  updateUserInfo,
  deleteMyAccount,
  type UserInfo,
  type UpdateUserRequest,
} from "@/apis/user";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/Modal";   

interface ProfileFormProps {
  onSaveExtra?: () => Promise<void>;
}

function ProfileForm({ onSaveExtra }: ProfileFormProps) {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState(""); // "YYYY-MM-DD"
  const [original, setOriginal] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ✅ 탈퇴 모달 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserInfo();
        setNickname(user.nickname ?? "");
        setEmail(user.email ?? "");
        setPhone(user.phoneNumber ?? "");
        setBirthDate(user.birthDate ?? "");
        setOriginal(user);
      } catch (e) {
        console.error("사용자 정보 불러오기 실패", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!original) return;

    const payload: UpdateUserRequest = {};
    if (nickname.trim() !== original.nickname)
      payload.nickname = nickname.trim();
    if (phone.trim() !== original.phoneNumber)
      payload.phoneNumber = phone.trim();
    if (birthDate !== original.birthDate) payload.birthDate = birthDate;

    try {
      if (onSaveExtra) await onSaveExtra();
      if (Object.keys(payload).length > 0) {
        await updateUserInfo(payload);
      }
      alert("정보가 변경되었습니다.");
      navigate("/mypage");
    } catch (e) {
      console.error("저장 실패:", e);
      alert("저장에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      await deleteMyAccount();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("fcmToken");
      alert("탈퇴가 완료되었습니다.");
      navigate("/login", { replace: true });
    } catch (e) {
      console.error("회원 탈퇴 실패:", e);
      alert("탈퇴 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div className="space-y-4 px-2">
      <ProfileInput
        label="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <ProfileInput
        label="생년월일"
        value={birthDate}
        type="date"
        onChange={(e) => setBirthDate(e.target.value)}
      />
      <ProfileInput
        label="휴대폰 번호"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="010-1234-5678"
      />
      <ProfileInput label="이메일 주소" value={email} disabled />

      {/* 모바일 */}
      <div className="pt-6 mt-[15%] sm:hidden">
        <button
          onClick={handleSave}
          className="w-full bg-[#FFEB9D] hover:bg-[#FFDB67] text-black font-medium px-6 py-3 rounded-md transition-colors cursor-pointer"
        >
          저장하기
        </button>
      </div>

      {/* 데스크탑 */}
      <div className="hidden sm:flex items-center justify-between pt-6 mt-[5%]">
        <button
          onClick={() => setShowDeleteModal(true)} // ✅ 모달 열기
          className="px-5 py-2 rounded-[10px] w-[120px] border text-sm font-medium cursor-pointer
                     border-[#FF7E7E] text-[#FF7E7E] bg-white
                     hover:bg-[#FFF4F4] transition"
        >
          회원탈퇴
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="px-5 py-2 rounded-[10px] w-[120px] border text-sm font-medium cursor-pointer
                       border-[#D9D9D9] text-[#1C1B1F] bg-white
                       hover:bg-[#F8F8F8] transition"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-[10px] w-[120px] text-sm font-semibold cursor-pointer
                       bg-[#FFEB99] hover:bg-[#FFE57A] border border-[#F0D66A] transition"
          >
            저장하기
          </button>
        </div>
      </div>

      <Modal
        open={showDeleteModal}
        title="탈퇴하기"
        description="정말 비타체크 서비스를 탈퇴하시겠습니까?"
        confirmText="탈퇴"
        cancelText="닫기"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

export default ProfileForm;
