import { useState } from "react";
import ProfileInput from "./ProfileInput";

function ProfileForm() {
  const [nickname, setNickname] = useState("유엠씨야채1580");
  const [phone, setPhone] = useState("010-1234-5678");
  const [email] = useState("si****@gmail.com");

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
    </div>
  );
}

export default ProfileForm;
