// 성분 검색 결과 타입
export interface IngredientSearchResult {
  ingredientId: number;
  ingredientName: string;
  amount?: number;
  unit?: string;
}

// 성분 검색 API 응답 타입
export interface IngredientSearchResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: IngredientSearchResult[];
}

// 대체 식품 타입
export interface IngredientAlternative {
  name: string;
  imageOrEmoji: string;
}

// 영양제 타입
export interface IngredientSupplement {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: number;
  imageUrl?: string;
}

// 성분 상세 정보 타입
export interface IngredientDetail {
  id: number;
  name: string;
  description: string;
  effect: string;
  caution: string;
  gender?: "MALE" | "FEMALE" | "UNKNOWN";
  age?: number;
  upperLimit: number;
  recommendedDosage: number;
  unit: string;
  subIngredients: Array<{
    name: string;
    imageOrEmoji: string;
  }>;
  alternatives: IngredientAlternative[];
  supplements: IngredientSupplement[];
}

// 성분 상세 정보 API 응답 타입
export interface IngredientDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: IngredientDetail;
}

// 대체 식품 API 응답 타입
export interface IngredientAlternativesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: IngredientAlternative[];
}

// 영양제 API 응답 타입
export interface IngredientSupplementsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: IngredientSupplement[];
}
