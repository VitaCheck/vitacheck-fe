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
export interface UpdateUserRequest {
  nickname?: string;
  birthDate?: string;
  phoneNumber?: string;
}

export const updateUserInfo = async (payload: UpdateUserRequest) => {
  const res = await api.put("/api/v1/users/me", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
