import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import TimePickerModal from "./TimePickerModal";
import ImagePickerModal from "@/components/alarm/ImagePickerModal";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

// 공용 타입/유틸 사용 (없다면 utils/alarm.ts에 추가해 두세요)
import type { DayOfWeek as DayEn } from "@/types/alarm";
import { KO_TO_EN, fixTime, unique, formatTime } from "@/utils/alarm";

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

const AlarmAddModal = ({ onClose, onCreated }: Props) => {
  const [name, setName] = useState("");
  const [days, setDays] = useState<string[]>([]); // ["일","월",...]
  const [times, setTimes] = useState<string[]>([]); // ["09:00","22:00"]

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [saving, setSaving] = useState(false);

  // 시간 편집 상태
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [timePickerDefault, setTimePickerDefault] = useState<{
    hour: string;
    minute: string;
  }>();

  // 미리보기 URL 메모리 누수 방지
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // 모달 열릴 때 배경 스크롤 잠금 (선택)
  useEffect(() => {
    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.overflowY = "scroll";
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflowY = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    };
  }, []);

  const openAddTime = () => {
    setEditingIndex(null);
    setTimePickerDefault({ hour: "09", minute: "00" });
    setShowTimePicker(true);
  };

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleImageSelected = (file: File) => {
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowImagePicker(false);
  };

  const openEditTime = (index: number) => {
    const t = times[index] ?? "09:00";
    const [h, m] = t.split(":");
    setEditingIndex(index);
    setTimePickerDefault({ hour: h, minute: m });
    setShowTimePicker(true);
  };

  const removeTime = (index: number) => {
    setTimes((prev) => prev.filter((_, i) => i !== index));
  };

  // 시간 확정: 편집이면 교체, 추가면 append (중복 제거 + 정렬)
  const handleConfirmTime = (v: { hour: string; minute: string }) => {
    const newTime = fixTime(`${v.hour}:${v.minute}`);
    setTimes((prev) => {
      let next = [...prev];
      if (editingIndex === null) {
        if (!next.includes(newTime)) next.push(newTime);
      } else {
        next[editingIndex] = newTime;
      }
      return unique(next).sort();
    });

    setShowTimePicker(false);
    setEditingIndex(null);
    setTimePickerDefault(undefined);
  };

  // 저장(생성)
  const handleSubmit = async () => {
    if (!name.trim()) return alert("영양제 이름을 입력해 주세요.");
    if (days.length === 0) return alert("복용 요일을 선택해 주세요.");
    if (times.length === 0)
      return alert("복용 시간을 한 개 이상 추가해 주세요.");
    if (times.some((t) => !/^\d{2}:\d{2}$/.test(t)))
      return alert("시간 형식이 올바르지 않습니다.");

    try {
      setSaving(true);

      let imageUrl: string | undefined;
      if (image) {
        const uploaded = await uploadImageToCloudinary(image);
        if (!uploaded) {
          alert("이미지 업로드에 실패했습니다.");
          setSaving(false);
          return;
        }
        imageUrl = uploaded;
      }

      // ["일","수"]×["09:00","22:00"] → schedules
      const schedules = days.flatMap((ko) =>
        times.map((t) => ({
          dayOfWeek: KO_TO_EN[ko] as DayEn,
          time: fixTime(t),
        }))
      );

      const payload = {
        name: name.trim(),
        imageUrl, // undefined면 BE에서 무시
        schedules,
      };

      await axios.post("/api/v1/notifications/routines/custom", payload);

      alert("알림이 추가되었습니다!");
      onCreated?.();
      onClose();
    } catch (err: any) {
      console.error("알림 추가 실패:", err?.response ?? err);
      alert(
        err?.response?.data?.message ??
          "알림 추가에 실패했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      onClick={onClose} // 배경 클릭 시 닫기
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full bg-white rounded-t-3xl px-6 pt-5 pb-10 h-[70%] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onClose} className="font-medium text-[23px]">
            취소
          </button>
          <span className="text-gray-500 font-bold text-[25px]">알림 추가</span>
          <button
            className="font-bold text-[23px]"
            onClick={handleSubmit}
            disabled={saving}
          >
            저장
          </button>
        </div>

        {/* 이미지 업로드 */}
        <div className="mb-4">
          <button
            onClick={() => setShowImagePicker(true)}
            className="w-[140px] h-[140px] rounded-[12px] bg-white border border-[#AAAAAA] flex items-center justify-center overflow-hidden"
            aria-label="제품 사진 추가"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="w-full h-full object-cover rounded-[12px]"
              />
            ) : (
              <img
                src="/images/camera.png"
                alt="camera icon"
                className="w-[51.67px] h-[46.5px] object-cover rounded-[12px]"
              />
            )}
          </button>
        </div>

        {/* 이름 입력 */}
        <label className="block text-[#808080] font-semibold text-[20px] mb-1">
          영양제 이름
        </label>
        <input
          className="w-full h-[50px] border border-[#AAAAAA] rounded-[10px] px-3 py-2 bg-white mx-auto"
          placeholder="예: 오메가3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 복용 요일 */}
        <label className="block text-[#808080] font-semibold text-[20px] mb-1 mt-[38px]">
          복용 요일 선택
        </label>
        <div className="flex justify-between mb-4">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <button
              key={day}
              className={`w-[47.5px] h-[47.5px] rounded-[9.5px] border border-[#AAAAAA] ${
                days.includes(day)
                  ? "bg-[#808080] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        {/* 시간 리스트 */}
        {times.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {times.map((t, idx) => (
              <button
                key={`${t}-${idx}`}
                type="button"
                onClick={() => openEditTime(idx)}
                className="w-full h-[60px] border border-[#AAAAAA] rounded-[10px] px-4 py-2 flex justify-between items-center bg-white text-left"
                title="탭하여 시간 편집"
              >
                <span className="text-[16px] text-[#AAAAAA]">
                  복용 시간 {idx + 1}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[16px] font-semibold text-[#4D4D4D]">
                    {formatTime(t)}
                  </span>
                  <span
                    role="button"
                    aria-label="시간 삭제"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTime(idx);
                    }}
                    className="text-[#666666] text-[18px] leading-none px-2"
                  >
                    &times;
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 시간 추가 버튼 */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            className="w-full h-[60px] border border-[#AAAAAA] text-[#AAAAAA] rounded-[10px] px-3 py-2 bg-white mx-auto"
            onClick={openAddTime}
          >
            복용 시간 추가
          </button>
        </div>

        {/* 시간 선택 모달 */}
        {showTimePicker && (
          <TimePickerModal
            key={`${editingIndex ?? "add"}-${timePickerDefault?.hour ?? "09"}:${timePickerDefault?.minute ?? "00"}`}
            onClose={() => {
              // 닫기만 — editingIndex는 유지(확정 시 초기화)
              setShowTimePicker(false);
            }}
            onConfirm={handleConfirmTime}
            defaultValue={timePickerDefault}
          />
        )}

        {/* 이미지 선택 모달 */}
        <ImagePickerModal
          open={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelect={handleImageSelected}
        />
      </div>
    </div>
  );
};

export default AlarmAddModal;
