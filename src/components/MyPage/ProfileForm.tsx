import { useEffect, useState } from "react";
import ProfileInput from "./ProfileInput";
import {
  getUserInfo,
  updateUserInfo,
  type UserInfo,
  type UpdateUserRequest,
} from "@/apis/user";
import { useNavigate } from "react-router-dom";

function ProfileForm() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState(""); // "YYYY-MM-DD"
  const [original, setOriginal] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
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

    if (Object.keys(payload).length === 0) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    try {
      await updateUserInfo(payload);
      alert("정보가 변경되었습니다.");
      navigate("/mypage");
    } catch (e) {
      console.error("정보 저장 실패:", e);
      alert("저장에 실패했습니다.");
    }
  };

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div className="space-y-4">
      <ProfileInput
        label="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <ProfileInput
        label="생년월일"
        value={birthDate}
        type="date" // 브라우저 날짜 입력
        onChange={(e) => setBirthDate(e.target.value)} // "YYYY-MM-DD"
      />
      <ProfileInput
        label="휴대폰 번호"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="010-1234-5678"
      />
      <ProfileInput
        label="이메일 주소"
        value={email}
        disabled // 이메일은 수정 불가
      />

      <div className="pt-6 mt-[22%] sm:mt-[5%]">
        <button
          onClick={handleSave}
          className="w-full bg-[#FFEB9D] hover:bg-[#FFDB67] text-black font-medium px-6 py-3 rounded-md transition-colors cursor-pointer"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}

export default ProfileForm;
