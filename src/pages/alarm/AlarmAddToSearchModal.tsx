import { useState } from "react";
import TimePickerModal from "./TimePickerModal";
import axios from "@/lib/axios";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  // 상세 페이지에서 내려줄 값
  supplementId?: number;
  supplementName: string;
  supplementImageUrl?: string;
}

type DayEn = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

const KO_TO_EN: Record<string, DayEn> = {
  일: "SUN",
  월: "MON",
  화: "TUE",
  수: "WED",
  목: "THU",
  금: "FRI",
  토: "SAT",
};

const fixTime = (t?: string) => (t ? t.slice(0, 5) : "");
const unique = <T,>(arr: T[]) => Array.from(new Set(arr));

const AlarmAddToSearchModal = ({
  open,
  onClose,
  onCreated,
  supplementId,
  supplementName,
  supplementImageUrl,
}: Props) => {
  if (!open) return null;

  // ✅ AlarmAddModal 과 동일한 UI/상태
  const [name, setName] = useState(supplementName ?? "");
  const [days, setDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    supplementImageUrl ?? null
  );
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowImagePicker(false);
    }
  };

  // 오전/오후 표기 (같게 유지)
  const formatTime = (time: string) => {
    const [hourStr, minute] = time.split(":");
    const hour = parseInt(hourStr, 10);
    const isPM = hour >= 12;
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${isPM ? "오후" : "오전"} ${displayHour
      .toString()
      .padStart(2, "0")}:${minute}`;
  };

  const handleConfirmTime = (v: { hour: string; minute: string }) => {
    const newTime = fixTime(`${v.hour}:${v.minute}`);
    setTimes((prev) => unique([...prev, newTime]).sort());
    setShowTimePicker(false);
  };

  // ✅ 저장(생성) API — 기존 AlarmAddModal 과 동일 엔드포인트 사용
  const handleSubmit = async () => {
    if (!name.trim()) return alert("영양제 이름을 입력해 주세요.");
    if (days.length === 0) return alert("복용 요일을 선택해 주세요.");
    if (times.length === 0)
      return alert("복용 시간을 한 개 이상 추가해 주세요.");
    if (times.some((t) => !/^\d{2}:\d{2}$/.test(t)))
      return alert("시간 형식이 올바르지 않습니다.");

    try {
      setSaving(true);

      let imageUrl: string | undefined = previewUrl || undefined;
      if (image) {
        const uploaded = await uploadImageToCloudinary(image);
        if (!uploaded) {
          alert("이미지 업로드에 실패했습니다.");
          setSaving(false);
          return;
        }
        imageUrl = uploaded;
      }

      const schedules = days.flatMap((ko) =>
        times.map((t) => ({
          dayOfWeek: KO_TO_EN[ko],
          time: fixTime(t),
        }))
      );

      const payload: any = {
        name: name.trim(),
        imageUrl,
        schedules,
      };
      if (supplementId) payload.supplementId = supplementId;

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
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-3xl px-6 pt-5 pb-10 h-[70%] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
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

        {/* 이름 입력 (상세에서 받은 값으로 프리필) */}
        <label className="block text-[#808080] font-semibold text-[20px] mb-1">
          영양제 이름
        </label>
        <input
          className="w-full h-[50px] border border-[#AAAAAA] rounded-[10px] px-3 py-2 bg-white mx-auto"
          placeholder="예: 오메가3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 복용 요일 선택 */}
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
              <div
                key={`${t}-${idx}`}
                className="w-full h-[60px] border border-[#AAAAAA] rounded-[10px] px-4 py-2 flex justify-between items-center bg-white"
              >
                <span className="text-[16px] text-[#AAAAAA]">
                  복용 시간 {idx + 1}
                </span>
                <span className="text-[16px] font-semibold text-[#4D4D4D]">
                  {formatTime(t)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 시간 추가 버튼 */}
        <div className="flex justify-center mt-4">
          <button
            className="w-full h-[60px] border border-[#AAAAAA] text-[#AAAAAA] rounded-[10px] px-3 py-2 bg-white mx-auto"
            onClick={() => setShowTimePicker(true)}
          >
            복용 시간 추가
          </button>
        </div>

        {/* 이미지 선택 모달 */}
        {showImagePicker && (
          <div
            className="fixed inset-0 bg-black/40 flex items-end z-50"
            onClick={() => setShowImagePicker(false)}
          >
            <div
              className="w-full bg-white rounded-t-2xl px-6 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[18px] font-semibold mb-4">
                제품 사진 추가하기
              </p>
              <div className="flex flex-col">
                <label className="w-full h-[90px] text-left text-[18px] py-3 px-4 border-b border-[#D9D9D9] cursor-pointer flex items-center">
                  <img
                    src="/images/cameraModal.png"
                    alt="camera icon"
                    className="w-[50px] h-[50px] mr-[22px]"
                  />
                  카메라로 촬영하기
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                <label className="w-full h-[90px] text-left text-[18px] py-3 px-4 cursor-pointer flex items-center">
                  <img
                    src="/images/galleryModal.png"
                    alt="gallery icon"
                    className="w-[50px] h-[50px] mr-[22px]"
                  />
                  사진 앨범에서 선택하기
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 시간 선택 모달 */}
        {showTimePicker && (
          <TimePickerModal
            onClose={() => setShowTimePicker(false)}
            onConfirm={handleConfirmTime}
          />
        )}
      </div>
    </div>
  );
};

export default AlarmAddToSearchModal;
