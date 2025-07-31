import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import axios from "@/lib/axios";
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

const DesktopAlarmEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [supplementId, setSupplementId] = useState<number>(1);
  const [supplementName, setSupplementName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isMobile) navigate("/alarm/settings");
  }, [isMobile, navigate]);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await axios.get(`/api/v1/notifications/routines/${id}`);
        const {
          supplementId,
          supplementName,
          supplementImageUrl,
          daysOfWeek,
          times,
        } = res.data.result;
        setSupplementId(supplementId);
        setSupplementName(supplementName);
        setSelectedDays(daysOfWeek);
        setTimes(times[0]);
        setPreviewUrl(supplementImageUrl);
      } catch (err) {
        console.error("루틴 불러오기 실패", err);
      }
    };
    if (id) fetchRoutine();
  }, [id]);

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

  const handleSubmit = async () => {
    if (
      !supplementId ||
      selectedDays.length === 0 ||
      times.some((t) => !t) ||
      !supplementName
    ) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    try {
      let imageUrl = previewUrl;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const payload = {
        supplementId,
        supplementName,
        supplementImageUrl: imageUrl,
        daysOfWeek: selectedDays,
        times,
      };

      await axios.post("/api/v1/notifications/routines", payload);
      alert("알림이 저장되었습니다!");
      navigate("/alarm/settings");
    } catch (err) {
      console.error(err);
      alert("알림 저장에 실패했습니다.");
    }
  };

  if (isMobile) return null;

  return (
    <div className="max-w-[480px] mx-auto pt-12 pb-20 space-y-8 bg-white">
      <div className="relative flex items-center justify-between w-full">
        <button
          onClick={() => navigate("/alarm/settings")}
          className="text-[28px] text-[#000000] font-semibold"
        >
          취소
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-[33px] text-[#202020] font-bold">
          알림 편집
        </h2>
        <button
          onClick={handleSubmit}
          className="text-[28px] text-[#000000] font-semibold"
        >
          저장
        </button>
      </div>

      <div className="w-[272px] h-[248px] bg-gray-100 mx-auto rounded-[20px] flex items-center justify-center overflow-hidden">
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

      <div className="flex flex-col space-y-[20px]">
        <label className="font-semibold text-[24px] text-[#6B6B6B] mb-[20px]">
          영양제 이름
        </label>
        <input
          type="text"
          className="w-full h-[73px] border rounded-xl px-4 py-2 text-[22px] text-[#AAAAAA]"
          placeholder="예: 멀티비타민"
          value={supplementName}
          onChange={(e) => setSupplementName(e.target.value)}
        />
      </div>

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
                  : "bg-white text-[#AAAAAA] border border-gray-300"
              }`}
              onClick={() => toggleDay(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-[20px]">
        <label className="font-semibold text-[24px] text-[#6B6B6B]">
          복용 시간 선택
        </label>
        {times.map((time, index) => (
          <input
            key={index}
            type="time"
            className="w-full h-[73px] border rounded-xl px-4 py-2 text-base mb-2"
            value={time}
            onChange={(e) => handleTimeChange(index, e.target.value)}
          />
        ))}
        <button
          onClick={addTime}
          className="w-full h-[73px] border border-gray-400 text-[22px] py-2 rounded-xl text-gray-700"
        >
          복용 시간 추가
        </button>
      </div>
    </div>
  );
};

export default DesktopAlarmEditPage;
