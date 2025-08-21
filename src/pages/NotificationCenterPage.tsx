import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Setting from "../assets/Setting.svg";
import Back from "../assets/back.svg";
import {
  getRoutinesByDate,
  type NotificationRoutine,
} from "@/apis/notifications";
import { getUserInfo } from "@/apis/user";

const dayKo: Record<string, string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

function NotificationCenterPage() {
  const navigate = useNavigate();

  const [routines, setRoutines] = useState<NotificationRoutine[]>([]);
  const [nickname, setNickname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const [me, data] = await Promise.all([
          getUserInfo().catch(() => null),
          getRoutinesByDate(today),
        ]);

        if (!ignore) {
          setNickname(me?.nickname ?? "");
          setRoutines(data);
        }
      } catch (e) {
        if (!ignore) setError("섭취 알림을 불러오지 못했습니다.");
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [today]);

  const goBack = () => navigate(-1);

  const parseTime = (t: any): { hour: number; minute: number } => {
    if (typeof t === "string") {
      const [h, m] = t.split(":");
      return { hour: Number(h) || 0, minute: Number(m) || 0 };
    }
    if (t && typeof t === "object" && "hour" in t && "minute" in t) {
      return { hour: t.hour ?? 0, minute: t.minute ?? 0 };
    }
    return { hour: 0, minute: 0 };
  };

  const formatTime = (h: number, m: number) => {
    const am = h < 12;
    const hh = ((h + 11) % 12) + 1;
    return `${am ? "오전" : "오후"} ${String(hh).padStart(2, "0")}:${String(
      m
    ).padStart(2, "0")}`;
  };

  const items = useMemo(() => {
  const list: Array<{
    key: string;
    type: "섭취알림";
    icon: string;
    message: string;
    sub?: string;
    taken: boolean;
    image?: string;
  }> = [];
  for (const r of routines) {
    for (const s of r.schedules ?? []) {
      const { hour, minute } = parseTime(s.time);
      list.push({
        key: `${r.notificationRoutineId}-${s.dayOfWeek}-${hour}-${minute}`,
        type: "섭취알림",
        icon: "💊",
        message: `${nickname ? `${nickname}님, ` : ""}'${
          r.supplementName
        }' 복용 시간이에요! ⏰`,
        sub: `설정하신 시간 ${dayKo[s.dayOfWeek]}요일 ${formatTime(
          hour,
          minute
        )} 입니다.`,
        taken: r.taken,
        image: r.supplementImageUrl,
      });
    }
  }
  return list.sort((a, b) => (a.sub ?? "").localeCompare(b.sub ?? ""));
}, [routines, nickname]);

  return (
    <div className="min-h-screen bg-white sm:bg-[#F3F3F3] px-4 py-6 flex justify-center items-start sm:mt-10">
      <div className="w-full sm:max-w-[700px] sm:bg-white sm:rounded-2xl sm:p-8 sm:shadow-md">
        {/* 헤더 */}
        <div className="w-full pb-2 flex items-center justify-between sm:border-b sm:border-[#D9D9D9]">
          <div className="flex items-center">
            <button
              onClick={goBack}
              className="mr-2 text-2xl text-black sm:hidden"
            >
              <img
                src={Back}
                alt="icon"
                className="w-[20px] h-[20px] object-contain cursor-pointer"
              />
            </button>
            <h1 className="text-xl font-semibold py-2">알림센터</h1>
          </div>
          <img
            src={Setting}
            alt="알림 설정"
            className="w-6 h-6 cursor-pointer"
            onClick={() => navigate("/setting")}
          />
        </div>

        {/* 내용 */}
        {loading && (
          <div className="mt-6 text-sm text-[#6B6B6B]">불러오는 중…</div>
        )}
        {error && <div className="mt-6 text-sm text-red-600">{error}</div>}

        {!loading &&
          !error &&
          (items.length === 0 ? (
            <div className="mt-6 text-sm text-[#6B6B6B]">
              섭취 알림이 없습니다.
            </div>
          ) : (
            <ul className="space-y-6 mt-4">
              {items.map((it) => (
                <li key={it.key} className="flex items-start space-x-3">
                  <span className="text-xl">{it.icon}</span>
                  <div className="flex-1">
                    <p className="text-lg font-medium text-black">
                      {it.type}{" "}
                      {it.taken ? (
                        <span className="ml-1 text-[#00A878] text-sm">
                          (복용 완료)
                        </span>
                      ) : null}
                    </p>
                    <p className="text-sm text-gray-800">{it.message}</p>
                    {it.sub && (
                      <p className="text-sm text-gray-800 mt-1">{it.sub}</p>
                    )}
                  </div>
                  {it.image && (
                    <img
                      src={it.image}
                      alt="supplement"
                      className="w-10 h-10 rounded-md object-cover border border-[#E5E5E5]"
                    />
                  )}
                </li>
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
}

export default NotificationCenterPage;
