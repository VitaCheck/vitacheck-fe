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




// src/apis/search.ts
import api from "@/lib/axios";
import axios from "axios";


export interface IngredientSearchItem {
  id: number;
  name: string;
}

export interface RecentProduct {
  id: number;
  name: string;
  imageUrl: string;
}

export interface PopularKeyword {
  score: number;
  keyword: string;
}


export async function searchIngredients(
  keyword: string
): Promise<IngredientSearchItem[]> {
  try {
    const res = await api.get("/api/v1/ingredients/search", {
      params: { keyword },
      validateStatus: (s) => (s >= 200 && s < 300) || s === 404,
    });

    if (res.status === 404) return []; // 결과 없음
    if (res.data?.isSuccess) return res.data.result as IngredientSearchItem[];
    return [];
  } catch (err) {
    // 네트워크 등 예외는 조용히 빈 배열
    if (axios.isAxiosError(err) && err.response?.status === 404) return [];
    return [];
  }
}


export interface SearchedSupplement {
  cursorId: number;
  supplementName: string;
  coupangUrl: string;
  imageUrl: string;
}

export interface SupplementCursorResult {
  items: SearchedSupplement[];
  nextCursor: number | null;
}

export async function searchSupplements(
  keyword: string,
  cursorId?: number | null,
  size = 40
): Promise<SupplementCursorResult> {
  const res = await api.get("/api/v1/supplements/search", {
    params: { keyword, cursorId, size },
  });

  if (!res.data?.isSuccess) {
    throw new Error("제품 검색 실패");
  }

  const { supplements, nextCursor } = res.data.result as {
    supplements: SearchedSupplement[];
    nextCursor: number | null;
  };

  return { items: supplements, nextCursor };
}

/** 인기 검색어 조회 */
export async function getPopularKeywords(): Promise<PopularKeyword[]> {
  const res = await api.get<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: PopularKeyword[];
  }>("/api/v1/search/popular");
  return res.data.result;
}

/** 최근 검색어 조회 */
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

/** 최근 본 상품 조회 */
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

