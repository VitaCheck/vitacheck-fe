// 서버 약관 타입(필요 시 프로젝트 공용 타입으로 이동)
export type TermItem = {
  id: number;
  title: string;
  required: boolean;
  version?: string;
  effectiveDate?: string;
  content?: string; // HTML
};

// title 키워드로 우선 매칭 → 실패 시 fallback
export function buildResolvedMap(terms?: TermItem[]) {
  const all = terms ?? [];
  const required = all.filter((t) => t.required);
  const optional = all.filter((t) => !t.required);

  const findBy = (kw: string) => all.find((t) => t.title?.includes(kw));

  const map = {
    terms: findBy("서비스 이용약관") ?? required[0], // 필수1
    privacy: findBy("개인정보") ?? required[1] ?? required[0], // 필수2
    marketing: findBy("마케팅") ?? optional[0] ?? all[0], // 선택1
  } as const;

  return map;
}

/** agrees 상태(terms/privacy/marketing) → agreedTermIds 계산 */
export function resolveAgreedTermIds(
  terms: TermItem[] | undefined,
  agrees: { terms: boolean; privacy: boolean; marketing: boolean }
) {
  const map = buildResolvedMap(terms);
  const ids: number[] = [];
  if (agrees.terms && map.terms) ids.push(map.terms.id);
  if (agrees.privacy && map.privacy) ids.push(map.privacy.id);
  if (agrees.marketing && map.marketing) ids.push(map.marketing.id);
  // 중복 제거
  return Array.from(new Set(ids));
}
