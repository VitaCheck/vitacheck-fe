import api from "@/lib/axios";

export type NotificationType = "EVENT" | "INTAKE";
export type NotificationChannel = "EMAIL" | "SMS" | "PUSH";

export interface NotificationSetting {
  type: NotificationType;
  channel: NotificationChannel;
  enabled: boolean;
}

// 조회
export const getMyNotificationSettings = async (): Promise<
  NotificationSetting[]
> => {
  const res = await api.get("/api/v1/notification-settings/me");
  if (res.data?.isSuccess) return res.data.result as NotificationSetting[];
  throw new Error("알림 설정 조회 실패");
};

// 내 알림 설정 변경
export const updateMyNotificationSetting = async (
  setting: NotificationSetting
) => {
  const res = await api.put("/api/v1/notification-settings/me", {
    type: setting.type,
    channel: setting.channel,
    isEnabled: setting.enabled,
  });
  return res.data;
};
