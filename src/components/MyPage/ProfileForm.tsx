import { useEffect, useState } from "react";
import ProfileInput from "./ProfileInput";
import { getUserInfo, updateUserInfo, type UserInfo } from "@/lib/user";
import { useNavigate } from "react-router-dom";

function ProfileForm() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("010-1234-5678");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user: UserInfo = await getUserInfo();
        setNickname(user.nickname);
        setEmail(user.email);
        setLoading(false);
      } catch (error) {
        console.error("사용자 정보 불러오기 실패", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      await updateUserInfo(nickname);
      alert("정보가 변경되었습니다.");
      navigate("/mypage");
    } catch (error) {
      console.error("닉네임 저장 실패:", error);
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
        label="휴대폰 번호"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <ProfileInput label="이메일 주소" value={email} />

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
