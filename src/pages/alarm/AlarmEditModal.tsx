import { useEffect, useMemo, useState } from "react";
import Picker from "react-mobile-picker";
import axios from "@/lib/axios";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

// ==== 타입 ====
type DayEn = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
type Schedule = { dayOfWeek: DayEn; time: string };

// ==== 요일/표시 ====
const EN_TO_KO: Record<DayEn, string> = {
  SUN: "일",
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
};
const KO_TO_EN: Record<string, DayEn> = {
  일: "SUN",
  월: "MON",
  화: "TUE",
  수: "WED",
  목: "THU",
  금: "FRI",
  토: "SAT",
};
const DAY_ORDER: DayEn[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// ==== 유틸 ====
const fixTime = (t?: string) => (t ? t.slice(0, 5) : "");
const unique = <T,>(arr: T[]) => Array.from(new Set(arr));

const normalizeRoutine = (raw: any) => {
  // 단건/목록 응답을 하나의 내부 형태로 정규화
  const supplementName: string = String(raw?.supplementName ?? raw?.name ?? "");
  const supplementImageUrl: string | null =
    raw?.supplementImageUrl ?? raw?.imageUrl ?? null;

  let daysOfWeek: DayEn[] | undefined = Array.isArray(raw?.daysOfWeek)
    ? raw.daysOfWeek.filter(Boolean)
    : undefined;
  let times: string[] | undefined = Array.isArray(raw?.times)
    ? raw.times.filter(Boolean).map(fixTime)
    : undefined;

  const schedules: Schedule[] | undefined = Array.isArray(raw?.schedules)
    ? raw.schedules
    : undefined;

  if ((!daysOfWeek || !daysOfWeek.length) && schedules) {
    daysOfWeek = unique(
      schedules.map((s) => s?.dayOfWeek).filter((v): v is DayEn => Boolean(v))
    );
  }
  if ((!times || !times.length) && schedules) {
    times = unique(schedules.map((s) => fixTime(s?.time)).filter(Boolean));
  }

  return {
    supplementName,
    supplementImageUrl: supplementImageUrl ?? null,
    daysOfWeek: daysOfWeek ?? [],
    times: times ?? [],
  };
};

interface Props {
  id: number;
  onClose: () => void;
  onSaved?: () => void; // ✅ 추가
}

const AlarmEditModal = ({ id, onClose, onSaved }: Props) => {
  // 폼 상태 (EN 코드로 들고 있다가 렌더만 한글 표시)
  const [name, setName] = useState("");
  const [days, setDays] = useState<DayEn[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  // 시간 선택용 피커
  const selections = {
    hour: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")),
    minute: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")),
  };
  const [pickerValue, setPickerValue] = useState({ hour: "09", minute: "00" });

  // 초기 로드 (데스크탑과 동일한 로직: 목록을 받아서 find)
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/v1/notifications/routines");
        const all = Array.isArray(res?.data?.result) ? res.data.result : [];
        const routine = all.find(
          (r: any) => Number(r?.notificationRoutineId) === Number(id)
        );
        if (!routine) throw new Error("해당 루틴이 없습니다.");

        const norm = normalizeRoutine(routine);
        setName(norm.supplementName);
        setDays(
          unique(norm.daysOfWeek).sort(
            (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
          )
        );
        setTimes(unique(norm.times).sort());
        setPreviewUrl(norm.supplementImageUrl);
      } catch (e) {
        console.error("루틴 불러오기 실패:", e);
        alert("알림 정보를 불러오지 못했습니다.");
        onClose();
      }
    })();
  }, [id, onClose]);

  const toggleDay = (ko: string) => {
    const en = KO_TO_EN[ko];
    setDays((prev) =>
      prev.includes(en) ? prev.filter((d) => d !== en) : [...prev, en]
    );
  };

  const handleAddTime = () => {
    const newTime = fixTime(`${pickerValue.hour}:${pickerValue.minute}`);
    setTimes((prev) => {
      const next = unique([...prev, newTime]).sort();
      return next;
    });
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    const isPM = hour >= 12;
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${isPM ? "오후" : "오전"} ${displayHour
      .toString()
      .padStart(2, "0")}:${m}`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowImagePicker(false);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return alert("영양제 이름을 입력해 주세요.");
    if (!days.length) return alert("복용 요일을 선택해 주세요.");
    if (!times.length) return alert("복용 시간을 한 개 이상 추가해 주세요.");
    if (times.some((t) => !/^\d{2}:\d{2}$/.test(t)))
      return alert("시간 형식이 올바르지 않습니다.");

    try {
      setSaving(true);

      // 이미지 변경 시 업로드
      let imageUrl = previewUrl ?? undefined;
      if (imageFile) {
        const uploaded = await uploadImageToCloudinary(imageFile);
        if (!uploaded) {
          alert("이미지 업로드에 실패했습니다.");
          setSaving(false);
          return;
        }
        imageUrl = uploaded;
      }

      // 데스크탑과 동일한 API 흐름: schedules 기반 custom upsert
      const schedules: Schedule[] = days.flatMap((d) =>
        times.map((t) => ({ dayOfWeek: d, time: fixTime(t) }))
      );

      const payload = {
        notificationRoutineId: Number(id),
        name: name.trim(),
        imageUrl, // undefined면 필드 생략되어도 OK (백엔드에서 처리)
        schedules,
      };

      await axios.post("/api/v1/notifications/routines/custom", payload);
      if (onSaved) onSaved();
      alert("알림이 저장되었습니다!");
      onClose();
    } catch (err: any) {
      console.error("알림 저장 실패:", err?.response ?? err);
      alert(
        err?.response?.data?.message ??
          "알림 저장에 실패했습니다. 잠시 후 다시 시도해 주세요."
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
          <span className="text-gray-500 font-bold text-[25px]">알림 수정</span>
          <button
            className="font-bold text-[23px]"
            onClick={handleSubmit}
            disabled={saving}
          >
            {"저장"}
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
                alt="preview"
                className="w-[51.67px] h-[46.5px] rounded-[12px]"
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

        {/* 복용 요일 선택 */}
        <label className="block text-[#808080] font-semibold text-[20px] mb-1 mt-[38px]">
          복용 요일 선택
        </label>
        <div className="flex justify-between mb-4">
          {DAY_ORDER.map((en) => {
            const ko = EN_TO_KO[en];
            const active = days.includes(en);
            return (
              <button
                key={en}
                className={`w-[47.5px] h-[47.5px] rounded-[9.5px] border border-[#AAAAAA] ${
                  active ? "bg-[#808080] text-white" : "bg-white text-black"
                }`}
                onClick={() => toggleDay(ko)}
              >
                {ko}
              </button>
            );
          })}
        </div>

        {/* 추가된 시간 리스트 */}
        {times.length > 0 && (
          <div className="flex flex-col gap-2 mt-4">
            {times.map((t, idx) => (
              <div
                key={t}
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

        {/* 복용 시간 추가 버튼 */}
        <div className="flex justify-center mt-4">
          <button
            className="w-full h-[60px] border border-[#AAAAAA] text-[#AAAAAA] rounded-[10px] px-3 py-2 bg-white mx-auto"
            onClick={() => setShowTimePicker(true)}
          >
            복용 시간 추가
          </button>
        </div>

        {/* 시간 선택 모달 */}
        {showTimePicker && (
          <div
            className="fixed inset-0 bg-black/40 flex items-end z-50"
            onClick={() => setShowTimePicker(false)}
          >
            <div
              className="w-full bg-white rounded-t-2xl px-6 py-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex justify-center items-center w-full mx-auto h-[180px]">
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-[36px] bg-[#F1F1F1] rounded-md z-0" />
                <div className="relative z-10 flex gap-3">
                  <Picker
                    value={pickerValue}
                    onChange={setPickerValue}
                    height={180}
                    itemHeight={36}
                    className="flex gap-3"
                  >
                    <Picker.Column
                      name="hour"
                      className="flex flex-col items-center"
                    >
                      {selections.hour.map((h) => (
                        <Picker.Item
                          key={h}
                          value={h}
                          className="text-[24px] leading-[36px]"
                        >
                          {h}
                        </Picker.Item>
                      ))}
                    </Picker.Column>

                    <div className="flex items-center justify-center text-[24px] w-[20px]">
                      :
                    </div>

                    <Picker.Column
                      name="minute"
                      className="flex flex-col items-center"
                    >
                      {selections.minute.map((m) => (
                        <Picker.Item
                          key={m}
                          value={m}
                          className="text-[24px] leading-[36px]"
                        >
                          {m}
                        </Picker.Item>
                      ))}
                    </Picker.Column>
                  </Picker>
                </div>
              </div>

              <button
                className="w-full mt-4 h-[50px] bg-[#FFEB9D] rounded-[10px] text-[18px] font-bold"
                onClick={() => {
                  handleAddTime();
                  setShowTimePicker(false);
                }}
              >
                시간 추가
              </button>
            </div>
          </div>
        )}

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
                <label className="w-full h-[90px] text-left text-[18px] text-black py-3 px-4 border-b border-[#D9D9D9] cursor-pointer flex items-center">
                  <img
                    src="/images/cameraModal.png"
                    alt="camera icon"
                    className="w-[50px] h-[50px] object-cover mr-[22px]"
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
                <label className="w-full h-[90px] text-left text-[18px] text-black py-3 px-4 cursor-pointer flex items-center">
                  <img
                    src="/images/galleryModal.png"
                    alt="gallery icon"
                    className="w-[50px] h-[50px] object-cover mr-[22px]"
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
      </div>
    </div>
  );
};

export default AlarmEditModal;
