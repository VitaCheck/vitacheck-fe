import api from "@/lib/axios";

export interface SupplementsScrapList {
  supplementId: number;
  name: string;
  brandName: string;
  imageUrl: string;
  price: number;
}

export interface IngredientScrap {
  ingredientId: number;
  name: string;
  effect: string;
}

// 찜한 제품 조회
export const getLikedSupplements = async (): Promise<
  SupplementsScrapList[]
> => {
  const response = await api.get("/api/v1/supplements/likes/me");

  if (response.data.isSuccess) {
    return response.data.result;
  } else {
    throw new Error("찜한 제품 조회 실패");
  }
};

// 찜한 성분 조회
export const getLikedIngredients = async (): Promise<IngredientScrap[]> => {
  const response = await api.get("/api/v1/users/me/likes/ingredients");

  if (response.data.isSuccess) {
    return response.data.result;
  } else {
    throw new Error("찜한 성분 조회 실패");
  }
};
