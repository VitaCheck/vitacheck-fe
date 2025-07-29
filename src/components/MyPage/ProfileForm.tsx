import { useState } from "react";
import ProfileInput from "./ProfileInput";

function ProfileForm() {
  const [nickname, setNickname] = useState("유엠씨야채1580");
  const [phone, setPhone] = useState("010-1234-5678");
  const [email] = useState("si****@gmail.com");

  const handleSave = () => {
    // 저장 로직 처리
    console.log("저장됨", { nickname, phone });
  };

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

      <div className="pt-6  mt-[22%] sm:mt-[5%]">
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
