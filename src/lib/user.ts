import api from "@/lib/axios";

export interface UserInfo {
  email: string;
  nickname: string;
  fullName: string;
  provider: string;
  age: number;
  birthDate: string;
  phoneNumber: string;
}

// 사용자 정보 조회
export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await api.get("/api/v1/users/me");
  return response.data.result as UserInfo;
};

// 사용자 닉네임 업데이트
export const updateUserInfo = async (nickname: string) => {
  const response = await api.put(
    "/api/v1/users/me",
    { nickname },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
