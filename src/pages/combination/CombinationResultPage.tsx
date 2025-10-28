import { useState, useEffect, useRef } from "react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import checkedBoxIcon from "../../assets/check box.png";
import vitaminArrow from "../../assets/비타민 C_arrow.png";
import boxIcon from "../../assets/box.png";
import flipIcon from "../../assets/flip.png";
import axios from "@/lib/axios";
import Navbar from "@/components/NavBar";
import line from "/images/PNG/조합 2-1/background line.png";
import AlarmAddToSearchModal from "@/pages/alarm/AlarmAddToSearchModal";

// 🔽 import들 아래에 추가
type KakaoSDK = {
  init(key: string): void;
  isInitialized(): boolean;
  Share: { sendDefault(options: any): void };
};
const Kakao = (window as any).Kakao as KakaoSDK;

const BREAKPOINT = 640;
const KAKAO_APP_KEY =
  import.meta.env.VITE_KAKAO_JS_KEY || "4b2032ace7d33963b0fb79993ff3c951";

// 컴포넌트 밖(파일 상단)
const SHARE_IMAGE_PATH = "/images/PNG/조합 3-1/인스타 분할 포스터-08.png";
const getShareImageUrl = () =>
  typeof window !== "undefined"
    ? `${window.location.origin}${encodeURI(SHARE_IMAGE_PATH)}`
    : encodeURI(SHARE_IMAGE_PATH);

// ✅ SSR 안전한 모바일 훅 교체
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= BREAKPOINT : true
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= BREAKPOINT);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
};

// ✅ 클립보드 유틸
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(el);
    }
  }
}

// ✅ 카카오 로더
async function ensureKakaoReady(): Promise<boolean> {
  if (!KAKAO_APP_KEY) {
    console.warn("카카오 JavaScript 키가 설정되지 않았습니다.");
    return false;
  }
  if (typeof window !== "undefined" && window.Kakao) {
    try {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_APP_KEY);
        console.log("카카오 SDK 초기화 완료");
      }
      return true;
    } catch (e) {
      console.error("카카오 SDK 초기화 실패:", e);
      return false;
    }
  }
  console.error("카카오 SDK가 로드되지 않았습니다.");
  return false;
}

function ShareSheet({
  open,
  onClose,
  onKakao,
  onCopy,
}: {
  open: boolean;
  onClose: () => void;
  onKakao: () => void;
  onCopy: () => void;
}) {
  if (!open) return null;
  const KAKAO_ICON = "/images/PNG/성분 2-1/kakao.png";
  const LINK_ICON = "/images/PNG/성분 2-1/link.png";
  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="닫기"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        className="absolute right-0 bottom-0 left-0 w-full"
        // style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto rounded-t-3xl bg-white shadow-xl">
          <div className="px-5 pt-6 pb-4">
            <h3 className="text-center text-[15px] font-semibold">공유하기</h3>
          </div>
          <button
            onClick={onKakao}
            className="flex w-full items-center gap-3 px-5 py-4 active:bg-gray-50"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full">
              <img
                src={KAKAO_ICON}
                alt="카카오톡"
                className="h-9 w-9 object-contain"
                loading="lazy"
              />
            </span>
            <span className="text-[15px]">카카오톡으로 공유하기</span>
          </button>
          <div className="h-px w-full bg-gray-200" />
          <button
            onClick={onCopy}
            className="flex w-full items-center gap-3 px-5 py-4 active:bg-gray-50"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full">
              <img
                src="/images/PNG/성분 2-1/link.png"
                alt="링크"
                className="h-9 w-9 object-contain"
                loading="lazy"
              />
            </span>
            <span className="text-[15px]">링크 복사하기</span>
          </button>
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({
  open,
  onClose,
  message,
}: {
  open: boolean;
  onClose: () => void;
  message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="absolute top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
        <p className="mb-5 text-center whitespace-pre-line text-gray-700">
          {message}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="h-10 min-w-[120px] rounded-xl bg-[#FFE17E] font-semibold text-black hover:brightness-95"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

// AddCombinationPage.tsx와 동일한 Product 인터페이스 사용
interface SupplementItem {
  cursorId: number;
  supplementId?: number;
  supplementName: string;
  imageUrl: string;
  price: number;
  description: string;
  method: string;
  caution: string;
  brandName: string;
  ingredients: {
    ingredientName: string;
    amount: number;
    unit: string;
  }[];
}

interface IngredientResult {
  ingredientName: string;
  totalAmount: number;
  unit: string;
  recommendedAmount: number | null;
  upperAmount: number | null;
  dosageRatio: number;
  overRecommended: boolean;
}

interface Combination {
  id: number;
  type: "GOOD" | "CAUTION";
  name: string;
  description: string;
  displayRank: number;
}

export default function CombinationResultPage() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.Kakao &&
      !window.Kakao.isInitialized()
    ) {
      window.Kakao.init(KAKAO_APP_KEY);
      console.log("카카오 SDK 초기화 완료");
    }
  }, []);

  // 선택: 더 촘촘한 올림 (1250 -> 1300)
  function niceRoundUp(n: number) {
    if (n <= 0) return 1;
    const step = 100; // 필요하면 50/100/200 등으로 조정
    return Math.ceil(n / step) * step;
  }

  const clamp = (x: number) => Math.max(0, Math.min(100, x));
  function toPct(n: number, max: number) {
    if (!max || max <= 0) return 0;
    return clamp((n / max) * 100);
  }

  function calcGauge(ing: IngredientResult) {
    const total = ing.totalAmount ?? 0;
    const unit = ing.unit ?? "";
    const rec = ing.recommendedAmount;
    const upper = ing.upperAmount;

    // 1) max 결정
    let max = Math.max(total, rec ?? 0, upper ?? 0, 1);
    if (rec == null && upper == null) {
      max = niceRoundUp(total * 1.25); // 기준 없으면 여유 + 보기 좋은 숫자
    } else if (upper == null && rec != null) {
      max = Math.max(max, rec * 1.5); // 권장만 있으면 우측 여유
    }

    // 2) 퍼센트 위치
    const widthPct = toPct(total, max);
    const recPct = rec != null ? toPct(rec, max) : 33.33; // 가이드
    const upperPct = upper != null ? toPct(upper, max) : 66.67; // 가이드
    const hasRealRec = rec != null;
    const hasRealUpper = upper != null;
    const isFallbackGuide = !hasRealRec && !hasRealUpper;

    // 3) 색상 구간(노랑/주황/빨강) 폭
    const yellowWidth = hasRealRec ? Math.min(widthPct, recPct) : widthPct;
    const orangeLeft = hasRealRec ? recPct : null;
    const orangeRight = hasRealUpper ? Math.min(widthPct, upperPct) : widthPct;
    const orangeWidth =
      orangeLeft != null ? Math.max(0, orangeRight - orangeLeft) : 0;
    const redLeft = hasRealUpper ? upperPct : null;
    const redWidth =
      redLeft != null && widthPct > redLeft ? widthPct - redLeft : 0;

    // 상한 초과 여부를 명확하게 계산
    // 상한선(66.67% 또는 실제 upper 값) 이상인 경우를 초과로 판단
    const isOverUpperLimit = hasRealUpper && widthPct > upperPct;

    return {
      unit,
      total,
      widthPct,
      recPct,
      upperPct,
      hasRealRec,
      hasRealUpper,
      isFallbackGuide,
      yellowWidth,
      orangeLeft,
      orangeWidth,
      redLeft,
      redWidth,
      isOverUpperLimit,
    };
  }
  // 공통 점선 위치
  const REC_LINE_POS = 33.33;
  const UPPER_LINE_POS = 66.67;

  function computeFillPercent(ing: IngredientResult) {
    const total = ing.totalAmount ?? 0;
    const rec = ing.recommendedAmount ?? null;
    const upper = ing.upperAmount ?? null;

    // 상한을 초과했을 때, 66.67%~100% 구간을 "초과량"에 비례해서 채우는 도우미
    // capMultiplier: 상한의 몇 배까지를 100%로 볼지 (예: 1.5배면 150%에서 막음)
    const overMap = (
      totalVal: number,
      upperVal: number,
      capMultiplier = 1.5
    ) => {
      const extra = Math.max(0, totalVal - upperVal); // 초과량
      const maxExtra = Math.max(upperVal * (capMultiplier - 1), 1e-6); // cap까지 초과량
      const t = Math.min(extra / maxExtra, 1); // 0..1
      return UPPER_LINE_POS + t * (100 - UPPER_LINE_POS); // 66.67% → 100%
    };

    if (upper && upper > 0) {
      if (rec && rec > 0) {
        if (total <= rec) {
          const r = total / rec;
          return Math.max(0, Math.min(100, r * REC_LINE_POS));
        }
        if (total <= upper) {
          const r = (total - rec) / Math.max(upper - rec, 1e-6);
          return Math.max(
            0,
            Math.min(100, REC_LINE_POS + r * (UPPER_LINE_POS - REC_LINE_POS))
          );
        }
        // ✅ 상한 초과: 66.67%~100% 구간으로 매핑
        return overMap(total, upper, 1.5); // cap 150% (원하면 1.3, 2.0 등으로 조절)
      }

      // 권장 없음: 0~upper 를 0~66.67%로, 초과는 66.67%~100%로 매핑
      if (total <= upper) {
        const r = total / upper;
        return Math.max(0, Math.min(100, r * UPPER_LINE_POS));
      }
      // ✅ 상한 초과 매핑
      return overMap(total, upper, 1.5);
    }

    if (rec && rec > 0) {
      const r = total / rec;
      return Math.max(0, Math.min(100, r <= 1 ? r * REC_LINE_POS : 100));
    }

    // 권장/상한 둘 다 없으면 살짝만 표시
    return Math.min(REC_LINE_POS, total > 0 ? REC_LINE_POS * 0.7 : 0);
  }

  function isOverUpper(ing: IngredientResult) {
    const total = ing.totalAmount ?? 0;
    const upper = ing.upperAmount ?? null;
    return !!(upper && upper > 0 && total > upper);
  }

  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const idsFromQuery = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const raw = sp.get("ids");
    if (!raw) return [];
    return raw
      .split(",")
      .map((n) => Number(n))
      .filter(Boolean);
  }, [location.search]);

  const selectedItems = location.state?.selectedItems || [];
  console.log("selectedItems:", selectedItems);
  console.log("location.state:", location.state);
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);

  const [activeTab, setActiveTab] = useState<"전체" | "초과">("전체");
  const [allOverUpper, setAllOverUpper] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  const [ingredientResults, setIngredientResults] = useState<
    IngredientResult[]
  >([]);

  const [goodCombinations, setGoodCombinations] = useState<Combination[]>([]);
  const [cautionCombinations, setCautionCombinations] = useState<Combination[]>(
    []
  );

  const selectedIds = useMemo(
    () =>
      (selectedItems as SupplementItem[])
        .map((i) => i.supplementId)
        .filter((v): v is number => !!v),
    [selectedItems]
  );

  const effectiveIds = selectedIds.length ? selectedIds : idsFromQuery;

  // 공유 바텀시트/확인 모달
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [shareOpen, setShareOpen] = useState(false);

  const shareUrl = useMemo(() => {
    const base = window.location.origin.includes("vitachecking.com")
      ? `${window.location.origin}/combination-result`
      : "https://www.vitachecking.com/combination-result";

    const ids = effectiveIds;
    if (ids.length) {
      const u = new URL(base);
      u.searchParams.set("ids", ids.join(","));
      return u.toString();
    }
    return base;
  }, [effectiveIds]);

  const shareImage =
    selectedItems?.[0]?.imageUrl ??
    "https://vitachecking.com/static/share-default.png";
  const shareTitle = "내 영양제 조합 결과";

  async function onClickShare() {
    if (isMobile) {
      setSheetOpen(true);
      return;
    }
    // PC: 링크 복사(혹은 기존 ShareLinkPopup을 계속 쓰고 싶다면 setShareOpen(true) 호출해도 됨)
    const ok = await copyToClipboard(shareUrl);
    setConfirmMessage("링크가 복사되었습니다.\n원하는 곳에 붙여넣기 하세요.");
    setConfirmOpen(ok);
  }

  async function onShareKakao() {
    // 카카오 공유
    const ready = await ensureKakaoReady();
    if (!ready) {
      const ok = await copyToClipboard(shareUrl);
      setSheetOpen(false);
      setConfirmMessage("링크가 복사되었습니다.\n원하는 곳에 붙여넣기 하세요.");
      setConfirmOpen(ok);
      return;
    }

    const shareData = {
      objectType: "feed",
      content: {
        title: `${shareTitle} - VitaCheck`,
        description: "VitaCheck에서 성분 정보를 확인해 보세요.",
        imageUrl: getShareImageUrl(), // ✅ 절대 URL
        imageWidth: 400, // ✅ 가능하면 명시 (권장)
        imageHeight: 400, // ✅ 가능하면 명시 (권장)
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [
        {
          title: "자세히 보기",
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
      ],
    };

    window.Kakao.Share.sendDefault(shareData);
    setSheetOpen(false);
    setConfirmMessage("카카오톡 공유하기 완료!");
    setConfirmOpen(true);
  }

  async function onShareCopy() {
    const ok = await copyToClipboard(shareUrl);
    setSheetOpen(false);
    setConfirmMessage("링크가 복사되었습니다.\n원하는 곳에 붙여넣기 하세요.");
    setConfirmOpen(ok);
  }

  // 템플릿 숫자: 초과/권장충족/주의조합
  const overCount = ingredientResults.filter(
    (i) => computeFillPercent(i) > UPPER_LINE_POS
  ).length;

  const metCount = ingredientResults.filter(
    (i) =>
      (i.recommendedAmount ?? 0) > 0 &&
      i.totalAmount >= (i.recommendedAmount ?? 0)
  ).length;

  const cautionCount = cautionCombinations.length;

  const filteredIngredients: IngredientResult[] =
    activeTab === "전체"
      ? ingredientResults
      : ingredientResults.filter((i) => {
          // 기존 계산
          const isOverRecommended = i.dosageRatio > 1;
          const isOverUpper = i.overRecommended;
          const isOverUpperLimit =
            i.upperAmount && i.totalAmount > i.upperAmount;

          // 게이지 기준(상한선 라인) 초과 체크
          const gauge = calcGauge(i);
          const isOverUpperInGauge = gauge.isOverUpperLimit; // hasRealUpper && widthPct > upperPct
          const isOverUpperLine = gauge.widthPct > gauge.upperPct; // 실제/가이드 상한 라인 초과

          // 🔥 새로 추가: 렌더링 게이지 기준으로도 상한 라인(두 번째 점선) 초과 시 포함
          const fillPct = computeFillPercent(i);
          const exceedsSecondDashed = fillPct > UPPER_LINE_POS; // 66.67% 초과

          // (선택) 일반 기준치 예외 처리 유지
          let isOverGeneralLimit = false;
          if (i.recommendedAmount === null && i.upperAmount === null) {
            if (i.unit === "IU") {
              if (
                i.ingredientName.includes("비타민 D") &&
                i.totalAmount > 4000
              ) {
                isOverGeneralLimit = true;
              } else if (
                i.ingredientName.includes("비타민 A") &&
                i.totalAmount > 10000
              ) {
                isOverGeneralLimit = true;
              }
            } else if (i.unit === "mg") {
              if (
                i.ingredientName.includes("비타민 C") &&
                i.totalAmount > 2000
              ) {
                isOverGeneralLimit = true;
              } else if (i.totalAmount > 1000) {
                isOverGeneralLimit = true;
              }
            }
          }

          // ✅ ‘초과’ 탭 표시 조건
          const shouldShow = computeFillPercent(i) > UPPER_LINE_POS;
          return shouldShow;
        });

  const fetchCombinationResult = async () => {
    try {
      if (effectiveIds.length === 0) {
        setIngredientResults([]);
        return;
      }

      const res = await axios.post("/api/v1/combinations/analyze", {
        supplementIds: effectiveIds,
      });

      if (res.data.result?.ingredientResults) {
        setIngredientResults(res.data.result.ingredientResults);
      } else {
        setIngredientResults([]);
      }
    } catch (error) {
      console.error("조합 결과 조회 실패:", error);
      setIngredientResults([]);
    }
  };

  const fetchCombinationRecommendations = async () => {
    try {
      const res = await axios.get("/api/v1/combinations/recommend");
      setGoodCombinations(res.data.result.goodCombinations);
      setCautionCombinations(res.data.result.cautionCombinations);
    } catch (error) {
      console.error("추천 조합 조회 실패:", error);
    }
  };

  useEffect(() => {
    if (effectiveIds.length > 0) {
      fetchCombinationResult();
      fetchCombinationRecommendations();
    }
    // 배열을 의존성에 직접 넣으면 참조가 바뀔 때만 동작하니, 문자열로 안정화
  }, [JSON.stringify(effectiveIds)]);

  // 모바일에서는 전역 헤더 숨김(있으면)
  useEffect(() => {
    if (!isMobile) return;
    const headerEl = document.querySelector("header");
    if (headerEl instanceof HTMLElement) {
      // headerEl.style.display = "none";
    }
    return () => {
      if (headerEl instanceof HTMLElement) {
        headerEl.style.display = "";
      }
    };
  }, [isMobile]);

  // 카드 가로 사이즈를 전체 비율의 0.154로 설정
  const PAGE_COUNT = 4;
  const GAP_W = 16; // tailwind gap과 맞추기
  const cardWidthCSS = `calc((100% - ${GAP_W * (PAGE_COUNT - 1)}px) / ${PAGE_COUNT})`;

  const alarmEnabled = checkedIndices.length === 1;

  // 모바일에서 섭취 알림 모달 열기
  const [openAlarmModal, setOpenAlarmModal] = useState(false);

  // 1개만 선택된 제품(버튼 활성 조건과 동일)
  const selectedItem = selectedItems.find((it: SupplementItem) =>
    checkedIndices.includes(it.cursorId)
  );

  // 버튼 핸들러들 근처에 추가
  const handleAlarmClick = () => {
    if (!alarmEnabled || !selectedItem) return;

    if (isMobile) {
      // 모바일: 모달 오픈
      setOpenAlarmModal(true);
    } else {
      // 데스크탑: 페이지 이동 (supplementId 쿼리로 전달)
      const id = selectedItem.supplementId ?? selectedItem.cursorId;
      const q = new URLSearchParams({ supplementId: String(id) });
      navigate(`/alarm/settings/add/search?${q.toString()}`);
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const page = el.clientWidth; // 현재 보이는 영역 너비
    const delta = direction === "right" ? page : -page;
    let target = el.scrollLeft + delta;
    // 경계 보정
    target = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const handleToggleCheckbox = (cursorId: number) => {
    setCheckedIndices((prev) =>
      prev.includes(cursorId)
        ? prev.filter((i) => i !== cursorId)
        : [...prev, cursorId]
    );
  };

  const handleRecombination = () => {
    const selectedFiltered = selectedItems.filter((item: SupplementItem) =>
      checkedIndices.includes(item.cursorId)
    );

    // 선택된 아이템들의 이름을 검색어로 사용하여 검색 결과를 미리 보여주기
    const searchTerms = selectedFiltered.map(
      (item: SupplementItem) => item.supplementName
    );

    // 검색기록에 선택된 제품들의 이름을 추가
    const currentHistory = JSON.parse(
      localStorage.getItem("searchHistory") || "[]"
    );
    const updatedHistory = [
      ...new Set([...searchTerms, ...currentHistory]),
    ].slice(0, 10); // 중복 제거하고 최대 10개 유지
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    navigate("/add-combination", {
      state: {
        selectedItems: selectedFiltered,
        preSearchTerms: searchTerms, // 검색어들을 미리 전달
        updateSearchHistory: true, // 검색기록 업데이트 플래그
      },
    });
  };

  const FlipCard: React.FC<{ name: string; description: string }> = ({
    name,
    description,
  }) => {
    const [flipped, setFlipped] = useState(false);
    return (
      <>
        {/* 모바일 카드 */}
        <div
          className="block h-[135px] w-[150px] cursor-pointer md:hidden"
          style={{ perspective: "1000px" }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative h-full w-full transition-transform duration-500 ${
              flipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-white px-[6px] py-[10px] text-center text-[18px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
              style={{ backfaceVisibility: "hidden" }}
            >
              {name}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
              />
            </div>
            <div
              className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-[#FFFBCC] px-[6px] py-[10px] text-center text-[18px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {description}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
              />
            </div>
          </div>
        </div>

        {/* PC용 카드 */}
        <div
          className="hidden h-[165px] w-[235px] cursor-pointer md:block"
          style={{ perspective: "1000px" }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative h-full w-full transition-transform duration-500 ${
              flipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-white px-[2px] py-[2px] text-center text-[20px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
              style={{ backfaceVisibility: "hidden" }}
            >
              {name}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
              />
            </div>
            <div
              className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-[#FFFBCC] px-[6px] py-[10px] text-center text-[20px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {description}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 pt-2 sm:px-36 sm:pt-10">
      {/* ✅ 모바일에서만 이 페이지의 Navbar 표시 (PC에서는 전역 Navbar만) */}
      {/* <div className="md:hidden">
        <Navbar />
      </div> */}

      {/* 조합분석 - 모바일 (제목 + 아이콘들) */}
      <div className="mb-5 flex items-center justify-between pt-6 pr-2 pl-2 md:hidden">
        <h1 className="font-pretendard text-[24px] leading-[100%] font-bold tracking-[-0.02em]">
          조합 분석
        </h1>

        <div className="flex items-center gap-3">
          {/* 공유 */}
          <button
            type="button"
            aria-label="공유"
            className="active:scale-95"
            onClick={onClickShare} // ✅ 모바일이면 바텀시트, PC면 복사(또는 ShareLinkPopup로 바꿔도 됨)
          >
            <img
              src="/images/PNG/조합 3-1/공유.png"
              alt="공유"
              className="h-[35px] w-[35px] object-contain"
            />
          </button>

          {/* 재조합 */}
          <button
            type="button"
            className="m-0 p-0 leading-none"
            onClick={handleRecombination}
          >
            <img
              src="/images/PNG/조합 3-1/재조합.png"
              alt="재조합"
              className="block h-[35px] w-auto align-middle"
            />
          </button>
        </div>
      </div>

      {/* PC 제목 + 버튼들 한 줄 배치 */}
      <div className="mb-8 hidden items-center justify-between px-8 md:flex">
        <h1 className="text-2xl font-semibold sm:text-4xl">조합 분석</h1>
        <div className="flex gap-4">
          <button
            onClick={handleRecombination}
            className="flex h-[55px] w-[150px] items-center justify-center rounded-full bg-[#EEEEEE] text-lg font-semibold"
          >
            재조합
          </button>
          <button
            onClick={handleAlarmClick}
            disabled={!alarmEnabled}
            aria-disabled={!alarmEnabled}
            title={
              !alarmEnabled ? "제품을 1개만 선택해주세요" : "섭취알림 등록하기"
            }
            className={[
              "flex h-[55px] w-[280px] items-center justify-center rounded-[62.5px] font-bold transition",
              alarmEnabled
                ? "bg-[#FFEB9D] hover:brightness-95"
                : "cursor-not-allowed bg-[#EEEEEE] text-[#9C9A9A]",
            ].join(" ")}
          >
            섭취알림 등록하기
          </button>
        </div>
      </div>

      {/* PC 슬라이더 */}
      <div className="hidden px-4 md:block">
        {/* 래퍼: 화살표가 테두리 밖으로 반쯤 나오도록 overflow-visible */}
        <div className="relative mx-auto w-full max-w-[1050px] overflow-visible">
          {/* 컨테이너: 내용은 안에서만 보이도록 overflow-hidden */}
          <div className="relative h-[300px] overflow-hidden rounded-[45.5px] border border-[#B2B2B2] bg-white px-[60px] py-[30px]">
            {/* 👇 w-full로 두고, 카드 폭은 calc로 4등분 */}
            <div className="w-full">
              <div
                ref={scrollRef}
                className="hide-scrollbar flex snap-x snap-mandatory gap-[16px] overflow-x-auto scroll-smooth"
              >
                {selectedItems.map((item: SupplementItem) => (
                  <div
                    key={item.cursorId}
                    className={`relative flex h-[250px] flex-shrink-0 snap-start flex-col items-center rounded-[22.76px] pt-[80px] ${checkedIndices.includes(item.cursorId) ? "bg-[#EEEEEE]" : "bg-white"}`}
                    style={{ width: cardWidthCSS, minWidth: cardWidthCSS }} // ⭐ 핵심: 4등분 고정
                  >
                    <img
                      src={
                        checkedIndices.includes(item.cursorId)
                          ? checkedBoxIcon
                          : boxIcon
                      }
                      alt="checkbox"
                      onClick={() => handleToggleCheckbox(item.cursorId)}
                      className="absolute top-[10px] left-[18px] h-[50px] w-[50px] cursor-pointer"
                    />
                    <img
                      src={item.imageUrl}
                      className="mt-[-20px] mb-3 h-[100px] w-[120px] object-contain"
                    />
                    <p
                      className="font-pretendard mt-1 text-center font-medium"
                      style={{
                        fontSize: "18px",
                        lineHeight: "100%",
                        letterSpacing: "-0.02em",
                        color: "#000000",
                      }}
                    >
                      {item.supplementName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 좌우 화살표: 아이콘만 표시(반쯤 밖으로) */}
          {selectedItems.length > 4 && (
            <>
              <button
                onClick={() => handleScroll("left")}
                aria-label="왼쪽으로 스크롤"
                className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
              >
                <img
                  src="/images/PNG/조합 3-1/Frame 724.png"
                  alt="왼쪽"
                  className="h-[65px] w-[65px] object-contain"
                />
              </button>
              <button
                onClick={() => handleScroll("right")}
                aria-label="오른쪽으로 스크롤"
                className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
              >
                <img
                  src="/images/PNG/조합 3-1/Frame 667.png"
                  alt="오른쪽"
                  className="h-[65px] w-[65px] object-contain"
                />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 모바일 슬라이더 */}
      <div className="/* 부모 컨텐츠 폭 100% */ /* iPhone 12 Pro 안전치 */ scrollbar-hide /* ← → 로 축소 */ mx-auto mt-3 w-full max-w-[358px] overflow-x-auto overflow-y-hidden rounded-[20px] border border-[#B2B2B2] bg-white px-3 py-2 py-3 md:hidden">
        <div className="flex w-max gap-3">
          {selectedItems.map((item: SupplementItem) => (
            <div
              key={item.cursorId}
              className={`relative flex h-[135px] w-[135px] flex-shrink-0 flex-col items-center rounded-[22.76px] pt-[35px] ${checkedIndices.includes(item.cursorId) ? "bg-[#EEEEEE]" : "bg-white"}`}
            >
              {/* 체크박스 */}
              <img
                src={
                  checkedIndices.includes(item.cursorId)
                    ? checkedBoxIcon
                    : boxIcon
                }
                alt="checkbox"
                onClick={() => handleToggleCheckbox(item.cursorId)}
                className="absolute top-[1px] left-[110px] h-[30px] w-[30px] cursor-pointer"
              />
              {/* 이미지 */}
              <img
                src={item.imageUrl}
                className="mt-[-25px] mb-3 h-[80px] w-[80px] object-contain"
              />
              {/* 이름 */}
              <p className="font-pretendard [display:-webkit-box] max-h-[34px] min-h-[34px] overflow-hidden px-2 text-center text-[14px] leading-[1.15] font-medium break-words text-black [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                {item.supplementName}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 모바일 섭취알림 버튼 */}
      <div className="mt-4 flex justify-center md:hidden">
        <button
          onClick={handleAlarmClick}
          disabled={!alarmEnabled}
          aria-disabled={!alarmEnabled}
          title={
            !alarmEnabled ? "제품을 1개만 선택해주세요" : "섭취알림 등록하기"
          }
          className={[
            "mt-2 flex h-[54px] w-[370px] items-center justify-center rounded-[14px] font-medium transition",
            alarmEnabled
              ? "bg-[#FFEB9D] hover:brightness-95"
              : "cursor-not-allowed bg-[#EEEEEE] text-[#9C9A9A]",
          ].join(" ")}
        >
          <span className="text-[20px]">섭취알림 등록하기 →</span>
        </button>
      </div>
      {/* PC 섭취량 탭 - 전체 / 초과 */}
      <div className="mt-[55px] hidden md:block">
        <div className="relative mx-auto w-full max-w-[1100px]">
          {/* 배경 라인 (절대배치) */}
          <div className="pointer-events-none absolute top-[56px] right-1/15 left-1/15 z-0 h-[8px] rounded-full bg-[#E5E5E5]" />

          {/* 탭 버튼들 */}
          <div className="relative z-10 flex justify-center">
            <div className="flex gap-80">
              {["전체", "초과"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "전체" | "초과")}
                  className="font-pretendard relative mb-5 py-2 text-[30px] leading-[120%] font-semibold tracking-[-0.02em]"
                >
                  <span
                    className={
                      activeTab === tab
                        ? tab === "초과"
                          ? "text-[#E70000]"
                          : "text-black"
                        : "text-[#9C9A9A]"
                    }
                  >
                    {tab}
                  </span>

                  {/* 활성 언더바: 배경 라인과 같은 y좌표에 겹치게 */}
                  {activeTab === tab && (
                    <span className="absolute top-[56px] left-1/2 z-10 h-[8px] w-[140px] -translate-x-1/2 rounded-full bg-black" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 버전 탭 */}
      <div className="mt-10 mb-2 md:hidden">
        <div className="relative mx-auto w-[350px]">
          {/* 배경 라인 */}
          <img
            src={line}
            alt=""
            className="pointer-events-none absolute bottom-0 left-1/2 h-[6px] w-[calc(100%-32px)] max-w-[358px] -translate-x-1/2 select-none"
          />

          {/* 탭 */}
          <div className="relative z-10 flex justify-center gap-x-30 text-center">
            {["전체", "초과"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "전체" | "초과")}
                className="relative py-2"
              >
                <span
                  className={`font-pretendard text-[20px] font-medium ${
                    activeTab === tab
                      ? tab === "초과"
                        ? "text-[#E70000]"
                        : "text-black"
                      : "text-[#9C9A9A]"
                  }`}
                >
                  {tab}
                </span>

                {/* 활성 언더바 */}
                {activeTab === tab && (
                  <span className="absolute bottom-[-0.1px] left-1/2 h-[4px] w-[60px] -translate-x-1/2 rounded-full bg-black" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === "초과" && (
        <>
          {/* PC 버전 */}
          <div className="mt-8 hidden md:block">
            <div className="relative z-20 mx-auto w-full max-w-[1100px] px-6">
              <div className="flex h-[102px] w-full items-center justify-center rounded-[22px] bg-[#E5E5E5]">
                <p className="font-pretendard text-center text-[32px]">
                  적정 섭취량을 준수하세요!
                </p>
              </div>
            </div>
          </div>

          {/* 모바일 버전 */}
          <div className="mt-2 flex justify-center md:hidden">
            <div
              className="flex items-center justify-center rounded-[15px]"
              style={{
                width: "350px",
                height: "68px",
                background: "#F4F4F4", // ← 더 진한 색상으로 변경
              }}
            >
              <p className="font-inter text-[20px] font-medium text-black">
                적정 섭취량을 준수하세요!
              </p>
            </div>
          </div>
        </>
      )}
      {/* 모바일 섭취량 그래프 */}
      {filteredIngredients && filteredIngredients.length > 0 ? (
        <div className="mx-auto w-full max-w-[370px] space-y-4 px-4 md:hidden">
          {/* 모바일: 이름 칼럼(120px) + 게이지(200px)와 같은 그리드로 정렬 */}
          <div className="mx-auto mt-5 mb-1 grid w-full max-w-[370px] grid-cols-[120px_1fr] items-center">
            <div /> {/* 이름 칼럼과 정렬 맞추기용 빈 칼럼 */}
            <div className="relative h-[24px] w-[200px]">
              <span
                className="absolute -top-1 z-20 -translate-x-1/2 text-[14px] font-medium whitespace-nowrap text-black"
                style={{ left: `${REC_LINE_POS}%` }}
              >
                권장
              </span>
              <span
                className="absolute -top-1 z-20 -translate-x-1/2 text-[14px] font-medium whitespace-nowrap text-black"
                style={{ left: `${UPPER_LINE_POS}%` }}
              >
                상한
              </span>
            </div>
          </div>

          {filteredIngredients
            .slice(0, showAllIngredients ? filteredIngredients.length : 5)
            .map((ingredient) => {
              const { ingredientName } = ingredient;

              // ✅ 항목별 채움 비율/초과여부 계산
              const fillPct = computeFillPercent(ingredient);
              const over = computeFillPercent(ingredient) > UPPER_LINE_POS;

              return (
                <div
                  key={ingredientName}
                  className="mx-auto grid w-full max-w-[370px] grid-cols-[120px_1fr] items-center"
                >
                  {/* 이름 칼럼 (120px) */}
                  <div
                    className="flex w-[120px] cursor-pointer items-center px-2"
                    onClick={() =>
                      navigate(
                        `/ingredients/${encodeURIComponent(ingredientName)}`
                      )
                    }
                  >
                    <span
                      className="font-pretendard inline-block text-[15px] font-medium"
                      style={{ lineHeight: "100%", letterSpacing: "-2%" }}
                    >
                      {ingredientName}
                    </span>
                    <img
                      src={vitaminArrow}
                      alt="화살표"
                      className="mt-0.5 ml-1"
                      style={{ width: 20, height: 12 }}
                    />
                  </div>

                  {/* 게이지 트랙 (200px) — 라벨 컨테이너와 동일 너비 */}
                  <div className="relative h-[40px] w-[200px] overflow-hidden rounded-full bg-[#EFEFEF]">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${fillPct}%`,
                        background: over ? "#FF7E7E" : "#FFE17E",
                      }}
                    />
                    {/* 점선(라벨과 같은 퍼센트 기준) */}
                    <div
                      className="absolute top-0 z-10 h-full border-l-2 border-dashed"
                      style={{
                        left: `${REC_LINE_POS}%`,
                        borderColor: "#000000",
                      }}
                    />
                    <div
                      className="absolute top-0 z-10 h-full border-l-2 border-dashed"
                      style={{
                        left: `${UPPER_LINE_POS}%`,
                        borderColor: "#000000",
                      }}
                    />
                  </div>
                </div>
              );
            })}

          {/* 모바일 더보기 버튼 */}
          {filteredIngredients.length > 5 && !showAllIngredients && (
            <div className="mx-auto mt-7 flex max-w-[370px] flex-col items-center justify-center">
              <img
                src="/images/PNG/조합 3-1/펼쳐보기 arrow.png"
                alt="더보기"
                className="h-[15px] w-[35px] cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => setShowAllIngredients(true)}
              />
              <p className="font-pretendard mt-4 text-[14px] text-[#666]">
                클릭하여 모든 성분 보기
              </p>
            </div>
          )}

          {/* 모바일 접기 버튼 */}
          {filteredIngredients.length > 5 && showAllIngredients && (
            <div className="mx-auto flex w-full max-w-[370px] flex-col items-center justify-center">
              <img
                src="/images/PNG/조합 3-1/Frame 499.png"
                alt="접기"
                className="h-[35px] w-full max-w-[370px] cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => setShowAllIngredients(false)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 px-4 text-center text-gray-500 md:hidden">
          {ingredientResults.length === 0
            ? "영양제를 선택해주세요."
            : activeTab === "초과"
              ? "초과된 성분이 없습니다."
              : "데이터를 불러오는 중입니다..."}
        </div>
      )}

      {/* PC 섭취량 그래프 */}
      {filteredIngredients && filteredIngredients.length > 0 ? (
        <div className="hidden w-full md:block">
          {/* 상단 라벨: 이름 칼럼 폭과 정렬을 맞추기 위해 동일한 그리드 사용 */}
          <div className="mx-auto mt-5 grid w-full max-w-[1200px] grid-cols-[200px_1fr] items-center gap-6 px-6 md:px-8">
            <div />
            <div className="relative h-6">
              <span
                className="absolute -top-1 z-20 translate-x-[-50%] text-[16px] font-medium whitespace-nowrap text-black lg:text-[18px]"
                style={{ left: `${REC_LINE_POS}%` }}
              >
                권장
              </span>
              <span
                className="absolute -top-1 z-20 translate-x-[-50%] text-[16px] font-medium whitespace-nowrap text-black lg:text-[18px]"
                style={{ left: `${UPPER_LINE_POS}%` }}
              >
                상한
              </span>
            </div>
          </div>

          {/* 게이지 리스트 */}
          <div className="mx-auto mt-2 w-full max-w-[1200px] space-y-5 px-6 md:px-8">
            {filteredIngredients
              .slice(0, showAllIngredients ? filteredIngredients.length : 5)
              .map((ingredient) => {
                const { ingredientName } = ingredient;

                // ✅ 항목별 채움 비율/초과여부
                const fillPct = computeFillPercent(ingredient);
                const over = computeFillPercent(ingredient) > UPPER_LINE_POS;

                return (
                  <div
                    key={ingredientName}
                    className="grid w-full grid-cols-[200px_1fr] items-center gap-6"
                  >
                    {/* 이름 + 꺾쇠 */}
                    <div
                      className="flex h-[48px] cursor-pointer items-center"
                      onClick={() =>
                        navigate(
                          `/ingredients/${encodeURIComponent(ingredientName)}`
                        )
                      }
                    >
                      <span className="text-[20px] font-medium lg:text-[24px]">
                        {ingredientName}
                      </span>
                      <img
                        src={vitaminArrow}
                        alt="화살표"
                        className="mt-1 ml-3"
                        style={{ width: 25, height: 20 }}
                      />
                    </div>

                    {/* 게이지(공통 점선 + 단색 채움) */}
                    <div className="relative w-full">
                      <div className="relative h-[48px] w-full overflow-hidden rounded-full bg-[#EFEFEF] lg:h-[56px]">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full"
                          style={{
                            width: `${fillPct}%`,
                            background: over ? "#FF7E7E" : "#FFE17E",
                          }}
                        />
                        <div
                          className="absolute top-0 z-10 h-full border-l-2 border-dashed"
                          style={{
                            left: `${REC_LINE_POS}%`,
                            borderColor: "#000000",
                          }}
                        />
                        <div
                          className="absolute top-0 z-10 h-full border-l-2 border-dashed"
                          style={{
                            left: `${UPPER_LINE_POS}%`,
                            borderColor: "#000000",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* PC 더보기 버튼 */}
            {filteredIngredients.length > 5 && !showAllIngredients && (
              <div className="mt-6 flex w-full flex-col items-center justify-center">
                <img
                  src="/images/PNG/조합 3-1/펼쳐보기 arrow.png"
                  alt="더보기"
                  className="h-[20px] w-[55px] cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => setShowAllIngredients(true)}
                />
                <p className="font-pretendard mt-3 text-[16px] text-[#666] lg:text-[18px]">
                  클릭하여 모든 성분 보기
                </p>
              </div>
            )}

            {/* PC 접기 버튼 */}
            {filteredIngredients.length > 5 && showAllIngredients && (
              <div className="mt-3 flex w-full flex-col items-center justify-center">
                <img
                  src="/images/PNG/조합 3-1/Frame 499.png"
                  alt="접기"
                  className="h-[92px] w-full max-w-[1100px] cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => setShowAllIngredients(false)}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-20 hidden flex-col items-center px-[60px] text-center text-gray-500 md:flex">
          {ingredientResults.length === 0
            ? "영양제를 선택해주세요."
            : activeTab === "초과"
              ? "초과된 성분이 없습니다."
              : "데이터를 불러오는 중입니다..."}
        </div>
      )}

      {/* ⚠️ 주의가 필요한 조합 */}
      {cautionCombinations?.length > 0 && (
        <>
          {/* 📱 모바일 - 주의 조합 */}
          <div className="mt-10 px-7 md:hidden">
            <h2 className="text-[22px] font-semibold text-black">
              주의가 필요한 조합 TOP 5
            </h2>
            <p className="mt-1 text-[14px] text-[#6B6B6B]">
              카드를 눌러서 확인해 보세요 !
            </p>
          </div>
          <div className="hide-scrollbar overflow-x-auto px-3 md:hidden">
            <div className="mt-5 mr-4 mb-5 ml-4 flex w-max gap-[16px]">
              {cautionCombinations.map((combo: Combination) => (
                <FlipCard
                  key={combo.id}
                  name={combo.name}
                  description={combo.description}
                />
              ))}
            </div>
          </div>

          {/* 💻 PC - 주의 조합 */}
          <section className="mt-20 hidden md:block">
            {/* 제목과 카드가 같은 컨테이너를 공유 */}
            <div className="mx-auto w-full max-w-[1050px] px-6 md:px-8">
              <h2 className="font-Pretendard mt-3 mb-1 w-full text-left text-[24px] leading-[120%] font-bold tracking-[-0.02em] text-black lg:text-[28px] xl:text-[32px]">
                주의가 필요한 조합 TOP 5
              </h2>
              <span className="font-Pretendard block text-left text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-[#6B6B6B] lg:text-[20px] xl:text-[22px]">
                카드를 눌러서 확인해 보세요 !
              </span>

              {/* 카드 래퍼: 제목과 같은 컨테이너 내부 → 시작점 일치 */}
              <div className="mt-8 mb-15 flex gap-2 lg:gap-4 xl:gap-6">
                {cautionCombinations.map((combo: Combination) => (
                  <FlipCard
                    key={combo.id}
                    name={combo.name}
                    description={combo.description}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
      {/* ===== 궁합이 좋은 조합 ===== */}
      {goodCombinations?.length > 0 && (
        <>
          {/* 📱 모바일 - 좋은 조합 */}
          <div className="mt-10 px-7 md:hidden">
            <h2 className="text-[22px] font-semibold text-black">
              궁합이 좋은 조합 TOP 5
            </h2>
            <p className="mt-1 text-[14px] text-[#6B6B6B]">
              카드를 눌러서 확인해 보세요 !
            </p>
          </div>
          <div className="hide-scrollbar overflow-x-auto px-3 md:hidden">
            <div className="mt-5 mr-4 mb-15 ml-4 flex w-max gap-[16px]">
              {goodCombinations.map((combo: Combination) => (
                <FlipCard
                  key={combo.id}
                  name={combo.name}
                  description={combo.description}
                />
              ))}
            </div>
          </div>

          {/* 💻 PC - 좋은 조합 */}
          <section className="mt-10 hidden md:block">
            {/* 제목과 카드가 같은 컨테이너를 공유 → 시작점/양옆 여백 동일 */}
            <div className="mx-auto w-full max-w-[1050px] px-6 md:px-8">
              <h2 className="font-Pretendard mt-3 mb-1 w-full text-left text-[24px] leading-[120%] font-bold tracking-[-0.02em] text-black lg:text-[28px] xl:text-[32px]">
                궁합이 좋은 조합 TOP 5
              </h2>
              <span className="font-Pretendard block text-left text-[18px] leading-[120%] font-semibold tracking-[-0.02em] text-[#6B6B6B] lg:text-[20px] xl:text-[22px]">
                카드를 눌러서 확인해 보세요 !
              </span>

              {/* 카드 래퍼: 제목과 같은 컨테이너 내부 */}
              <div className="mt-8 mb-20 flex gap-2 lg:gap-4 xl:gap-6">
                {goodCombinations.map((combo: Combination) => (
                  <FlipCard
                    key={combo.id}
                    name={combo.name}
                    description={combo.description}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* 📱 모바일 공유 바텀시트 */}
      <ShareSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onKakao={onShareKakao}
        onCopy={onShareCopy}
      />

      {/* 알람 추가 모달  */}
      {selectedItem && (
        <AlarmAddToSearchModal
          open={openAlarmModal}
          onClose={() => setOpenAlarmModal(false)}
          supplementId={selectedItem.supplementId ?? selectedItem.cursorId}
          supplementName={selectedItem.supplementName}
          supplementImageUrl={selectedItem.imageUrl}
        />
      )}

      {/* ✅ 확인 모달 */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message={confirmMessage}
      />
    </div>
  );
}
