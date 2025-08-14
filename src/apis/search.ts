import api from "@/lib/axios";

export interface Ingredient {
  ingredientId: number;
  name: string;
  description: string;
  effect: string;
}

export interface Supplement {
  supplementId: number;
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

export interface PopularKeyword {
  score: number;
  keyword: string;
}

export interface SearchResultResponse {
  matchedIngredients: Ingredient[];
  supplements: {
    content: Supplement[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
}

export const searchSupplements = async (
  keyword: string
): Promise<SearchResultResponse> => {
  const response = await api.get("/api/v1/supplements/search", {
    params: {
      keyword,
      page: 0,
      size: 20,
    },
  });

  if (response.data.isSuccess) {
    return response.data.result;
  } else {
    throw new Error("검색 실패");
  }
};

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
