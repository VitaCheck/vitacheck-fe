import React from "react";
import { ensureIOSWebPushSubscription } from "@/lib/push-ios";

export default function SettingsPage() {
  async function debugIOSSubscribe() {
    const sub = await ensureIOSWebPushSubscription();
    if (!sub) { console.log("[IOS-PWA] subscribe failed"); return; }
    const json = sub.toJSON();
    console.log("[IOS-PWA] endpoint:", json.endpoint);
    console.log("[IOS-PWA] keys:", json.keys);
  }

  return (
    <div>
      <h1>설정 페이지</h1>
      {/* 디버그용 버튼 */}
      <button
        onClick={debugIOSSubscribe}
        className="border px-4 py-2 rounded bg-gray-200"
      >
        iOS WebPush 구독 디버그
      </button>
    </div>
  );
}
