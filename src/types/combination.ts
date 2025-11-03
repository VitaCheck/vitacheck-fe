// AddCombinationPage.tsx와 동일한 Product 인터페이스 사용
export interface SupplementItem {
  cursorId: number;
  supplementId?: number;
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

export interface IngredientResult {
  ingredientName: string;
  totalAmount: number;
  unit: string;
  recommendedAmount: number | null;
  upperAmount: number | null;
  dosageRatio: number;
  overRecommended: boolean;
}

export interface Combination {
  id: number;
  type: "GOOD" | "CAUTION";
  name: string;
  description: string;
  displayRank: number;
}
