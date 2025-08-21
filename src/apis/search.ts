// import api from "@/lib/axios";

// export interface Ingredient {
//   ingredientId: number;
//   name: string;
//   description: string;
//   effect: string;
// }

// export interface Supplement {
//   supplementId: number;
//   supplementName: string;
//   imageUrl: string;
//   price: number;
//   description: string;
//   method: string;
//   caution: string;
//   brandName: string;
//   ingredients: {
//     ingredientName: string;
//     amount: number;
//     unit: string;
//   }[];
// }

// export interface PopularKeyword {
//   score: number;
//   keyword: string;
// }

// export interface RecentProduct {
//   id: number;
//   name: string;
//   imageUrl: string;
// }

// export interface SearchResultResponse {
//   matchedIngredients: Ingredient[];
//   supplements: {
//     content: Supplement[];
//     totalPages: number;
//     totalElements: number;
//     size: number;
//     number: number;
//   };
// }

// export const searchSupplements = async (
//   keyword: string
// ): Promise<SearchResultResponse> => {
//   const response = await api.get("/api/v1/supplements/search", {
//     params: {
//       keyword,
//       page: 0,
//       size: 20,
//     },
//   });

//   if (response.data.isSuccess) {
//     return response.data.result;
//   } else {
//     throw new Error("검색 실패");
//   }
// };

// /** 인기 검색어 조회 */
// export async function getPopularKeywords(): Promise<PopularKeyword[]> {
//   const res = await api.get<{
//     isSuccess: boolean;
//     code: string;
//     message: string;
//     result: PopularKeyword[];
//   }>("/api/v1/search/popular");
//   return res.data.result;
// }

// /** 최근 검색어 조회 */
// export async function getRecentKeywords(limit = 10): Promise<string[]> {
//   const token =
//     localStorage.getItem("accessToken") ||
//     sessionStorage.getItem("accessToken");

//   const res = await api.get("/recent", {
//     params: { limit },
//     headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//   });

//   if (res.data?.isSuccess && Array.isArray(res.data.result)) {
//     return res.data.result;
//   }
//   return [];
// }

// /** 최근 본 상품 조회 */
// export async function getRecentProducts(limit = 5): Promise<RecentProduct[]> {
//   const res = await api.get<{
//     isSuccess: boolean;
//     code: string;
//     message: string;
//     result: RecentProduct[];
//   }>("/me/recent-products", { params: { limit } });

//   if (res.data?.isSuccess && Array.isArray(res.data.result)) {
//     return res.data.result;
//   }
//   return [];
// }

import api from "@/lib/axios";

/** ------ Types (백엔드 응답 구조에 맞춰 정리) ------ */
export interface Ingredient {
  id: number;
  name: string;
}

export interface Supplement {
  id: number;
  name: string;
  imageUrl: string;
  coupangUrl?: string; // 스샷에 존재, 선택 값으로 둠
}

/** 인기 검색어/최근 본 상품 타입은 기존 그대로 사용 가능 */
export interface PopularKeyword {
  score: number;
  keyword: string;
}
export interface RecentProduct {
  id: number;
  name: string;
  imageUrl: string;
}

/** ------ NEW: 성분 검색 ------
 * GET /api/v1/ingredients/search?keyword=...
 * result: Ingredient[]
 */
export async function searchIngredients(
  keyword: string
): Promise<Ingredient[]> {
  const res = await api.get("/api/v1/ingredients/search", {
    params: { keyword },
  });
  if (res.data?.isSuccess && Array.isArray(res.data.result)) {
    return res.data.result as Ingredient[];
  }
  return [];
}

/** ------ NEW: 성분ID로 보충제 조회 (cursor 기반) ------
 * GET /api/v1/ingredients/{id}/supplements?cursor={number}&size={number}
 * result: { supplements: Supplement[] , nextCursor? ... } 형태라고 가정
 * (스샷에는 supplements 배열만 확인되어 최소 필드만 사용)
 */
export async function getSupplementsByIngredient(
  ingredientId: number,
  cursor: number | null = null,
  size = 40
): Promise<{ items: Supplement[]; nextCursor: number | null }> {
  const params: Record<string, any> = { size };
  // 백엔드가 첫 페이지를 cursor 생략 또는 0/1로 처리할 수 있으므로 null이면 보내지 않음
  if (cursor !== null) params.cursor = cursor;

  const res = await api.get(`/api/v1/ingredients/${ingredientId}/supplements`, {
    params,
  });

  const result = res.data?.result ?? {};
  const items: Supplement[] = (result.supplements ?? []) as Supplement[];
  // nextCursor가 있으면 활용, 없으면 null
  const nextCursor: number | null =
    typeof result.nextCursor === "number" ? result.nextCursor : null;

  return { items, nextCursor };
}

/** ------ 이하: 인기/최근 키워드 및 최근 본 상품 (기존 그대로) ------ */
export async function getPopularKeywords(): Promise<PopularKeyword[]> {
  const res = await api.get<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: PopularKeyword[];
  }>("/api/v1/search/popular");
  return res.data.result;
}

export async function getRecentKeywords(limit = 10): Promise<string[]> {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  const res = await api.get("/recent", {
    params: { limit },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (res.data?.isSuccess && Array.isArray(res.data.result)) {
    return res.data.result;
  }
  return [];
}

export async function getRecentProducts(limit = 5): Promise<RecentProduct[]> {
  const res = await api.get<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: RecentProduct[];
  }>("/me/recent-products", { params: { limit } });

  if (res.data?.isSuccess && Array.isArray(res.data.result)) {
    return res.data.result;
  }
  return [];
}
