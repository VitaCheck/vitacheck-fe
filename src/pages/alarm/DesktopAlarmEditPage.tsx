// DesktopAlarmEditPage.tsx
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
  const { id } = useParams(); // notificationRoutineId
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [supplementId, setSupplementId] = useState<number>(1);
  const [supplementName, setSupplementName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false); // ⬅️ 삭제 중 중복요청 방지

  useEffect(() => {
    if (isMobile) navigate("/alarm/settings");
  }, [isMobile, navigate]);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await axios.get("/api/v1/notifications/routines");
        const allRoutines = res.data.result;
        const routine = allRoutines.find(
          (r: any) => r.notificationRoutineId === Number(id)
        );
        if (!routine) throw new Error("해당 루틴이 없습니다.");

        const {
          supplementId,
          supplementName,
          supplementImageUrl,
          daysOfWeek,
          times,
        } = routine;

        setSupplementId(supplementId);
        setSupplementName(supplementName);
        setSelectedDays(daysOfWeek);
        setTimes(times);
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

  // 🔥 삭제 핸들러
  const handleDelete = async () => {
    if (!id) return;
    if (isDeleting) return;

    const ok = window.confirm("정말 이 알림을 삭제할까요?");
    if (!ok) return;

    try {
      setIsDeleting(true);
      await axios.delete(`/api/v1/notifications/routines/${id}`);
      alert("알림을 삭제했습니다.");
      navigate("/alarm/settings");
    } catch (err: any) {
      console.error("삭제 실패:", err?.response ?? err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 404
          ? "해당 루틴을 찾을 수 없습니다."
          : "알림 삭제에 실패했습니다.");
      alert(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isMobile) return null;

  return (
    <div className="max-w-[480px] mx-auto pt-12 pb-20 space-y-8">
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

      <div className="flex flex-col space-y-[20px]">
        <label className="font-semibold text-[24px] text-[#6B6B6B] mb-[20px]">
          영양제 이름
        </label>
        <input
          type="text"
          className="w-full h-[73px] bg-white border border-[#AAAAAA] rounded-xl px-4 py-2 text-[22px]"
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
                  : "bg-white text-[#AAAAAA] border border-[#AAAAAA]"
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
            className="w-full h-[73px] border border-[#AAAAAA] bg-white rounded-xl px-4 py-2 text-base mb-2"
            value={time}
            onChange={(e) => handleTimeChange(index, e.target.value)}
          />
        ))}
        <button
          onClick={addTime}
          className="w-full h-[73px] border border-[#AAAAAA] bg-white text-[22px] py-2 rounded-xl text-gray-700"
        >
          복용 시간 추가
        </button>

        {/* ⬇️ 삭제 버튼: DELETE /api/v1/notifications/routines/{notificationRoutineId} */}
        <button
          onClick={handleDelete}
          disabled={!id || isDeleting}
          className={`w-full h-[73px] text-[22px] py-2 rounded-xl mt-[108px]
            ${isDeleting ? "bg-[#CCCCCC] cursor-not-allowed" : "bg-[#EEEEEE]"}`}
        >
          {isDeleting ? "삭제 중..." : "알림 삭제"}
        </button>
      </div>
    </div>
  );
};

export default DesktopAlarmEditPage;
