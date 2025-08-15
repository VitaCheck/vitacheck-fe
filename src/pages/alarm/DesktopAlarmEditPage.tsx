import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import axios from "@/lib/axios";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

type DayOfWeek = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
type Schedule = { dayOfWeek: DayOfWeek; time: string };

const days = [
  { label: "일", value: "SUN" },
  { label: "월", value: "MON" },
  { label: "화", value: "TUE" },
  { label: "수", value: "WED" },
  { label: "목", value: "THU" },
  { label: "금", value: "FRI" },
  { label: "토", value: "SAT" },
];

const fixTime = (t?: string) => (t ? t.slice(0, 5) : "");
const unique = <T,>(arr: T[]) => Array.from(new Set(arr));

// BE 응답을 하나의 내부 형태로 정규화
const normalizeRoutine = (raw: any) => {
  const supplementId: number = Number(raw?.supplementId ?? 0);
  const supplementName: string = String(raw?.supplementName ?? raw?.name ?? "");
  const supplementImageUrl: string | null =
    raw?.supplementImageUrl ?? raw?.imageUrl ?? null;

  // 기존 스펙
  let daysOfWeek: string[] | undefined = Array.isArray(raw?.daysOfWeek)
    ? raw.daysOfWeek.filter(Boolean)
    : undefined;
  let times: string[] | undefined = Array.isArray(raw?.times)
    ? raw.times.filter(Boolean).map(fixTime)
    : undefined;

  // 신규 스펙 (schedules) → 변환
  const schedules: Schedule[] | undefined = Array.isArray(raw?.schedules)
    ? raw.schedules
    : undefined;

  if ((!daysOfWeek || !daysOfWeek.length) && Array.isArray(schedules)) {
    daysOfWeek = unique(
      schedules
        .map((s) => s?.dayOfWeek)
        .filter((v): v is DayOfWeek => Boolean(v))
    );
  }
  if ((!times || !times.length) && Array.isArray(schedules)) {
    times = unique(schedules.map((s) => fixTime(s?.time)).filter(Boolean));
  }

  return {
    supplementId,
    supplementName,
    supplementImageUrl: supplementImageUrl ?? null,
    daysOfWeek: daysOfWeek ?? [],
    times: times ?? [],
  };
};

// 빈 값 제거 유틸 (imageUrl: "" 제거)
const clean = (obj: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

const DesktopAlarmEditPage = () => {
  const { id } = useParams(); // notificationRoutineId
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [supplementId, setSupplementId] = useState<number>(0);
  const [supplementName, setSupplementName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMobile) navigate("/alarm/settings");
  }, [isMobile, navigate]);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        setLoading(true);
        // NOTE: 개별 조회 API가 있으면 그걸 쓰세요. (지금은 목록→find)
        const res = await axios.get("/api/v1/notifications/routines");
        const all = Array.isArray(res.data?.result) ? res.data.result : [];
        const routine = all.find(
          (r: any) => Number(r?.notificationRoutineId) === Number(id)
        );
        if (!routine) throw new Error("해당 루틴이 없습니다.");

        const norm = normalizeRoutine(routine);
        setSupplementId(norm.supplementId);
        setSupplementName(norm.supplementName);
        setSelectedDays(norm.daysOfWeek); // ✅ 항상 배열 보장
        setTimes(norm.times.length ? norm.times : [""]); // 최소 1칸
        setPreviewUrl(norm.supplementImageUrl);
      } catch (err) {
        console.error("루틴 불러오기 실패", err);
        alert("루틴 정보를 불러오지 못했습니다.");
        navigate("/alarm/settings");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoutine();
  }, [id, navigate]);

  const toggleDay = (value: string) => {
    setSelectedDays((prev) => {
      const base = Array.isArray(prev) ? prev : [];
      return base.includes(value)
        ? base.filter((d) => d !== value)
        : [...base, value];
    });
  };

  const handleTimeChange = (index: number, value: string) => {
    const updated = [...times];
    updated[index] = fixTime(value);
    setTimes(updated);
  };

  const addTime = () => setTimes((prev) => [...prev, ""]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (
      !supplementName.trim() ||
      !Array.isArray(selectedDays) ||
      selectedDays.length === 0 ||
      times.some((t) => !t)
    ) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    try {
      // 이미지가 선택된 경우에만 업로드
      let imageUrl = previewUrl ?? undefined;
      if (imageFile) {
        const uploaded = await uploadImageToCloudinary(imageFile);
        if (!uploaded) {
          alert("이미지 업로드에 실패했습니다.");
          return;
        }
        imageUrl = uploaded;
      }

      // 백엔드 스펙이 "custom upsert" 라면 schedules로 전송 권장
      // (NotificationRoutineCustomRestController 참고)
      const schedules = selectedDays.flatMap((d) =>
        times
          .filter(Boolean)
          .map((t) => ({ dayOfWeek: d as DayOfWeek, time: fixTime(t) }))
      );

      // 1) 커스텀 업서트(권장): POST /api/v1/notifications/routines/custom
      const upsertPayload = clean({
        notificationRoutineId: Number(id), // 수정이므로 포함
        name: supplementName.trim(),
        imageUrl, // 없으면 clean에서 제거됨
        schedules,
      });

      await axios.post("/api/v1/notifications/routines/custom", upsertPayload);

      alert("알림이 저장되었습니다!");
      navigate("/alarm/settings");
    } catch (err: any) {
      console.error("알림 저장 실패:", err?.response ?? err);
      alert(
        err?.response?.data?.message ??
          "알림 저장에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!id || isDeleting) return;
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

  if (loading) {
    return (
      <div className="max-w-[480px] mx-auto pt-12 pb-20">
        <div className="text-center text-gray-500">불러오는 중…</div>
      </div>
    );
  }

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
                (selectedDays ?? []).includes(value)
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
        {(times ?? []).map((time, index) => (
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
