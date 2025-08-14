import React, { useMemo, useState } from "react";
import { useTerms } from "@/apis/terms";

type AgreeKey = "terms" | "privacy" | "marketing";

interface Props {
  agrees: Record<AgreeKey, boolean>;
  handleCheckboxChange: (key: AgreeKey) => void;
}

/** 간단 모달 */
function TermsModal({
  open,
  title,
  html,
  onClose,
}: {
  open: boolean;
  title?: string;
  html?: string;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="닫기"
      />
      {/* panel */}
      <div className="relative max-h-[80vh] w-[min(640px,92vw)] overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title ?? "약관"}</h3>
          <button
            onClick={onClose}
            className="rounded-md border px-3 py-1 text-sm"
          >
            닫기
          </button>
        </div>
        <div
          className="prose max-w-none overflow-y-auto pr-1"
          style={{ maxHeight: "60vh" }}
          // 백엔드가 HTML을 내려주므로 그대로 렌더
          dangerouslySetInnerHTML={{
            __html: html ?? "<p>내용이 없습니다.</p>",
          }}
        />
      </div>
    </div>
  );
}

/** 키워드로 약관 찾기 (title 매칭) */
const findByKeyword = (
  terms: ReturnType<typeof useTerms>["data"],
  keyword: string
) => terms?.find((t) => t.title?.includes(keyword));

/** 안전한 fallback 매핑:
 * - 필수 약관 2개: required=true인 앞 2개
 * - 선택 약관 1개: required=false인 첫 번째
 */
function buildFallbackMap(terms?: ReturnType<typeof useTerms>["data"]) {
  const required = (terms ?? []).filter((t) => t.required);
  const optional = (terms ?? []).filter((t) => !t.required);
  return {
    terms: required[0],
    privacy: required[1] ?? required[0],
    marketing: optional[0] ?? (terms ?? [])[0],
  } as const;
}

const TermsAgreement: React.FC<Props> = ({ agrees, handleCheckboxChange }) => {
  const { data: allTerms, isLoading, error } = useTerms();
  const [openKey, setOpenKey] = useState<AgreeKey | null>(null);

  // title 기반 우선 매핑 → 실패 시 fallback
  const map = useMemo(() => {
    const fb = buildFallbackMap(allTerms);
    return {
      terms: findByKeyword(allTerms, "서비스 이용약관") ?? fb.terms,
      privacy: findByKeyword(allTerms, "개인정보") ?? fb.privacy,
      marketing: findByKeyword(allTerms, "마케팅") ?? fb.marketing,
    } as Record<AgreeKey, typeof fb.terms>;
  }, [allTerms]);

  const openTerm = (key: AgreeKey) => setOpenKey(key);
  const closeModal = () => setOpenKey(null);

  if (isLoading) {
    return <p className="text-[#6B6B6B]">약관을 불러오는 중...</p>;
  }
  if (error) {
    return (
      <p className="text-red-500">약관을 불러오는 중 오류가 발생했습니다.</p>
    );
  }

  return (
    <div className="ml-[30px] space-y-2 text-[18px] font-medium text-[#6B6B6B]">
      {/* 서비스 이용약관 (필수) */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <span className="relative inline-block">
            <input
              type="checkbox"
              checked={agrees.terms}
              onChange={() => handleCheckboxChange("terms")}
              className="appearance-none w-[28px] h-[28px] border border-gray-300 rounded-[4px] checked:bg-[#FFD54E] checked:border-none relative"
            />
            <span className="absolute top-0 left-0 w-[28px] h-[28px] pointer-events-none flex justify-center items-center">
              {agrees.terms && (
                <img
                  src="/images/check-white.png"
                  alt=""
                  className="w-[16px]"
                />
              )}
            </span>
          </span>
          서비스 이용약관 동의 (필수)
        </label>
        <button
          type="button"
          onClick={() => openTerm("terms")}
          className="text-sm underline underline-offset-4"
        >
          보기
        </button>
      </div>

      {/* 개인정보 수집 및 이용 동의 (필수) */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <span className="relative inline-block">
            <input
              type="checkbox"
              checked={agrees.privacy}
              onChange={() => handleCheckboxChange("privacy")}
              className="appearance-none w-[28px] h-[28px] border border-gray-300 rounded-[4px] checked:bg-[#FFD54E] checked:border-none relative"
            />
            <span className="absolute top-0 left-0 w-[28px] h-[28px] pointer-events-none flex justify-center items-center">
              {agrees.privacy && (
                <img
                  src="/images/check-white.png"
                  alt=""
                  className="w-[16px]"
                />
              )}
            </span>
          </span>
          개인정보 수집 및 이용 동의 (필수)
        </label>
        <button
          type="button"
          onClick={() => openTerm("privacy")}
          className="text-sm underline underline-offset-4"
        >
          보기
        </button>
      </div>

      {/* 마케팅 이용 동의 (선택) */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <span className="relative inline-block">
            <input
              type="checkbox"
              checked={agrees.marketing}
              onChange={() => handleCheckboxChange("marketing")}
              className="appearance-none w-[28px] h-[28px] border border-gray-300 rounded-[4px] checked:bg-[#FFD54E] checked:border-none relative"
            />
            <span className="absolute top-0 left-0 w-[28px] h-[28px] pointer-events-none flex justify-center items-center">
              {agrees.marketing && (
                <img
                  src="/images/check-white.png"
                  alt=""
                  className="w-[16px]"
                />
              )}
            </span>
          </span>
          마케팅 이용 동의 (선택)
        </label>
        <button
          type="button"
          onClick={() => openTerm("marketing")}
          className="text-sm underline underline-offset-4"
        >
          보기
        </button>
      </div>

      {/* 약관 모달 */}
      <TermsModal
        open={openKey !== null}
        title={
          openKey
            ? (map[openKey]?.title ??
              (openKey === "terms"
                ? "서비스 이용약관"
                : openKey === "privacy"
                  ? "개인정보 처리방침"
                  : "마케팅 이용 동의"))
            : undefined
        }
        html={openKey ? map[openKey]?.content : undefined}
        onClose={closeModal}
      />
    </div>
  );
};

export default TermsAgreement;
