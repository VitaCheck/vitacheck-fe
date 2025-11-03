import type { IngredientResult } from "@/types/combination";

export const REC_LINE_POS = 33.33;
export const UPPER_LINE_POS = 66.67;

function niceRoundUp(n: number) {
  if (n <= 0) return 1;
  const step = 100;
  return Math.ceil(n / step) * step;
}

const clamp = (x: number) => Math.max(0, Math.min(100, x));

function toPct(n: number, max: number) {
  if (!max || max <= 0) return 0;
  return clamp((n / max) * 100);
}

/** '초과' 탭 필터링을 위해 원본 calcGauge 로직 일부 유지 */
export function calcGauge(ing: IngredientResult) {
  const total = ing.totalAmount ?? 0;
  const rec = ing.recommendedAmount;
  const upper = ing.upperAmount;

  let max = Math.max(total, rec ?? 0, upper ?? 0, 1);
  if (rec == null && upper == null) {
    max = niceRoundUp(total * 1.25);
  } else if (upper == null && rec != null) {
    max = Math.max(max, rec * 1.5);
  }

  const widthPct = toPct(total, max);
  const recPct = rec != null ? toPct(rec, max) : 33.33;
  const upperPct = upper != null ? toPct(upper, max) : 66.67;
  const hasRealRec = rec != null;
  const hasRealUpper = upper != null;

  const isOverUpperLimit = hasRealUpper && widthPct > upperPct;

  return {
    widthPct,
    recPct,
    upperPct,
    hasRealRec,
    hasRealUpper,
    isOverUpperLimit,
  };
}

/** 게이지의 채워질 퍼센티지(0-100)를 계산합니다. */
export function computeFillPercent(ing: IngredientResult) {
  const total = ing.totalAmount ?? 0;
  const rec = ing.recommendedAmount ?? null;
  const upper = ing.upperAmount ?? null;

  const overMap = (totalVal: number, upperVal: number, capMultiplier = 1.5) => {
    const extra = Math.max(0, totalVal - upperVal);
    const maxExtra = Math.max(upperVal * (capMultiplier - 1), 1e-6);
    const t = Math.min(extra / maxExtra, 1);
    return UPPER_LINE_POS + t * (100 - UPPER_LINE_POS);
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
      return overMap(total, upper, 1.5);
    }

    if (total <= upper) {
      const r = total / upper;
      return Math.max(0, Math.min(100, r * UPPER_LINE_POS));
    }
    return overMap(total, upper, 1.5);
  }

  if (rec && rec > 0) {
    const r = total / rec;
    return Math.max(0, Math.min(100, r <= 1 ? r * REC_LINE_POS : 100));
  }

  return Math.min(REC_LINE_POS, total > 0 ? REC_LINE_POS * 0.7 : 0);
}
