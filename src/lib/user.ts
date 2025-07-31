import axios from "axios";

export interface UserInfo {
  email: string;
  nickname: string;
  fullName: string;
  provider: string;
  age: number;
}

const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL;

export const getUserInfo = async (token: string): Promise<UserInfo> => {
  const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.result as UserInfo;
};

export const updateUserInfo = async (token: string, nickname: string) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/v1/users/me`,
    { nickname },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
