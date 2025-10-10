// alarm/settings/add

import { useState } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

const days = [
  { label: "일", value: "SUN" },
  { label: "월", value: "MON" },
  { label: "화", value: "TUE" },
  { label: "수", value: "WED" },
  { label: "목", value: "THU" },
  { label: "금", value: "FRI" },
  { label: "토", value: "SAT" },
];

const DesktopAlarmAddPage = () => {
  const [supplementName, setSupplementName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobile) {
      // 모바일이면 알림 설정 리스트로 강제 리다이렉트
      navigate("/alarm/settings");
    }
  }, [isMobile, navigate]);

  if (isMobile) return null; // 모바일에선 아무것도 렌더링하지 않음

  const toggleDay = (value: string) => {
    setSelectedDays((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const handleTimeChange = (index: number, value: string) => {
    const updated = [...times];
    updated[index] = value;
    setTimes(updated);
  };

  const addTime = () => setTimes([...times, ""]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 유틸: undefined/null 제거
  const clean = (obj: Record<string, any>) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
    );

  // handleSubmit
  const handleSubmit = async () => {
    if (
      !supplementName.trim() ||
      selectedDays.length === 0 ||
      times.some((t) => !t)
    ) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      // (요일 × 시간) -> schedules 배열로 변환
      const schedules = selectedDays.flatMap(
        (d) =>
          times
            .filter(Boolean)
            .map((t) => ({ dayOfWeek: d, time: t.slice(0, 5) })) // HH:mm 보장
      );

      const payload = {
        name: supplementName.trim(),
        imageUrl: imageUrl || undefined, // 없으면 필드 생략
        schedules,
      };

      console.log("📦 payload(custom):", payload);

      await axios.post("/api/v1/notifications/routines/custom", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
        },
      });

      alert("알림이 추가되었습니다!");
      navigate("/alarm/settings");
    } catch (err: any) {
      console.error("create routine error:", err?.response ?? err);
      alert(err?.response?.data?.message ?? "알림 추가에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-[480px] mx-auto pt-12 pb-20 space-y-8 ">
      {/* 상단 헤더 */}
      <div className="relative flex items-center justify-between w-full">
        <button
          onClick={() => navigate("/alarm/settings")}
          className="text-[28px] text-[#000000] font-semibold"
        >
          취소
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-[33px] text-[#202020] font-bold">
          알림 추가
        </h2>
        <button
          onClick={handleSubmit}
          className="text-[28px] text-[#000000] font-semibold"
        >
          저장
        </button>
      </div>

      {/* 이미지 업로드 */}
      <div className="w-[272px] h-[248px] bg-white rounded-[20px] flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <img
              src="/images/camera.png"
              alt="camera icon"
              className="w-[102.5px] h-[92.25px]"
            />
          </label>
        )}
      </div>

      {/* 영양제 이름 */}
      <div className="flex flex-col space-y-[20px]">
        <label className="font-semibold text-[24px] text-[#6B6B6B] mb-[20px]">
          영양제 이름
        </label>
        <input
          type="text"
          className="w-full h-[73px] border border-[#AAAAAA] rounded-xl px-4 py-2 text-[22px] text-[#202020] bg-white"
          placeholder="예: 멀티비타민"
          value={supplementName}
          onChange={(e) => setSupplementName(e.target.value)}
        />
      </div>

      {/* 요일 선택 */}
      <div className="flex flex-col space-y-[20px]">
        <label className="font-semibold text-[24px] text-[#6B6B6B]">
          복용 요일 선택
        </label>
        <div className="grid grid-cols-7 gap-[10px]">
          {days.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              className={`w-full aspect-square rounded-xl text-[22px] font-semibold border transition ${
                selectedDays.includes(value)
                  ? "bg-[#AAAAAA] text-white border-transparent"
                  : "bg-white text-[#AAAAAA] border border-[#AAAAAA]"
              }`}
              onClick={() => toggleDay(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 시간 선택 */}
      <div className="flex flex-col space-y-[20px]">
        <label className="font-semibold text-[24px] text-[#6B6B6B]">
          복용 시간 선택
        </label>
        {(times ?? []).map((time, index) => (
          <div
            key={index}
            className="flex items-center justify-between mb-4 w-full h-[73px] bg-white border border-[#AAAAAA] rounded-xl px-4"
          >
            {/* 복용 시간 n */}
            <span className="text-[#9C9C9C] text-[22px] font-medium">
              복용 시간 {index + 1}
            </span>

            {/* 시간 input */}
            <div className="flex items-center gap-3">
              <input
                type="time"
                className="w-[150px] h-[48px] text-[22px] font-medium text-[#202020] bg-transparent focus:outline-none"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
              />

              {/* 삭제 버튼 (2개 이상일 때만 표시) */}
              {times.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setTimes((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="w-[24px] h-[24px] rounded-full bg-[#C7C7C7] flex items-center justify-center hover:bg-[#B5B5B5]"
                >
                  <span className="text-white text-[22px] leading-none pb-[2px]">
                    ×
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          onClick={addTime}
          className="bg-white w-full h-[73px] border border-[#AAAAAA] text-[22px] py-2 rounded-xl text-gray-700"
        >
          복용 시간 추가
        </button>
      </div>
    </div>
  );
};

export default DesktopAlarmAddPage;
