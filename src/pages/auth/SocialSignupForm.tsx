import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { postSocialSignup } from "@/apis/auth";

export default function SocialSignupForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: state?.email || "",
    provider: state?.provider || "",
    providerId: state?.providerId || "",
    nickname: "",
    birth: "",
    gender: "MALE",
    phoneNumber: "",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await postSocialSignup(form);
      localStorage.setItem("accessToken", res.result.accessToken);
      localStorage.setItem("refreshToken", res.result.refreshToken);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        name="nickname"
        value={form.nickname}
        onChange={onChange}
        placeholder="닉네임"
      />
      <input
        name="birth"
        value={form.birth}
        onChange={onChange}
        placeholder="YYYY-MM-DD"
      />
      <select name="gender" value={form.gender} onChange={onChange}>
        <option value="MALE">남성</option>
        <option value="FEMALE">여성</option>
      </select>
      <input
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={onChange}
        placeholder="전화번호"
      />
      <button type="submit">회원가입</button>
    </form>
  );
}
