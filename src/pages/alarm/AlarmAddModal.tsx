import { useState } from "react";
import Picker from "react-mobile-picker";

interface Props {
  onClose: () => void;
}

const AlarmAddModal = ({ onClose }: Props) => {
  const [name, setName] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const selections = {
    hour: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")),
    minute: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")),
  };
  const [pickerValue, setPickerValue] = useState({
    hour: "09",
    minute: "00",
  });

  const [times, setTimes] = useState<string[]>([]);

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
    return `${isPM ? "오후" : "오전"} ${displayHour.toString().padStart(2, "0")}:${minute}`;
  };

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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
          <span className="text-gray-500 font-bold text-[25px]">알림 추가</span>
          <button className="font-bold text-[23px]">저장</button>
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
              <span className="text-[30px] text-[#CCCCCC]">📷</span>
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

        {/* 휠형 시간 선택 */}
        <label className="block text-[#808080] font-semibold text-[20px] mb-1 mt-[38px]">
          복용 시간 선택
        </label>
        <div className="relative flex justify-center items-center w-full mx-auto h-[180px]">
          {/* 선택 영역 배경 */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-[36px] bg-[#F1F1F1] rounded-md z-0" />

          {/* Picker */}
          <div className="relative z-10 flex gap-3">
            <Picker
              value={pickerValue}
              onChange={setPickerValue}
              height={180}
              itemHeight={36}
              className="flex gap-3"
            >
              {/* Hour Column */}
              <Picker.Column name="hour" className="flex flex-col items-center">
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

              {/* 콜론 ":" */}
              <div className="flex items-center justify-center text-[24px] font-regular w-[20px]">
                :
              </div>

              {/* Minute Column */}
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

        <div className="flex justify-center mt-4">
          <button
            className="w-full h-[60px] border border-[#AAAAAA] text-[#AAAAAA] rounded-[10px] px-3 py-2 bg-white mx-auto"
            onClick={handleAddTime}
          >
            복용 시간 추가
          </button>
        </div>

        {/* 이미지 선택 옵션 */}
        {showImagePicker && (
          <div
            className="fixed inset-0 bg-black/40 flex items-end z-50"
            onClick={() => setShowImagePicker(false)}
          >
            <div
              className="w-full bg-white rounded-t-2xl px-6 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[18px] font-semibold mb-4 ">
                제품 사진 추가하기
              </p>

              <div className="flex flex-col">
                <label className="w-full h-[90px] text-left text-[18px] text-black py-3 px-4 border-b border-[#D9D9D9] cursor-pointer flex items-center">
                  📷 카메라로 촬영하기
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                <label className="w-full h-[90px] text-left text-[18px] text-black py-3 px-4 cursor-pointer flex items-center">
                  🖼 사진 앨범에서 선택하기
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

export default AlarmAddModal;
