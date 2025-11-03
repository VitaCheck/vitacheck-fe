import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "@/lib/axios";

// 타입 Import
import type {
  SupplementItem,
  IngredientResult,
  Combination,
} from "@/types/combination";

// 유틸리티/훅 Import
import useIsMobile from "@/hooks/useIsMobile";
import { copyToClipboard } from "@/utils/clipboard";
import { ensureKakaoReady, shareToKakao } from "@/utils/kakao";

// 공용 컴포넌트 Import
import ShareSheet from "@/components/ShareSheet";
import ConfirmModal from "@/components/ConfirmModal";
import AlarmAddToSearchModal from "@/pages/alarm/AlarmAddToSearchModal";

// 페이지 전용 컴포넌트 Import
import ProductSlider from "@/components/combination/ProductSlider";
import IngredientGaugeList from "@/components/combination/IngredientGaugeList";
import CombinationCardList from "@/components/combination/CombinationCardList";

export default function CombinationResultPage() {
  // 1024px 미만을 모바일(태블릿 세로 포함)로 처리
  const isMobile = useIsMobile(1024);
  const location = useLocation();
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [ingredientResults, setIngredientResults] = useState<
    IngredientResult[]
  >([]);
  const [goodCombinations, setGoodCombinations] = useState<Combination[]>([]);
  const [cautionCombinations, setCautionCombinations] = useState<Combination[]>(
    []
  );

  // 모달 상태
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [openAlarmModal, setOpenAlarmModal] = useState(false);

  // --- 데이터 파생 ---
  const idsFromQuery = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const raw = sp.get("ids");
    if (!raw) return [];
    return raw
      .split(",")
      .map((n) => Number(n))
      .filter(Boolean);
  }, [location.search]);

  const selectedItems = (location.state?.selectedItems ||
    []) as SupplementItem[];

  const selectedIds = useMemo(
    () =>
      selectedItems.map((i) => i.supplementId).filter((v): v is number => !!v),
    [selectedItems]
  );

  const effectiveIds = selectedIds.length ? selectedIds : idsFromQuery;

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

  const shareTitle = "내 영양제 조합 결과";

  // --- 데이터 페칭 ---
  useEffect(() => {
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

    if (effectiveIds.length > 0) {
      fetchCombinationResult();
      fetchCombinationRecommendations();
    }
  }, [JSON.stringify(effectiveIds)]);

  // --- 핸들러 ---
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
    const searchTerms = selectedFiltered.map(
      (item: SupplementItem) => item.supplementName
    );
    const currentHistory = JSON.parse(
      localStorage.getItem("searchHistory") || "[]"
    );
    const updatedHistory = [
      ...new Set([...searchTerms, ...currentHistory]),
    ].slice(0, 10);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    navigate("/add-combination", {
      state: {
        selectedItems: selectedFiltered,
        preSearchTerms: searchTerms,
        updateSearchHistory: true,
      },
    });
  };

  // 알람 버튼 로직
  const alarmEnabled = checkedIndices.length === 1;
  const selectedItemForAlarm = selectedItems.find((it) =>
    checkedIndices.includes(it.cursorId)
  );

  const handleAlarmClick = () => {
    if (!alarmEnabled || !selectedItemForAlarm) return;
    if (isMobile) {
      setOpenAlarmModal(true);
    } else {
      const id =
        selectedItemForAlarm.supplementId ?? selectedItemForAlarm.cursorId;
      const q = new URLSearchParams({ supplementId: String(id) });
      navigate(`/alarm/settings/add/search?${q.toString()}`);
    }
  };

  // 공유 핸들러
  async function onClickShare() {
    if (isMobile) {
      setSheetOpen(true);
      return;
    }
    const ok = await copyToClipboard(shareUrl);
    setConfirmMessage("링크가 복사되었습니다.\n원하는 곳에 붙여넣기 하세요.");
    setConfirmOpen(ok);
  }

  async function onShareKakao() {
    const ready = await ensureKakaoReady();
    if (!ready) {
      onShareCopy(); // 카카오 준비 실패 시 링크 복사로 fallback
      return;
    }
    shareToKakao(shareUrl, shareTitle); // 분리된 유틸 사용
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

  return (
    <div className="mx-auto max-w-screen-xl px-4 pt-2 sm:px-36 sm:pt-10">
      {/* 조합분석 - 모바일 (제목 + 아이콘들) */}
      <div className="mb-5 flex items-center justify-between pt-6 pr-2 pl-2 md:hidden">
        <h1 className="font-pretendard text-[24px] leading-[100%] font-bold tracking-[-0.02em]">
          조합 분석
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="공유"
            className="active:scale-95"
            onClick={onClickShare}
          >
            <img
              src="/images/PNG/조합 3-1/공유.png" // TODO: 경로 확인
              alt="공유"
              className="h-[35px] w-[35px] object-contain"
            />
          </button>
          <button
            type="button"
            className="m-0 p-0 leading-none"
            onClick={handleRecombination}
          >
            <img
              src="/images/PNG/조합 3-1/재조합.png" // TODO: 경로 확인
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

      {/* 1. 제품 슬라이더 컴포넌트 */}
      <ProductSlider
        selectedItems={selectedItems}
        checkedIndices={checkedIndices}
        onToggleCheckbox={handleToggleCheckbox}
      />

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

      {/* 2. 성분 게이지 리스트 컴포넌트 */}
      <IngredientGaugeList ingredientResults={ingredientResults} />

      {/* 3. 조합 카드 리스트 컴포넌트 */}
      <CombinationCardList
        goodCombinations={goodCombinations}
        riskyCombinations={cautionCombinations}
        isLoading={false}
        isMobile={isMobile}
      />

      {/* --- 모달 --- */}

      {/* 모바일 공유 바텀시트 */}
      <ShareSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onKakao={onShareKakao}
        onCopy={onShareCopy}
      />

      {/* 알람 추가 모달 */}
      {selectedItemForAlarm && (
        <AlarmAddToSearchModal
          open={openAlarmModal}
          onClose={() => setOpenAlarmModal(false)}
          supplementId={
            selectedItemForAlarm.supplementId ?? selectedItemForAlarm.cursorId
          }
          supplementName={selectedItemForAlarm.supplementName}
          supplementImageUrl={selectedItemForAlarm.imageUrl}
        />
      )}

      {/* 확인 모달 */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message={confirmMessage}
      />
    </div>
  );
}
