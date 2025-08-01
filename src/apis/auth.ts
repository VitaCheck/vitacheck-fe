import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_API_URL;

export const postSocialSignup = async (data: {
  email: string;
  nickname: string;
  birth: string;
  gender: string;
  phoneNumber: string;
}) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/auth/social-signup`,
    data
  );
  return response.data;
};
