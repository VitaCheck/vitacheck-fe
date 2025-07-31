import axios from "axios";

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

const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL;

export const searchSupplements = async (
  keyword: string
): Promise<SearchResultResponse> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/v1/supplements/search`,
    {
      params: {
        keyword,
        page: 0,
        size: 20,
      },
    }
  );

  if (response.data.isSuccess) {
    return response.data.result;
  } else {
    throw new Error("검색 실패");
  }
};
