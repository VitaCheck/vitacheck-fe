import api from "@/lib/axios";

export interface UserInfo {
  email: string;
  nickname: string;
  fullName: string;
  provider: string;
  age: number;
  birthDate: string;
  phoneNumber: string;
  profileImageUrl?: string;
}

export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await api.get("/api/v1/users/me");
  return response.data.result as UserInfo;
};

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

export const updateProfileImageUrl = async (profileImageUrl: string) => {
  const res = await api.patch(
    "/api/v1/users/me/profile-image",
    { profileImageUrl },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const getMyProfileImageUrl = async (): Promise<string | null> => {
  const res = await api.get<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: string | null;
  }>("/api/v1/users/me/profile-image", {
    params: { _t: Date.now() },
  });
  return res.data.result ?? null;
};

export async function updateFcmTokenWithLocalStorageFetch() {
  const fcmToken = localStorage.getItem("fcmToken");
  const accessToken = localStorage.getItem("accessToken");
  if (!fcmToken || !accessToken) return;

  await fetch(
    `${import.meta.env.VITE_SERVER_API_URL}/api/v1/users/me/fcm-token`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fcmToken }),
    }
  );
}


export const deleteMyAccount = async (): Promise<void> => {
  await api.delete("/api/v1/users/me", {
    validateStatus: (s) => s === 200 || s === 204,
  });
};
