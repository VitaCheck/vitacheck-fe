// src/apis/terms.ts
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

// ==== Types ====
export interface Term {
  id: number;
  title: string;
  content: string; // HTML 또는 일반 텍스트
  version: string;
  effectiveDate: string; // "YYYY-MM-DD"
  required: boolean;
}

export interface GetTermsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Term[];
}

// ==== API ====
/**
 * 모든 약관 목록 조회
 * GET /api/v1/terms
 */
export const getTerms = async (): Promise<Term[]> => {
  const { data } = await axios.get<GetTermsResponse>("/api/v1/terms");
  // 방어적 처리: result가 없을 경우 빈 배열 반환
  return Array.isArray(data?.result) ? data.result : [];
};

// ==== React Query Hook ====
export const useTerms = (): UseQueryResult<Term[], Error> =>
  useQuery({
    queryKey: ["terms"],
    queryFn: getTerms,
  });

/**
 * 사용 예시)
 *
 * const { data: terms, isLoading, error } = useTerms();
 *
 * terms?.map(t => (
 *   <section key={t.id}>
 *     <h3>{t.title} {t.required ? "(필수)" : "(선택)"}</h3>
 *     // content가 HTML이라면:
 *     <div dangerouslySetInnerHTML={{ __html: t.content }} />
 *   </section>
 * ))
 */

//  개인정보 처리방침만 골라주는 훅
export const usePrivacyPolicy = () => {
  const q = useTerms();
  const term = useMemo(() => {
    const list = q.data ?? [];
    const byTitle = list.find((t) => t.title?.includes("개인정보"));
    if (byTitle) return byTitle;

    // fallback: required 중 두 번째 → 첫 번째 → 아무거나
    const required = list.filter((t) => t.required);
    return required[1] ?? required[0] ?? list[0];
  }, [q.data]);

  return { ...q, term };
};
