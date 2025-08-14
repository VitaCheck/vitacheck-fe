// 스웨거 문서 기반 실제 API 응답 타입
export interface IngredientSearchResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: IngredientSearchResult[];
}

export interface IngredientSearchResult {
  id: number; // 실제 API 응답에서는 "id"
  name: string; // 실제 API 응답에서는 "name"
  description?: string;
  imageUrl?: string;
}

export interface IngredientDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: IngredientDetail;
}

export interface IngredientDetail {
  id: number;
  name: string;
  description?: string;
  effect?: string;
  caution?: string;
  upperLimit?: number;
  recommendedDosage?: number;
  unit?: string;
  subIngredients?: string[];
  alternatives?: IngredientAlternative[];
  supplements?: IngredientSupplement[];
}

export interface IngredientAlternative {
  name: string;
  imageOrEmoji?: string;
}

export interface IngredientSupplement {
  id: number;
  name: string;
  brand?: string;
  price?: number;
  rating?: number;
  imageUrl?: string;
}

// 카드 리스트용 슬림 타입
export type Supplement = Required<
  Pick<IngredientSupplement, "id" | "name" | "imageUrl">
>;

// 기존 타입들 (하위 호환성을 위해 유지)
export interface IngredientData {
  name: string;
  description: string;
  effect: string;
  caution: string;
  upperLimit: number;
  recommendedDosage: number;
  unit: string;
  subIngredients: string[];
  alternatives: IngredientAlternative[];
  supplements: IngredientSupplement[];
}
