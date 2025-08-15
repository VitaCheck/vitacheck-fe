import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import axios from "@/lib/axios";

type Day = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

const DAYS: { label: string; value: Day }[] = [
  { label: "일", value: "SUN" },
  { label: "월", value: "MON" },
  { label: "화", value: "TUE" },
  { label: "수", value: "WED" },
  { label: "목", value: "THU" },
  { label: "금", value: "FRI" },
  { label: "토", value: "SAT" },
];

interface SupplementDetail {
  supplementId: number;
  supplementName: string;
  supplementImageUrl?: string;
}

export default function DesktopAlarmAddToSearchPage() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const supplementId = Number(sp.get("supplementId") || 0);

  // 상세(이름/이미지만 사용)
  const [detail, setDetail] = useState<SupplementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  // 사용자 입력 (기본값 없음)
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [times, setTimes] = useState<string[]>([""]); // 빈 인풋 1개로 시작

  useEffect(() => {
    if (isMobile) navigate("/alarm/settings");
  }, [isMobile, navigate]);

  const [supplementName, setSupplementName] = useState("");
  useEffect(() => {
    setSupplementName(detail?.supplementName ?? "");
  }, [detail?.supplementName]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!supplementId) {
        setLoadErr("잘못된 접근입니다. 제품이 선택되지 않았습니다.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setLoadErr(null);
        const { data } = await axios.get("/api/v1/supplements", {
          params: { id: supplementId },
        });
        const d = (data.result ?? data) as any;
        console.log(d);

        if (!ignore) {
          setDetail({
            supplementId: d.supplementId,
            supplementName: d.supplementName,
            supplementImageUrl: d.supplementImageUrl,
          });
        }
      } catch (e: any) {
        if (!ignore)
          setLoadErr(
            e?.response?.data?.message ?? "제품 정보를 불러오지 못했습니다."
          );
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [supplementId]);

  const toggleDay = (d: Day) =>
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  const setTimeAt = (i: number, v: string) =>
    setTimes((prev) => prev.map((t, idx) => (idx === i ? v : t)));
  const addTime = () => setTimes((prev) => [...prev, ""]);
  const removeTime = (i: number) =>
    setTimes((prev) => prev.filter((_, idx) => idx !== i));

  const normalize = (t: string) => {
    const [h = "0", m = "0"] = (t || "").split(":");
    const hh = String(Math.max(0, Math.min(23, +h))).padStart(2, "0");
    const mm = String(Math.max(0, Math.min(59, +m))).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const canSubmit = useMemo(
    () =>
      !!supplementId &&
      selectedDays.length > 0 &&
      times.length > 0 &&
      times.every((t) => t && t.length >= 4),
    [supplementId, selectedDays.length, times]
  );

  const handleSubmit = async () => {
    if (!canSubmit) return alert("요일과 시간을 입력해주세요.");
    try {
      const payload = {
        supplementId,
        schedules: selectedDays
          .map((day) =>
            Array.from(new Set(times.map(normalize))).map((time) => ({
              dayOfWeek: day,
              time: time,
            }))
          )
          .flat(),
      };

      // 콘솔에 POST 데이터 출력
      console.log("[POST] /api/v1/notifications/routines", payload);
      await axios.post("/api/v1/notifications/routines", payload);
      alert("알림이 추가되었습니다!");
      navigate("/alarm/settings", { replace: true });
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message ?? "알림 추가에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-[480px] mx-auto pt-12 pb-20 space-y-8 ">
      {/* 헤더 */}
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

      {/* 제품 카드: 이미지 + 이름 (세로 배치) */}
      <div className="mt-8">
        {loading ? (
          <div className="w-full h-[120px] bg-gray-100 rounded-xl animate-pulse" />
        ) : loadErr ? (
          <div className="text-red-500 text-sm">{loadErr}</div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* 이미지 박스 */}
            <div className="w-[272px] h-[248px] bg-white rounded-[20px] flex items-center justify-center overflow-hidden">
              {detail?.supplementImageUrl ? (
                <img
                  src={detail.supplementImageUrl}
                  alt={detail?.supplementName ?? "supplement"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/images/camera.png"
                  alt="camera icon"
                  className="w-[102.5px] h-[92.25px]"
                />
              )}
            </div>

            {/* 영양제 이름 */}
            <div className="flex flex-col">
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
          </div>
        )}
      </div>

      {/* 요일 선택 */}
      <div className="flex flex-col space-y-[20px]">
        <label className="font-semibold text-[24px] text-[#6B6B6B]">
          복용 요일 선택
        </label>
        <div className="grid grid-cols-7 gap-[10px]">
          {DAYS.map(({ label, value }) => (
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

      {/* 시간 선택 (빈값으로 시작) */}
      <div className="flex flex-col space-y-[20px]">
        <label className="font-semibold text-[24px] text-[#6B6B6B]">
          복용 시간 선택
        </label>
        <div className="mt-3 space-y-2">
          {times.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="time"
                value={t}
                onChange={(e) => setTimeAt(i, e.target.value)}
                className="bg-white w-full h-[73px] border border-[#AAAAAA] rounded-xl px-4 py-2 text-base"
              />
              {times.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTime(i)}
                  className="text-sm text-gray-500 underline"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addTime}
          className="bg-white w-full h-[73px] border border-[#AAAAAA] text-[22px] py-2 rounded-xl text-gray-700"
        >
          복용 시간 추가
        </button>
      </div>
    </div>
  );
}
