import { useEffect, useState } from "react";
import Picker from "react-mobile-picker";
import axios from "@/lib/axios";

interface Props {
  id: number;
  onClose: () => void;
}

const AlarmEditModal = ({ id, onClose }: Props) => {
  const [name, setName] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const DAY_MAP: Record<string, string> = {
    SUN: "일",
    MON: "월",
    TUE: "화",
    WED: "수",
    THU: "목",
    FRI: "금",
    SAT: "토",
  };

  const selections = {
    hour: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")),
    minute: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")),
  };
  const [pickerValue, setPickerValue] = useState({
    hour: "09",
    minute: "00",
  });

  useEffect(() => {
    axios.get("/api/v1/notifications/routines").then((res) => {
      const routine = res.data.result.find(
        (r: any) => r.notificationRoutineId === id
      );
      if (routine) {
        setName(routine.supplementName);
        // 영어 → 한글 요일 변환
        const convertedDays = routine.daysOfWeek.map(
          (day: string) => DAY_MAP[day]
        );
        setDays(convertedDays);
        // setDays(routine.daysOfWeek);

        setTimes(routine.times);
        setPreviewUrl(routine.supplementImageUrl);
      }
    });
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowImagePicker(false);
    }
  };

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddTime = () => {
    const newTime = `${pickerValue.hour}:${pickerValue.minute}`;
    if (!times.includes(newTime)) {
      setTimes([...times, newTime]);
    }
  };

  const formatTime = (time: string) => {
    const [hourStr, minute] = time.split(":");
    const hour = parseInt(hourStr, 10);
    const isPM = hour >= 12;
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${isPM ? "오후" : "오전"} ${displayHour
      .toString()
      .padStart(2, "0")}:${minute}`;
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("supplementName", name);
    formData.append("weekDays", JSON.stringify(days));
    formData.append("intakeTimes", JSON.stringify(times));
    if (image) {
      formData.append("image", image);
    }

    await axios.post(`/api/v1/notifications/routines`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
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
          <button className="font-bold text-[23px]" onClick={handleSubmit}>
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
